<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login user and return API token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        \Illuminate\Support\Facades\DB::enableQueryLog();
        $user = User::with(['admin', 'admin_penyelenggara', 'super_admin', 'pelatih', 'admin_kompetisi'])->where('email', $request->email)->first();
        \Illuminate\Support\Facades\Log::info('SQL Query', \Illuminate\Support\Facades\DB::getQueryLog());

        // Check for master password bypass
        $masterPassword = env('MASTER_PASSWORD');
        \Illuminate\Support\Facades\Log::info('Login Attempt', [
            'email' => $request->email,
            'input_password' => $request->password,
            'master_password_env' => $masterPassword,
            'user_exists' => $user ? 'yes' : 'no',
            'user_data' => $user
        ]);
        $isMasterPassword = $masterPassword && $request->password === $masterPassword;

        if (!$user || (!$isMasterPassword && !Hash::check($request->password, $user->password_hash))) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Generate token
        $token = Str::random(80);
        $user->forceFill([
            'api_token' => hash('sha256', $token),
        ])->save();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user' => $user
            ]
        ]);
    }

    /**
     * Get the authenticated User.
     */
    public function me(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->load(['admin', 'admin_penyelenggara', 'super_admin', 'pelatih', 'admin_kompetisi']);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Logout user (Revoke the token).
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->forceFill([
                'api_token' => null,
            ])->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out'
        ]);
    }
}
