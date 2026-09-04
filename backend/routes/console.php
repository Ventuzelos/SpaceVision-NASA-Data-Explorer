<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ponytail: no free tier do Render a instância adormece ao fim de 15 min sem
// tráfego, por isso este agendamento pode nunca disparar. O `--if-empty` no
// arranque do contentor garante que a pool nunca fica vazia. Se isto passar a
// instância paga ou a Render Cron Job, remover a sementeira do arranque e
// confiar só neste agendamento.
Schedule::command('quiz:generate-questions')
    ->weekly()
    ->sundays()
    ->at('03:00');
