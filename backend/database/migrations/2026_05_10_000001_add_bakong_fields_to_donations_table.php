<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('currency');
            $table->string('md5', 64)->nullable()->after('status')->index();
            $table->text('qr_string')->nullable()->after('md5');
            $table->string('bakong_hash')->nullable()->after('qr_string');
            $table->timestamp('paid_at')->nullable()->after('bakong_hash');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn(['status', 'md5', 'qr_string', 'bakong_hash', 'paid_at']);
        });
    }
};
