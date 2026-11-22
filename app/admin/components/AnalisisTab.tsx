"use client";

import React from "react";
import type { StatisticalSummary } from "@/lib/adminAnalytics";

interface AnalisisTabProps {
    stats: StatisticalSummary;
}

export default function AnalisisTab({ stats }: AnalisisTabProps) {
    return (
        <div className="space-y-5">
            {/* KARTU RINGKASAN UTAMA */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                        SAMPEL VALID (CLEAN / RAW)
                    </p>
                    <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
                        {stats.totalClean}{" "}
                        <span className="text-sm font-normal text-slate-400">
                            / {stats.totalRaw}
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                        {stats.totalExcluded} data dieksklusi
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                        RATA-RATA SKOR (PRE → POST)
                    </p>
                    <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#172B45]">
                        {stats.preMean} → {stats.postMean}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                        Selisih rata-rata: {stats.gainMean >= 0 ? `+${stats.gainMean}` : stats.gainMean} poin (maks 12)
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                        RATA-RATA N-GAIN (&lt;g&gt;)
                    </p>
                    <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
                        {stats.nGainMean}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                        Tinggi: {stats.nGainDistribution.tinggi} • Sedang: {stats.nGainDistribution.sedang} • Rendah: {stats.nGainDistribution.rendah}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                        PAIRED T-TEST (P-VALUE)
                    </p>
                    <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
                        {stats.totalClean > 1 ? stats.pValueApprox : "-"}
                    </p>
                    <p className="mt-1 text-xs">
                        {stats.totalClean <= 1 ? (
                            <span className="text-slate-500">Butuh minimal 2 sampel valid</span>
                        ) : stats.isSignificant ? (
                            <span className="font-semibold text-emerald-700">
                                Signifikan (p &lt; 0.05), d = {stats.cohensD}
                            </span>
                        ) : (
                            <span className="font-semibold text-amber-700">
                                Tidak signifikan (p ≥ 0.05)
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* STATISTIK DESKRIPTIF & UJI HIPOTESIS */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <p className="text-xs font-semibold tracking-wider text-slate-600">
                        RINGKASAN DESKRIPTIF
                    </p>
                    <h3 className="mt-1 mb-4 text-base font-semibold tracking-tight text-slate-900">
                        Statistik Skor & Metrik Pendukung
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-700">
                                    <th className="p-2.5 font-semibold sm:p-3">Metrik</th>
                                    <th className="whitespace-nowrap p-2.5 text-right font-semibold sm:p-3">
                                        Pre-test
                                    </th>
                                    <th className="whitespace-nowrap p-2.5 text-right font-semibold sm:p-3">
                                        Post-test
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-2.5 font-medium text-slate-700 sm:p-3">Mean (Rata-rata Skor)</td>
                                    <td className="p-2.5 text-right text-slate-800 sm:p-3">{stats.preMean}</td>
                                    <td className="p-2.5 text-right font-semibold text-[#172B45] sm:p-3">
                                        {stats.postMean}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2.5 font-medium text-slate-700 sm:p-3">Standar Deviasi (SD)</td>
                                    <td className="p-2.5 text-right text-slate-800 sm:p-3">{stats.preSD}</td>
                                    <td className="p-2.5 text-right text-slate-800 sm:p-3">{stats.postSD}</td>
                                </tr>
                                <tr>
                                    <td className="p-2.5 font-medium text-slate-700 sm:p-3">Median</td>
                                    <td className="p-2.5 text-right text-slate-800 sm:p-3">{stats.preMedian}</td>
                                    <td className="p-2.5 text-right text-slate-800 sm:p-3">{stats.postMedian}</td>
                                </tr>
                                <tr>
                                    <td className="p-2.5 font-medium text-slate-700 sm:p-3">
                                        Rata-rata Confidence (1–5)
                                    </td>
                                    <td className="p-2.5 text-right text-slate-800 sm:p-3">
                                        {stats.preConfidenceMean}
                                    </td>
                                    <td className="p-2.5 text-right text-slate-800 sm:p-3">
                                        {stats.postConfidenceMean}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2.5 font-medium text-slate-700 sm:p-3">
                                        Rata-rata Durasi Belajar
                                    </td>
                                    <td colSpan={2} className="p-2.5 text-right font-semibold text-slate-800 sm:p-3">
                                        {stats.avgTreatmentSeconds}s ({(stats.avgTreatmentSeconds / 60).toFixed(1)} mnt)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-slate-600">
                            STATISTIK INFERENSIAL
                        </p>
                        <h3 className="mt-1 mb-4 text-base font-semibold tracking-tight text-slate-900">
                            Hasil Uji Paired Sample t-test
                        </h3>
                        <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 px-3.5 text-xs text-slate-700 sm:px-4">
                            <div className="flex justify-between py-2.5">
                                <span>Jumlah Sampel Valid (N)</span>
                                <span className="font-semibold text-slate-900">{stats.totalClean}</span>
                            </div>
                            <div className="flex justify-between py-2.5">
                                <span>Derajat Kebebasan (df)</span>
                                <span className="font-semibold text-slate-900">{stats.degreesOfFreedom}</span>
                            </div>
                            <div className="flex justify-between py-2.5">
                                <span>t-hitung (t-statistic)</span>
                                <span className="font-mono font-semibold text-slate-900">{stats.tStatistic}</span>
                            </div>
                            <div className="flex justify-between py-2.5">
                                <span>p-value (two-tailed)</span>
                                <span className="font-mono font-semibold text-slate-900">{stats.pValueApprox}</span>
                            </div>
                            <div className="flex justify-between py-2.5">
                                <span>Effect Size (Cohen&apos;s d)</span>
                                <span className="font-mono font-semibold text-slate-900">{stats.cohensD}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-300 p-3.5 text-xs leading-6 text-slate-600 sm:p-4">
                        {stats.totalClean < 2 ? (
                            "Kumpulkan minimal 2 responden valid pada Clean Data untuk menampilkan interpretasi uji signifikansi statistik."
                        ) : stats.isSignificant ? (
                            `Terdapat peningkatan skor deteksi phishing yang signifikan secara statistik setelah intervensi microlearning (t(${stats.degreesOfFreedom}) = ${stats.tStatistic}, p = ${stats.pValueApprox}, d = ${stats.cohensD}).`
                        ) : (
                            `Belum ditemukan perbedaan yang signifikan secara statistik antara skor Pre-test dan Post-test (t(${stats.degreesOfFreedom}) = ${stats.tStatistic}, p = ${stats.pValueApprox}).`
                        )}
                    </div>
                </div>
            </div>

            {/* ANALISIS PER BUTIR SOAL */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <p className="text-xs font-semibold tracking-wider text-slate-600">
                    EVALUASI INSTRUMEN SOAL
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900">
                    Perbandingan Akurasi Per Butir (P1–P12 vs Q1–Q12)
                </h3>
                <p className="mt-1 mb-4 text-xs leading-5 text-slate-600 sm:mb-5 sm:text-sm">
                    Persentase responden valid yang menjawab benar pada tiap pasangan butir Pre-test dan Post-test.
                </p>

                {/* TAMPILAN HANDPHONE PER BUTIR (CARD RINGKAS) */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:hidden">
                    {stats.itemComparisons.map((item) => (
                        <div
                            key={item.itemNumber}
                            className="rounded-lg border border-slate-200 p-3.5 text-xs"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900">
                                        Soal {item.itemNumber}
                                    </span>
                                    <span className="rounded border border-slate-200 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                                        {item.preCode} → {item.postCode}
                                    </span>
                                </div>

                                <span
                                    className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${item.deltaPct > 0
                                        ? "border-emerald-400 text-emerald-700"
                                        : item.deltaPct < 0
                                            ? "border-rose-400 text-rose-700"
                                            : "border-slate-300 text-slate-600"
                                        }`}
                                >
                                    {item.deltaPct > 0 ? `+${item.deltaPct}%` : `${item.deltaPct}%`}
                                </span>
                            </div>

                            <div className="mt-2.5 grid grid-cols-2 divide-x divide-slate-200 rounded-md border border-slate-200 py-2 text-center">
                                <div>
                                    <p className="text-[10px] text-slate-400">Benar Pre-test</p>
                                    <p className="mt-0.5 font-semibold text-slate-700">
                                        {item.preCorrectCount}/{stats.totalClean} ({item.preAccuracyPct}%)
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400">Benar Post-test</p>
                                    <p className="mt-0.5 font-semibold text-[#172B45]">
                                        {item.postCorrectCount}/{stats.totalClean} ({item.postAccuracyPct}%)
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TAMPILAN DESKTOP PER BUTIR (TABLE VIEW) */}
                <div className="hidden overflow-hidden rounded-lg border border-slate-200 md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-700">
                                    <th className="p-3.5 font-semibold">Butir</th>
                                    <th className="p-3.5 font-semibold">Pasangan Kode</th>
                                    <th className="p-3.5 text-right font-semibold">Benar Pre-test</th>
                                    <th className="p-3.5 text-right font-semibold">Benar Post-test</th>
                                    <th className="p-3.5 text-right font-semibold">Peningkatan (Δ)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {stats.itemComparisons.map((item) => (
                                    <tr key={item.itemNumber} className="hover:bg-slate-50/50">
                                        <td className="p-3.5 font-medium text-slate-800">Soal {item.itemNumber}</td>
                                        <td className="p-3.5 font-mono text-slate-600">
                                            {item.preCode} → {item.postCode}
                                        </td>
                                        <td className="p-3.5 text-right text-slate-700">
                                            {item.preCorrectCount}/{stats.totalClean} ({item.preAccuracyPct}%)
                                        </td>
                                        <td className="p-3.5 text-right font-semibold text-[#172B45]">
                                            {item.postCorrectCount}/{stats.totalClean} ({item.postAccuracyPct}%)
                                        </td>
                                        <td className="p-3.5 text-right font-semibold">
                                            <span
                                                className={
                                                    item.deltaPct > 0
                                                        ? "text-emerald-700"
                                                        : item.deltaPct < 0
                                                            ? "text-rose-700"
                                                            : "text-slate-500"
                                                }
                                            >
                                                {item.deltaPct > 0 ? `+${item.deltaPct}%` : `${item.deltaPct}%`}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}