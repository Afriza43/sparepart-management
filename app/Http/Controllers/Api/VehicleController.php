<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Vehicle::latest()->get()]);
    }

    public function store(Request $request)
    {
        // Hapus 'name', fokus ke 3 kolom ini
        $request->validate([
            'nopol' => 'required|string|max:20',    // Wajib diisi sebagai ID utama
            'bus_code' => 'nullable|string|max:50',
            'model' => 'nullable|string|max:100',
        ]);

        $vehicle = Vehicle::create($request->all());
        return response()->json(['message' => 'Kendaraan berhasil disimpan', 'data' => $vehicle]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nopol' => 'required|string|max:20',
            'bus_code' => 'nullable|string|max:50',
            'model' => 'nullable|string|max:100',
        ]);

        $vehicle = Vehicle::findOrFail($id);
        $vehicle->update($request->all());
        return response()->json(['message' => 'Kendaraan berhasil diupdate', 'data' => $vehicle]);
    }

    public function destroy($id)
    {
        Vehicle::findOrFail($id)->delete();
        return response()->json(['message' => 'Kendaraan berhasil dihapus']);
    }
}
