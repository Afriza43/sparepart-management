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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(); // Siapa adminnya

            // Nullable karena: Kalau barang masuk butuh supplier, kalau keluar butuh vehicle (opsional)
            $table->foreignId('supplier_id')->nullable()->constrained();
            $table->foreignId('vehicle_id')->nullable()->constrained(); // Barang ini dipasang ke bus mana?

            $table->enum('type', ['in', 'out', 'initial']); // Initial = Penyesuaian stok manual (Saldo Awal)
            $table->date('date');
            $table->string('reference_number'); // No Nota / No Surat Jalan

            $table->text('notes')->nullable(); // Keterangan (misal: "Ganti rutin")
            $table->string('image_proof')->nullable(); // Foto Nota / Foto Barang Rusak yg diganti
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
