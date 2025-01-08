<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        // 'subject_name',
        'teacher_id',
        'question',
        'level',
        'rightanswer',
        'answer_a',
        'answer_b',
        'answer_c',
        'answer_d',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'teacher_id');
    }
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }
    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_question');
    }
}
