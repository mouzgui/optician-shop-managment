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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

            $table->string('invoice_number', 50)->unique();
            $table->string('status')->default('deposit_paid');

            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->string('discount_type')->default('fixed'); // fixed, percentage
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);

            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->decimal('balance_due', 12, 2);

            // Polymorphic relationship for prescriptions
            $table->nullableMorphs('prescription');

            $table->text('notes')->nullable();
            $table->text('warranty_info')->nullable();

            $table->dateTime('estimated_pickup')->nullable();
            $table->dateTime('actual_pickup')->nullable();

            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['business_id', 'status']);
            $table->index(['business_id', 'created_at']);
            $table->index(['business_id', 'invoice_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
