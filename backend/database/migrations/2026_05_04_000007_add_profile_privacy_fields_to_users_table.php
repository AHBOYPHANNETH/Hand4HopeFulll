<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->after('role');
            $table->string('phone', 40)->nullable()->after('avatar_url');
            $table->string('address')->nullable()->after('phone');
            $table->boolean('is_profile_public')->default(false)->after('address');
            $table->boolean('email_notifications')->default(true)->after('is_profile_public');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_url',
                'phone',
                'address',
                'is_profile_public',
                'email_notifications',
            ]);
        });
    }
};
