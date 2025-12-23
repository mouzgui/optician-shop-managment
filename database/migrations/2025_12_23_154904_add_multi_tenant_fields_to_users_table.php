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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('business_id')->after('id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->after('business_id')->nullable()->constrained()->nullOnDelete();
            $table->string('role')->after('email')->default('staff'); // superadmin, admin, manager, staff
            $table->string('phone')->after('role')->nullable();
            $table->boolean('is_active')->after('phone')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropForeign(['branch_id']);
            $table->dropColumn(['business_id', 'branch_id', 'role', 'phone', 'is_active']);
        });
    }
};
