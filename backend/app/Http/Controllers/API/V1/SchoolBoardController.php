<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\SchoolBoard;
use App\Models\Exam;

class SchoolBoardController extends Controller
{
    // Hiển thị danh sách tất cả các thành viên Ban giám hiệu
    public function index()
    {
        $schoolBoards = SchoolBoard::all();
        return response()->json($schoolBoards, 200);
    }

    // Xem thông tin chi tiết một thành viên Ban giám hiệu
    public function show($id)
    {
        $schoolBoard = SchoolBoard::find($id);

        if (!$schoolBoard) {
            return response()->json(['error' => 'SchoolBoard not found'], 404);
        }

        return response()->json($schoolBoard, 200);
    }

    // Thêm mới một thành viên Ban giám hiệu
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|uuid|exists:users,id',
        ]);

        $schoolBoard = SchoolBoard::create($validated);
        return response()->json($schoolBoard, 201);
    }

    // Cập nhật thông tin của một thành viên Ban giám hiệu
    public function update(Request $request, $id)
    {
        $schoolBoard = SchoolBoard::find($id);

        if (!$schoolBoard) {
            return response()->json(['error' => 'SchoolBoard not found'], 404);
        }

        $validated = $request->validate([
            'id' => 'required|uuid|exists:users,id',
        ]);

        $schoolBoard->update($validated);
        return response()->json($schoolBoard, 200);
    }

    // Xóa một thành viên Ban giám hiệu
    public function destroy($id)
    {
        $schoolBoard = SchoolBoard::find($id);

        if (!$schoolBoard) {
            return response()->json(['error' => 'SchoolBoard not found'], 404);
        }

        $schoolBoard->delete();
        return response()->json(['message' => 'SchoolBoard deleted successfully'], 200);
    }
    // Tổ chức kỳ thi mới
    public function createExam(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject_id' => 'required|string|exists:subjects,subject_id',
            'teacher_id' => 'required|int|exists:teachers,teacher_id',
            'time' => 'required|int|min:1',
            'examtype' => 'required|in:NORMAL,GENERAL EXAM',
            'Qtype1' => 'nullable|int|min:0',
            'Qtype2' => 'nullable|int|min:0',
            'Qtype3' => 'nullable|int|min:0',
        ]);

        $validated['Qnumber'] = ($validated['Qtype1'] ?? 0) + ($validated['Qtype2'] ?? 0) + ($validated['Qtype3'] ?? 0);

        $exam = Exam::create($validated);
        return response()->json($exam, 201);
    }

    // Xem danh sách kỳ thi được tổ chức bởi Ban giám hiệu
    public function exams()
    {
        $exams = Exam::all();
        return response()->json($exams, 200);
    }

    // Tạo báo cáo chi tiết về kỳ thi
    public function examReport($examId)
    {
        $exam = Exam::find($examId);

        if (!$exam) {
            return response()->json(['error' => 'Exam not found'], 404);
        }

        $report = [
            'exam' => $exam,
            'total_students' => $exam->results()->count(),
            'average_score' => $exam->results()->avg('score'),
            'highest_score' => $exam->results()->max('score'),
            'lowest_score' => $exam->results()->min('score'),
        ];

        return response()->json($report, 200);
    }
}
