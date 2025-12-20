<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Models\User;
use App\Models\Supplier;
use App\Models\Vehicle;
use App\Models\TransactionDetail;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'supplier_id',
        'vehicle_id',
        'type',             // 'in', 'out', 'initial'
        'date',
        'reference_number', // No Nota / No Bon
        'notes',
        'image_proof'
    ];

    // Cast tanggal agar otomatis jadi object Carbon (mudah diformat)
    protected $casts = [
        'date' => 'date',
    ];

    // --- RELASI ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class); // Asumsi tabel users bawaan Laravel
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    // Satu nota punya banyak barang
    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
