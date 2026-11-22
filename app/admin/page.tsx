"use client";

import React, { useState, useEffect, useCallback } from "react";
import RawDataTab from "./components/RawDataTab";
import CleanDataTab from "./components/CleanDataTab";
import AnalisisTab from "./components/AnalisisTab";
import type {
    RawRespondentRow,
    CleanRespondentRow,
    ExclusionLogItem,
    StatisticalSummary,
} from "@/lib/adminAnalytics";

type ActiveTab = "raw" | "clean" | "analisis";
type SessionFilter = "all" | "pilot" | "experiment";

export default function AdminDashboardPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState("");

    const [activeTab, setActiveTab] = useState<ActiveTab>("raw");
    const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
    const [activeAppMode, setActiveAppMode] = useState<"pilot" | "experiment">("pilot");
    const [updatingMode, setUpdatingMode] = useState(false);

    const [loading, setLoading] = useState(false);
    const [rawRows, setRawRows] = useState<RawRespondentRow[]>([]);
    const [cleanRows, setCleanRows] = useState<CleanRespondentRow[]>([]);
    const [exclusionLogs, setExclusionLogs] = useState<ExclusionLogItem[]>([]);
    const [stats, setStats] = useState<StatisticalSummary | null>(null);

    const getAdminPassword = useCallback(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("a03_admin_pass") || password;
        }
        return password;
    }, [password]);

    const fetchDashboardData = useCallback(
        async (adminPass: string, filter: SessionFilter) => {
            setLoading(true);
            setAuthError("");
            try {
                const [dataRes, settingsRes] = await Promise.all([
                    fetch(`/api/admin/data?session=${filter}`, {
                        headers: { "x-admin-password": adminPass },
                        cache: "no-store",
                    }),
                    fetch("/api/settings", {
                        cache: "no-store",
                    }),
                ]);

                if (dataRes.status === 401) {
                    setIsAuthenticated(false);
                    sessionStorage.removeItem("a03_admin_pass");
                    setAuthError("Password admin yang dimasukkan tidak sesuai.");
                    return;
                }

                const dataJson = await dataRes.json();
                if (!dataJson.success) {
                    throw new Error(dataJson.message || "Gagal memuat data.");
                }

                setRawRows(dataJson.rawRows || []);
                setCleanRows(dataJson.cleanRows || []);
                setExclusionLogs(dataJson.exclusionLogs || []);
                setStats(dataJson.stats || null);
                setIsAuthenticated(true);
                sessionStorage.setItem("a03_admin_pass", adminPass);

                if (settingsRes.ok) {
                    const settingsJson = await settingsRes.json();
                    const resolvedMode =
                        settingsJson.session_type ||
                        settingsJson.sessionType ||
                        settingsJson.mode ||
                        (typeof settingsJson.isExperiment === "boolean"
                            ? settingsJson.isExperiment
                                ? "experiment"
                                : "pilot"
                            : null);

                    if (resolvedMode === "pilot" || resolvedMode === "experiment") {
                        setActiveAppMode(resolvedMode);
                    }
                }
            } catch (err) {
                setAuthError(
                    err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        const savedPass = sessionStorage.getItem("a03_admin_pass");
        if (savedPass) {
            setPassword(savedPass);
            fetchDashboardData(savedPass, sessionFilter);
        }
    }, [fetchDashboardData, sessionFilter]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;
        fetchDashboardData(password.trim(), sessionFilter);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("a03_admin_pass");
        setIsAuthenticated(false);
        setPassword("");
    };

    const handleToggleAppMode = async (targetMode: "pilot" | "experiment") => {
        if (targetMode === activeAppMode) return;
        const confirmText =
            targetMode === "experiment"
                ? "Ubah mode aplikasi ke EXPERIMENT (pengambilan data utama)?"
                : "Kembalikan mode aplikasi ke PILOT (uji coba)?";
        if (!window.confirm(confirmText)) return;

        const currentPass = getAdminPassword();

        setUpdatingMode(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": currentPass,
                },
                body: JSON.stringify({ session_type: targetMode }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                alert(json.message || "Gagal mengubah mode.");
                return;
            }
            const nextMode =
                json.session_type === "pilot" || json.session_type === "experiment"
                    ? json.session_type
                    : targetMode;
            setActiveAppMode(nextMode);
        } finally {
            setUpdatingMode(false);
        }
    };

    const handleDeleteRespondent = async (respondentId: string) => {
        const currentPass = getAdminPassword();

        const res = await fetch(
            `/api/admin/data?respondentId=${encodeURIComponent(respondentId)}`,
            {
                method: "DELETE",
                headers: { "x-admin-password": currentPass },
            }
        );
        const json = await res.json();
        if (!res.ok || !json.success) {
            alert(json.message || "Gagal menghapus responden.");
            return;
        }
        await fetchDashboardData(currentPass, sessionFilter);
    };

    // HALAMAN LOGIN (Split-panel identik dengan ConsentPage)
    if (!isAuthenticated) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
                <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
                    {/* PANEL KIRI */}
                    <section className="flex flex-col justify-between bg-[#172B45] p-8 text-white sm:p-10">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-slate-300">
                                INFORMATION SECURITY
                            </p>

                            <h1 className="mt-12 text-3xl font-semibold leading-tight tracking-tight">
                                Panel Peneliti,
                                <br />
                                Kelola Data Riset.
                            </h1>

                            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
                                Pantau pengumpulan data responden, validasi kebersihan data, dan evaluasi hasil eksperimen microlearning.
                            </p>
                        </div>

                        <div className="mt-16 border-t border-slate-600 pt-5">
                            <p className="text-xs text-slate-300">
                                Penelitian Keamanan Informasi
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Kelompok A03 • Administrator
                            </p>
                        </div>
                    </section>

                    {/* PANEL KANAN */}
                    <section className="flex flex-col justify-center p-8 sm:p-10">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-slate-600">
                                AKSES TERBATAS
                            </p>

                            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                                Masuk Dasbor Admin
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-slate-600">
                                Masukkan kata sandi administrator untuk mengelola mode sesi penelitian, mengunduh dataset, dan melihat analisis statistik.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="mt-7 space-y-5">
                            {authError && (
                                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs leading-5 text-rose-700">
                                    {authError}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold tracking-wider text-slate-700">
                                    PASSWORD ADMIN
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password admin"
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#172B45] focus:outline-none focus:ring-1 focus:ring-[#172B45]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !password.trim()}
                                className="w-full cursor-pointer rounded-lg bg-[#172B45] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {loading ? "Memverifikasi..." : "Masuk ke Dasbor"}
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        );
    }

    // HALAMAN UTAMA DASBOR ADMIN (Full-Width)
    return (
        <main className="min-h-screen w-full bg-slate-100 pb-14 text-slate-900">
            {/* HEADER UTAMA */}
            <header className="w-full border-b border-slate-200 bg-white shadow-xs">
                <div className="w-full bg-[#172B45] text-white">
                    <div className="flex w-full flex-col justify-between gap-4 px-5 py-6 sm:px-8 lg:flex-row lg:items-center">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-slate-300">
                                INFORMATION SECURITY • KELOMPOK A03
                            </p>
                            <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                Dasbor Penelitian Microlearning
                            </h1>
                            <p className="mt-1 text-xs text-slate-300">
                                Zona Waktu: Asia/Jakarta (WIB) • Total Responden Terfilter: {rawRows.length}
                            </p>
                        </div>

                        {/* KONTROL MODE SESI & FILTER */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-lg border border-slate-600 bg-[#0F1F33] p-1">
                                <span className="px-2.5 text-xs font-medium text-slate-300">
                                    Mode Aktif:
                                </span>
                                <button
                                    onClick={() => handleToggleAppMode("pilot")}
                                    disabled={updatingMode}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeAppMode === "pilot"
                                        ? "bg-amber-500 text-slate-950"
                                        : "text-slate-300 hover:text-white"
                                        }`}
                                >
                                    Pilot
                                </button>
                                <button
                                    onClick={() => handleToggleAppMode("experiment")}
                                    disabled={updatingMode}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeAppMode === "experiment"
                                        ? "bg-emerald-500 text-slate-950"
                                        : "text-slate-300 hover:text-white"
                                        }`}
                                >
                                    Experiment
                                </button>
                            </div>

                            <select
                                value={sessionFilter}
                                onChange={(e) => setSessionFilter(e.target.value as SessionFilter)}
                                className="cursor-pointer rounded-lg border border-slate-600 bg-[#0F1F33] px-3.5 py-2 text-xs font-semibold text-white focus:border-slate-400 focus:outline-none"
                            >
                                <option value="all">Tampilkan: Semua Sesi</option>
                                <option value="pilot">Filter: Pilot Saja</option>
                                <option value="experiment">Filter: Experiment Saja</option>
                            </select>

                            <button
                                onClick={() => fetchDashboardData(getAdminPassword(), sessionFilter)}
                                disabled={loading}
                                className="cursor-pointer rounded-lg border border-slate-500 bg-[#243B59] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2E496D] disabled:opacity-50"
                            >
                                {loading ? "Memuat..." : "Refresh"}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="cursor-pointer rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>

                {/* NAVIGASI 3 TAB UTAMA */}
                <div className="flex w-full gap-1 overflow-x-auto px-5 sm:px-8">
                    <button
                        onClick={() => setActiveTab("raw")}
                        className={`cursor-pointer whitespace-nowrap border-b-2 px-5 py-3.5 text-sm font-semibold transition-colors ${activeTab === "raw"
                            ? "border-[#172B45] text-[#172B45]"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        1. Raw Data ({rawRows.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("clean")}
                        className={`cursor-pointer whitespace-nowrap border-b-2 px-5 py-3.5 text-sm font-semibold transition-colors ${activeTab === "clean"
                            ? "border-[#172B45] text-[#172B45]"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        2. Clean Data ({cleanRows.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("analisis")}
                        className={`cursor-pointer whitespace-nowrap border-b-2 px-5 py-3.5 text-sm font-semibold transition-colors ${activeTab === "analisis"
                            ? "border-[#172B45] text-[#172B45]"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        3. Analisis Statistik
                    </button>
                </div>
            </header>

            {/* KONTEN TAB AKTIF */}
            <div className="w-full px-5 pt-7 sm:px-8">
                {activeTab === "raw" && (
                    <RawDataTab
                        rows={rawRows}
                        onDeleteRespondent={handleDeleteRespondent}
                    />
                )}

                {activeTab === "clean" && (
                    <CleanDataTab
                        cleanRows={cleanRows}
                        exclusionLogs={exclusionLogs}
                    />
                )}

                {activeTab === "analisis" && stats && (
                    <AnalisisTab stats={stats} />
                )}
            </div>
        </main>
    );
}