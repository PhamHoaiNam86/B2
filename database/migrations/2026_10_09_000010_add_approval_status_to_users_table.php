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
        if (! Schema::hasColumn('users', 'approval_status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('approval_status')->default('pending')->after('is_admin');
            });
        }

        // Approve existing users and admin accounts
        DB::table('users')->whereNull('approval_status')->orWhere('is_admin', true)->update([
            'approval_status' => 'approved',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('users', 'approval_status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('approval_status');
            });
        }
    }
};
