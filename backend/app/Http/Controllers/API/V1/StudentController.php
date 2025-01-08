<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\ClassStudent;
use App\Models\Result;

class StudentController extends Controller
{
    // Lấy danh sách tất cả sinh viên
    public function index()
    {
        $students = Student::with('user')->get();
        return response()->json(['success' => true, 'data' => $students], 200);
    }

    // Lấy thông tin sinh viên cụ thể
    public function show($id)
    {
        $student = Student::with('user')->find($id);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $student], 200);
    }

    // Tạo mới sinh viên
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|uuid|exists:users,id',
        ]);

        $student = Student::create($validatedData);
        return response()->json(['success' => true, 'data' => $student], 201);
    }

    // Cập nhật thông tin sinh viên
    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $validatedData = $request->validate([
            'id' => 'sometimes|uuid|exists:users,id',
        ]);

        $student->update($validatedData);
        return response()->json(['success' => true, 'data' => $student], 200);
    }

    // Xoá sinh viên
    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $student->delete();
        return response()->json(['success' => true, 'message' => 'Student deleted successfully'], 200);
    }

    // Liên kết sinh viên với lớp học
    public function addToClass(Request $request)
    {
        $validatedData = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'student_id' => 'required|exists:students,id',
        ]);

        $classStudent = ClassStudent::create($validatedData);
        return response()->json(['success' => true, 'data' => $classStudent], 201);
    }

    // Xem lịch sử kết quả thi của sinh viên
    public function examHistory($studentId)
    {
        $results = Result::with('exam')
            ->where('student_id', $studentId)
            ->get();

        if ($results->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'No results found for this student'], 404);
        }

        return response()->json(['success' => true, 'data' => $results], 200);
    }
}
