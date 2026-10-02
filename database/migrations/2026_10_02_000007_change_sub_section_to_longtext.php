<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            Schema::table('questions', function (Blueprint $table) {
                DB::statement('ALTER TABLE questions MODIFY sub_section LONGTEXT NULL');
            });
        } catch (Throwable $e) {
        }

        try {
            Schema::table('exams', function (Blueprint $table) {
                if (Schema::hasColumn('exams', 'sections_json')) {
                    DB::statement('ALTER TABLE exams MODIFY sections_json LONGTEXT NULL');
                }
            });
        } catch (Throwable $e) {
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
