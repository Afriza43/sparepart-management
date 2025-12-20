// @ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import {
    Package,
    AlertTriangle,
    DollarSign,
    Activity,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
} from "lucide-react";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard");
                setData(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Gagal load dashboard", error);
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    // Helper Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    if (loading)
        return (
            <div className="p-8 text-center text-gray-500">
                Sedang memuat dashboard...
            </div>
        );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard Logistik
            </h1>

            {/* --- SECTION 1: STATISTIC CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Total Aset */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Total Nilai Aset
                        </p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                            {formatRupiah(data.counts.total_asset)}
                        </h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Card 2: Stok Menipis (CRITICAL) */}
                <div
                    className={`p-6 rounded-xl shadow-sm border flex items-center justify-between ${
                        data.counts.low_stock > 0
                            ? "bg-red-50 border-red-100"
                            : "bg-white border-gray-100"
                    }`}
                >
                    <div>
                        <p
                            className={`text-sm font-medium ${
                                data.counts.low_stock > 0
                                    ? "text-red-600"
                                    : "text-gray-500"
                            }`}
                        >
                            Stok Menipis / Habis
                        </p>
                        <h3
                            className={`text-2xl font-bold mt-1 ${
                                data.counts.low_stock > 0
                                    ? "text-red-700"
                                    : "text-gray-800"
                            }`}
                        >
                            {data.counts.low_stock}{" "}
                            <span className="text-sm font-normal">Barang</span>
                        </h3>
                    </div>
                    <div
                        className={`p-3 rounded-full ${
                            data.counts.low_stock > 0
                                ? "bg-red-200 text-red-700"
                                : "bg-gray-50 text-gray-600"
                        }`}
                    >
                        <AlertTriangle size={24} />
                    </div>
                </div>

                {/* Card 3: Pengeluaran Bulan Ini */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Belanja Bulan Ini
                        </p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                            {formatRupiah(data.counts.monthly_expense)}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full text-green-600">
                        <TrendingUp size={24} />
                    </div>
                </div>

                {/* Card 4: Total Item */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Total Jenis Sparepart
                        </p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                            {data.counts.total_items}
                        </h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                        <Package size={24} />
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: TABLES GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TABLE 1: PERINGATAN STOK (Actionable Insight) */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
                        <h3 className="font-semibold text-red-800 flex items-center gap-2">
                            <AlertTriangle size={18} /> Perlu Restock Segera
                        </h3>
                        <Link
                            to="/spareparts"
                            className="text-xs text-red-600 hover:underline font-medium"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="p-0 overflow-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Info Barang (Kode Pabrik)
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Status Stok
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Est. Biaya
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.low_stock_items?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-8"
                                        >
                                            <div className="flex flex-col items-center justify-center text-green-600">
                                                <div className="bg-green-100 p-3 rounded-full mb-2">
                                                    <Package size={24} />
                                                </div>
                                                <span className="font-medium">
                                                    Aman! Stok gudang sehat.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data?.low_stock_items?.map((item) => {
                                        // LOGIC HITUNGAN
                                        const deficit =
                                            item.stock_min - item.stock; // Berapa yang harus dibeli minimal
                                        const estCost = deficit * item.price; // Estimasi biaya
                                        const isCritical = item.stock === 0; // Stok Habis Total

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-red-50/30 transition-colors group"
                                            >
                                                {/* KOLOM 1: IDENTITAS LENGKAP (Sesuai Excel) */}
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800 text-sm">
                                                            {item.name}
                                                        </span>
                                                        {/* Menampilkan No Part (Kode Produk) agar sesuai Excel */}
                                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1 border border-gray-200">
                                                            {item.no_part}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* KOLOM 2: INDIKATOR VISUAL */}
                                                <td className="px-4 py-3 text-center align-middle">
                                                    <div className="flex flex-col items-center gap-1">
                                                        {/* Badge Status */}
                                                        <span
                                                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                                                isCritical
                                                                    ? "bg-red-100 text-red-700 border-red-200"
                                                                    : "bg-orange-100 text-orange-700 border-orange-200"
                                                            }`}
                                                        >
                                                            {isCritical
                                                                ? "HABIS"
                                                                : "KRITIS"}
                                                        </span>

                                                        {/* Angka Stok: Saat ini / Min */}
                                                        <div className="text-xs text-gray-600 font-medium">
                                                            <span className="text-red-600 font-bold text-sm">
                                                                {item.stock}
                                                            </span>
                                                            <span className="text-gray-400 mx-1">
                                                                /
                                                            </span>
                                                            {item.stock_min}{" "}
                                                            unit
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* KOLOM 3: ESTIMASI BIAYA (Agar Manajer tahu budget) */}
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-400">
                                                            Kurang {deficit} pcs
                                                        </span>
                                                        <span className="font-semibold text-gray-700">
                                                            {formatRupiah(
                                                                estCost
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* KOLOM 4: TOMBOL AKSI */}
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        to="/transactions/create"
                                                        // Nanti kita bisa bikin fitur auto-fill via state location
                                                        className="inline-flex items-center gap-1 text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-600 hover:text-white transition shadow-sm font-medium"
                                                    >
                                                        + Order
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* TABLE 2: TRANSAKSI TERAKHIR (Monitoring) */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Activity size={18} /> Aktivitas Terbaru
                        </h3>
                        <Link
                            to="/transactions"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="p-0">
                        {data.recent_transactions.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                                Belum ada aktivitas.
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <tbody className="divide-y divide-gray-100">
                                    {data.recent_transactions.map((trx) => (
                                        <tr
                                            key={trx.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`p-2 rounded-full ${
                                                            trx.type === "in"
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-orange-100 text-orange-600"
                                                        }`}
                                                    >
                                                        {trx.type === "in" ? (
                                                            <ArrowDownLeft
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <ArrowUpRight
                                                                size={16}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-800">
                                                            {trx.type === "in"
                                                                ? "Barang Masuk"
                                                                : "Barang Keluar"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(
                                                                trx.date
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )}{" "}
                                                            •{" "}
                                                            {
                                                                trx.reference_number
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="font-medium text-gray-800">
                                                    {trx.type === "in"
                                                        ? trx.supplier?.name
                                                        : trx.vehicle?.bus_code}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {trx.type === "in"
                                                        ? "Supplier"
                                                        : "Armada"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
