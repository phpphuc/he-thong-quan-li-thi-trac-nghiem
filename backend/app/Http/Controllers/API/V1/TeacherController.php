<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Models\Classroom; 
use App\Models\Subject;
use App\Models\Exam;
class TeacherController extends Controller
{
    /**
     * Lấy danh sách giáo viên.
     */
    public function index()
    {
        $teachers = Teacher::with(['classes', 'subjects'])->get();

        return response()->json([
            'message' => 'Danh sách giáo viên.',
            'data' => $teachers,
        ]);
    }

    /**
     * Tạo mới giáo viên.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid|unique:teachers,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:teachers,email',
            'phone' => 'nullable|string|max:15',
        ]);

        $teacher = Teacher::create($validated);

        return response()->json([
            'message' => 'Tạo giáo viên thành công.',
            'data' => $teacher,
        ]);
    }

    /**
     * Cập nhật thông tin giáo viên.
     */
    public function update(Request $request, $teacherId)
    {
        $teacher = Teacher::findOrFail($teacherId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:teachers,email,' . $teacher->id,
            'phone' => 'nullable|string|max:15',
        ]);

        $teacher->update($validated);

        return response()->json([
            'message' => 'Cập nhật thông tin giáo viên thành công.',
            'data' => $teacher,
        ]);
    }

    /**
     * Xoá giáo viên.
     */
    public function destroy($teacherId)
    {
        $teacher = Teacher::findOrFail($teacherId);
        $teacher->delete();

        return response()->json([
            'message' => 'Xoá giáo viên thành công.',
        ]);
    }

    /**
     * Gán giáo viên vào lớp học.
     */
    public function assignToClass(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'class_id' => 'required|exists:classes,class_id',
        ]);

        $class = Classroom::findOrFail($validated['class_id']);
        $class->teacher_id = $validated['teacher_id'];
        $class->save();

        return response()->json([
            'message' => 'Gán giáo viên vào lớp học thành công.',
            'data' => $class,
        ]);
    }

    /**
     * Gán giáo viên vào môn học.
     */
    public function assignToSubject(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,subject_id',
        ]);

        $subject = Subject::findOrFail($validated['subject_id']);
        $subject->teacher_id = $validated['teacher_id'];
        $subject->save();

        return response()->json([
            'message' => 'Gán giáo viên vào môn học thành công.',
            'data' => $subject,
        ]);
    }

    /**
     * Tổ chức kỳ thi.
     */
    public function organizeExam(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'name' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,subject_id',
            'time' => 'required|integer|min:1',
            'examtype' => 'required|in:NORMAL,GENERAL_EXAM',
        ]);

        $exam = Exam::create([
            'teacher_id' => $validated['teacher_id'],
            'name' => $validated['name'],
            'subject_id' => $validated['subject_id'],
            'time' => $validated['time'],
            'examtype' => $validated['examtype'],
        ]);

        return response()->json([
            'message' => 'Tổ chức kỳ thi thành công.',
            'data' => $exam,
        ]);
    }
}
