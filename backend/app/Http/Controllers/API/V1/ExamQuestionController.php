<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\Exam;
use App\Models\Question;

class ExamQuestionController extends Controller
{
    //Liên kết câu hỏi với kỳ thi
    public function attachQuestions(Request $request, $exam_id)
    {
        $exam = Exam::findOrFail($exam_id);

        $request->validate([
            'question_ids' => 'required|array',
            'question_ids.*' => 'exists:questions,question_id'
        ]);

        // Liên kết các câu hỏi với kỳ thi
        $exam->questions()->sync($request->question_ids);

        return response()->json([
            'message' => 'Câu hỏi đã được liên kết với kỳ thi thành công!'
        ]);
    }

    // Xem các câu hỏi đã được liên kết với kỳ thi
    public function showQuestions($exam_id)
    {
        $exam = Exam::findOrFail($exam_id);

        $questions = $exam->questions;

        return response()->json([
            'exam'     => $exam->name,
            'questions' => $questions
        ]);
    }

    // Xóa liên kết câu hỏi khỏi kỳ thi
    public function detachQuestions(Request $request, $exam_id)
    {
        $exam = Exam::findOrFail($exam_id);

        $request->validate([
            'question_ids' => 'required|array',
            'question_ids.*' => 'exists:questions,question_id'
        ]);

        $exam->questions()->detach($request->question_ids);

        return response()->json([
            'message' => 'Câu hỏi đã được xoá khỏi kỳ thi!'
        ]);
    }
}
