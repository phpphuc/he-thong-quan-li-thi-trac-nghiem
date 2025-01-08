<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\QuestionController;
use App\Http\Controllers\API\V1\SubjectController;
use App\Http\Controllers\API\V1\ExamController;
use App\Http\Controllers\API\V1\ResultController;
use App\Http\Controllers\API\V1\SchoolBoardController;
use App\Http\Controllers\API\V1\ExamQuestionController;
use App\Http\Controllers\API\V1\ClassController;
use App\Http\Controllers\API\V1\ClassStudentController;
use App\Http\Controllers\API\V1\TeacherController;
use App\Http\Controllers\API\V1\StudentController;

Route::prefix('v1')->group(function () {
    Route::get('/user', function (Request $request) {
        return 'p c';
        // return $request->user();
    })->middleware(['auth:sanctum', 'abilities:view-users']);


    Route::get('/users', [App\Http\Controllers\API\V1\AuthController::class, 'index']);

    Route::post('/register', [App\Http\Controllers\API\V1\AuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\API\V1\AuthController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\API\V1\AuthController::class, 'logout'])->middleware('auth:sanctum');


    Route::get('questions', [QuestionController::class, 'index']);
    Route::post('questions', [QuestionController::class, 'store']);
    Route::put('questions/{id}', [QuestionController::class, 'update']);
    Route::delete('questions/{id}', [QuestionController::class, 'destroy']);

    //Route::post('subjects', [SubjectController::class, 'store']);

    //Route::get('teachers', [App\Http\Controllers\API\V1\TeacherController::class, 'index']);
    //Route::post('teachers', [App\Http\Controllers\API\V1\TeacherController::class, 'store']);


    Route::get('/exams', [ExamController::class, 'index']);
    Route::patch('/exams/{id}', [ExamController::class, 'updateExam']);

    Route::get('students/exams/{id}', [ExamController::class, 'showExamForStudent'])->middleware('auth:sanctum', 'abilities:view-student-exams');
    Route::get('/students/exams', [ExamController::class, 'getExamsForStudent'])->middleware('auth:sanctum', 'abilities:view-student-exams');
    Route::get('/students/completed-exams', [ExamController::class, 'getCompletedExamsForStudent'])->middleware('auth:sanctum', 'abilities:view-student-exams');
    Route::get('/students/completed-exams/{exam_id}', [ExamController::class, 'getCompletedExamDetailsForStudent'])->middleware('auth:sanctum', 'abilities:view-student-exams');
    Route::post('/exams/{id}/submit', [ExamController::class, 'submitExam'])->middleware('auth:sanctum', 'abilities:submit-exams');

    Route::get('/teachers/exams', [ExamController::class, 'getExamsForTeacher'])->middleware('auth:sanctum', 'abilities:view-exams');
    Route::get('/teachers/exams/{id}', [ExamController::class, 'showExamForTeacher'])->middleware('auth:sanctum', 'abilities:view-exams');
    Route::post('/exams', [ExamController::class, 'createExam'])->middleware('auth:sanctum', 'abilities:create-exams');

    Route::get('/teachers/subjects', [SubjectController::class, 'getSubjectsByTeacher'])->middleware('auth:sanctum', 'abilities:view-subjects');

    Route::get('/results', [ResultController::class, 'index']);
    Route::get('/results/{id}', [ResultController::class, 'show']);
    Route::post('/results', [ResultController::class, 'store']);
    Route::put('/results/{id}', [ResultController::class, 'update']);
    Route::get('/results/student/{studentId}', [ResultController::class, 'studentHistory']);
    Route::get('/results/exam/{examId}/report', [ResultController::class, 'examReport']);


    Route::get('/schoolboards', [SchoolBoardController::class, 'index']);
    Route::get('/schoolboards/{id}', [SchoolBoardController::class, 'show']);
    Route::post('/schoolboards', [SchoolBoardController::class, 'store']);
    Route::put('/schoolboards/{id}', [SchoolBoardController::class, 'update']);
    Route::delete('/schoolboards/{id}', [SchoolBoardController::class, 'destroy']);
    Route::post('/schoolboards/exams', [SchoolBoardController::class, 'createExam']);
    Route::get('/schoolboards/exams', [SchoolBoardController::class, 'exams']);
    Route::get('/schoolboards/exams/{examId}/report', [SchoolBoardController::class, 'examReport']);


    Route::post('/exam/{exam_id}/attach-questions', [ExamQuestionController::class, 'attachQuestions']);
    Route::get('/exam/{exam_id}/questions', [ExamQuestionController::class, 'showQuestions']);
    Route::post('/exam/{exam_id}/detach-questions', [ExamQuestionController::class, 'detachQuestions']);

    Route::post('/class/store', [ClassController::class, 'store']);
    Route::put('/class/update/{class_id}', [ClassController::class, 'update']);
    Route::delete('/class/delete/{class_id}', [ClassController::class, 'destroy']);
    Route::get('/class/{class_id}/members', [ClassController::class, 'showMembers']);


    Route::post('/subject/store', [SubjectController::class, 'store']);
    Route::put('/subject/update/{id}', [SubjectController::class, 'update']);
    Route::delete('/subject/delete/{id}', [SubjectController::class, 'destroy']);
    Route::post('/subject/{id}/link-class', [SubjectController::class, 'linkClass']);
    Route::post('/subject/{id}/link-exam', [SubjectController::class, 'linkExam']);

    Route::get('/class-students', [ClassStudentController::class, 'index']);
    Route::post('/class-students', [ClassStudentController::class, 'store']);
    Route::get('/class-students/{classId}', [ClassStudentController::class, 'search']);
    Route::delete('/class-students/{classId}/{studentId}', [ClassStudentController::class, 'destroy']);


    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::post('/teachers', [TeacherController::class, 'store']);
    Route::put('/teachers/{id}', [TeacherController::class, 'update']);
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
    Route::post('/teachers/assign-to-class', [TeacherController::class, 'assignToClass']);
    Route::post('/teachers/assign-to-subject', [TeacherController::class, 'assignToSubject']);
    Route::post('/teachers/organize-exam', [TeacherController::class, 'organizeExam']);

    Route::get('/students', [StudentController::class, 'index']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::delete('/students/{id}', [StudentController::class, 'destroy']);
    Route::post('/students/add-to-class', [StudentController::class, 'addToClass']);
    Route::get('/students/{studentId}/exam-history', [StudentController::class, 'examHistory']);
});
