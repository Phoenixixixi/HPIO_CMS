<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('landing_contents')->updateOrInsert(
            ['key' => 'about_description'],
            [
                'value' => 'HPIO (High Performance Information Operations) is dedicated to maintaining the excellence of IT systems for the Jakarta-Bandung High-Speed Railway.',
                'type' => 'text',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('landing_contents')->where('key', 'about_description')->delete();
    }
};
