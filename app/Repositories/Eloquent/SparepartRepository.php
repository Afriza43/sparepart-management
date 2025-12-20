<?php

namespace App\Repositories\Eloquent;

use App\Models\Sparepart;
use App\Repositories\Interfaces\SparepartRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class SparepartRepository implements SparepartRepositoryInterface
{
    protected $model;

    // Inject Model Sparepart ke sini
    public function __construct(Sparepart $model)
    {
        $this->model = $model;
    }

    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        // Kita eager load relasi agar hemat query (N+1 Problem solved)
        return $this->model->with(['category', 'brand', 'unit'])
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): ?Sparepart
    {
        return $this->model->with(['category', 'brand', 'unit'])->find($id);
    }

    public function findByNoPart(string $no_part): ?Sparepart
    {
        return $this->model->where('no_part', $no_part)->first();
    }

    public function create(array $data): Sparepart
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $sparepart = $this->model->find($id);
        if (!$sparepart) return false;

        return $sparepart->update($data);
    }

    public function delete(int $id): bool
    {
        $sparepart = $this->model->find($id);
        if (!$sparepart) return false;

        return $sparepart->delete();
    }
}
