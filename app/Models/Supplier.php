<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = ['name', 'address', 'phone'];

    // Relasi: Satu Supplier bisa ada di banyak Transaksi (Pembelian)
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
