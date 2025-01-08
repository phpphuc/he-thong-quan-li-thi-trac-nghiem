<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Student;

class ClassController extends Controller
{
    //Tạo một lớp học mới
    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'subject_id'   => 'required|exists:subjects,subject_id',
            'teacher_id'   => 'required|exists:teachers,teacher_id'
        ]);

        $class = Classroom::create([
            'name'   => $request->name,
            'subject_id'   => $request->subject_id,
            'teacher_id'   => $request->teacher_id
        ]);

        return response()->json([
            'message' => 'Lớp học đã được tạo thành công!',
            'class'   => $class
        ]);
    }

    //Sửa thông tin lớp học
    public function update(Request $request, $class_id)
    {
        $class = Classroom::findOrFail($class_id);

        $request->validate([
            'name'   => 'sometimes|string|max:255',
            'subject_id'   => 'sometimes|exists:subjects,subject_id',
            'teacher_id'   => 'sometimes|exists:teachers,teacher_id'
        ]);

        if ($request->has('name')) {
            $class->name = $request->name;
        }
        if ($request->has('subject_id')) {
            $class->subject_id = $request->subject_id;
        }
        if ($request->has('teacher_id')) {
            $class->teacher_id = $request->teacher_id;
        }

        $class->save();

        return response()->json([
            'message' => 'Thông tin lớp học đã được cập nhật!',
            'class'   => $class
        ]);
    }

    // Xóa một lớp học
    public function destroy($class_id)
    {
        $class = Classroom::findOrFail($class_id);
        $class->delete();

        return response()->json([
            'message' => 'Lớp học đã được xoá thành công!'
        ]);
    }

    // Xem thông tin thành viên trong lớp (sinh viên, giáo viên)
    public function showMembers($class_id)
    {
        $class = Classroom::findOrFail($class_id);

        $teacher = Teacher::find($class->teacher_id);
        $students = $class->students;

        return response()->json([
            'class'   => $class,
            'teacher'  => $teacher,
            'students' => $students
        ]);
    }
}
