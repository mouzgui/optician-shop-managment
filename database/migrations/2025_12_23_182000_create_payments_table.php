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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            
            $table->decimal('amount', 12, 2);
            $table->string('payment_method'); // cash, card, bank_transfer, insurance
            
            $table->string('reference')->nullable(); // Transaction ID, check number, etc.
            $table->string('insurance_claim_id')->nullable();
            
            $table->foreignId('received_by')->constrained('users');
            $table->dateTime('received_at');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['business_id', 'invoice_id']);
            $table->index(['business_id', 'payment_method']);
            $table->index(['business_id', 'received_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
