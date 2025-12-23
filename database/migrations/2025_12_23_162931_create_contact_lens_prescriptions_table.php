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
        Schema::create('contact_lens_prescriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('prescribed_by')->constrained('users')->cascadeOnDelete();
            $table->dateTime('prescribed_at');

            // Right Eye (OD)
            $table->decimal('od_sphere', 5, 2);
            $table->decimal('od_cylinder', 5, 2)->nullable();
            $table->unsignedSmallInteger('od_axis')->nullable();
            $table->decimal('od_add', 4, 2)->nullable();
            $table->decimal('od_base_curve', 4, 2)->nullable(); // 8.0-9.5
            $table->decimal('od_diameter', 4, 2)->nullable();  // 13.0-15.0
            $table->string('od_brand')->nullable();

            // Left Eye (OS)
            $table->decimal('os_sphere', 5, 2);
            $table->decimal('os_cylinder', 5, 2)->nullable();
            $table->unsignedSmallInteger('os_axis')->nullable();
            $table->decimal('os_add', 4, 2)->nullable();
            $table->decimal('os_base_curve', 4, 2)->nullable(); // 8.0-9.5
            $table->decimal('os_diameter', 4, 2)->nullable();  // 13.0-15.0
            $table->string('os_brand')->nullable();

            $table->string('replacement_schedule')->nullable(); // daily, bi-weekly, monthly, etc.
            $table->text('notes')->nullable();
            $table->dateTime('expires_at');

            $table->timestamps();

            $table->index(['business_id', 'customer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_lens_prescriptions');
    }
};
