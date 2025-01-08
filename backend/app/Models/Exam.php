<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'subject_id',
        'teacher_id',
        'time',
        'examtype',
        'Qtype1',
        'Qtype2',
        'Qtype3',
        'Qnumber',
        'start_time',
    ];
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function results()
    {
        return $this->hasMany(Result::class, 'exam_id', 'exam_id');
    }
    public function questions()
    {
        return $this->belongsToMany(Question::class, 'exam_question', 'exam_id', 'question_id');
    }
    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class, 'class_exam', 'exam_id', 'class_id');
    }
}
