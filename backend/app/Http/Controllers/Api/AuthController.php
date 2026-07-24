<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ExistingAccountRegistrationAttempted;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Regista uma conta nova.
     *
     * A resposta é sempre igual quer o email já exista quer não
     * (não cria conta duplicada nem revela qual dos dois casos
     * aconteceu - ver finding F5 da auditoria de segurança). O
     * registo já não devolve token de acesso imediato: a conta só
     * fica utilizável depois de confirmar o email (F6).
     */
    public function register(Request $request)
    {
       $validated = $request->validate(
    [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ],
    [
        'name.required' => 'O nome é obrigatório.',
        'name.max' => 'O nome não pode ter mais de 255 caracteres.',
        'email.required' => 'O email é obrigatório.',
        'email.email' => 'Introduz um email válido.',
        'password.required' => 'A palavra-passe é obrigatória.',
        'password.min' => 'A palavra-passe deve ter pelo menos 8 caracteres.',
        'password.confirmed' => 'A confirmação da palavra-passe não coincide.',
    ]
);

        $existingUser = User::where('email', $validated['email'])->first();

        $responseData = [
            'message' => 'Verifica o teu email para ativares a conta.',
        ];

        if ($existingUser) {
            $existingUser->notify(
                new ExistingAccountRegistrationAttempted
            );
        } else {
            $user = User::create($validated);

            event(new Registered($user));

            $verificationUrl = $this->localVerificationUrl($user);

            if ($verificationUrl) {
                $responseData['verification_url'] = $verificationUrl;
            }
        }

        return response()->json($responseData, 201);
    }

    /**
     * Devolve o link de verificação assinado para uso direto em
     * testes locais (evita ter de ir ao storage/logs/laravel.log
     * ou configurar um mailer real só para testar o registo).
     *
     * Nunca ativo fora de app()->isLocal() - expor isto em staging
     * ou produção anularia o propósito da verificação de email.
     */
    private function localVerificationUrl(User $user): ?string
    {
        if (! app()->isLocal()) {
            return null;
        }

        return URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );
    }

    /**
     * Confirma o email a partir do link assinado enviado por email
     * e redireciona para o frontend.
     */
    public function verifyEmail(
        Request $request,
        int $id,
        string $hash
    ) {
        $user = User::findOrFail($id);

        if (! hash_equals(
            (string) $hash,
            sha1($user->getEmailForVerification())
        )) {
            abort(403, 'Link de verificação inválido.');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();

            event(new Verified($user));
        }

        $frontendUrl = rtrim(
            (string) config('app.frontend_url'),
            '/'
        );

        return redirect()->away(
            $frontendUrl.'/login?verified=1'
        );
    }

    /**
     * Reenvia o email de verificação, se existir uma conta por
     * verificar com este email. Resposta sempre genérica (F5).
     */
    public function resendVerification(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        $responseData = [
            'message' => 'Se existir uma conta por verificar com esse email, foi enviado um novo link.',
        ];

        if ($user && ! $user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();

            $verificationUrl = $this->localVerificationUrl($user);

            if ($verificationUrl) {
                $responseData['verification_url'] = $verificationUrl;
            }
        }

        return response()->json($responseData);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Os dados de acesso estão incorretos.'],
            ]);
        }

        $token = $this->createAccessToken($user);

        return response()->json([
            'user' => $this->userData($user),
            'token' => $token,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        Password::sendResetLink([
            'email' => $validated['email'],
        ]);

        return response()->json([
            'message' => 'Se existir uma conta com esse email, será enviado um link para repor a palavra-passe.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => 'Palavra-passe atualizada com sucesso.',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ], [
            'name.required' => 'O nome é obrigatório.',
            'name.max' => 'O nome não pode ter mais de 255 caracteres.',
            'email.required' => 'O email é obrigatório.',
            'email.email' => 'Introduz um email válido.',
            'email.unique' => 'Este email já está associado a outra conta.',
        ]);

        $user->update([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
        ]);

        return response()->json([
            'message' => 'Perfil atualizado com sucesso.',
            'user' => $this->userData($user->fresh()),
        ]);
    }

    public function deleteAccount(Request $request)
    {
        $validated = $request->validate([
            'password' => [
                'required',
                'string',
            ],
        ], [
            'password.required' => 'Introduz a tua palavra-passe para eliminar a conta.',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => [
                    'A palavra-passe está incorreta.',
                ],
            ]);
        }

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->delete();
        });

        return response()->json([
            'message' => 'Conta eliminada com sucesso.',
        ]);
    }

    public function logout(Request $request)
    {
        $currentAccessToken = $request->user()->currentAccessToken();

        if ($currentAccessToken) {
            $currentAccessToken->delete();
        }

        return response()->json([
            'message' => 'Sessão terminada com sucesso.',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json(
            $this->userData($request->user())
        );
    }

    private function createAccessToken(User $user): string
    {
        $abilities = [
            'profile:read',
            'profile:update',
            'favorites:manage',
            'nasa:read',
        ];

        if ($user->isAdmin()) {
            $abilities[] = 'admin:access';
        }

        return $user
            ->createToken('spacevision-token', $abilities)
            ->plainTextToken;
    }

    private function userData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_admin' => $user->isAdmin(),
            'has_nasa_api_key' => filled($user->nasa_api_key),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
