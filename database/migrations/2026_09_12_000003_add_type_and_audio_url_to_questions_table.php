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
        Schema::table('questions', function (Blueprint $table) {
            if (! Schema::hasColumn('questions', 'type')) {
                $table->string('type')->default('choice')->after('sub_section');
            }
            if (! Schema::hasColumn('questions', 'audio_url')) {
                $table->text('audio_url')->nullable()->after('context_text');
            }
            $table->string('correct_option_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('questions', 'audio_url')) {
                $table->dropColumn('audio_url');
            }
        });
    }
};
