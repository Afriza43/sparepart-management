// @ts-nocheck
import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, Link, useParams } from "react-router-dom";

export default function SparepartForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);

    // State untuk Data Master (Pilihan Dropdown)
    const [options, setOptions] = useState({
        categories: [],
        brands: [],
        units: [],
    });

    const [formData, setFormData] = useState({
        name: "",
        no_part: "",
        category_id: "",
        brand_id: "",
        unit_id: "",
        stock_min: "",
        description: "",
        stock: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/master-data");
                // Simpan data categories, brands, units ke state
                setOptions(response.data.data);

                if (isEditMode) {
                    const itemResponse = await api.get(`/spareparts/${id}`);
                    const item = itemResponse.data.data;

                    // Isi form dengan data lama
                    setFormData({
                        name: item.name,
                        no_part: item.no_part,
                        category_id: item.category_id,
                        brand_id: item.brand_id || "",
                        unit_id: item.unit_id,
                        stock_min: item.stock_min,
                        description: item.description || "",
                    });
                }
            } catch (error) {
                console.error(error);
                const msg =
                    error.response?.data?.message || "Terjadi kesalahan.";
                alert(`Gagal: ${msg}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await api.put(`/spareparts/${id}`, formData);
                alert("Data berhasil diperbarui!");
            } else {
                await api.post("/spareparts", formData);
                alert("Data berhasil disimpan!");
            }
            navigate("/");
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data?.message || "Gagal menyimpan data.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        {isEditMode
                            ? "Edit Sparepart"
                            : "Tambah Sparepart Baru"}
                    </h2>
                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* INPUT FORM SAMA SEPERTI SEBELUMNYA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nama Barang
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nomor Part
                            </label>
                            <input
                                type="text"
                                name="no_part"
                                value={formData.no_part}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Kategori
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
                                required
                            >
                                <option value="" disabled>
                                    -- Pilih --
                                </option>
                                {options.categories?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Merk
                            </label>
                            <select
                                name="brand_id"
                                value={formData.brand_id}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
                            >
                                <option value="">-- Tanpa Merk --</option>
                                {options.brands?.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Unit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Satuan
                            </label>
                            <select
                                name="unit_id"
                                value={formData.unit_id}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
                                required
                            >
                                <option value="" disabled>
                                    -- Pilih --
                                </option>
                                {options.units?.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Stok Tersedia
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="mt-1 w-24 border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Stok Min
                        </label>
                        <input
                            type="number"
                            name="stock_min"
                            value={formData.stock_min}
                            onChange={handleChange}
                            className="mt-1 w-24 border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Harga Satuan (Rp)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Harga referensi per satuan
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Keterangan
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded p-2"
                            rows="3"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold"
                    >
                        {loading
                            ? "Menyimpan..."
                            : isEditMode
                            ? "UPDATE DATA"
                            : "SIMPAN DATA"}
                    </button>
                </form>
            </div>
        </div>
    );
}
