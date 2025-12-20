<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\Sparepart;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // 1. Ringkasan Utama
        $totalItems = Sparepart::count(); // Jumlah jenis barang

        // Menghitung barang yang stoknya di bawah atau sama dengan stock_min
        $lowStockItems = Sparepart::whereColumn('stock', '<=', 'stock_min')->get();
        $lowStockCount = $lowStockItems->count();

        // Menghitung Total Aset (Stok * Harga)
        // Kita gunakan query raw agar cepat dan tidak membebani RAM PHP
        $totalAssetValue = Sparepart::select(DB::raw('SUM(stock * price) as total'))->value('total');

        // Menghitung Pengeluaran Bulan Ini (Barang Masuk/Beli)
        $monthlyExpense = Transaction::where('type', 'in')
            ->whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->with('details')
            ->get()
            ->sum(function ($trx) {
                return $trx->details->sum(fn($d) => $d->quantity * $d->price);
            });

        // 2. Transaksi Terakhir (5 data)
        $recentTransactions = Transaction::with(['user', 'supplier', 'vehicle'])
            ->latest()
            ->take(5)
            ->get();

        // 3. Grafik Sederhana (Transaksi 7 hari terakhir)
        // Kita siapkan datanya untuk chart di frontend
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $chartData[] = [
                'date' => Carbon::now()->subDays($i)->format('d M'),
                'in' => Transaction::where('type', 'in')->whereDate('date', $date)->count(),
                'out' => Transaction::where('type', 'out')->whereDate('date', $date)->count(),
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'counts' => [
                    'total_items' => $totalItems,
                    'low_stock' => $lowStockCount,
                    'total_asset' => (float) $totalAssetValue,
                    'monthly_expense' => (float) $monthlyExpense
                ],
                'low_stock_items' => $lowStockItems->take(5), // Kirim 5 barang yg kritis
                'recent_transactions' => $recentTransactions,
                'chart_data' => $chartData
            ]
        ]);
    }
}
