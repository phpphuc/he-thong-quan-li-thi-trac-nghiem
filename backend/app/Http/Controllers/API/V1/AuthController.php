<?php

namespace App\Http\Controllers\API\V1;

use App\Models\User;
use App\Helper\Reply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\API\V1\LoginRequest;
use App\Http\Controllers\API\V1\Controller;
use App\Http\Resources\API\V1\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthController extends Controller
{
    public function index()
    {
        return User::all();
    }

    // Temporary code for development purposes
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:TEACHER,STUDENT,SCHOOLBOARD',
            'phone' => 'required|string',
            'address' => 'required|string',
            'birth_date' => 'required|date',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
            'address' => $request->address,
            'birth_date' => $request->birth_date,
        ]);

        if ($request->role == 'TEACHER') {
            $user->teacher()->create();
        } else if ($request->role == 'STUDENT') {
            $user->student()->create();
        } else if ($request->role == 'SCHOOLBOARD') {
            $user->schoolboard()->create();
        }

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function login(LoginRequest $request)
    {
        // dd($request->only('email', 'password'));
        // có thể dùng cách này
        // if (!auth()->attempt($request->only('email', 'password'))) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Invalid login details'
        //     ], 401);
        // }

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'status' => '401',
                    'title' => 'Unauthorized',
                    'detail' => 'Invalid login details'
                ]
            ], 401);
        }

        $abilities = [];
        switch ($user->role) {
            case 'TEACHER':
                $abilities = ['view-users', 'view-questions', 'create-questions', 'update-questions', 'delete-questions', 'view-subjects', 'view-exams', 'create-exams', 'submit-exams', 'view-results', 'create-results', 'update-results', 'view-student-results', 'view-exam-report', 'view-schoolboards', 'create-schoolboards', 'update-schoolboards', 'delete-schoolboards', 'create-schoolboard-exams', 'view-schoolboard-exams', 'view-schoolboard-exam-report', 'edit-exams'];
                break;
            case 'STUDENT':
                $abilities = ['view-student-exams', 'submit-exams', 'view-student-results'];
                break;
            case 'SCHOOLBOARD':
                $abilities = ['view-users', 'view-questions', 'view-exams', 'create-exams', 'view-results', 'view-exam-report', 'view-schoolboards', 'create-schoolboards', 'update-schoolboards', 'delete-schoolboards', 'create-schoolboard-exams', 'view-schoolboard-exams', 'view-schoolboard-exam-report', 'edit-exams'];
                break;
        }

        $token = $user->createToken('authToken', $abilities)->plainTextToken;

        $user->setAttribute('token', $token);

        return new UserResource($user);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
