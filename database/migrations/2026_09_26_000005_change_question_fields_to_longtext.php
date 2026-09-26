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
        Schema::table('questions', function (Blueprint $table) {
            DB::statement('ALTER TABLE questions MODIFY title TEXT NULL');
            DB::statement('ALTER TABLE questions MODIFY context_text LONGTEXT NULL');
            DB::statement('ALTER TABLE questions MODIFY explanation LONGTEXT NULL');
            DB::statement('ALTER TABLE questions MODIFY options_json LONGTEXT NULL');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
