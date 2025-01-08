<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Models\Subject;
use Illuminate\Support\Facades\Auth;
use App\Models\Classroom;
use App\Models\Exam;

class SubjectController extends Controller
{
    //Tạo một môn học mới
    public function store(Request $request)
    {
        $request->validate([
            'subject_name'  => 'required|string|max:255'
        ]);

        $subject = Subject::create([
            'name' => $request->subject_name
        ]);

        return response()->json([
            'message' => 'Môn học đã được tạo thành công!',
            'subject'  => $subject
        ]);
    }

    //Sửa thông tin môn học
    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $request->validate([
            'subject_name'  => 'sometimes|string|max:255'
        ]);

        if ($request->has('name')) {
            $subject->name = $request->subject_name;
        }

        $subject->save();

        return response()->json([
            'message' => 'Thông tin môn học đã được cập nhật!',
            'subject'  => $subject
        ]);
    }

    // Xóa một môn học
    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json([
            'message' => 'Môn học đã được xoá thành công!'
        ]);
    }

    // Liên kết môn học với các lớp học
    public function linkClass(Request $request, $id)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,class_id'
        ]);

        $subject = Subject::findOrFail($id);
        $class = Classroom::findOrFail($request->class_id);

        $class->subject_id = $subject->id;
        $class->save();

        return response()->json([
            'message' => 'Môn học đã được liên kết với lớp thành công!',
            'class'   => $class
        ]);
    }

    // Liên kết môn học với kỳ thi
    public function linkExam(Request $request, $id)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,exam_id'
        ]);

        $subject = Subject::findOrFail($id);
        $exam = Exam::findOrFail($request->exam_id);

        $exam->subject_id = $subject->id;
        $exam->save();

        return response()->json([
            'message' => 'Môn học đã được liên kết với kỳ thi thành công!',
            'exam'   => $exam
        ]);
    }

    public function getSubjectsByTeacher()
    {
        $id = Auth::id();

        $teacher = Teacher::where('user_id', $id)->firstOrFail();

        $classes = Classroom::where('teacher_id', $teacher->id)->get();

        $subjectIds = $classes->pluck('subject_id')->unique();

        $subjects = Subject::whereIn('id', $subjectIds)->get();

        return response()->json([
            'subjects' => $subjects
        ]);
    }
}
