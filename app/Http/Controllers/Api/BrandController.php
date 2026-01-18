<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    // GET: Ambil semua data
    public function index()
    {
        $brands = Brand::latest()->get();
        return response()->json(['data' => $brands]);
    }

    // POST: Simpan data baru
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $brand = Brand::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return response()->json(['message' => 'Brand berhasil dibuat', 'data' => $brand], 201);
    }

    // PUT: Update data
    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $brand = Brand::findOrFail($id);
        $brand->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return response()->json(['message' => 'Brand berhasil diupdate', 'data' => $brand]);
    }

    // DELETE: Hapus data
    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();

        return response()->json(['message' => 'Brand berhasil dihapus']);
    }
}
