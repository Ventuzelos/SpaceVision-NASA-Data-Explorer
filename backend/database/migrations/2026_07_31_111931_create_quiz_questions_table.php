<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->text('text_pt');
            $table->text('text_en');
            $table->json('options_pt');
            $table->json('options_en');
            $table->unsignedTinyInteger('correct_index');
            $table->text('fact_pt');
            $table->text('fact_en');
            $table->string('source')->default('ai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
