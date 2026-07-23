<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Enviada de forma síncrona (não implementa ShouldQueue) - é um
 * evento raro (alguém repetir um registo com um email já usado),
 * não vale a pena depender de um queue worker estar a correr só
 * para esta notificação chegar.
 */
class ExistingAccountRegistrationAttempted extends Notification
{
    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Tentativa de registo com o teu email — SpaceVision')
            ->line('Alguém tentou criar uma conta no SpaceVision usando este endereço de email.')
            ->line('Se foste tu, já tens conta — inicia sessão normalmente ou usa "Esqueceste-te da password?" se não a recordares.')
            ->line('Se não foste tu, podes ignorar este email em segurança.');
    }
}
