<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sparepart extends Model
{
    use SoftDeletes; // Agar data tidak hilang permanen saat dihapus

    protected $fillable = [
        'category_id',
        'brand_id',
        'unit_id',
        'name',
        'no_part',
        'stock_min',
        'stock',
        'description',
        'image',
        'price'
    ];

    // --- RELASI KE ATAS (Parents) ---

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    // --- RELASI KE BAWAH (Children) ---

    // Barang ini ada di detail transaksi apa saja?
    public function transactionDetails(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
