<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\Result;
use App\Models\Exam;
use App\Models\Student;

class ResultController extends Controller
{
    // Hiển thị danh sách kết quả thi.
    public function index()
    {
        $results = Result::with('exam', 'student')->get();
        return response()->json($results);
    }

    //Hiển thị chi tiết kết quả của một bài thi.
    public function show($id)
    {
        $result = Result::with('exam', 'student')->find($id);

        if (!$result) {
            return response()->json(['message' => 'Result not found'], 404);
        }

        return response()->json($result);
    }

    // Lưu kết quả bài thi.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'student_id' => 'required|exists:students,id',
            'score' => 'required|numeric|min:0',
        ]);

        $result = Result::create($validated);

        return response()->json([
            'message' => 'Result created successfully',
            'result' => $result
        ], 201);
    }

    // Cập nhật kết quả bài thi.
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'score' => 'nullable|numeric|min:0',
        ]);

        $result = Result::find($id);

        if (!$result) {
            return response()->json(['message' => 'Result not found'], 404);
        }

        $result->update($validated);

        return response()->json([
            'message' => 'Result updated successfully',
            'result' => $result
        ]);
    }

    // Xem lịch sử kết quả của một sinh viên.
    public function studentHistory($studentId)
    {
        $results = Result::with('exam')
            ->where('student_id', $studentId)
            ->get();

        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found for this student'], 404);
        }

        return response()->json($results);
    }

    // Tạo báo cáo kết quả kỳ thi.
    public function examReport($examId)
    {
        $results = Result::with('student')
            ->where('exam_id', $examId)
            ->get();

        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found for this exam'], 404);
        }

        $averageScore = $results->avg('score');
        $highestScore = $results->max('score');
        $lowestScore = $results->min('score');

        return response()->json([
            'exam_id' => $examId,
            'total_results' => $results->count(),
            'average_score' => $averageScore,
            'highest_score' => $highestScore,
            'lowest_score' => $lowestScore,
            'results' => $results
        ]);
    }
}
