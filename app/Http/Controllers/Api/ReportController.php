<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->input('month', date('m'));
        $year = $request->input('year', date('Y'));
        $type = $request->input('type', 'all');

        $query = Transaction::with('user', 'vehicle', 'supplier', 'details.sparepart')
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->latest('date');

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $data = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $data,
            'filter' => [
                'month' => $month,
                'year' => $year,
                'type' => $type,
            ],
        ]);
    }
}
