<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Sparepart;

use Illuminate\Http\Request;

class TransactionController
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:in,out', // Masuk atau Keluar
            'date' => 'required|date',
            'items' => 'required|array|min:1', // Harus ada barangnya
            'items.*.sparepart_id' => 'required|exists:spareparts,id',
            'items.*.quantity' => 'required|integer|min:1',
            // Jika OUT wajib pilih BUS, Jika IN wajib pilih SUPPLIER
            'vehicle_id' => 'required_if:type,out|nullable|exists:vehicles,id',
            'supplier_id' => 'required_if:type,in|nullable|exists:suppliers,id',
        ]);

        DB::beginTransaction();

        try {
            $transaction = Transaction::create([
                'user_id' => 1, // Sementara hardcode ID 1 (Admin), nanti pakai Auth::id()
                'type' => $request->type,
                'date' => $request->date,
                'supplier_id' => $request->supplier_id,
                'vehicle_id' => $request->vehicle_id,
                'reference_number' => 'TRX-' . time(), // Generate No Nota Otomatis
                'notes' => $request->notes,
            ]);

            // 3. Loop setiap barang yang diinput
            foreach ($request->items as $item) {
                // Simpan detail
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'sparepart_id' => $item['sparepart_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'] ?? 0, // Harga beli (opsional kalau keluar)
                ]);

                // 4. UPDATE STOK REALTIME
                $sparepart = Sparepart::lockForUpdate()->find($item['sparepart_id']);

                if ($request->type === 'in') {
                    // Kalau masuk, stok nambah
                    $sparepart->increment('stock', $item['quantity']);
                } else {
                    // Kalau keluar, stok berkurang
                    if ($sparepart->stock < $item['quantity']) {
                        throw new \Exception("Stok {$sparepart->name} tidak cukup! Sisa: {$sparepart->stock}");
                    }
                    $sparepart->decrement('stock', $item['quantity']);
                }
            }

            DB::commit(); // Simpan permanen

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil disimpan',
                'data' => $transaction
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function index()
    {
        $transactions = Transaction::with(['supplier', 'vehicle', 'details.sparepart'])
            ->latest()
            ->paginate(10);

        return response()->json($transactions);
    }
}
