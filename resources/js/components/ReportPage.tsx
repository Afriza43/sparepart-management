// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { useReactToPrint } from "react-to-print";
import { Printer, Filter } from "lucide-react";

export default function ReportPage() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("all");

    const [transactions, setTransactions] = useState([]);
    const componentRef = useRef();

    const fetchReports = async () => {
        try {
            const response = await api.get(
                `/reports?month=${month}&year=${year}&type=${type}`
            );
            setTransactions(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil laporan:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [month, year, type]);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* --- HEADER & FILTER (Disembunyikan saat Print) --- */}
            <div className="max-w-6xl mx-auto mb-6 print:hidden">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow mb-4">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        📊 Rekapitulasi Transaksi
                    </h1>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                        <Printer size={18} /> Cetak Laporan (PDF)
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Bulan
                        </label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border rounded p-2 w-32"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString("id-ID", {
                                        month: "long",
                                    })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tahun
                        </label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="border rounded p-2 w-24"
                        >
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Jenis
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border rounded p-2 w-32"
                        >
                            <option value="all">Semua</option>
                            <option value="in">Barang Masuk</option>
                            <option value="out">Barang Keluar</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- AREA LAPORAN (Yang akan dicetak) --- */}
            <div
                id="printable-area"
                className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow print:shadow-none print:w-full"
            >
                {/* Header Kop Surat (Hanya muncul saat Print/Preview) */}
                <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
                    <h2 className="text-2xl font-bold uppercase">
                        Laporan Logistik Sparepart
                    </h2>
                    <p className="text-sm">
                        Periode:{" "}
                        {new Date(0, month - 1).toLocaleString("id-ID", {
                            month: "long",
                        })}{" "}
                        {year}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 w-24">
                                    Tanggal
                                </th>
                                <th className="border border-gray-300 px-4 py-2 w-32">
                                    No. Ref
                                </th>
                                <th className="border border-gray-300 px-4 py-2 w-24 text-center">
                                    Tipe
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Sumber / Tujuan
                                </th>
                                <th className="border border-gray-300 px-4 py-2">
                                    Detail Barang
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-4"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-4 text-red-500"
                                    >
                                        Tidak ada transaksi pada periode ini.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx) => (
                                    <tr
                                        key={trx.id}
                                        className="hover:bg-gray-50 break-inside-avoid"
                                    >
                                        <td className="border border-gray-300 px-4 py-2 align-top">
                                            {formatDate(trx.date)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 align-top font-mono text-xs">
                                            {trx.reference_number}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 align-top text-center">
                                            {trx.type === "in" ? (
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                                                    MASUK
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                                                    KELUAR
                                                </span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 align-top">
                                            {trx.type === "in" ? (
                                                <div className="font-semibold">
                                                    {trx.supplier?.name || "-"}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="font-semibold">
                                                        {trx.vehicle?.bus_code}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {trx.vehicle?.nopol}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 align-top">
                                            <ul className="list-disc list-inside">
                                                {trx.details?.map(
                                                    (detail, idx) => (
                                                        <li key={idx}>
                                                            <span className="font-medium">
                                                                {
                                                                    detail
                                                                        .sparepart
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span className="text-gray-600">
                                                                {" "}
                                                                (
                                                                {
                                                                    detail.quantity
                                                                }{" "}
                                                                {
                                                                    detail
                                                                        .sparepart
                                                                        ?.unit
                                                                        ?.code
                                                                }
                                                                )
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Tanda Tangan (Hanya muncul saat Print) */}
                <div className="hidden print:flex justify-end mt-16 px-10">
                    <div className="text-center">
                        <p className="mb-16">
                            Mengetahui, <br /> Kepala Logistik
                        </p>
                        <p className="font-bold underline">
                            ____________________
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
