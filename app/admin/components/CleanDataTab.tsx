"use client";

import React from "react";
import {
    downloadCSV,
    type CleanRespondentRow,
    type ExclusionLogItem,
} from "@/lib/adminAnalytics";

interface CleanDataTabProps {
    cleanRows: CleanRespondentRow[];
    exclusionLogs: ExclusionLogItem[];
}

export default function CleanDataTab({ cleanRows, exclusionLogs }: CleanDataTabProps) {
    const handleExportCleanCSV = () => {
        const headers = [
            "respondent_id",
            "group_id",
            "treatment",
            "session_type",
            "created_at_wib",
            "D1_usia",
            "D2_bidang_studi",
            "D3_riwayat_pelatihan",
            "D4_pengalaman_phishing",
            "D5_penggunaan_mfa",
            "D6_frekuensi_email",
            "pre_score",
            "pre_accuracy_pct",
            "confidence_pre_avg",
            "u1_seconds",
            "u2_seconds",
            "u3_seconds",
            "u4_seconds",
            "u5_seconds",
            "u6_seconds",
            "total_treatment_seconds",
            "post_score",
            "post_accuracy_pct",
            "confidence_post_avg",
            "score_gain",
            "n_gain",
            "n_gain_category",
            "confidence_gain",
            "feedback",
        ];

        const csvRows = cleanRows.map((r) => [
            r.respondent_id,
            r.group_id,
            r.treatment,
            r.session_type,
            r.created_at_wib,
            r.D1_usia,
            r.D2_bidang_studi,
            r.D3_riwayat_pelatihan,
            r.D4_pengalaman_phishing,
            r.D5_penggunaan_mfa,
            r.D6_frekuensi_email,
            r.pre_score_final,
            r.pre_accuracy_pct,
            r.confidence_pre_avg ?? "",
            r.u1_seconds ?? 0,
            r.u2_seconds ?? 0,
            r.u3_seconds ?? 0,
            r.u4_seconds ?? 0,
            r.u5_seconds ?? 0,
            r.u6_seconds ?? 0,
            r.total_treatment_seconds,
            r.post_score_final,
            r.post_accuracy_pct,
            r.confidence_post_avg ?? "",
            r.score_gain,
            r.n_gain,
            r.n_gain_category,
            r.confidence_gain,
            r.feedback,
        ]);

        downloadCSV("A03_CleanData.csv", headers, csvRows);
    };

    return (
        <div className="space-y-5">
            {/* HEADER & EKSPOR */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-6">
                <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-600">
                        DATASET TERVALIDASI
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                        Clean Data ({cleanRows.length} Responden Valid)
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Mencakup responden yang menyelesaikan seluruh tahapan dan lolos pemeriksaan kualitas data.
                    </p>
                </div>

                <button
                    onClick={handleExportCleanCSV}
                    disabled={cleanRows.length === 0}
                    className="w-full cursor-pointer rounded-lg bg-[#172B45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                >
                    Unduh A03_CleanData.csv
                </button>
            </div>

            {/* TAMPILAN HANDPHONE CLEAN DATA (CARD RAPI) */}
            <div className="space-y-3 md:hidden">
                {cleanRows.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                        Belum ada data responden yang memenuhi kriteria Clean Data.
                    </div>
                ) : (
                    cleanRows.map((r, idx) => (
                        <article
                            key={r.respondent_id}
                            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            {/* Baris 1: Nomor & Badge */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                        {idx + 1}
                                    </span>
                                    <span className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                        {r.session_type}
                                    </span>
                                </div>

                                <span
                                    className={`whitespace-nowrap rounded border px-2.5 py-0.5 text-[11px] font-semibold ${r.n_gain_category === "Tinggi"
                                        ? "border-emerald-400 text-emerald-700"
                                        : r.n_gain_category === "Sedang"
                                            ? "border-[#172B45]/40 text-[#172B45]"
                                            : "border-slate-300 text-slate-600"
                                        }`}
                                >
                                    N-Gain: {r.n_gain_category} ({r.n_gain})
                                </span>
                            </div>

                            {/* Baris 2: ID Responden penuh satu baris */}
                            <div className="mt-2.5">
                                <p className="break-all font-mono text-xs font-semibold text-slate-900">
                                    {r.respondent_id}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500">
                                    {r.D2_bidang_studi} • Durasi {r.total_treatment_seconds}s
                                </p>
                            </div>

                            {/* Baris 3: 3 Kolom Skor */}
                            <div className="mt-3.5 grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 py-2.5 text-center">
                                <div>
                                    <p className="text-[11px] text-slate-500">Pre-test</p>
                                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                        {r.pre_score_final}/12
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-500">Post-test</p>
                                    <p className="mt-0.5 text-sm font-semibold text-[#172B45]">
                                        {r.post_score_final}/12
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-500">Gain</p>
                                    <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                                        {r.score_gain > 0 ? `+${r.score_gain}` : r.score_gain}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {/* TAMPILAN DESKTOP CLEAN DATA (TABLE VIEW) */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-700">
                                <th className="p-3.5 font-semibold">No</th>
                                <th className="p-3.5 font-semibold">Respondent ID</th>
                                <th className="p-3.5 font-semibold">Sesi</th>
                                <th className="p-3.5 font-semibold">Bidang Studi</th>
                                <th className="p-3.5 text-center font-semibold">Pre-test</th>
                                <th className="p-3.5 text-center font-semibold">Post-test</th>
                                <th className="p-3.5 text-center font-semibold">Gain</th>
                                <th className="p-3.5 text-center font-semibold">N-Gain</th>
                                <th className="p-3.5 text-center font-semibold">Kategori</th>
                                <th className="p-3.5 text-center font-semibold">Durasi Total</th>
                                <th className="p-3.5 text-center font-semibold">Conf. Pre → Post</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {cleanRows.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="p-10 text-center text-sm text-slate-500">
                                        Belum ada data responden yang memenuhi kriteria Clean Data.
                                    </td>
                                </tr>
                            ) : (
                                cleanRows.map((r, idx) => (
                                    <tr key={r.respondent_id} className="hover:bg-slate-50/50">
                                        <td className="p-3.5 text-slate-500">{idx + 1}</td>
                                        <td className="p-3.5 font-mono font-semibold text-slate-900">
                                            {r.respondent_id}
                                        </td>
                                        <td className="p-3.5 text-slate-600">{r.session_type}</td>
                                        <td className="p-3.5 text-slate-600">{r.D2_bidang_studi}</td>
                                        <td className="p-3.5 text-center font-semibold text-slate-800">
                                            {r.pre_score_final}/12 ({r.pre_accuracy_pct}%)
                                        </td>
                                        <td className="p-3.5 text-center font-semibold text-[#172B45]">
                                            {r.post_score_final}/12 ({r.post_accuracy_pct}%)
                                        </td>
                                        <td className="p-3.5 text-center font-semibold text-slate-800">
                                            {r.score_gain > 0 ? `+${r.score_gain}` : r.score_gain}
                                        </td>
                                        <td className="p-3.5 text-center font-mono text-slate-800">
                                            {r.n_gain}
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <span
                                                className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold ${r.n_gain_category === "Tinggi"
                                                    ? "border-emerald-400 text-emerald-700"
                                                    : r.n_gain_category === "Sedang"
                                                        ? "border-[#172B45]/40 text-[#172B45]"
                                                        : "border-slate-300 text-slate-600"
                                                    }`}
                                            >
                                                {r.n_gain_category}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-center text-slate-600">
                                            {r.total_treatment_seconds} detik
                                        </td>
                                        <td className="p-3.5 text-center text-slate-600">
                                            {r.confidence_pre_avg ?? "-"} → {r.confidence_post_avg ?? "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* LOG PEMBERSIHAN DATA */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <p className="text-xs font-semibold tracking-wider text-slate-600">
                    TRANSPARANSI PEMBERSIHAN DATA
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900">
                    Log Eksklusi Responden ({exclusionLogs.length} Data Disaring)
                </h3>
                <p className="mt-1 mb-4 text-sm text-slate-600">
                    Daftar responden di Raw Data yang dikeluarkan dari perhitungan statistik beserta alasan penyaringannya.
                </p>

                {exclusionLogs.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-700">
                        Seluruh responden pada filter saat ini valid dan masuk ke dalam Clean Data.
                    </div>
                ) : (
                    <>
                        {/* Kartu Log di HP */}
                        <div className="space-y-2.5 md:hidden">
                            {exclusionLogs.map((log) => (
                                <div
                                    key={log.respondent_id}
                                    className="rounded-lg border border-slate-200 p-3.5 text-xs"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                            {log.session_type}
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            {log.created_at_wib}
                                        </span>
                                    </div>
                                    <p className="mt-2 break-all font-mono font-semibold text-slate-900">
                                        {log.respondent_id}
                                    </p>
                                    <p className="mt-1.5 font-medium text-rose-700">
                                        {log.reasons.join("; ")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Tabel Log di Desktop */}
                        <div className="hidden overflow-hidden rounded-lg border border-slate-200 md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-700">
                                            <th className="p-3 font-semibold">Respondent ID</th>
                                            <th className="p-3 font-semibold">Sesi</th>
                                            <th className="p-3 font-semibold">Waktu Masuk (WIB)</th>
                                            <th className="p-3 font-semibold">Alasan Eksklusi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {exclusionLogs.map((log) => (
                                            <tr key={log.respondent_id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-mono font-semibold text-slate-900">
                                                    {log.respondent_id}
                                                </td>
                                                <td className="p-3 text-slate-600">{log.session_type}</td>
                                                <td className="p-3 text-slate-500">{log.created_at_wib}</td>
                                                <td className="p-3 font-medium text-rose-700">
                                                    {log.reasons.join("; ")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}