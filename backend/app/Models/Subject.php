<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'teacher_id',
    ];

    public function questions()
    {
        return $this->hasMany(Question::class, 'subject_id', 'id');
    }
    public function classes()
    {
        return $this->hasMany(Classroom::class, 'subject_id', 'id');
    }
    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'id');
    }
}
