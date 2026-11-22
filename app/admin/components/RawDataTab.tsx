"use client";

import React, { useState } from "react";
import { downloadCSV, type RawRespondentRow } from "@/lib/adminAnalytics";

interface RawDataTabProps {
    rows: RawRespondentRow[];
    onDeleteRespondent: (respondentId: string) => Promise<void>;
}

function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    );
}

function formatConfidencePair(row: RawRespondentRow): string {
    const pre = row.confidence_pre_avg !== null && row.confidence_pre_avg !== undefined
        ? row.confidence_pre_avg
        : "-";
    const post = row.confidence_post_avg !== null && row.confidence_post_avg !== undefined
        ? row.confidence_post_avg
        : "-";
    return `${pre} → ${post}`;
}

export default function RawDataTab({ rows, onDeleteRespondent }: RawDataTabProps) {
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredRows = rows.filter((r) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        return (
            r.respondent_id.toLowerCase().includes(q) ||
            r.D2_bidang_studi.toLowerCase().includes(q) ||
            r.session_type.toLowerCase().includes(q) ||
            r.feedback.toLowerCase().includes(q)
        );
    });

    const allExpanded =
        filteredRows.length > 0 &&
        filteredRows.every((r) => Boolean(expandedIds[r.respondent_id]));

    const toggleAllExpand = () => {
        if (allExpanded) {
            setExpandedIds({});
        } else {
            const next: Record<string, boolean> = {};
            filteredRows.forEach((r) => {
                next[r.respondent_id] = true;
            });
            setExpandedIds(next);
        }
    };

    const handleExportCSV = () => {
        const headers = [
            "respondent_id",
            "group_id",
            "treatment",
            "session_type",
            "created_at_wib",
            "status_selesai",
            "D1_usia",
            "D2_bidang_studi",
            "D3_riwayat_pelatihan",
            "D4_pengalaman_phishing",
            "D5_penggunaan_mfa",
            "D6_frekuensi_email",
            ...Array.from({ length: 12 }, (_, i) => `P${i + 1}`),
            "confidence_pre_avg",
            "pre_score",
            "u1_seconds",
            "u2_seconds",
            "u3_seconds",
            "u4_seconds",
            "u5_seconds",
            "u6_seconds",
            "total_treatment_seconds",
            ...Array.from({ length: 12 }, (_, i) => `Q${i + 1}`),
            "confidence_post_avg",
            "post_score",
            "feedback",
            "feedback_submitted_at_wib",
        ];

        const csvRows = filteredRows.map((r) => [
            r.respondent_id,
            r.group_id,
            r.treatment,
            r.session_type,
            r.created_at_wib,
            r.is_completed ? "Selesai" : "Belum Selesai",
            r.D1_usia,
            r.D2_bidang_studi,
            r.D3_riwayat_pelatihan,
            r.D4_pengalaman_phishing,
            r.D5_penggunaan_mfa,
            r.D6_frekuensi_email,
            ...Array.from({ length: 12 }, (_, i) => r.pre_answers[`P${i + 1}`] || ""),
            r.confidence_pre_avg ?? "",
            r.pre_score ?? "",
            r.u1_seconds ?? "",
            r.u2_seconds ?? "",
            r.u3_seconds ?? "",
            r.u4_seconds ?? "",
            r.u5_seconds ?? "",
            r.u6_seconds ?? "",
            r.total_treatment_seconds,
            ...Array.from({ length: 12 }, (_, i) => r.post_answers[`Q${i + 1}`] || ""),
            r.confidence_post_avg ?? "",
            r.post_score ?? "",
            r.feedback,
            r.feedback_submitted_at_wib,
        ]);

        downloadCSV("A03_RawData.csv", headers, csvRows);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Hapus permanen data responden ${id}?`)) return;
        setDeletingId(id);
        try {
            await onDeleteRespondent(id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* TOOLBAR */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari ID responden, prodi, atau saran..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#172B45] focus:outline-none focus:ring-1 focus:ring-[#172B45] sm:max-w-sm"
                    />
                    <span className="whitespace-nowrap text-xs font-medium text-slate-500">
                        Menampilkan {filteredRows.length} dari {rows.length} responden
                    </span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {filteredRows.length > 0 && (
                        <button
                            type="button"
                            onClick={toggleAllExpand}
                            className="hidden cursor-pointer whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 md:inline-flex md:items-center md:justify-center"
                        >
                            {allExpanded ? "Tutup Semua Detail" : "Buka Semua Detail"}
                        </button>
                    )}

                    <button
                        onClick={handleExportCSV}
                        disabled={filteredRows.length === 0}
                        className="inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-[#172B45] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                    >
                        Unduh A03_RawData.csv
                    </button>
                </div>
            </div>

            {/* TAMPILAN HANDPHONE (CARD VIEW) */}
            <div className="space-y-3 md:hidden">
                {filteredRows.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                        Belum ada data responden yang sesuai.
                    </div>
                ) : (
                    filteredRows.map((r, idx) => {
                        const isExpanded = Boolean(expandedIds[r.respondent_id]);
                        return (
                            <article
                                key={r.respondent_id}
                                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                                {idx + 1}
                                            </span>
                                            <span
                                                className={`whitespace-nowrap rounded border px-2 py-0.5 text-[11px] font-semibold ${r.session_type === "experiment"
                                                    ? "border-[#172B45]/40 text-[#172B45]"
                                                    : "border-amber-400 text-amber-800"
                                                    }`}
                                            >
                                                {r.session_type}
                                            </span>
                                            {r.is_completed ? (
                                                <span className="whitespace-nowrap rounded border border-emerald-400 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                    Selesai
                                                </span>
                                            ) : (
                                                <span className="whitespace-nowrap rounded border border-slate-300 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                                    Progres {r.completed_units_count}/6
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleDelete(r.respondent_id)}
                                            disabled={deletingId === r.respondent_id}
                                            title="Hapus responden"
                                            aria-label="Hapus responden"
                                            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-rose-300 p-1.5 text-rose-600 transition-colors hover:border-rose-500 hover:text-rose-700 disabled:opacity-50"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mt-2.5">
                                        <p className="break-all font-mono text-xs font-semibold text-slate-900">
                                            {r.respondent_id}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-slate-500">
                                            {r.created_at_wib} • {r.D2_bidang_studi || "-"}
                                        </p>
                                    </div>

                                    <div className="mt-3.5 grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 py-2.5 text-center">
                                        <div>
                                            <p className="text-[11px] text-slate-500">Pre-test</p>
                                            <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                                {r.pre_score !== null ? `${r.pre_score}/12` : "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-500">Durasi</p>
                                            <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                                {r.total_treatment_seconds}s
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-500">Post-test</p>
                                            <p className="mt-0.5 text-sm font-semibold text-[#172B45]">
                                                {r.post_score !== null ? `${r.post_score}/12` : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-2.5 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs">
                                        <span className="text-slate-500">Avg. Confidence (Pre → Post)</span>
                                        <span className="font-semibold tabular-nums text-slate-800">
                                            {formatConfidencePair(r)}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(r.respondent_id)}
                                        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        <span>{isExpanded ? "Sembunyikan Detail" : "Lihat Detail Jawaban & Demografi"}</span>
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="space-y-3.5 border-t border-slate-200 p-4 text-xs">
                                        <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white p-3">
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Usia</span>
                                                <span className="font-semibold text-slate-800">{r.D1_usia || "-"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Bidang Studi</span>
                                                <span className="font-semibold text-slate-800">{r.D2_bidang_studi || "-"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Pelatihan Keamanan</span>
                                                <span className="font-semibold text-slate-800">{r.D3_riwayat_pelatihan || "-"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Pengalaman Phishing</span>
                                                <span className="font-semibold text-slate-800">{r.D4_pengalaman_phishing || "-"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Penggunaan MFA</span>
                                                <span className="font-semibold text-slate-800">{r.D5_penggunaan_mfa || "-"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Frekuensi Email</span>
                                                <span className="font-semibold text-slate-800">{r.D6_frekuensi_email || "-"}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-1.5">
                                            {[r.u1_seconds, r.u2_seconds, r.u3_seconds, r.u4_seconds, r.u5_seconds, r.u6_seconds].map(
                                                (sec, i) => (
                                                    <div
                                                        key={i}
                                                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-center"
                                                    >
                                                        <span className="text-[10px] text-slate-400">U{i + 1}: </span>
                                                        <span className="font-semibold text-slate-800">{sec ?? 0}s</span>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                                            <div>
                                                <p className="text-[10px] font-semibold text-slate-400">PRE-TEST (P1–P12)</p>
                                                <p className="mt-0.5 font-mono text-xs tracking-wider text-slate-800">
                                                    {r.has_pretest
                                                        ? Array.from({ length: 12 }, (_, i) => r.pre_answers[`P${i + 1}`] || "-").join(" ")
                                                        : "Belum diisi"}
                                                </p>
                                            </div>
                                            <div className="border-t border-slate-100 pt-2">
                                                <p className="text-[10px] font-semibold text-slate-400">POST-TEST (Q1–Q12)</p>
                                                <p className="mt-0.5 font-mono text-xs tracking-wider text-slate-800">
                                                    {r.has_posttest
                                                        ? Array.from({ length: 12 }, (_, i) => r.post_answers[`Q${i + 1}`] || "-").join(" ")
                                                        : "Belum diisi"}
                                                </p>
                                            </div>
                                        </div>

                                        {r.feedback && (
                                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                                                <p className="text-[10px] font-semibold text-slate-400">SARAN / FEEDBACK</p>
                                                <p className="mt-1 leading-relaxed text-slate-700">{r.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </div>

            {/* TAMPILAN DESKTOP (TABEL BERSIH & PRESISI + PANEL DETAIL 3 KARTU SEJAJAR) */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-600">
                                <th className="w-14 px-4 py-3.5 text-center font-semibold">No</th>
                                <th className="px-4 py-3.5 font-semibold">Respondent ID & Waktu</th>
                                <th className="px-4 py-3.5 font-semibold">Sesi & Status</th>
                                <th className="px-4 py-3.5 font-semibold">Bidang Studi</th>
                                <th className="px-4 py-3.5 text-center font-semibold">Pre-test</th>
                                <th className="px-4 py-3.5 text-center font-semibold">Durasi</th>
                                <th className="px-4 py-3.5 text-center font-semibold">Post-test</th>
                                <th className="whitespace-nowrap px-4 py-3.5 text-center font-semibold">Avg. Confidence (Pre → Post)</th>
                                <th className="px-4 py-3.5 text-right font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredRows.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-10 text-center text-sm text-slate-500">
                                        Belum ada data responden yang sesuai.
                                    </td>
                                </tr>
                            ) : (
                                filteredRows.map((r, idx) => {
                                    const isExpanded = Boolean(expandedIds[r.respondent_id]);
                                    return (
                                        <React.Fragment key={r.respondent_id}>
                                            {/* BARIS UTAMA YANG LEGA & PRESISI */}
                                            <tr className="transition-colors hover:bg-slate-50/50">
                                                <td className="px-4 py-4 text-center font-medium text-slate-500">
                                                    {idx + 1}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p className="break-all font-mono font-semibold text-slate-900">
                                                        {r.respondent_id}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        {r.created_at_wib}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span
                                                            className={`whitespace-nowrap rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${r.session_type === "experiment"
                                                                ? "border-[#172B45]/40 text-[#172B45]"
                                                                : "border-amber-400 text-amber-800"
                                                                }`}
                                                        >
                                                            {r.session_type}
                                                        </span>
                                                        {r.is_completed ? (
                                                            <span className="whitespace-nowrap rounded-md border border-emerald-400 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                                Selesai
                                                            </span>
                                                        ) : (
                                                            <span className="whitespace-nowrap rounded-md border border-slate-300 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                                                                Progres {r.completed_units_count}/6
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {r.D2_bidang_studi || "-"}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        Usia {r.D1_usia || "-"} thn
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4 text-center tabular-nums">
                                                    <span className="font-semibold text-slate-900">
                                                        {r.pre_score !== null ? `${r.pre_score}/12` : "-"}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4 text-center tabular-nums">
                                                    <span className="font-semibold text-slate-900">
                                                        {r.total_treatment_seconds}s
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4 text-center tabular-nums">
                                                    <span className="font-semibold text-[#172B45]">
                                                        {r.post_score !== null ? `${r.post_score}/12` : "-"}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-center tabular-nums">
                                                    <span className="font-semibold text-slate-800">
                                                        {formatConfidencePair(r)}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpand(r.respondent_id)}
                                                            className={`inline-flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${isExpanded
                                                                ? "border-[#172B45] text-[#172B45]"
                                                                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            <span>Detail</span>
                                                            <svg
                                                                className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""
                                                                    }`}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(r.respondent_id)}
                                                            disabled={deletingId === r.respondent_id}
                                                            title="Hapus responden"
                                                            aria-label="Hapus responden"
                                                            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-rose-300 bg-white p-1.5 text-rose-600 transition-colors hover:border-rose-500 hover:text-rose-700 disabled:opacity-50"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* BARIS DETAIL: 3 KARTU SAMA TINGGI & PRESISI */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={9} className="border-t border-slate-200/80 px-6 py-5">
                                                        <div className="grid grid-cols-3 items-stretch gap-4">
                                                            {/* KARTU 1: DEMOGRAFI */}
                                                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4">
                                                                <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                                                                    DEMOGRAFI (D1–D6)
                                                                </p>
                                                                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
                                                                    <div>
                                                                        <span className="block text-[10px] text-slate-400">
                                                                            Usia
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800">
                                                                            {r.D1_usia || "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-[10px] text-slate-400">
                                                                            Bidang Studi
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800">
                                                                            {r.D2_bidang_studi || "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-[10px] text-slate-400">
                                                                            Pelatihan Keamanan
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800">
                                                                            {r.D3_riwayat_pelatihan || "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-[10px] text-slate-400">
                                                                            Pengalaman Phishing
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800">
                                                                            {r.D4_pengalaman_phishing || "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-[10px] text-slate-400">
                                                                            Penggunaan MFA
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800">
                                                                            {r.D5_penggunaan_mfa || "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-[10px] text-slate-400">
                                                                            Frekuensi Email
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800">
                                                                            {r.D6_frekuensi_email || "-"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* KARTU 2: DURASI PER UNIT */}
                                                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4">
                                                                <div>
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                                                                            DURASI UNIT (U1–U6)
                                                                        </p>
                                                                        <span className="text-[11px] font-semibold text-slate-700">
                                                                            Total: {r.total_treatment_seconds}s
                                                                        </span>
                                                                    </div>

                                                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                                                        {[
                                                                            r.u1_seconds,
                                                                            r.u2_seconds,
                                                                            r.u3_seconds,
                                                                            r.u4_seconds,
                                                                            r.u5_seconds,
                                                                            r.u6_seconds,
                                                                        ].map((sec, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-center"
                                                                            >
                                                                                <span className="block text-[10px] text-slate-400">
                                                                                    Unit {i + 1}
                                                                                </span>
                                                                                <span className="font-semibold text-slate-800">
                                                                                    {sec ?? 0}s
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
                                                                    <span className="text-slate-500">
                                                                        Unit Selesai
                                                                    </span>
                                                                    <span className="font-semibold text-slate-800">
                                                                        {r.completed_units_count}/6 Unit
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* KARTU 3: JAWABAN PRE/POST & SARAN */}
                                                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4">
                                                                <div>
                                                                    <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                                                                        LOG JAWABAN & SARAN
                                                                    </p>

                                                                    <div className="mt-3 space-y-2.5">
                                                                        <div>
                                                                            <span className="block text-[10px] font-semibold text-slate-400">
                                                                                PRE-TEST (P1–P12)
                                                                            </span>
                                                                            <p className="mt-0.5 font-mono text-xs tracking-wider text-slate-800">
                                                                                {r.has_pretest
                                                                                    ? Array.from(
                                                                                        { length: 12 },
                                                                                        (_, i) =>
                                                                                            r.pre_answers[
                                                                                            `P${i + 1}`
                                                                                            ] || "-"
                                                                                    ).join(" ")
                                                                                    : "Belum diisi"}
                                                                            </p>
                                                                        </div>

                                                                        <div className="border-t border-slate-100 pt-2">
                                                                            <span className="block text-[10px] font-semibold text-slate-400">
                                                                                POST-TEST (Q1–Q12)
                                                                            </span>
                                                                            <p className="mt-0.5 font-mono text-xs tracking-wider text-slate-800">
                                                                                {r.has_posttest
                                                                                    ? Array.from(
                                                                                        { length: 12 },
                                                                                        (_, i) =>
                                                                                            r.post_answers[
                                                                                            `Q${i + 1}`
                                                                                            ] || "-"
                                                                                    ).join(" ")
                                                                                    : "Belum diisi"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 border-t border-slate-100 pt-2.5 text-[11px]">
                                                                    <span className="font-semibold text-slate-400">
                                                                        Saran:{" "}
                                                                    </span>
                                                                    <span className="text-slate-700">
                                                                        {r.feedback || "-"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}