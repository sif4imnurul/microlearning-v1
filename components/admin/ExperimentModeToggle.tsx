"use client";

import { useEffect, useState } from "react";

type Props = {
    adminPassword: string;
};

export default function ExperimentModeToggle({ adminPassword }: Props) {
    const [isExperiment, setIsExperiment] = useState(false);
    const [showFeedback, setShowFeedback] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/settings", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data?.success) {
                    setIsExperiment(Boolean(data.isExperiment));
                    setShowFeedback(Boolean(data.showFeedback));
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchSettings();
    }, []);

    async function saveConfig(
        nextIsExperiment: boolean,
        nextShowFeedback: boolean
    ) {
        setIsSaving(true);
        setStatusMessage("");

        try {
            const response = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": adminPassword,
                },
                body: JSON.stringify({
                    isExperiment: nextIsExperiment,
                    showFeedback: nextShowFeedback,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setStatusMessage(
                    result.message || "Gagal menyimpan pengaturan."
                );
                return;
            }

            setIsExperiment(nextIsExperiment);
            setShowFeedback(nextShowFeedback);
            setStatusMessage("Pengaturan tersimpan.");
        } catch {
            setStatusMessage("Koneksi bermasalah saat menyimpan.");
        } finally {
            setIsSaving(false);
        }
    }

    function handleToggleMode() {
        const nextIsExperiment = !isExperiment;
        // Otomatis ON saat Pilot, otomatis OFF saat pindah ke Eksperimen (tetap bisa diubah manual)
        const nextShowFeedback = !nextIsExperiment;
        saveConfig(nextIsExperiment, nextShowFeedback);
    }

    function handleToggleFeedback() {
        saveConfig(isExperiment, !showFeedback);
    }

    if (isLoading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
                Memuat pengaturan mode penelitian...
            </div>
        );
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-500">
                        PENGATURAN TAHAP PENELITIAN
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-[#172B45]">
                        Mode:{" "}
                        {isExperiment
                            ? "Eksperimen Utama (Minggu 5)"
                            : "Pilot Test (Minggu 4)"}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        {isExperiment
                            ? "Tombol 'Kirim respons lain' disembunyikan untuk mencegah pengisian ganda."
                            : "Mode uji coba terbatas aktif. Tombol 'Kirim respons lain' ditampilkan."}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleToggleMode}
                        disabled={isSaving}
                        className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#172B45] transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                        {isExperiment
                            ? "Ubah ke Mode Pilot"
                            : "Aktifkan Mode Eksperimen"}
                    </button>

                    <button
                        type="button"
                        onClick={handleToggleFeedback}
                        disabled={isSaving}
                        className={`cursor-pointer rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition-colors disabled:opacity-50 ${showFeedback
                                ? "bg-[#172B45] hover:bg-[#243B59]"
                                : "bg-slate-400 hover:bg-slate-500"
                            }`}
                    >
                        Kolom Saran: {showFeedback ? "ON" : "OFF"}
                    </button>
                </div>
            </div>

            {statusMessage && (
                <p className="mt-3 text-xs font-medium text-slate-600">
                    {statusMessage}
                </p>
            )}
        </section>
    );
}