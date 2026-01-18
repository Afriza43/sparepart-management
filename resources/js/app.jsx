// @ts-nocheck
import "./bootstrap";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Layout & Halaman
import DashboardLayout from "./Layouts/DashboardLayout";
import SparepartList from "./components/SparepartList";
import SparepartForm from "./components/SparepartForm";
import TransactionForm from "./components/TransactionForm";
import ReportPage from "./components/ReportPage";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import BrandPage from "./components/BrandPage";
import CategoryPage from "./components/CategoryPage";
import VehiclePage from "./components/VehiclePage";
import SupplierPage from "./components/SupplierPage";

function App() {
    const isAuthenticated = localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>
                {/* Jika sudah login, paksa ke Dashboard. Jika belum, tampilkan Form Login */}
                <Route
                    path="/login"
                    element={
                        !isAuthenticated ? (
                            <Login />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />

                {/* Cek Auth di sini. Jika lolos, render DashboardLayout. Jika gagal, lempar ke Login */}
                <Route
                    element={
                        isAuthenticated ? (
                            <DashboardLayout />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                >
                    {/* Halaman Dashboard (Root) */}
                    <Route path="/" element={<Dashboard />} />

                    {/* Halaman Lainnya (Otomatis terlindungi & punya Sidebar) */}
                    <Route path="/spareparts" element={<SparepartList />} />
                    <Route path="/create" element={<SparepartForm />} />
                    <Route path="/edit/:id" element={<SparepartForm />} />

                    <Route path="/transactions" element={<TransactionList />} />
                    <Route
                        path="/transactions/create"
                        element={<TransactionForm />}
                    />
                    <Route path="/brands" element={<BrandPage />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/vehicles" element={<VehiclePage />} />
                    <Route path="/suppliers" element={<SupplierPage />} />

                    <Route path="/reports" element={<ReportPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById("app");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}
