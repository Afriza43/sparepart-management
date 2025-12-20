<?php

namespace App\Repositories\Interfaces;

use App\Models\Sparepart;
use Illuminate\Pagination\LengthAwarePaginator;

interface SparepartRepositoryInterface
{
    // Mengambil semua data (dengan pagination agar aplikasi tidak berat)
    public function getAll(int $perPage = 10): LengthAwarePaginator;

    // Mencari 1 barang berdasarkan ID
    public function findById(int $id): ?Sparepart;

    // Mencari barang berdasarkan No Part (Untuk scan barcode nanti)
    public function findByNoPart(string $no_part): ?Sparepart;

    // Simpan data baru
    public function create(array $data): Sparepart;

    // Update data
    public function update(int $id, array $data): bool;

    // Hapus data (Soft delete)
    public function delete(int $id): bool;
}
