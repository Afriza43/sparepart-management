<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends Model
{
    protected $fillable = ['name', 'slug'];

    // Relasi: Satu Merk punya banyak Sparepart
    public function spareparts(): HasMany
    {
        return $this->hasMany(Sparepart::class);
    }
}
