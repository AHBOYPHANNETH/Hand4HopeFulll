<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Existing events from before capacity was required default to 10 seats.
        DB::table('events')->whereNull('capacity')->update(['capacity' => 10]);

        Schema::table('events', function (Blueprint $table) {
            $table->integer('capacity')->default(10)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->integer('capacity')->nullable()->default(null)->change();
        });
    }
};
