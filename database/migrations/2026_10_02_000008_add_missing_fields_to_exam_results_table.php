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
        if (Schema::hasTable('exam_results')) {
            Schema::table('exam_results', function (Blueprint $table) {
                if (! Schema::hasColumn('exam_results', 'reading_score')) {
                    $table->float('reading_score')->default(0)->after('status_text');
                }
                if (! Schema::hasColumn('exam_results', 'listening_score')) {
                    $table->float('listening_score')->default(0)->after('reading_score');
                }
                if (! Schema::hasColumn('exam_results', 'writing_score')) {
                    $table->float('writing_score')->default(0)->after('listening_score');
                }
                if (! Schema::hasColumn('exam_results', 'speaking_score')) {
                    $table->float('speaking_score')->default(0)->after('writing_score');
                }
                if (! Schema::hasColumn('exam_results', 'tab_switch_count')) {
                    $table->integer('tab_switch_count')->default(0)->after('speaking_score');
                }
                if (! Schema::hasColumn('exam_results', 'ai_feedback')) {
                    $table->text('ai_feedback')->nullable()->after('tab_switch_count');
                }
                if (! Schema::hasColumn('exam_results', 'description')) {
                    $table->text('description')->nullable()->after('ai_feedback');
                }
                if (! Schema::hasColumn('exam_results', 'time_ago')) {
                    $table->string('time_ago')->nullable()->after('description');
                }
                if (! Schema::hasColumn('exam_results', 'submitted_at')) {
                    $table->timestamp('submitted_at')->useCurrent()->after('time_ago');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
