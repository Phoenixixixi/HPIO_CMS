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
        Schema::create('track_interns', function (Blueprint $table) {
            $table->id();
            $table->string('Batch');
            $table->string('start_date');
            $table->string('end_date');
            $table->string('achievement_title');
            $table->text('achievement_description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('track_interns');
    }
};
