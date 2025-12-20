<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sparepart;
use Illuminate\Support\Str;

class UpdateSparepartPricesSeeder extends Seeder
{
    public function run(): void
    {
        $spareparts = Sparepart::all();

        foreach ($spareparts as $part) {
            $name = strtoupper($part->name);
            $price = 0;

            // Logika Harga Berdasarkan Nama Barang
            if (Str::contains($name, 'BAN LUAR')) {
                $price = 3500000; // 3.5 Juta
            } elseif (Str::contains($name, 'BAN DALAM')) {
                $price = 250000;  // 250 Ribu
            } elseif (Str::contains($name, 'SELENDANG')) {
                $price = 75000;
            } elseif (Str::contains($name, 'KAMPAS REM')) {
                $price = 185000;  // 185 Ribu
            } elseif (Str::contains($name, 'FILTER OLI')) {
                $price = 85000;
            } elseif (Str::contains($name, 'FILTER SOLAR')) {
                $price = 65000;
            } elseif (Str::contains($name, 'FILTER UDARA')) {
                $price = 250000;
            } elseif (Str::contains($name, 'OLI') || Str::contains($name, 'PELUMAS')) {
                $price = 45000;   // Per Liter
            } elseif (Str::contains($name, 'BOHLAM') || Str::contains($name, 'LAMPU')) {
                $price = 25000;
            } elseif (Str::contains($name, 'SEKRING')) {
                $price = 2000;
            } elseif (Str::contains($name, 'MINYAK REM')) {
                $price = 35000;
            } else {
                // Harga default random jika tidak dikenali (50rb - 500rb)
                $price = rand(50, 500) * 1000;
            }

            // Update harga
            $part->update(['price' => $price]);

            $this->command->info("Updated: {$part->name} -> Rp " . number_format($price));
        }
    }
}
