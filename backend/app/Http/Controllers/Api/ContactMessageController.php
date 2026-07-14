<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[\pL\pM\s\'-]+$/u',
            ],
            'email' => [
                'required',
                'string',
                'email:rfc',
                'max:150',
            ],
            'subject' => [
                'required',
                'string',
                'min:3',
                'max:150',
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:5000',
            ],
        ]);

        $contactMessage = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Mensagem enviada com sucesso.',
            'data' => $contactMessage,
        ], 201);
    }
}
