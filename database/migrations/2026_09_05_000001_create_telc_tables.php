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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('exam_code')->unique();
            $table->string('title');
            $table->integer('duration_minutes')->default(90);
            $table->string('level')->default('TELC B2');
            $table->text('description')->nullable();
            $table->integer('total_questions')->default(45);
            $table->integer('total_score')->default(300);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('vocabularies', function (Blueprint $table) {
            $table->id();
            $table->string('vocab_id')->unique();
            $table->string('word');
            $table->string('article')->nullable(); // der, die, das
            $table->string('plural')->nullable();
            $table->string('pos'); // Nomen, Verb, Adjektiv, Redewendung
            $table->string('phonetic')->nullable();
            $table->text('meaning_vi');
            $table->text('example_de');
            $table->text('example_vi');
            $table->string('topic');
            $table->string('status')->default('learning'); // learning, mastered, reviewing
            $table->boolean('is_favorite')->default(false);
            $table->timestamps();
        });

        Schema::create('grammar_topics', function (Blueprint $table) {
            $table->id();
            $table->string('topic_id')->unique();
            $table->string('title');
            $table->string('level')->default('B2');
            $table->string('category');
            $table->text('summary');
            $table->longText('content')->nullable(); // HTML or Markdown breakdown
            $table->json('rule_points')->nullable();
            $table->json('examples')->nullable();
            $table->string('status')->default('in_progress'); // completed, in_progress, not_started
            $table->integer('progress')->default(0);
            $table->float('score')->default(0.0);
            $table->string('badge_label')->default('CẦN LUYỆN');
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('class_name');
            $table->string('avatar_url')->nullable();
            $table->float('target_score')->default(240.0);
            $table->float('current_score')->default(0.0);
            $table->string('status')->default('Đang học');
            $table->date('target_exam_date')->nullable();
            $table->timestamps();
        });

        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->string('result_id')->unique();
            $table->string('exam_code');
            $table->string('student_name');
            $table->float('score');
            $table->float('max_score')->default(300.0);
            $table->string('status_text'); // Đạt chuẩn TELC B2, Xuất sắc, Cần cố gắng
            $table->float('reading_score')->default(0);
            $table->float('listening_score')->default(0);
            $table->float('writing_score')->default(0);
            $table->float('speaking_score')->default(0);
            $table->integer('tab_switch_count')->default(0);
            $table->text('ai_feedback')->nullable();
            $table->text('description')->nullable();
            $table->string('time_ago')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_results');
        Schema::dropIfExists('students');
        Schema::dropIfExists('grammar_topics');
        Schema::dropIfExists('vocabularies');
        Schema::dropIfExists('exams');
    }
};
