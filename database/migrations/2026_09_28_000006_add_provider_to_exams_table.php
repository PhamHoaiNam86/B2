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
        if (! Schema::hasColumn('exams', 'provider')) {
            Schema::table('exams', function (Blueprint $table) {
                $table->string('provider', 50)->default('TELC')->after('level');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('exams', 'provider')) {
            Schema::table('exams', function (Blueprint $table) {
                $table->dropColumn('provider');
            });
        }
    }
};
