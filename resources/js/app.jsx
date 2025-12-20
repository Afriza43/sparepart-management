// @ts-nocheck
import "./bootstrap";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Layout & Halaman
import DashboardLayout from "./Layouts/DashboardLayout";
import SparepartList from "./components/SparepartList";
import SparepartForm from "./components/SparepartForm";
import TransactionForm from "./components/TransactionForm";
import ReportPage from "./components/ReportPage";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Semua route di dalam sini akan memiliki Sidebar & Header */}
                <Route element={<DashboardLayout />}>
                    {/* Halaman Dashboard/Home */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/spareparts" element={<SparepartList />} />

                    <Route path="/create" element={<SparepartForm />} />
                    <Route path="/edit/:id" element={<SparepartForm />} />
                    <Route
                        path="/transactions/create"
                        element={<TransactionForm />}
                    />
                    <Route path="/transactions" element={<TransactionList />} />
                    <Route path="/reports" element={<ReportPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById("app");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}
