// @ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../api";
import {} from "react/jsx-runtime";
import { Link } from "react-router-dom";

export default function SparepartList() {
    const [spareparts, setSparepart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSpareparts();
    }, []);

    const fetchSpareparts = async () => {
        try {
            const response = await api.get("/spareparts");
            setSparepart(response.data.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Gagal ambil data:", err);
            setError("Gagal mengambil data dari server.");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus data ini?")) {
            try {
                await api.delete(`/spareparts/${id}`);
                fetchSpareparts();
                alert("Data berhasil dihapus.");
            } catch (err) {
                console.error("Gagal menghapus data:", err);
                alert("Gagal menghapus data.");
            }
        }
    };

    if (loading)
        return <div className="p-5 text-center">Sedang memuat data...</div>;
    if (error)
        return <div className="p-5 text-center text-red-500">{error}</div>;

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0, // Menghilangkan desimal ,00 di belakang
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        📦 Manajemen Sparepart
                    </h1>
                    <Link
                        to="/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        + Tambah Barang
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    No. Part
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Nama Barang
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Merk
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Harga
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Stok
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {spareparts.length > 0 ? (
                                spareparts.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4 text-sm font-mono text-blue-600">
                                            {item.no_part}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-900">
                                            <div className="font-bold">
                                                {item.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.unit?.name}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                                                {item.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {item.brand?.name || "-"}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-center">
                                            <span className="bg-green-100 text-green-800 py-1 px-3 text-xs">
                                                {formatRupiah(item.price)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={`font-bold ${
                                                    item.stock <= item.stock_min
                                                        ? "text-red-600"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center text-sm">
                                            <Link
                                                to={`/edit/${item.id}`}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id,
                                                        item.name,
                                                    )
                                                }
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-5 text-gray-500"
                                    >
                                        Belum ada data sparepart.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
