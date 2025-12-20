<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    protected $fillable = ['name', 'code']; // code: pcs, set, ltr

    // Relasi: Satu Satuan dipakai banyak Sparepart
    public function spareparts(): HasMany
    {
        return $this->hasMany(Sparepart::class);
    }
}
