// @ts-nocheck

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { Plus, Trash2, Save } from "lucide-react";

export default function TransactionForm() {
    const navigate = useNavigate();
    const [items, setItems] = useState([
        { sparepart_id: "", quantity: 1, stock_now: 0 },
    ]);

    const [loading, setLoading] = useState(false);
    const [master, setMaster] = useState({
        spareparts: [],
        vehicles: [],
        suppliers: [],
    });

    const [header, setHeader] = useState({
        type: "out",
        vehicle_id: "",
        supplier_id: "",
        transaction_date: new Date().toISOString().slice(0, 10),
        notes: "",
    });

    useEffect(() => {
        const loadMasterData = async () => {
            try {
                const response = await api.get("/master-data");
                setMaster(response.data.data);
            } catch (error) {
                console.error("Failed to load master data:", error);
            }
        };
        loadMasterData();
    }, []);

    const handleHeaderChange = (e) => {
        setHeader({ ...header, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        if (field === "sparepart_id") {
            const selectedPart = master.spareparts.find(
                (p) => p.id === parseInt(value)
            );
            newItems[index]["stock_now"] = selectedPart
                ? selectedPart.stock
                : 0;
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { sparepart_id: "", quantity: 1, stock_now: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.some((item) => !item.sparepart_id || item.quantity <= 0)) {
            alert("Mohon lengkapi data barang dan jumlah harus > 0");
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...header,
                items: items,
            };

            await api.post("/transactions", payload);

            alert("Transaksi berhasil disimpan");
            navigate("/transactions");
        } catch (error) {
            console.error("Failed to submit transaction:", error);
            alert("Gagal menyimpan transaksi. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    📝 Form Transaksi Baru
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* --- BAGIAN 1: HEADER TRANSAKSI --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-md border">
                        {/* Jenis Transaksi */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Jenis Transaksi
                            </label>
                            <select
                                name="type"
                                value={header.type}
                                onChange={handleHeaderChange}
                                className={inputClass}
                            >
                                <option value="out">
                                    Barang Keluar (Pemakaian)
                                </option>
                                <option value="in">
                                    Barang Masuk (Pembelian)
                                </option>
                            </select>
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tanggal
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={header.date}
                                onChange={handleHeaderChange}
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Kondisional: Supplier atau Bus */}
                        <div>
                            {header.type === "in" ? (
                                <>
                                    <label className="block text-sm font-medium mb-1">
                                        Supplier / Toko
                                    </label>
                                    <select
                                        name="supplier_id"
                                        value={header.supplier_id}
                                        onChange={handleHeaderChange}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Supplier --
                                        </option>
                                        {master.suppliers?.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <>
                                    <label className="block text-sm font-medium mb-1">
                                        Armada Bus
                                    </label>
                                    <select
                                        name="vehicle_id"
                                        value={header.vehicle_id}
                                        onChange={handleHeaderChange}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Bus --
                                        </option>
                                        {master.vehicles?.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.bus_code} - {v.nopol}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- BAGIAN 2: DAFTAR BARANG (ITEMS) --- */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">
                            Daftar Barang
                        </h3>
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 w-1/2">
                                            Nama Barang / Part Number
                                        </th>
                                        <th className="px-4 py-3 w-32">
                                            Stok Saat Ini
                                        </th>
                                        <th className="px-4 py-3 w-32">
                                            Jumlah
                                        </th>
                                        <th className="px-4 py-3 w-16">
                                            Hapus
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white hover:bg-gray-50"
                                        >
                                            <td className="p-2">
                                                <select
                                                    value={item.sparepart_id}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "sparepart_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                    required
                                                >
                                                    <option value="">
                                                        -- Pilih Barang --
                                                    </option>
                                                    {master.spareparts?.map(
                                                        (part) => (
                                                            <option
                                                                key={part.id}
                                                                value={part.id}
                                                            >
                                                                {part.no_part} -{" "}
                                                                {part.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </td>
                                            <td className="p-2 text-center text-gray-500 font-mono">
                                                {item.stock_now}
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                    disabled={
                                                        items.length === 1
                                                    }
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className="mt-3 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800"
                        >
                            <Plus size={16} /> Tambah Baris Barang
                        </button>
                    </div>

                    {/* --- BAGIAN 3: CATATAN & SUBMIT --- */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">
                            Catatan Tambahan
                        </label>
                        <textarea
                            name="notes"
                            value={header.notes}
                            onChange={handleHeaderChange}
                            className={`${inputClass} h-20`}
                            placeholder="Contoh: Penggantian rutin, Barang rusak, dll."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? "Menyimpan..." : "Simpan Transaksi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
