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
        Schema::create('frames', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('sku');
            $table->string('barcode')->nullable();
            $table->string('brand');
            $table->string('model');
            $table->string('color_code')->nullable();
            $table->string('color_name')->nullable();
            
            // Sizes (mm)
            $table->unsignedSmallInteger('size_eye')->nullable();
            $table->unsignedSmallInteger('size_bridge')->nullable();
            $table->unsignedSmallInteger('size_temple')->nullable();
            
            $table->string('category'); // optical, sunglasses, sports, kids
            $table->string('material')->nullable(); // metal, plastic, titanium, acetate, mixed
            $table->string('gender')->nullable(); // male, female, unisex, kids
            
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->decimal('selling_price', 12, 2);
            
            $table->integer('quantity')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['business_id', 'sku']);
            $table->index(['business_id', 'barcode']);
            $table->index(['business_id', 'brand', 'model']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('frames');
    }
};
