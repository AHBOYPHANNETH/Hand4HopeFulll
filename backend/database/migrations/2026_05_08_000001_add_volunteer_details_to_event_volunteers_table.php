<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_volunteers', function (Blueprint $table) {
            $table->string('name')->nullable()->after('user_id');
            $table->string('email')->nullable()->after('name');
            $table->string('phone', 40)->nullable()->after('email');
            $table->date('date_of_birth')->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('event_volunteers', function (Blueprint $table) {
            $table->dropColumn(['name', 'email', 'phone', 'date_of_birth']);
        });
    }
};
