<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Exam;
use App\Models\ExamAnswer;
use App\Models\Result;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Subject;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ExamController extends Controller
{
    public function index()
    {
        $exams = Exam::all(); // Lấy tất cả các bài thi
        return response()->json([
            'exams' => $exams,
        ], 200);
    }

    public function updateExam(Request $request, $id)
    {
        $validated = $request->validate([
            'test_name' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            // 'teacher_id' => 'required|exists:teachers,id',
            'time' => 'required|integer|min:1',
            // 'examtype' => 'required|in:NORMAL,GENERAL EXAM',
            'Qtype1' => 'required|integer|min:0',
            'Qtype2' => 'required|integer|min:0',
            'Qtype3' => 'required|integer|min:0',
            'Qnumber' => 'required|integer|min:1',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
        ]);

        $exam = Exam::findOrFail($id);

        $totalQuestions = $validated['Qtype1'] + $validated['Qtype2'] + $validated['Qtype3'];
        if ($totalQuestions != $validated['Qnumber']) {
            return response()->json(['error' => 'Tổng số câu hỏi không khớp với số lượng câu hỏi đã chỉ định.'], 422);
        }

        // Handle both date formats
        try {
            $startTime = Carbon::createFromFormat('Y-m-d\TH:i', $validated['start_time'])->format('Y-m-d H:i:s');
        } catch (\Exception $e) {
            try {
                $startTime = Carbon::createFromFormat('Y-m-d H:i:s', $validated['start_time'])->format('Y-m-d H:i:s');
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid date format for start_time.'], 422);
            }
        }

        $exam->update([
            'name' => $validated['test_name'],
            'subject_id' => $validated['subject_id'],
            'time' => $validated['time'],
            // 'examtype' => $validated['examtype'],
            'Qtype1' => $validated['Qtype1'],
            'Qtype2' => $validated['Qtype2'],
            'Qtype3' => $validated['Qtype3'],
            'Qnumber' => $validated['Qnumber'],
            'start_time' => $startTime,
        ]);

        return response()->json([
            'message' => 'Kỳ thi đã được cập nhật thành công!',
            'exam' => $exam,
        ], 200);
    }
    public function createExam(Request $request)
    {
        $validated = $request->validate([
            'test_name' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            // 'teacher_id' => 'required|exists:teachers,id',
            'time' => 'required|integer|min:1',
            'examtype' => 'required|in:NORMAL,GENERAL EXAM',
            'Qtype1' => 'required|integer|min:0',
            'Qtype2' => 'required|integer|min:0',
            'Qtype3' => 'required|integer|min:0',
            'Qnumber' => 'required|integer|min:1',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
        ]);

        $totalQuestions = $validated['Qtype1'] + $validated['Qtype2'] + $validated['Qtype3'];
        if ($totalQuestions != $validated['Qnumber']) {
            return response()->json(['error' => 'Tổng số câu hỏi không khớp với số lượng câu hỏi đã chỉ định.'], 422);
        }

        // Lấy danh sách câu hỏi
        $questions = Question::where('subject_id', $validated['subject_id'])
            ->whereIn('level', ['Nhận biết', 'Thông hiểu', 'Vận dụng'])
            ->get()
            ->groupBy('level');

        $selectedQuestions = collect();

        $selectedQuestions = $selectedQuestions->merge(
            $questions->get('Nhận biết', collect())->random(min($validated['Qtype1'], $questions->get('Nhận biết', collect())->count()))
        );

        $selectedQuestions = $selectedQuestions->merge(
            $questions->get('Thông hiểu', collect())->random(min($validated['Qtype2'], $questions->get('Thông hiểu', collect())->count()))
        );

        $selectedQuestions = $selectedQuestions->merge(
            $questions->get('Vận dụng', collect())->random(min($validated['Qtype3'], $questions->get('Vận dụng', collect())->count()))
        );

        $selectedQuestions = $selectedQuestions->shuffle();

        $subject = Subject::find($validated['subject_id']);

        if (!$subject) {
            return response()->json(['error' => 'Subject không tồn tại.'], 404);
        }

        $id = Auth::id();
        if (!$id) {
            $id = 11;
            // return response()->json(['error' => 'User không tồn tại.'], 404);
        }

        $teacher = Teacher::where('user_id', $id)->firstOrFail();

        $exam = Exam::create([
            'name' => $validated['test_name'],
            'subject_id' => $validated['subject_id'],
            'teacher_id' => $teacher->id,
            'time' => $validated['time'],
            'examtype' => $validated['examtype'],
            'Qtype1' => $validated['Qtype1'],
            'Qtype2' => $validated['Qtype2'],
            'Qtype3' => $validated['Qtype3'],
            'Qnumber' => $validated['Qnumber'],
            'start_time' => $validated['start_time'],
        ]);

        $exam->questions()->attach($selectedQuestions->pluck('id')->toArray());

        return response()->json([
            'message' => 'Kỳ thi đã được tạo thành công!',
            'exam' => $exam,
        ], 201);
    }
    public function getExamsForTeacher()
    {
        $id = Auth::id();

        // $teacher = Teacher::findOrFail($id);
        $teacher = Teacher::where('user_id', $id)->firstOrFail();

        $exams = Exam::where('teacher_id', $teacher->id)->get();

        $examDetails = $exams->map(function ($exam) {
            return [
                'id' => $exam->id,
                'test_name' => $exam->name,
                'subject' => [
                    'name' => $exam->subject->name,
                ],
                'time' => $exam->time,
                // map: NORMAL =Thi riêng ; GENERAL =Tập trung
                'type' => $exam->examtype == 'NORMAL' ? 'Thi riêng' : 'Tập trung',
                'created_at' => $exam->created_at,
                'start_time' => $exam->start_time,
            ];
        });

        return response()->json([
            'exams' => $examDetails,
        ]);
    }
    public function showExamForTeacher($id)
    {
        $exam = Exam::with('questions')->findOrFail($id);

        $currentTime = Carbon::now();
        $startTime = Carbon::parse($exam->start_time);
        $endTime = $startTime->copy()->addMinutes($exam->time);
        // return response()->json([
        //     // 'exam' => $exam,
        //     // 'shuffledQuestions' => $shuffledQuestions,
        //     'currentTime' => $currentTime,
        //     'startTime' => $startTime,
        //     'endTime' => $endTime,
        // ], 200);

        // if ($currentTime->lessThan($startTime) || $currentTime->greaterThan($endTime)) {
        //     return response()->json([
        //         'message' => 'You cannot view this exam at this time.',
        //     ], 403);
        // }

        // $shuffledQuestions = $exam->questions->shuffle();
        $timeLeft = round($currentTime->diffInSeconds($endTime));

        return response()->json([
            'exam' => [
                'id' => $exam->id,
                'test_name' => $exam->name,
                'subject' => [
                    'id' => $exam->subject->id,
                    'name' => $exam->subject->name,
                ],
                'teacher' => [
                    'name' => $exam->teacher->user->name,
                    'email' => $exam->teacher->user->email,
                ],
                'time' => $exam->time,
                // map: NORMAL =Thi riêng ; GENERAL =Tập trung
                'examtype' => $exam->examtype == 'NORMAL' ? 'Thi riêng' : 'Tập trung',
                'Qtype1' => $exam->Qtype1,
                'Qtype2' => $exam->Qtype2,
                'Qtype3' => $exam->Qtype3,
                'Qnumber' => $exam->Qnumber,
                'questions' => $exam->questions,
                'created_at' => $exam->created_at,
                'time_left' => $timeLeft,
                'start_time' => $exam->start_time,
            ],
        ], 200);
        return response()->json([
            'exam' => $exam,
        ], 200);
    }
    public function getExamsForStudent()
    {
        $id = Auth::id();

        // $student = Student::findOrFail($id);
        $student = Student::where('user_id', $id)->firstOrFail();

        // Lấy danh sách lớp học của sinh viên
        $classrooms = $student->classes()->pluck('classes.id');

        // Lấy danh sách bài thi thuộc các lớp học đó
        $exams = Exam::whereHas('classrooms', function ($query) use ($classrooms) {
            $query->whereIn('classes.id', $classrooms);
        })->get();


        $examDetails = $exams->map(function ($exam) use ($student) {
            $result = Result::where('exam_id', $exam->id)
                ->where('student_id', $student->id)
                ->first();

            $currentTime = Carbon::now();
            $startTime = Carbon::parse($exam->start_time);
            $endTime = $startTime->copy()->addMinutes($exam->time);

            if ($currentTime->lessThan($startTime)) {
                $status = 'Not Started';
            } elseif ($currentTime->greaterThan($startTime) && $currentTime->lessThan($endTime)) {
                $status = $result ? 'Taken' : 'Not Taken';
            } else {
                $status = $result ? 'Taken' : 'Expired';
            }

            // if ($status === 'Not Started' || $status === 'Expired') {
            //     return response()->json([
            //         'message' => 'You cannot view this exam at this time.',
            //         'status' => $status,
            //     ], 403);
            // }
            return [
                'id' => $exam->id,
                'test_name' => $exam->name,
                'subject' => [
                    'name' => $exam->subject->name,
                ],
                'teacher' => [
                    'name' => $exam->teacher->user->name,
                    'email' => $exam->teacher->user->email,
                ],
                'time' => $exam->time,
                // map: NORMAL =Thi riêng ; GENERAL =Tập trung
                'type' => $exam->examtype == 'NORMAL' ? 'Thi riêng' : 'Tập trung',
                // 'questions' => $exam->questions->shuffle(),
                'created_at' => $exam->created_at,
                'status' => $status,
                'start_time' => $exam->start_time,
            ];
        });

        return response()->json([
            'exams' => $examDetails,
        ]);
    }
    public function getCompletedExamsForStudent()
    {
        $id = Auth::id();

        $student = Student::where('user_id', $id)->firstOrFail();

        // Get all results for the student with their related exams
        $results = Result::with(['exam.subject', 'exam.teacher.user'])
            ->where('student_id', $student->id)
            ->get();

        $examDetails = $results->map(function ($result) {
            return [
                'id' => $result->exam->id,
                'test_name' => $result->exam->name,
                'subject' => [
                    'name' => $result->exam->subject->name,
                ],
                'teacher' => [
                    'name' => $result->exam->teacher->user->name,
                    'email' => $result->exam->teacher->user->email,
                ],
                'time' => $result->exam->time,
                'type' => $result->exam->examtype == 'NORMAL' ? 'Thi riêng' : 'Tập trung',
                'score' => $result->score,
                'total_questions' => $result->exam->Qnumber,
                'submission_time' => $result->created_at,
                'exam_date' => $result->exam->start_time,
            ];
        });

        return response()->json([
            'completed_exams' => $examDetails,
        ]);
    }

    public function getCompletedExamDetailsForStudent($exam_id)
    {
        $userId = Auth::id();
        $student = Student::where('user_id', $userId)->firstOrFail();

        // Retrieve the result for the specific exam and student
        $result = Result::with(['exam.subject', 'exam.teacher.user', 'answers.question'])
            ->where('exam_id', $exam_id)
            ->where('student_id', $student->id)
            ->first();

        if (!$result) {
            return response()->json([
                'message' => 'Exam result not found.',
            ], 404);
        }

        // Prepare detailed exam information
        $exam = $result->exam;

        $examDetails = [
            'id' => $exam->id,
            'test_name' => $exam->name,
            'subject' => [
                'name' => $exam->subject->name,
            ],
            'teacher' => [
                'name' => $exam->teacher->user->name,
                'email' => $exam->teacher->user->email,
            ],
            'time' => $exam->time,
            'type' => $exam->examtype == 'NORMAL' ? 'Thi riêng' : 'Tập trung',
            'score' => $result->score,
            'total_questions' => $exam->Qnumber,
            'start_time' => $exam->start_time,
            'submission_time' => $result->created_at,
            'questions' => $result->answers->map(function ($answer) {
                return [
                    'id' => $answer->question->id,
                    "question_text" => $answer->question->question,
                    "answer_a" => $answer->question->answer_a,
                    "answer_b" => $answer->question->answer_b,
                    "answer_c" => $answer->question->answer_c,
                    "answer_d" => $answer->question->answer_d,
                    'selected_answer' => $answer->answer,
                    'is_correct' => $answer->is_correct,
                    'rightanswer' => $answer->question->rightanswer,
                ];
            }),
        ];

        return response()->json([
            'exam_details' => $examDetails,
        ], 200);
    }
    public function showExamForStudent($id)
    {
        $exam = Exam::with('questions')->findOrFail($id);

        $currentTime = Carbon::now();
        $startTime = Carbon::parse($exam->start_time);
        $endTime = $startTime->copy()->addMinutes($exam->time);
        // return response()->json([
        //     // 'exam' => $exam,
        //     // 'shuffledQuestions' => $shuffledQuestions,
        //     'currentTime' => $currentTime,
        //     'startTime' => $startTime,
        //     'endTime' => $endTime,
        // ], 200);

        if ($currentTime->lessThan($startTime) || $currentTime->greaterThan($endTime)) {
            return response()->json([
                'message' => 'You cannot view this exam at this time.',
            ], 403);
        }

        $shuffledQuestions = $exam->questions->shuffle();
        $timeLeft = round($currentTime->diffInSeconds($endTime));

        return response()->json([
            'exam' => [
                'id' => $exam->id,
                'test_name' => $exam->name,
                'subject' => [
                    'name' => $exam->subject->name,
                ],
                'teacher' => [
                    'name' => $exam->teacher->user->name,
                    'email' => $exam->teacher->user->email,
                ],
                'time' => $exam->time,
                // map: NORMAL =Thi riêng ; GENERAL =Tập trung
                'type' => $exam->examtype == 'NORMAL' ? 'Thi riêng' : 'Tập trung',
                'questions' => $shuffledQuestions,
                'created_at' => $exam->created_at,
                'time_left' => $timeLeft,
            ],
        ], 200);
        return response()->json([
            'exam' => $exam,
        ], 200);
    }

    public function submitExam(Request $request, $id)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.answer' => 'required|string',
        ]);

        if (Auth::id() !== $validated['student_id']) {
            return response()->json([
                'message' => 'Unauthorized submission.',
            ], 403);
        }

        $exam = Exam::with('questions')->findOrFail($id);

        $startTime = Carbon::parse($exam->start_time);
        $currentTime = Carbon::now();
        $endTime = $startTime->copy()->addMinutes($exam->time);

        if ($currentTime->greaterThan($endTime)) {
            return response()->json([
                'message' => 'Time limit exceeded. You cannot submit the exam.',
            ], 403);
        }

        $score = 0;
        $result = Result::create([
            'exam_id' => $exam->id,
            'student_id' => $validated['student_id'],
            'score' => 0, // Will update after processing answers
        ]);

        foreach ($validated['answers'] as $answer) {
            $question = $exam->questions->find($answer['question_id']);
            $isCorrect = false;

            if ($question && strtolower($question->rightanswer) === strtolower($answer['answer'])) {
                $score++;
                $isCorrect = true;
            }

            ExamAnswer::create([
                'result_id' => $result->id,
                'question_id' => $answer['question_id'],
                'answer' => $answer['answer'],
                'is_correct' => $isCorrect,
            ]);
        }

        $result->update(['score' => $score]);

        return response()->json([
            'message' => 'Exam submitted successfully!',
            'score' => $score,
            'total' => $exam->questions->count(),
            'result' => $result->load('answers'),
        ], 200);
    }
    // public function submitExam(Request $request, $id)
    // {
    //     $validated = $request->validate([
    //         'student_id' => 'required|exists:students,id',
    //         'answers' => 'required|array',
    //         'answers.*.question_id' => 'required|exists:questions,id',
    //         'answers.*.answer' => 'required|string',
    //     ]);
    //     // return Auth::id();

    //     if (Auth::id() !== $validated['student_id']) {
    //         return response()->json([
    //             'message' => 'Unauthorized submission.',
    //         ], 403);
    //     }

    //     // $existingResult = Result::where('exam_id', $id)
    //     //     ->where('student_id', $validated['student_id'])
    //     //     ->first();

    //     // if ($existingResult) {
    //     //     return response()->json([
    //     //         'message' => 'You have already submitted this exam.',
    //     //     ], 403);
    //     // }

    //     $exam = Exam::with('questions')->findOrFail($id);

    //     $startTime = Carbon::parse($exam->start_time);
    //     $currentTime = Carbon::now();
    //     $endTime = $startTime->copy()->addMinutes($exam->time);

    //     // return response()->json([
    //     //     // 'exam' => $exam,
    //     //     'startTime' => $startTime,
    //     //     'currentTime' => $currentTime,
    //     //     'endTime' => $endTime,
    //     // ], 200);
    //     if ($currentTime->greaterThan($endTime)) {
    //         return response()->json([
    //             'message' => 'Time limit exceeded. You cannot submit the exam.',
    //         ], 403);
    //     }

    //     $score = 0;
    //     foreach ($validated['answers'] as $answer) {
    //         $question = $exam->questions->find($answer['question_id']);
    //         if ($question && strtolower($question->rightanswer) === strtolower($answer['answer'])) {
    //             $score++;
    //         }
    //     }

    //     $result = Result::create([
    //         'exam_id' => $exam->id,
    //         'student_id' => $validated['student_id'],
    //         'score' => $score,
    //     ]);

    //     return response()->json([
    //         'message' => 'Exam submitted successfully!',
    //         'score' => $score,
    //         'total' => $exam->questions->count(),
    //         'result' => $result,
    //     ], 200);
    // }
}
