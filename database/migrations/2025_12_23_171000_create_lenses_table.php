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
        Schema::create('lenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            
            $table->string('name'); // e.g., "Single Vision 1.56 HMC"
            $table->string('brand')->nullable();
            $table->string('type'); // single_vision, bifocal, progressive, office, sports
            $table->string('index'); // 1.50, 1.56, 1.60, 1.67, 1.74
            
            $table->json('coatings')->nullable();
            $table->string('material')->nullable();
            
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->decimal('selling_price', 12, 2);
            
            $table->string('lab_supplier')->nullable();
            $table->integer('lead_time_days')->default(0);
            
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['business_id', 'type', 'index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lenses');
    }
};
