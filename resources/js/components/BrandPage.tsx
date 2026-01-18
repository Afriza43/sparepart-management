// @ts-nocheck
import React, { useEffect, useState } from "react";
import api from "../api";

export default function BrandPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    // State Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "" });
    const [error, setError] = useState(null);

    // --- FETCH DATA ---
    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await api.get("/brands");
            setBrands(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // --- HANDLERS ---
    const handleOpenCreate = () => {
        setIsEditMode(false);
        setFormData({ id: null, name: "" });
        setError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (brand) => {
        setIsEditMode(true);
        setFormData({ id: brand.id, name: brand.name });
        setError(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus merk ini?")) {
            try {
                await api.delete(`/brands/${id}`);
                fetchBrands();
            } catch (err) {
                alert("Gagal menghapus data.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/brands/${formData.id}`, {
                    name: formData.name,
                });
            } else {
                await api.post("/brands", { name: formData.name });
            }
            setIsModalOpen(false);
            fetchBrands();
        } catch (err) {
            setError("Gagal menyimpan data.");
        }
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* HEADER HALAMAN */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            🏷️ Data Merk (Brand)
                        </h1>
                        <button
                            onClick={handleOpenCreate}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium shadow-sm"
                        >
                            + Tambah Merk
                        </button>
                    </div>

                    {/* TABEL DATA (Style persis SparepartList.tsx) */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider w-20">
                                        No
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                        Nama Merk
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
                                            colSpan="3"
                                            className="p-5 text-center text-gray-500"
                                        >
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : brands.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="p-5 text-center text-gray-500"
                                        >
                                            Belum ada data merk.
                                        </td>
                                    </tr>
                                ) : (
                                    brands.map((brand, index) => (
                                        <tr
                                            key={brand.id}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {index + 1}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-900 font-semibold">
                                                {brand.name}
                                            </td>
                                            <td className="px-5 py-4 text-center text-sm">
                                                <button
                                                    onClick={() =>
                                                        handleOpenEdit(brand)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(brand.id)
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

                {/* --- MODAL POPUP --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all duration-300">
                        {/* Modal Card (Style mirip SparepartForm.tsx) */}
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all scale-100">
                            {/* Header Modal */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {isEditMode
                                        ? "Edit Merk"
                                        : "Tambah Merk Baru"}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form Input */}
                            <form onSubmit={handleSubmit} className="p-6">
                                {error && (
                                    <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Merk
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
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        placeholder="Contoh: Honda, Yamaha"
                                        autoFocus
                                        required
                                    />
                                </div>

                                {/* Footer Tombol */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold transition shadow-sm"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
