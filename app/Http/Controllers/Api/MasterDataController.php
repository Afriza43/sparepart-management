<?php

// @ts-nocheck

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Unit;
use App\Models\Supplier;
use App\Models\Vehicle;
use App\Models\Sparepart;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MasterDataController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                // Data Referensi
                'categories' => Category::select('id', 'name')->orderBy('name')->get(),
                'brands'     => Brand::select('id', 'name')->orderBy('name')->get(),
                'units'      => Unit::select('id', 'name', 'code')->orderBy('name')->get(),

                // Data Stakeholder
                'suppliers'  => Supplier::select('id', 'name')->orderBy('name')->get(),
                'vehicles'   => Vehicle::select('id', 'nopol', 'bus_code')->orderBy('nopol')->get(),

                // Data Barang (Untuk Dropdown Pilih Barang)
                // Catatan: Jika barang ribuan, sebaiknya pakai Search API terpisah. Tapi untuk sekarang kita load semua.
                'spareparts' => Sparepart::select('id', 'name', 'no_part', 'stock')->orderBy('name')->get(),
            ]
        ]);
    }
}
