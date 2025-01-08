<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\ClassStudent;
use App\Models\Student;
use App\Models\Classroom;

class ClassStudentController extends Controller
{
    // Lấy danh sách sinh viên trong lớp học.
    public function index($classId)
    {
        $students = ClassStudent::where('class_id', $classId)
            ->with('student') 
            ->get();

        return response()->json([
            'message' => 'Danh sách sinh viên trong lớp học.',
            'data' => $students,
        ]);
    }

    // Thêm sinh viên vào lớp học.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,class_id', 
            'student_id' => 'required|exists:students,student_id', 
        ]);

        // Kiểm tra xem sinh viên đã có trong lớp chưa
        $exists = ClassStudent::where('class_id', $validated['class_id'])
            ->where('student_id', $validated['student_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Sinh viên đã có trong lớp học.',
            ], 400);
        }

        $classStudent = ClassStudent::create($validated);

        return response()->json([
            'message' => 'Thêm sinh viên vào lớp học thành công.',
            'data' => $classStudent,
        ]);
    }

    // Xóa sinh viên khỏi lớp học.
    public function destroy($classId, $studentId)
    {
        $classStudent = ClassStudent::where('class_id', $classId)
            ->where('student_id', $studentId)
            ->first();

        if (!$classStudent) {
            return response()->json([
                'message' => 'Sinh viên không tồn tại trong lớp học.',
            ], 404);
        }

        $classStudent->delete();

        return response()->json([
            'message' => 'Xóa sinh viên khỏi lớp học thành công.',
        ]);
    }

    // Tìm kiếm sinh viên trong lớp học.
    public function search(Request $request, $classId)
    {
        $searchTerm = $request->get('query');

        $students = Student::where('name', 'LIKE', "%{$searchTerm}%")
            ->whereHas('classes', function ($query) use ($classId) {
                $query->where('class_id', $classId);
            })
            ->get();

        return response()->json([
            'message' => 'Kết quả tìm kiếm sinh viên.',
            'data' => $students,
        ]);
    }
}
