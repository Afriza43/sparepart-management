<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Supplier::latest()->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string'
        ]);

        $supplier = Supplier::create($request->all());
        return response()->json(['message' => 'Supplier berhasil disimpan', 'data' => $supplier]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string'
        ]);

        $supplier = Supplier::findOrFail($id);
        $supplier->update($request->all());
        return response()->json(['message' => 'Supplier berhasil diupdate', 'data' => $supplier]);
    }

    public function destroy($id)
    {
        Supplier::findOrFail($id)->delete();
        return response()->json(['message' => 'Supplier berhasil dihapus']);
    }
}
