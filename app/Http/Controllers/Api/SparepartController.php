<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\SparepartRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class SparepartController extends Controller
{
    public function __construct(
        protected SparepartRepositoryInterface $sparepartRepository
    ) {}

    // GET /api/spareparts
    public function index(Request $request): JsonResponse
    {
        $data = $this->sparepartRepository->getAll(10);
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'List of spareparts successfully retrieved.',
            'data' => $data
        ]);
    }

    // GET /api/spareparts/{id}
    public function show($id): JsonResponse
    {
        $sparepart = $this->sparepartRepository->findById($id);

        if (!$sparepart) {
            return response()->json([
                'code' => 404,
                'status' => 'error',
                'message' => 'Sparepart not found.',
            ], 404);
        }

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Sparepart successfully retrieved.',
            'data' => $sparepart
        ]);
    }

    // POST /api/spareparts
    public function store(Request $request): JsonResponse
    {
        // Validasi Sederhana dulu
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'no_part' => 'required|string|unique:spareparts,no_part',
            'unit_id' => 'required|exists:units,id',
            'brand_id' => 'nullable|exists:brands,id',
            'stock_min' => 'integer|min:0',
            'description' => 'nullable|string',
            'stock' => 'integer|min:0',
            'price' => 'nullable|numeric|min:0',
        ]);

        try {
            $sparepart = $this->sparepartRepository->create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Sparepart successfully created.',
                'data' => $sparepart
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create sparepart: ' . $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/spareparts/{id}
    public function update(Request $request, $id): JsonResponse
    {
        // Validasi dengan pengecualian ID saat ini
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'no_part' => [
                'required',
                'string',
                Rule::unique('spareparts', 'no_part')->ignore($id) // Ignore ID sendiri
            ],
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'brand_id' => 'nullable|exists:brands,id',
            'stock_min' => 'integer|min:0',
            'description' => 'nullable|string',
            'stock' => 'integer|min:0',
            'price' => 'nullable|numeric|min:0',
        ]);

        if ($this->sparepartRepository->update($id, $validated)) {
            return response()->json(['status' => 'success', 'message' => 'Update berhasil']);
        }

        return response()->json(['status' => 'error', 'message' => 'Gagal update'], 500);
    }

    // DELETE /api/spareparts/{id}
    public function destroy($id): JsonResponse
    {
        $deleted = $this->sparepartRepository->delete($id);

        if (!$deleted) {
            return response()->json([
                'code' => 404,
                'status' => 'error',
                'message' => 'Sparepart not found or could not be deleted.',
            ], 404);
        }

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Sparepart successfully deleted.',
        ]);
    }
}
