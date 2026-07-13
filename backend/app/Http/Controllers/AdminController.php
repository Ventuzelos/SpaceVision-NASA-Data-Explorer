<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Devolve o número total de utilizadores registados.
     */
    public function usersCount(): JsonResponse
    {
        return response()->json([
            'count' => User::count(),
        ]);
    }

    
}
