<?php

namespace App\Console\Commands;

use App\Models\QuizQuestion;
use App\Services\QuizQuestionGeneratorService;
use Illuminate\Console\Command;
use Throwable;

class GenerateQuizQuestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'quiz:generate-questions {--count=15} {--prune=100}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gera novas perguntas do quiz com IA e remove as mais antigas da pool.';

    public function handle(QuizQuestionGeneratorService $generator): int
    {
        $count = (int) $this->option('count');
        $keepAtMost = (int) $this->option('prune');

        try {
            $saved = $generator->generate($count);
        } catch (Throwable $exception) {
            $this->error(
                "Falha ao gerar perguntas do quiz: {$exception->getMessage()}"
            );

            return self::FAILURE;
        }

        $this->info("{$saved} pergunta(s) nova(s) guardada(s).");

        $this->pruneOldestBeyond($keepAtMost);

        return self::SUCCESS;
    }

    private function pruneOldestBeyond(int $keepAtMost): void
    {
        $total = QuizQuestion::query()->count();

        if ($total <= $keepAtMost) {
            return;
        }

        $idsToRemove = QuizQuestion::query()
            ->orderBy('created_at')
            ->limit($total - $keepAtMost)
            ->pluck('id');

        QuizQuestion::query()
            ->whereIn('id', $idsToRemove)
            ->delete();

        $this->info(
            "{$idsToRemove->count()} pergunta(s) antiga(s) removida(s) da pool."
        );
    }
}
