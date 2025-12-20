// @ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Plus, ArrowUpRight, ArrowDownLeft, FileText } from "lucide-react";

export default function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            // Kita pakai endpoint reports dulu karena isinya sama (List Transaksi)
            // Nanti bisa dibuat endpoint khusus jika perlu pagination
            const res = await api.get("/reports?type=all");
            setTransactions(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal load transaksi", error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Riwayat Transaksi
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Monitor keluar masuk barang secara realtime
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/reports"
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition shadow-sm"
                        >
                            <FileText size={18} /> Laporan Bulanan
                        </Link>
                        <Link
                            to="/transactions/create"
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-sm"
                        >
                            <Plus size={18} /> Transaksi Baru
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Asal / Tujuan</th>
                                <th className="px-6 py-4">Detail Barang</th>
                                <th className="px-6 py-4">Ref</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        Memuat data transaksi...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        Belum ada transaksi.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx) => (
                                    <tr
                                        key={trx.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {formatDate(trx.date)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {trx.type === "in" ? (
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
                                                    <ArrowDownLeft size={14} />{" "}
                                                    MASUK
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold border border-orange-200">
                                                    <ArrowUpRight size={14} />{" "}
                                                    KELUAR
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {trx.type === "in" ? (
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-800">
                                                        {trx.supplier?.name ||
                                                            "Stok Awal"}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        Supplier
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-800">
                                                        {trx.vehicle
                                                            ?.bus_code || "-"}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {trx.vehicle?.nopol}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                {trx.details?.map((d, i) => (
                                                    <div
                                                        key={i}
                                                        className="text-gray-700 mb-1 border-b border-dashed border-gray-200 last:border-0 pb-1 last:pb-0"
                                                    >
                                                        <span className="font-medium">
                                                            {d.quantity}{" "}
                                                            {
                                                                d.sparepart
                                                                    ?.unit?.code
                                                            }
                                                        </span>
                                                        <span className="ml-1 text-gray-600">
                                                            {d.sparepart?.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-400">
                                            {trx.reference_number}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
