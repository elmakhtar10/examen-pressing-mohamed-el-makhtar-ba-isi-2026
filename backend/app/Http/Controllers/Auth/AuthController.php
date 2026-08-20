<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request){

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Identifiants incorrects.'
            ], 401);
        }

        $user = User::where('email', $credentials['email'])->first()->load('role');
        $token = $user->createToken('angular_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

public function register(Request $request)
{
    $validated = $request->validate([
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'string', 'email', 'unique:users,email'],
        'password' => ['required', 'string'],
        'phone'    => ['nullable', 'string'],
    ]);

    $clientRole = Role::where('name', 'Client')->first();

    $user = User::create([
        'name'     => $validated['name'],
        'email'    => $validated['email'],
        'phone'    => $validated['phone'] ?? null,
        'password' => Hash::make($validated['password']),
        'role_id'  => $clientRole ? $clientRole->id : 2
    ]);

    $token = $user->createToken('angular_token')->plainTextToken;

    return response()->json([
        'message'      => 'Inscription réussie.',
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => $user
    ], 201);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }
}
