// @ts-nocheck

import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Box,
    Truck,
    Settings,
    LogOut,
    User,
    FileText,
} from "lucide-react";
import {} from "react/jsx-runtime";

export default function DashboardLayout() {
    const location = useLocation();

    // Menu Navigasi Samping
    const menus = [
        { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
        { name: "Sparepart", path: "/spareparts", icon: <Package size={20} /> },
        {
            name: "Kelola Barang",
            path: "/transactions",
            icon: <Box size={20} />,
        },
        { name: "Laporan", path: "/reports", icon: <FileText size={20} /> },
        {
            name: "Kelola Supplier",
            path: "/suppliers",
            icon: <Box size={20} />,
        },
        { name: "List Merk", path: "/brands", icon: <FileText size={20} /> },
        {
            name: "List Kendaraan",
            path: "/vehicles",
            icon: <FileText size={20} />,
        },
        {
            name: "List Kategori",
            path: "/categories",
            icon: <FileText size={20} />,
        },
    ];

    const isActive = (path) => {
        if (path === "/" && location.pathname !== "/") return false;
        return location.pathname.startsWith(path);
    };

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault(); // Mencegah reload link biasa

        try {
            // 1. Request ke Backend untuk hapus token di database
            // Kita pakai 'api' supaya token otomatis terkirim di header
            await api.post("/logout");
        } catch (error) {
            // Jika error (misal token sudah expired duluan),
            // biarkan saja, tetap lanjut logout di frontend
            console.error(
                "Logout gagal di server, tapi tetap logout di browser.",
            );
        } finally {
            // 2. WAJIB: Hapus token dari penyimpanan browser
            localStorage.removeItem("token");

            // 3. Redirect paksa ke halaman login
            // Kita pakai window.location agar halaman fresh reload
            window.location.href = "/login";
        }
    };

    // Cek apakah user sudah login
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-blue-600">
                        LogistikApp
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menus.map((menu) => (
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                                isActive(menu.path)
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {menu.icon}
                            {menu.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold text-gray-800">
                        Sistem Manajemen Sparepart
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                                <User size={16} />
                            </div>
                            <span>Admin Logistik</span>
                        </div>
                    </div>
                </header>

                {/* Content Area (Berubah-ubah sesuai halaman) */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
