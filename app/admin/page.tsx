"use client";

import { useCallback, useEffect, useState } from "react";
import type {
    AdminPayload,
    Analysis,
    CleanRow,
    Desc,
} from "@/lib/adminTypes";

type Tab = "dashboard" | "raw" | "cleaning" | "laporan";

const TABS: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard Analisis" },
    { id: "raw", label: "Raw Data" },
    { id: "cleaning", label: "Data Cleaning" },
    { id: "laporan", label: "Laporan & Ekspor" },
];

function f(value: number | null | undefined, digits = 2) {
    return value === null || value === undefined ? "–" : value.toFixed(digits);
}

function fp(value: number | null | undefined) {
    if (value === null || value === undefined) return "–";

    return value < 0.001 ? "< 0.001" : value.toFixed(3);
}

function yesNo(value: boolean | null) {
    return value === null ? "–" : value ? "Ya" : "Tidak";
}

function downloadCsv(name: string, rows: Record<string, unknown>[]) {
    if (rows.length === 0) return;

    const columns = Array.from(
        rows.reduce((set, row) => {
            Object.keys(row).forEach((key) => set.add(key));
            return set;
        }, new Set<string>())
    );

    const escape = (value: unknown) => {
        if (value === null || value === undefined) return "";

        const textValue =
            typeof value === "object" ? JSON.stringify(value) : String(value);

        return /[",\n\r]/.test(textValue)
            ? `"${textValue.replace(/"/g, '""')}"`
            : textValue;
    };

    const csv =
        "\uFEFF" +
        [
            columns.join(","),
            ...rows.map((row) =>
                columns.map((column) => escape(row[column])).join(",")
            ),
        ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
}

function flattenScored(row: CleanRow): Record<string, unknown> {
    const result: Record<string, unknown> = {
        respondent_id: row.respondent_id,
        group_id: row.group_id,
        treatment: row.treatment,
        usia: row.usia,
        bidang_studi: row.bidang_studi,
        riwayat_pelatihan: yesNo(row.riwayat_pelatihan),
        pengalaman_phishing: yesNo(row.pengalaman_phishing),
        penggunaan_mfa: yesNo(row.penggunaan_mfa),
        frekuensi_email: row.frekuensi_email,
        total_treatment_seconds: row.total_treatment_seconds,
    };

    row.items_pre.forEach((value, i) => {
        result[`P${i + 1}`] = value;
    });

    row.items_post.forEach((value, i) => {
        result[`Q${i + 1}`] = value;
    });

    result.pre_score = row.pre_score;
    result.post_score = row.post_score;
    result.accuracy_pre = row.accuracy_pre;
    result.accuracy_post = row.accuracy_post;
    result.confidence_pre = row.confidence_pre;
    result.confidence_post = row.confidence_post;
    result.improvement = row.improvement;
    result.valid_case = row.valid_case ? 1 : 0;
    result.exclusion_reason = row.exclusion_reason;

    return result;
}

function interpret(analysis: Analysis) {
    if (!analysis.pairedT || analysis.improvement.mean === null) {
        return "Data belum cukup untuk uji statistik.";
    }

    const mean = analysis.improvement.mean;
    const direction =
        mean > 0 ? "lebih tinggi daripada" : mean < 0 ? "lebih rendah daripada" : "sama dengan";
    const significance =
        analysis.pairedT.p < 0.05
            ? "perbedaan ini signifikan secara statistik (p < 0.05)"
            : "perbedaan ini tidak signifikan secara statistik (p ≥ 0.05)";

    return `Rata-rata skor post-test (${f(analysis.post.mean)}) ${direction} pre-test (${f(analysis.pre.mean)}), dengan selisih rata-rata ${f(mean)} poin. Pada paired t-test, ${significance}, dengan ukuran efek Cohen's dz = ${f(analysis.pairedT.dz)}. Desain pre-test–intervensi–post-test tanpa kelompok kontrol tidak mendukung klaim sebab-akibat.`;
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold tracking-wide text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#172B45]">{value}</p>
        </div>
    );
}

function Bar({
    label,
    value,
    suffix,
}: {
    label: string;
    value: number | null;
    suffix?: string;
}) {
    const width = value === null ? 0 : Math.max(0, Math.min(100, value * 100));

    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 truncate text-slate-600">{label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-[#172B45]"
                    style={{ width: `${width}%` }}
                />
            </div>
            <span className="w-24 shrink-0 text-right tabular-nums text-slate-600">
                {value === null ? "–" : `${(value * 100).toFixed(0)}%`}
                {suffix ?? ""}
            </span>
        </div>
    );
}

function DescTable({ rows }: { rows: { label: string; desc: Desc }[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                        <th className="py-2 pr-4 font-semibold">Variabel</th>
                        <th className="py-2 pr-4 font-semibold">N</th>
                        <th className="py-2 pr-4 font-semibold">Mean</th>
                        <th className="py-2 pr-4 font-semibold">Median</th>
                        <th className="py-2 pr-4 font-semibold">SD</th>
                        <th className="py-2 pr-4 font-semibold">Min</th>
                        <th className="py-2 font-semibold">Maks</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ label, desc }) => (
                        <tr key={label} className="border-b border-slate-100">
                            <td className="py-2 pr-4 text-slate-700">{label}</td>
                            <td className="py-2 pr-4 tabular-nums">{desc.n}</td>
                            <td className="py-2 pr-4 tabular-nums">{f(desc.mean)}</td>
                            <td className="py-2 pr-4 tabular-nums">{f(desc.median)}</td>
                            <td className="py-2 pr-4 tabular-nums">{f(desc.sd)}</td>
                            <td className="py-2 pr-4 tabular-nums">{f(desc.min)}</td>
                            <td className="py-2 tabular-nums">{f(desc.max)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TestTable({ analysis }: { analysis: Analysis }) {
    const t = analysis.pairedT;
    const w = analysis.wilcoxon;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">Paired t-test</h3>
                {t ? (
                    <dl className="mt-3 space-y-1 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <dt>t (df = {t.df})</dt>
                            <dd className="tabular-nums">{f(t.t, 3)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>p (dua arah)</dt>
                            <dd className="tabular-nums">{fp(t.p)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>Selisih rata-rata</dt>
                            <dd className="tabular-nums">{f(t.meanDiff)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>CI 95%</dt>
                            <dd className="tabular-nums">
                                [{f(t.ciLow)}, {f(t.ciHigh)}]
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>Cohen&apos;s dz</dt>
                            <dd className="tabular-nums">{f(t.dz)}</dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-3 text-sm text-slate-500">
                        Belum bisa dihitung (data kurang atau tidak ada variasi selisih).
                    </p>
                )}
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                    Wilcoxon signed-rank
                </h3>
                {w ? (
                    <dl className="mt-3 space-y-1 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <dt>N (selisih ≠ 0)</dt>
                            <dd className="tabular-nums">{w.n}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>W+ / W−</dt>
                            <dd className="tabular-nums">
                                {f(w.wPlus, 1)} / {f(w.wMinus, 1)}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>z (aproksimasi normal)</dt>
                            <dd className="tabular-nums">{f(w.z, 3)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>p (dua arah)</dt>
                            <dd className="tabular-nums">{fp(w.p)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>Effect size r</dt>
                            <dd className="tabular-nums">{f(w.r)}</dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-3 text-sm text-slate-500">
                        Belum bisa dihitung (tidak ada selisih bukan nol).
                    </p>
                )}
            </div>
        </div>
    );
}

function DescriptiveRows(analysis: Analysis) {
    return [
        { label: "Skor pre-test (0–12)", desc: analysis.pre },
        { label: "Skor post-test (0–12)", desc: analysis.post },
        { label: "Improvement", desc: analysis.improvement },
        { label: "Accuracy pre (%)", desc: analysis.accuracyPre },
        { label: "Accuracy post (%)", desc: analysis.accuracyPost },
        { label: "Confidence pre (1–5)", desc: analysis.confidencePre },
        { label: "Confidence post (1–5)", desc: analysis.confidencePost },
    ];
}

export default function AdminPage() {
    const [adminKey, setAdminKey] = useState("");
    const [keyInput, setKeyInput] = useState("");
    const [data, setData] = useState<AdminPayload | null>(null);
    const [tab, setTab] = useState<Tab>("dashboard");
    const [isLoading, setIsLoading] = useState(false);
    const [isRestored, setIsRestored] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [target, setTarget] = useState<{ id: string; reason: string } | null>(
        null
    );
    const [cleanError, setCleanError] = useState("");

    const load = useCallback(async (key: string) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/admin/data", {
                headers: { "x-admin-key": key },
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    sessionStorage.removeItem("admin_key");
                    setAdminKey("");
                }

                setErrorMessage(result.message || "Gagal memuat data.");
                return;
            }

            sessionStorage.setItem("admin_key", key);
            setAdminKey(key);
            setData(result as AdminPayload);
        } catch (error) {
            console.error(error);
            setErrorMessage("Terjadi kesalahan koneksi.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const saved = sessionStorage.getItem("admin_key");

        if (saved) {
            load(saved);
        }

        setIsRestored(true);
    }, [load]);

    async function handleClean(
        respondentId: string,
        action: "exclude" | "restore",
        reason: string
    ) {
        setCleanError("");

        const response = await fetch("/api/admin/cleaning", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-key": adminKey,
            },
            body: JSON.stringify({ respondentId, action, reason }),
        });

        const result = await response.json();

        if (!response.ok) {
            setCleanError(result.message || "Gagal menyimpan.");
            return;
        }

        setTarget(null);
        await load(adminKey);
    }

    if (!isRestored) {
        return null;
    }

    if (!adminKey || !data) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white px-5">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        load(keyInput);
                    }}
                    className="w-full max-w-sm rounded-xl border border-slate-200 p-6"
                >
                    <h1 className="text-xl font-semibold text-[#172B45]">
                        Admin A03
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Masukkan kunci admin untuk melanjutkan.
                    </p>

                    <input
                        type="password"
                        value={keyInput}
                        onChange={(event) => setKeyInput(event.target.value)}
                        className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#172B45]"
                        placeholder="Kunci admin"
                        autoFocus
                    />

                    {errorMessage && (
                        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || keyInput === ""}
                        className="mt-4 w-full cursor-pointer rounded-md bg-[#172B45] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {isLoading ? "Memeriksa..." : "Masuk"}
                    </button>
                </form>
            </main>
        );
    }

    const { rows, rawRows, log, analysis, keyReady } = data;
    const validRows = rows.filter((row) => row.valid_case);
    const excludedRows = rows.filter((row) => !row.valid_case);
    const completedCount = rows.filter((row) => row.has_pre && row.has_post).length;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
            <div className="mx-auto w-full max-w-6xl">
                <header className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                            PENELITIAN KEAMANAN INFORMASI · A03
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold text-[#172B45]">
                            Panel Admin
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => load(adminKey)}
                            disabled={isLoading}
                            className="cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            {isLoading ? "Memuat..." : "Muat ulang"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                sessionStorage.removeItem("admin_key");
                                setAdminKey("");
                                setData(null);
                                setKeyInput("");
                            }}
                            className="cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Keluar
                        </button>
                    </div>
                </header>

                <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 print:hidden">
                    {TABS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setTab(item.id)}
                            className={`cursor-pointer border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${tab === item.id
                                ? "border-[#172B45] text-[#172B45]"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {!keyReady && (
                    <p className="mb-6 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 print:hidden">
                        Kunci jawaban belum lengkap di <strong>lib/answerKey.ts</strong>.
                        Skor dan analisis belum bisa dihitung sampai PRE_KEY dan POST_KEY
                        terisi.
                    </p>
                )}

                {tab === "dashboard" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <StatCard label="TOTAL RESPONDEN" value={String(rows.length)} />
                            <StatCard label="SELESAI PRE & POST" value={String(completedCount)} />
                            <StatCard label="VALID (CLEAN DATA)" value={String(validRows.length)} />
                            <StatCard label="DIKECUALIKAN" value={String(excludedRows.length)} />
                        </div>

                        {analysis ? (
                            <>
                                <section className="rounded-xl border border-slate-200 bg-white p-5">
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Perubahan Pre-test ke Post-test (N = {analysis.n})
                                    </h2>

                                    <div className="mt-4 space-y-3">
                                        <Bar
                                            label="Accuracy pre"
                                            value={
                                                analysis.accuracyPre.mean === null
                                                    ? null
                                                    : analysis.accuracyPre.mean / 100
                                            }
                                        />
                                        <Bar
                                            label="Accuracy post"
                                            value={
                                                analysis.accuracyPost.mean === null
                                                    ? null
                                                    : analysis.accuracyPost.mean / 100
                                            }
                                        />
                                    </div>

                                    <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                                        <div className="rounded-md bg-slate-50 p-3">
                                            <p className="text-xl font-semibold text-[#172B45]">
                                                {analysis.improvedCount}
                                            </p>
                                            <p className="text-slate-500">Meningkat</p>
                                        </div>
                                        <div className="rounded-md bg-slate-50 p-3">
                                            <p className="text-xl font-semibold text-[#172B45]">
                                                {analysis.sameCount}
                                            </p>
                                            <p className="text-slate-500">Tetap</p>
                                        </div>
                                        <div className="rounded-md bg-slate-50 p-3">
                                            <p className="text-xl font-semibold text-[#172B45]">
                                                {analysis.declinedCount}
                                            </p>
                                            <p className="text-slate-500">Menurun</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-xl border border-slate-200 bg-white p-5">
                                    <h2 className="mb-3 text-sm font-semibold text-slate-900">
                                        Statistik Deskriptif
                                    </h2>
                                    <DescTable rows={DescriptiveRows(analysis)} />
                                </section>

                                <section className="rounded-xl border border-slate-200 bg-white p-5">
                                    <h2 className="mb-3 text-sm font-semibold text-slate-900">
                                        Uji Statistik Pre vs Post
                                    </h2>
                                    <TestTable analysis={analysis} />
                                    <p className="mt-3 text-xs leading-5 text-slate-500">
                                        Pilih uji sesuai arahan dosen. Paired t-test
                                        mengasumsikan selisih skor berdistribusi
                                        mendekati normal; jika tidak terpenuhi, gunakan
                                        Wilcoxon.
                                    </p>
                                </section>

                                <section className="rounded-xl border border-slate-200 bg-white p-5">
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Kategori Ancaman yang Paling Sulit (RQ3)
                                    </h2>
                                    <p className="mb-4 mt-1 text-xs text-slate-500">
                                        Persentase jawaban benar per kategori, diurutkan dari
                                        yang terendah pada post-test.
                                    </p>

                                    <div className="space-y-3">
                                        {analysis.categories.map((category) => (
                                            <div key={category.category} className="space-y-1">
                                                <p className="text-xs font-semibold text-slate-700">
                                                    {category.category}
                                                </p>
                                                <Bar label="Pre" value={category.preCorrectRate} />
                                                <Bar label="Post" value={category.postCorrectRate} />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                                        <h2 className="mb-3 text-sm font-semibold text-slate-900">
                                            Persentase Benar per Soal Pre-test
                                        </h2>
                                        <div className="space-y-2">
                                            {analysis.itemsPre.map((item) => (
                                                <Bar
                                                    key={item.label}
                                                    label={`${item.label} · ${item.category}`}
                                                    value={item.correctRate}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                                        <h2 className="mb-3 text-sm font-semibold text-slate-900">
                                            Persentase Benar per Soal Post-test
                                        </h2>
                                        <div className="space-y-2">
                                            {analysis.itemsPost.map((item) => (
                                                <Bar
                                                    key={item.label}
                                                    label={`${item.label} · ${item.category}`}
                                                    value={item.correctRate}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </>
                        ) : (
                            <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
                                Analisis tampil setelah kunci jawaban diisi.
                            </p>
                        )}
                    </div>
                )}

                {tab === "raw" && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Raw Data ({rawRows.length} baris)
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Hanya baca. Tidak ada perubahan atau penghapusan data di
                                    halaman ini.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => downloadCsv("A03_RawData.csv", rawRows)}
                                className="cursor-pointer rounded-md bg-[#172B45] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243B59]"
                            >
                                Unduh A03_RawData.csv
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                        <th className="py-2 pr-3 font-semibold">ID</th>
                                        <th className="py-2 pr-3 font-semibold">Usia</th>
                                        <th className="py-2 pr-3 font-semibold">Bidang</th>
                                        <th className="py-2 pr-3 font-semibold">Pelatihan</th>
                                        <th className="py-2 pr-3 font-semibold">Phishing</th>
                                        <th className="py-2 pr-3 font-semibold">MFA</th>
                                        <th className="py-2 pr-3 font-semibold">Email</th>
                                        <th className="py-2 pr-3 font-semibold">Durasi (dtk)</th>
                                        <th className="py-2 pr-3 font-semibold">Pre</th>
                                        <th className="py-2 font-semibold">Post</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.respondent_id} className="border-b border-slate-100">
                                            <td className="py-2 pr-3 font-mono text-xs">
                                                {row.respondent_id}
                                            </td>
                                            <td className="py-2 pr-3">{row.usia ?? "–"}</td>
                                            <td className="py-2 pr-3">{row.bidang_studi ?? "–"}</td>
                                            <td className="py-2 pr-3">{yesNo(row.riwayat_pelatihan)}</td>
                                            <td className="py-2 pr-3">{yesNo(row.pengalaman_phishing)}</td>
                                            <td className="py-2 pr-3">{yesNo(row.penggunaan_mfa)}</td>
                                            <td className="py-2 pr-3">{row.frekuensi_email ?? "–"}</td>
                                            <td className="py-2 pr-3 tabular-nums">
                                                {row.total_treatment_seconds ?? "–"}
                                            </td>
                                            <td className="py-2 pr-3">{row.has_pre ? "✓" : "–"}</td>
                                            <td className="py-2">{row.has_post ? "✓" : "–"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {tab === "cleaning" && (
                    <div className="space-y-6">
                        <p className="border-l-4 border-[#172B45] bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                            Eksklusi hanya boleh karena alasan prosedural (data tidak lengkap,
                            duplikat, ikut treatment lain). Responden tidak boleh dikeluarkan
                            karena skornya rendah atau tidak sesuai hipotesis. Setiap
                            perubahan tercatat di cleaning log.
                        </p>

                        <section className="rounded-xl border border-slate-200 bg-white p-5">
                            <h2 className="mb-4 text-sm font-semibold text-slate-900">
                                Status Responden
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[820px] text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                            <th className="py-2 pr-3 font-semibold">ID</th>
                                            <th className="py-2 pr-3 font-semibold">Status</th>
                                            <th className="py-2 pr-3 font-semibold">Alasan eksklusi</th>
                                            <th className="py-2 pr-3 font-semibold">Peringatan</th>
                                            <th className="py-2 font-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr key={row.respondent_id} className="border-b border-slate-100 align-top">
                                                <td className="py-2 pr-3 font-mono text-xs">
                                                    {row.respondent_id}
                                                </td>
                                                <td className="py-2 pr-3">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${row.valid_case
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-red-50 text-red-700"
                                                            }`}
                                                    >
                                                        {row.valid_case ? "Valid" : "Dikecualikan"}
                                                    </span>
                                                </td>
                                                <td className="py-2 pr-3 text-slate-600">
                                                    {row.exclusion_reason || "–"}
                                                </td>
                                                <td className="py-2 pr-3 text-xs text-amber-700">
                                                    {row.warnings.length > 0
                                                        ? row.warnings.join("; ")
                                                        : "–"}
                                                </td>
                                                <td className="py-2">
                                                    {row.manual_excluded ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleClean(
                                                                    row.respondent_id,
                                                                    "restore",
                                                                    "Dipulihkan"
                                                                )
                                                            }
                                                            className="cursor-pointer text-sm font-semibold text-[#172B45] underline underline-offset-4"
                                                        >
                                                            Pulihkan
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCleanError("");
                                                                setTarget({
                                                                    id: row.respondent_id,
                                                                    reason: "",
                                                                });
                                                            }}
                                                            className="cursor-pointer text-sm font-semibold text-red-700 underline underline-offset-4"
                                                        >
                                                            Keluarkan
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-5">
                            <h2 className="mb-4 text-sm font-semibold text-slate-900">
                                Cleaning Log ({log.length})
                            </h2>

                            {log.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    Belum ada perubahan manual.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[640px] text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                                <th className="py-2 pr-3 font-semibold">Waktu</th>
                                                <th className="py-2 pr-3 font-semibold">ID</th>
                                                <th className="py-2 pr-3 font-semibold">Aksi</th>
                                                <th className="py-2 font-semibold">Alasan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...log].reverse().map((entry) => (
                                                <tr key={entry.id} className="border-b border-slate-100">
                                                    <td className="py-2 pr-3 text-xs text-slate-500">
                                                        {new Date(entry.created_at).toLocaleString("id-ID")}
                                                    </td>
                                                    <td className="py-2 pr-3 font-mono text-xs">
                                                        {entry.respondent_id}
                                                    </td>
                                                    <td className="py-2 pr-3">
                                                        {entry.action === "exclude" ? "Keluarkan" : "Pulihkan"}
                                                    </td>
                                                    <td className="py-2 text-slate-600">{entry.reason}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {tab === "laporan" && (
                    <div className="space-y-6">
                        <section className="rounded-xl border border-slate-200 bg-white p-5 print:hidden">
                            <h2 className="mb-1 text-sm font-semibold text-slate-900">
                                Ekspor Data
                            </h2>
                            <p className="mb-4 text-xs text-slate-500">
                                Nama file mengikuti kode A03 sesuai struktur folder petunjuk.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => downloadCsv("A03_RawData.csv", rawRows)}
                                    className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    A03_RawData.csv
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        downloadCsv("A03_CleanData.csv", validRows.map(flattenScored))
                                    }
                                    disabled={!keyReady}
                                    className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    A03_CleanData.csv
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        downloadCsv("A03_ScoredAllCases.csv", rows.map(flattenScored))
                                    }
                                    disabled={!keyReady}
                                    className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    A03_ScoredAllCases.csv
                                </button>

                                <button
                                    type="button"
                                    onClick={() => downloadCsv("A03_CleaningLog.csv", log)}
                                    disabled={log.length === 0}
                                    className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    A03_CleaningLog.csv
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!analysis) return;

                                        downloadCsv(
                                            "A03_AnalysisSummary.csv",
                                            DescriptiveRows(analysis).map(({ label, desc }) => ({
                                                variabel: label,
                                                n: desc.n,
                                                mean: desc.mean,
                                                median: desc.median,
                                                sd: desc.sd,
                                                min: desc.min,
                                                max: desc.max,
                                            }))
                                        );
                                    }}
                                    disabled={!analysis}
                                    className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    A03_AnalysisSummary.csv
                                </button>

                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    disabled={!analysis}
                                    className="cursor-pointer rounded-md bg-[#172B45] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    Cetak / Simpan Laporan PDF
                                </button>
                            </div>
                        </section>

                        {analysis && (
                            <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 print:border-0 print:p-0">
                                <header>
                                    <h2 className="text-xl font-semibold text-[#172B45]">
                                        Laporan Analisis Kelompok A03
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Efektivitas Microlearning terhadap Kemampuan Mendeteksi
                                        Phishing dan Social Engineering
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Dibuat: {new Date(data.generatedAt).toLocaleString("id-ID")}
                                    </p>
                                </header>

                                <section>
                                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                        1. Karakteristik Data
                                    </h3>
                                    <p className="text-sm leading-6 text-slate-600">
                                        Total responden tercatat {rows.length}. Responden valid
                                        untuk analisis (clean data) {validRows.length}, dikecualikan{" "}
                                        {excludedRows.length}. Analisis pre–post memakai{" "}
                                        {analysis.n} responden dengan data lengkap.
                                    </p>

                                    {excludedRows.length > 0 && (
                                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                                            {excludedRows.map((row) => (
                                                <li key={row.respondent_id}>
                                                    {row.respondent_id}: {row.exclusion_reason}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>

                                <section>
                                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                        2. Statistik Deskriptif
                                    </h3>
                                    <DescTable rows={DescriptiveRows(analysis)} />
                                    <p className="mt-2 text-sm text-slate-600">
                                        Meningkat: {analysis.improvedCount}, tetap:{" "}
                                        {analysis.sameCount}, menurun: {analysis.declinedCount}.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                        3. Uji Statistik
                                    </h3>
                                    <TestTable analysis={analysis} />
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {interpret(analysis)}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                        4. Kategori Ancaman (RQ3)
                                    </h3>

                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                                <th className="py-2 pr-3 font-semibold">Kategori</th>
                                                <th className="py-2 pr-3 font-semibold">Benar pre</th>
                                                <th className="py-2 font-semibold">Benar post</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysis.categories.map((category) => (
                                                <tr key={category.category} className="border-b border-slate-100">
                                                    <td className="py-2 pr-3">{category.category}</td>
                                                    <td className="py-2 pr-3 tabular-nums">
                                                        {category.preCorrectRate === null
                                                            ? "–"
                                                            : `${(category.preCorrectRate * 100).toFixed(0)}%`}
                                                    </td>
                                                    <td className="py-2 tabular-nums">
                                                        {category.postCorrectRate === null
                                                            ? "–"
                                                            : `${(category.postCorrectRate * 100).toFixed(0)}%`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>

                                <section>
                                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                        5. Catatan Keterbatasan
                                    </h3>
                                    <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                                        <li>Post-test diberikan segera setelah intervensi (immediate post-test).</li>
                                        <li>Tidak ada kelompok kontrol sehingga sebab-akibat tidak dapat disimpulkan.</li>
                                        <li>Treatment dibuat mahasiswa dan jumlah responden terbatas.</li>
                                    </ul>
                                </section>
                            </article>
                        )}
                    </div>
                )}
            </div>

            {target && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                    onClick={() => setTarget(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-semibold text-[#172B45]">
                            Keluarkan dari clean data
                        </h2>

                        <p className="mt-1 font-mono text-xs text-slate-500">{target.id}</p>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Data mentah tidak dihapus. Alasan akan dicatat di cleaning log.
                        </p>

                        <textarea
                            value={target.reason}
                            onChange={(event) =>
                                setTarget({ ...target, reason: event.target.value })
                            }
                            rows={3}
                            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#172B45]"
                            placeholder="Alasan eksklusi (misalnya: ikut treatment kelompok lain)"
                        />

                        {cleanError && (
                            <p className="mt-2 text-sm text-red-600">{cleanError}</p>
                        )}

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setTarget(null)}
                                className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={() => handleClean(target.id, "exclude", target.reason)}
                                className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                            >
                                Keluarkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}