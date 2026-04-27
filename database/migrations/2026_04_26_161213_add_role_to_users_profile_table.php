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
        Schema::table('users_profile', function (Blueprint $table) {
            $table->string('team')->default('internal'); // internal or cnjo
            $table->string('role')->default('ranger'); // manager, team_leader, ranger, etc.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users_profile', function (Blueprint $table) {
            $table->dropColumn(['team', 'role']);
        });
    }
};
