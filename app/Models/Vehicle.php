<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    // bus_code = Kode Lambung (misal: BUS-01)
    protected $fillable = ['nopol', 'bus_code', 'model'];

    // Relasi: Satu Kendaraan punya banyak riwayat pemakaian sparepart (Transaksi)
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
