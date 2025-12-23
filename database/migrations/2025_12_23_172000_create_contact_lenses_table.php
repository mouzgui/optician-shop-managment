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
        Schema::create('contact_lenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            
            $table->string('brand');
            $table->string('product_line');
            $table->string('type'); // spherical, toric, multifocal, color
            $table->string('replacement_schedule'); // daily, monthly, etc.
            
            // Optical parameters
            $table->decimal('power', 4, 2)->nullable(); // sphere
            $table->decimal('cylinder', 4, 2)->nullable();
            $table->unsignedSmallInteger('axis')->nullable();
            $table->decimal('add', 4, 2)->nullable();
            $table->decimal('base_curve', 4, 2)->nullable();
            $table->decimal('diameter', 4, 2)->nullable();
            
            $table->integer('box_quantity')->default(1); // lenses per box
            $table->integer('boxes_in_stock')->default(0);
            
            $table->decimal('cost_price_per_box', 12, 2)->nullable();
            $table->decimal('selling_price_per_box', 12, 2);
            
            $table->date('expiry_date')->nullable();
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['business_id', 'brand', 'product_line']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_lenses');
    }
};
