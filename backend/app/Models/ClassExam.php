<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClassExam extends Model
{
    use HasFactory;

    protected $table = 'class_exam';
    protected $fillable = [
        'class_id',
        'exam_id',
    ];
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    // Quan hệ với bảng 'Exam'
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
