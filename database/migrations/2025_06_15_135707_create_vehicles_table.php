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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_owner_id')
            ->constrained('vehicle_owners')
            ->cascadeOnDelete()
            ->cascadeOnUpdate();
            $table->foreignId('car_type_id')
            ->constrained('car_types')
            ->cascadeOnDelete()
            ->cascadeOnUpdate();
            $table->longText("car_discription");
            $table->integer('people_count');
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
