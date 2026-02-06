// @ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../api";

export default function VehiclePage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // UPDATE 1: Sesuaikan state dengan kolom database Anda
    const [formData, setFormData] = useState({
        id: null,
        nopol: "",
        bus_code: "",
        model: "",
    });

    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/vehicles");
            setData(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenCreate = () => {
        setIsEditMode(false);
        // UPDATE 2: Reset semua field baru
        setFormData({ id: null, nopol: "", bus_code: "", model: "" });
        setError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setIsEditMode(true);
        // UPDATE 3: Isi data saat edit
        setFormData({
            id: item.id,
            nopol: item.nopol || "",
            bus_code: item.bus_code || "",
            model: item.model || "",
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus Kendaraan ini?")) {
            try {
                await api.delete(`/vehicles/${id}`);
                fetchData();
            } catch (err) {
                alert("Gagal menghapus data.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/vehicles/${formData.id}`, formData);
            } else {
                await api.post("/vehicles", formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError("Gagal menyimpan data.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        📂 Data Kendaraan
                    </h1>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium shadow-sm"
                    >
                        + Tambah Kendaraan
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider w-20">
                                    No.
                                </th>
                                {/* UPDATE 4: Header Tabel Disesuaikan */}
                                <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    No. Polisi
                                </th>
                                <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    Kode Bus
                                </th>
                                <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                    Model
                                </th>
                                <th className="px-5 py-3 text-center text-xs text-gray-600 uppercase tracking-wider w-40">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-5 text-center text-gray-500"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-5 text-center text-gray-500"
                                    >
                                        Belum ada data.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>
                                        {/* UPDATE 5: Isi Tabel Disesuaikan */}
                                        <td className="px-5 py-4 text-sm text-gray-900 font-bold">
                                            {item.nopol}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-blue-600 font-mono">
                                            {item.bus_code || "-"}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {item.model || "-"}
                                        </td>
                                        <td className="px-5 py-4 text-center text-sm">
                                            <button
                                                onClick={() =>
                                                    handleOpenEdit(item)
                                                }
                                                className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* UPDATE 6: MODAL FORM DISESUAIKAN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isEditMode
                                    ? "Edit Kendaraan"
                                    : "Tambah Kendaraan Baru"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            {error && (
                                <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
                                    {error}
                                </div>
                            )}

                            {/* INPUT NOPOL (UTAMA) */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor Polisi{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.nopol}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nopol: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                                    placeholder="Contoh: B 1234 XX"
                                    autoFocus
                                    required
                                />
                            </div>

                            {/* INPUT BUS CODE */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kode Lambung / Bus Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.bus_code}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bus_code: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Contoh: BUS-01"
                                />
                            </div>

                            {/* INPUT MODEL */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Model / Merk
                                </label>
                                <input
                                    type="text"
                                    value={formData.model}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            model: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Contoh: Mercedes Benz OH 1626"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow-sm"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
