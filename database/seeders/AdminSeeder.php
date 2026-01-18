<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Cek apakah user sudah ada biar tidak duplikat
        if (!User::where('email', 'admin@sparepart.com')->exists()) {
            User::create([
                'name' => 'Super Admin',
                'email' => 'admin@sparepart.com', // Email Login
                'password' => Hash::make('adminlogistik123'), // Password Login (Terenkripsi)
                'email_verified_at' => now(),
            ]);
        }
    }
}
