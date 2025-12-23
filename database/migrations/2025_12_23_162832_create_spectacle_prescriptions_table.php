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
        Schema::create('spectacle_prescriptions', function (Blueprint $table) {
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
            $table->string('od_prism', 20)->nullable();

            // Left Eye (OS)
            $table->decimal('os_sphere', 5, 2);
            $table->decimal('os_cylinder', 5, 2)->nullable();
            $table->unsignedSmallInteger('os_axis')->nullable();
            $table->decimal('os_add', 4, 2)->nullable();
            $table->string('os_prism', 20)->nullable();

            // PD
            $table->decimal('pd_far', 4, 1)->nullable();
            $table->decimal('pd_near', 4, 1)->nullable();
            $table->enum('pd_type', ['single', 'dual'])->default('single');

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
        Schema::dropIfExists('spectacle_prescriptions');
    }
};
