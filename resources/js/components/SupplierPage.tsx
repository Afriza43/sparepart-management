// @ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../api";

export default function SupplierPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/suppliers");
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

    // Handlers
    const handleOpenCreate = () => {
        setIsEditMode(false);
        setFormData({ id: null, name: "", phone: "", address: "" });
        setError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setIsEditMode(true);
        setFormData({
            id: item.id,
            name: item.name,
            phone: item.phone || "",
            address: item.address || "",
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus supplier ini?")) {
            try {
                await api.delete(`/suppliers/${id}`);
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
                await api.put(`/suppliers/${formData.id}`, formData);
            } else {
                await api.post("/suppliers", formData);
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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        🏭 Data Supplier
                    </h1>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm flex items-center gap-2"
                    >
                        <span>+ Tambah Supplier</span>
                    </button>
                </div>

                {/* Tabel */}
                <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider font-semibold">
                                <th className="px-6 py-4 text-left w-16">No</th>
                                <th className="px-6 py-4 text-left">
                                    Nama Supplier
                                </th>
                                <th className="px-6 py-4 text-left">Telepon</th>
                                <th className="px-6 py-4 text-left">Alamat</th>
                                <th className="px-6 py-4 text-center w-40">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        Sedang memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        Belum ada data supplier.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-blue-50 transition duration-150 ease-in-out"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-blue-600 font-mono">
                                            {item.phone || "-"}
                                        </td>
                                        <td
                                            className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs"
                                            title={item.address}
                                        >
                                            {item.address || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm space-x-3">
                                            <button
                                                onClick={() =>
                                                    handleOpenEdit(item)
                                                }
                                                className="text-blue-600 hover:text-blue-800 font-medium transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-red-500 hover:text-red-700 font-medium transition"
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

            {/* --- MODAL TRANS Paran/GLASS --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all duration-300">
                    {/* Card Modal */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 border border-gray-100">
                        {/* Header Modal */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isEditMode
                                    ? "Edit Data Supplier"
                                    : "Tambah Supplier Baru"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold transition rounded-full p-1 hover:bg-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Supplier{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Contoh: PT. Jaya Abadi"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor Telepon / WA
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Contoh: 08123456789"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-24 resize-none"
                                    placeholder="Masukkan alamat supplier..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/30 transition"
                                >
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
