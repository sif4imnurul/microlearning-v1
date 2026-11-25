"use client";

import { useRef, useState } from "react";
import GmailSimulator from "@/components/microlearning/simulators/GmailSimulator";
import type { UnitProps } from "@/components/microlearning/UnitParts";

type Decision = "trusted" | "suspicious" | null;
type AnatomyKey = "displayName" | "emailAddress" | "domain";

type ActionNotice = {
    tone: "caution" | "positive";
    message: string;
};

const ANATOMY_PARTS: Array<{
    key: AnatomyKey;
    label: string;
    detail: string;
    blockBg: string;
    activeRing: string;
    labelColor: string;
}> = [
    {
        key: "displayName",
        label: "Nama tampilan",
        detail: "Bisa ditulis siapa saja, belum membuktikan apa pun.",
        blockBg: "bg-[#FEF6E7]",
        activeRing: "ring-1.5 ring-[#8A4B08]",
        labelColor: "text-[#8A4B08]",
    },
    {
        key: "emailAddress",
        label: "Alamat email",
        detail: "Baca lengkap, terutama bagian di belakang tanda @.",
        blockBg: "bg-[#EDF2F7]",
        activeRing: "ring-1.5 ring-[#172B45]",
        labelColor: "text-[#172B45]",
    },
    {
        key: "domain",
        label: "Domain",
        detail: "Bandingkan dengan domain resmi yang Anda kenal.",
        blockBg: "bg-[#FDF1EE]",
        activeRing: "ring-1.5 ring-[#A62D14]",
        labelColor: "text-[#A62D14]",
    },
];

const SAFE_ACTIONS = [
    "Lihat alamat lengkap dan domainnya, bukan hanya nama pengirim.",
    "Bandingkan dengan alamat resmi yang Anda ketahui dari kanal resmi.",
    "Jika berbeda atau ragu, jangan klik dan jangan balas dulu.",
];

export default function Unit1({
    seconds,
    isSaving,
    isTimeLocked,
    errorMessage,
    onFinish,
}: UnitProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [decision, setDecision] = useState<Decision>(null);
    const [actionNotice, setActionNotice] = useState<ActionNotice | null>(null);
    const [activeAnatomy, setActiveAnatomy] = useState<AnatomyKey>("domain");
    const [showScenario, setShowScenario] = useState(false);
    const revealRef = useRef<HTMLDivElement | null>(null);

    const isRevealed = decision !== null;
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");

    function handleDecision(choice: Exclude<Decision, null>) {
        setDecision(choice);
        setDetailsOpen(true);
        setActionNotice(null);

        window.requestAnimationFrame(() => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            revealRef.current?.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "nearest",
            });
        });
    }

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        setActionNotice({
            tone: "caution",
            message:
                action === "Balas"
                    ? "Tahan dulu. Jika alamat pengirim berbeda atau ragu, jangan balas sebelum dipastikan lewat kanal resmi."
                    : "Tahan dulu. Jangan teruskan email mencurigakan sebelum keaslian pengirimnya dipastikan.",
        });
    }

    function handleReportSpam() {
        setActionNotice({
            tone: "positive",
            message:
                "Langkah aman. Prosedur lengkap pelaporan dibahas di Unit 6.",
        });
    }

    function handleDeleteEmail() {
        setActionNotice({
            tone: "positive",
            message:
                "Menghapus email aman bagi akun Anda, tetapi melaporkannya lewat spam membantu memblokir pengirimnya.",
        });
    }

    function handleClickEmailCta(target: "cta" | "help") {
        setDetailsOpen(true);
        setActionNotice({
            tone: "caution",
            message:
                target === "cta"
                    ? "Hati-hati. Tombol ini berasal dari pengirim banknusantara-notifikasi.com, bukan domain resmi banknusantara.co.id. Periksa detail pengirim di atas sebelum mengeklik tautan apa pun."
                    : "Tahan dulu. Jangan membuka tautan bantuan dari dalam email yang pengirimnya belum pasti. Buka aplikasi atau situs resmi banknusantara.co.id secara langsung.",
        });
    }

    return (
        <article className="mx-auto w-full max-w-[780px] text-[#1C2430]">
            {/* Briefing Header Band */}
            <header className="rounded-2xl bg-[#172B45] px-5 py-5 text-white sm:px-7 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-start gap-4">
                        <span
                            className="hidden font-mono text-4xl font-semibold leading-none tracking-tight text-[#D8E2EE]/45 select-none sm:inline-block"
                            aria-hidden="true"
                        >
                            01
                        </span>
                        <div className="max-w-[52ch]">
                            <p className="text-xs font-medium text-[#D8E2EE]">
                                Pengenalan pengirim
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white text-balance sm:text-[1.75rem]">
                                Kenali Siapa Pengirimnya
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#D8E2EE] text-pretty">
                                Bedakan nama tampilan dari alamat pengirim yang
                                sebenarnya.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between border-t border-white/15 pt-3 text-xs text-[#D8E2EE] sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                        <span>Waktu membaca</span>
                        <span className="mt-0.5 font-mono text-base font-semibold tabular-nums text-white">
                            {formattedMinutes}:{formattedSeconds}
                        </span>
                    </div>
                </div>
            </header>

            {/* Initial Point of View Context */}
            {!showScenario ? (
                <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4E5A69]">
                        Konteks skenario
                    </p>
                    <h2 className="mt-2 text-lg font-semibold leading-snug text-[#172B45]">
                        Anda adalah nasabah Bank Nusantara
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#4E5A69]">
                        Anda menerima pemberitahuan tentang pembaruan layanan
                        digital bank. Domain resmi yang biasa digunakan Bank
                        Nusantara adalah{" "}
                        <strong className="font-semibold text-[#145C3A]">
                            banknusantara.co.id
                        </strong>
                        .
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => setShowScenario(true)}
                            className="min-h-12 flex-1 rounded-lg bg-[#172B45] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Sudah jelas, lanjut ke email
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowScenario(true)}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-5 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Saya mencurigai pesan itu
                        </button>
                    </div>
                </section>
            ) : (
                <section className="mt-6" aria-label="Simulasi email masuk">
                    <GmailSimulator
                        subject="Pemberitahuan layanan"
                        senderName="Bank Nusantara Care"
                        senderEmail="cs@banknusantara-notifikasi.com"
                        senderInitials="BN"
                        senderAvatarColor="#1A56DB"
                        timestamp="10.14 (5 menit lalu)"
                        details={{
                            fromName: "Bank Nusantara Care",
                            fromEmail: "cs@banknusantara-notifikasi.com",
                            toEmail: "anda@gmail.com",
                            dateLabel: "Hari ini, 10.14 WIB",
                            subject: "Pemberitahuan layanan",
                            mailedBy: "banknusantara-notifikasi.com",
                            securityLabel: "Enkripsi standar (TLS)",
                        }}
                        detailsOpen={detailsOpen}
                        onToggleDetails={() => setDetailsOpen((prev) => !prev)}
                        onCloseDetails={() => setDetailsOpen(false)}
                        revealAnnotations={isRevealed}
                        suspiciousPart="-notifikasi.com"
                        onReplyClick={() => handleAttemptEmailAction("Balas")}
                        onForwardClick={() => handleAttemptEmailAction("Teruskan")}
                        onReportSpamClick={handleReportSpam}
                        onDeleteClick={handleDeleteEmail}
                        actionFeedback={
                            actionNotice ? (
                                <div
                                    role="status"
                                    className={`animate-reveal-in flex items-start justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-xs leading-relaxed ${
                                        actionNotice.tone === "positive"
                                            ? "border-[#B9DFC8] bg-[#ECF7F1] text-[#145C3A]"
                                            : "border-[#E6C88C] bg-[#FEF6E7] text-[#8A4B08]"
                                    }`}
                                >
                                    <p>{actionNotice.message}</p>
                                    <button
                                        type="button"
                                        onClick={() => setActionNotice(null)}
                                        aria-label="Tutup pesan"
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#172B45]"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : null
                        }
                    >
                        {/* Realistic Bank Email Inner Card */}
                        <div className="rounded-lg border border-[#E6E8EC] bg-[#FAFBFC] p-4 sm:p-5">
                            <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-3">
                                <span className="text-sm font-bold tracking-tight text-[#1A56DB]">
                                    Bank Nusantara
                                </span>
                                <span className="text-xs text-[#5E5E5E]">
                                    Info Layanan Digital
                                </span>
                            </div>

                            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#222222]">
                                <p>Yth. Nasabah,</p>
                                <p>
                                    Terdapat pembaruan layanan pada akun Anda
                                    terkait penyesuaian sistem keamanan dan fitur
                                    transaksi digital yang berlaku mulai bulan ini.
                                </p>
                                <p>
                                    Untuk memastikan layanan mobile banking dan
                                    notifikasi transaksi tetap berjalan normal,
                                    silakan tinjau detail pembaruan melalui tombol
                                    di bawah ini:
                                </p>

                                <div className="pt-1 pb-2">
                                    <button
                                        type="button"
                                        onClick={() => handleClickEmailCta("cta")}
                                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#1A56DB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1545B5] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                                    >
                                        Tinjau Pembaruan Layanan
                                    </button>
                                </div>

                                <p className="text-xs leading-relaxed text-[#5E5E5E]">
                                    Jika membutuhkan bantuan, kunjungi{" "}
                                    <button
                                        type="button"
                                        onClick={() => handleClickEmailCta("help")}
                                        className="font-medium text-[#1A56DB] underline underline-offset-2 hover:text-[#1545B5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                                    >
                                        Pusat Bantuan Bank Nusantara
                                    </button>
                                    .
                                </p>

                                <div className="border-t border-[#E6E8EC] pt-3 text-xs leading-relaxed text-[#5E5E5E]">
                                    <p className="font-medium text-[#333333]">
                                        Hormat kami,
                                        <br />
                                        Layanan Nasabah Bank Nusantara
                                    </p>
                                    <p className="mt-2">
                                        Email ini dikirim secara otomatis. Mohon
                                        tidak membalas langsung ke alamat ini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GmailSimulator>

                    <p className="mt-2.5 text-xs text-[#4E5A69]">
                        Simulasi latihan. Nama layanan dan alamat di atas hanya
                        rekaan.
                    </p>
                </section>
            )}

            {/* Interactive Decision Prompt */}
            {!isRevealed && showScenario && (
                <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white px-5 py-5 sm:px-6">
                    <p className="text-base font-semibold leading-snug text-[#172B45] text-balance">
                        Email ini tertulis dari Bank Nusantara Care. Apakah
                        pengirimnya sudah pasti resmi?
                    </p>
                    <p className="mt-1 text-xs text-[#4E5A69]">
                        Klik{" "}
                        <strong className="font-semibold text-[#1C2430]">
                            kepada saya ▾
                        </strong>{" "}
                        atau{" "}
                        <strong className="font-semibold text-[#1C2430]">
                            Detail header
                        </strong>{" "}
                        untuk mengecek pengirim sebelum memilih.
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleDecision("trusted")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Ya, terlihat resmi
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDecision("suspicious")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Belum tentu, perlu dicurigai
                        </button>
                    </div>
                </section>
            )}

            {/* Post-Decision Reveal: Concise, Zero Repetition */}
            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-7 space-y-7"
                >
                    {/* Section A: Tight Email Breakdown + Domain Diff */}
                    <section className="rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                        <div className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    decision === "suspicious"
                                        ? "bg-[#ECF7F1] text-[#145C3A]"
                                        : "bg-[#FEF6E7] text-[#8A4B08]"
                                }`}
                                aria-hidden="true"
                            >
                                {decision === "suspicious" ? "✓" : "!"}
                            </span>
                            <p
                                className={`text-sm font-semibold leading-snug sm:text-base ${
                                    decision === "suspicious"
                                        ? "text-[#145C3A]"
                                        : "text-[#8A4B08]"
                                }`}
                            >
                                {decision === "suspicious"
                                    ? "Tepat. Nama tampilan belum membuktikan pengirimnya resmi."
                                    : "Sekilas meyakinkan, tetapi domain pengirimnya berbeda dari yang resmi."}
                            </p>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            <div className="rounded-lg bg-[#ECF7F1] px-4 py-3">
                                <p className="text-xs font-medium text-[#145C3A]">
                                    Domain resmi
                                </p>
                                <p className="mt-1 font-mono text-sm font-semibold text-[#145C3A]">
                                    banknusantara.co.id
                                </p>
                            </div>

                            <div className="rounded-lg bg-[#FDF1EE] px-4 py-3">
                                <p className="text-xs font-medium text-[#A62D14]">
                                    Alamat pada email ini
                                </p>
                                <p className="mt-1 break-all font-mono text-sm text-[#1C2430]">
                                    cs@banknusantara
                                    <span className="whitespace-nowrap rounded bg-[#F8DCD5] px-1 font-bold text-[#A62D14]">
                                        -notifikasi.com
                                    </span>
                                </p>
                            </div>
                        </div>

                        <p className="mt-3.5 text-sm leading-relaxed text-[#4E5A69] text-pretty">
                            <strong className="font-semibold text-[#1C2430]">
                                Nama tampilan bisa dipalsukan.
                            </strong>{" "}
                            Domain palsu sering dibuat mirip dengan menambah
                            kata, mengganti huruf, atau memakai ekstensi lain.
                        </p>
                    </section>

                    {/* Section B: Unified 3-Part Sender Anatomy with Clear Subtle Blocks */}
                    <section className="px-1">
                        <h2 className="text-base font-semibold text-[#172B45]">
                            Tiga bagian pengirim yang perlu dibedakan
                        </h2>

                        {/* Unified Single Sender Line */}
                        <div className="mt-3 rounded-xl border border-[#DDD9CF] bg-white p-4">
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
                                <span className="mr-1 text-xs font-medium text-[#4E5A69]">
                                    Dari:
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveAnatomy("displayName")
                                    }
                                    aria-pressed={
                                        activeAnatomy === "displayName"
                                    }
                                    className={`min-h-8 rounded-md bg-[#FEF6E7] px-2 py-1 font-semibold text-[#8A4B08] transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                        activeAnatomy === "displayName"
                                            ? "ring-1.5 ring-[#8A4B08]"
                                            : "hover:ring-1 hover:ring-[#E6C88C]"
                                    }`}
                                >
                                    Bank Nusantara Care
                                </button>

                                <div
                                    className={`inline-flex flex-wrap items-center rounded-md bg-[#EDF2F7] px-1.5 py-0.5 font-mono text-xs transition-all sm:text-sm ${
                                        activeAnatomy === "emailAddress"
                                            ? "ring-1.5 ring-[#172B45]"
                                            : ""
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveAnatomy("emailAddress")
                                        }
                                        className="min-h-8 rounded px-1 text-[#172B45] focus-visible:outline-2 focus-visible:outline-[#172B45]"
                                    >
                                        &lt;cs@
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveAnatomy("domain")
                                        }
                                        aria-pressed={
                                            activeAnatomy === "domain"
                                        }
                                        className={`min-h-8 rounded bg-[#FDF1EE] px-1.5 font-semibold text-[#A62D14] transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#172B45] ${
                                            activeAnatomy === "domain"
                                                ? "ring-1.5 ring-[#A62D14]"
                                                : "hover:ring-1 hover:ring-[#E8B7AC]"
                                        }`}
                                    >
                                        banknusantara-notifikasi.com
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveAnatomy("emailAddress")
                                        }
                                        className="min-h-8 rounded px-1 text-[#172B45] focus-visible:outline-2 focus-visible:outline-[#172B45]"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>

                            {/* 3 Clear Subtle Blocks Right Underneath */}
                            <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                {ANATOMY_PARTS.map((part, idx) => {
                                    const isActive = activeAnatomy === part.key;
                                    return (
                                        <button
                                            key={part.key}
                                            type="button"
                                            onClick={() =>
                                                setActiveAnatomy(part.key)
                                            }
                                            aria-pressed={isActive}
                                            className={`min-h-11 rounded-lg px-3.5 py-3 text-left transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                                part.blockBg
                                            } ${
                                                isActive
                                                    ? part.activeRing
                                                    : "opacity-85 hover:opacity-100"
                                            }`}
                                        >
                                            <p
                                                className={`text-xs font-semibold ${part.labelColor}`}
                                            >
                                                {idx + 1}. {part.label}
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed text-[#4E5A69]">
                                                {part.detail}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Section C: Concise Safe Action Checklist */}
                    <section className="grid grid-cols-1 gap-4 px-1 sm:grid-cols-12">
                        <div className="sm:col-span-5">
                            <p className="text-xs font-semibold text-[#145C3A]">
                                Tindakan aman
                            </p>
                            <h2 className="mt-1 text-base font-semibold leading-snug text-[#172B45] text-balance">
                                Baca alamat lengkapnya, lalu bandingkan
                            </h2>
                            <p className="mt-2 text-xs leading-relaxed text-[#4E5A69]">
                                Pemeriksaan ini untuk memastikan, bukan untuk
                                mencurigai semua pesan.
                            </p>
                        </div>

                        <ol className="divide-y divide-[#DDD9CF] border-y border-[#DDD9CF] sm:col-span-7">
                            {SAFE_ACTIONS.map((text, idx) => (
                                <li
                                    key={text}
                                    className="flex items-start gap-3 py-3 text-sm leading-relaxed text-[#1C2430]"
                                >
                                    <span className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-[#145C3A]">
                                        0{idx + 1}
                                    </span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>
            )}

            {/* Footer Action Bar */}
            <footer className="mt-8 flex flex-col gap-4 border-t border-[#DDD9CF] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#4E5A69]">
                    Berikutnya:{" "}
                    <span className="font-semibold text-[#1C2430]">
                        Unit 2, Jangan mudah terpancing
                    </span>
                </p>

                <button
                    type="button"
                    onClick={onFinish}
                    disabled={!isRevealed || isSaving || isTimeLocked}
                    className="min-h-12 w-full rounded-lg bg-[#172B45] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] disabled:bg-[#E6E2D8] disabled:text-[#4E5A69] disabled:active:scale-100 sm:w-auto sm:min-w-48"
                >
                    {isSaving
                        ? "Menyimpan..."
                        : isTimeLocked
                          ? `Tunggu ${60 - seconds} detik lagi`
                          : isRevealed
                            ? "Selesaikan Unit 1"
                            : "Jawab simulasi dulu"}
                </button>
            </footer>

            {errorMessage && (
                <p
                    role="alert"
                    className="mt-4 rounded-lg border border-[#E8B7AC] bg-[#FDF1EE] px-4 py-3 text-sm leading-6 text-[#A62D14]"
                >
                    {errorMessage}
                </p>
            )}
        </article>
    );
}