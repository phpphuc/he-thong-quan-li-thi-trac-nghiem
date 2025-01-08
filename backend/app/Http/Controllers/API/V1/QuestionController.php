<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Http\Controllers\API\V1\Controller;

class QuestionController extends Controller
{
    // Lấy danh sách câu hỏi
    public function index()
    {
        $questions = Question::all();

        $questions = $questions->map(function ($question): Question {
            $question->subject_name = $question->subject->name;
            return $question;
        });

        return response()->json($questions);
    }
    // Thêm mới câu hỏi
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|string',
            // 'subject_name' => 'required|string',
            'teacher_id' => 'required|integer',
            'question' => 'required|string',
            'level' => 'required|string|in:Nhận biết,Thông hiểu,Vận dụng',
            'rightanswer' => 'required|string',
            'answer_a' => 'required|string',
            'answer_b' => 'required|string',
            'answer_c' => 'required|string',
            'answer_d' => 'required|string',
        ]);

        $question = Question::create($validated);

        return response()->json(['message' => 'Question created successfully', 'data' => $question], 201);
    }
    //cập nhật câu hỏi
    public function update(Request $request, $id)
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $validated = $request->validate([
            'subject_id' => 'sometimes|string',
            // 'subject_name' => 'sometimes|string',
            'teacher_id' => 'sometimes|integer',
            'question' => 'sometimes|string',
            'level' => 'sometimes|string|in:Nhận biết,Thông hiểu,Vận dụng',
            'rightanswer' => 'sometimes|string',
            'answer_a' => 'sometimes|string',
            'answer_b' => 'sometimes|string',
            'answer_c' => 'sometimes|string',
            'answer_d' => 'sometimes|string',
        ]);

        $question->update($validated);

        return response()->json(['message' => 'Question updated successfully', 'data' => $question], 200);
    }
    //xóa câu hỏi
    public function destroy($id)
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question->delete();

        return response()->json(['message' => 'Question deleted successfully'], 200);
    }
}
