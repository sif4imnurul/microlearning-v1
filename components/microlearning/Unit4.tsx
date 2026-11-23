"use client";

import { useRef, useState } from "react";
import GmailSimulator from "@/components/microlearning/simulators/GmailSimulator";
import WhatsAppSimulator from "@/components/microlearning/simulators/WhatsAppSimulator";
import type { UnitProps } from "@/components/microlearning/UnitParts";

type ScenarioTab = "email" | "whatsapp";
type Decision = "open_first" | "verify_first" | null;

type ActionNotice = {
    tone: "caution" | "positive";
    message: string;
};

const RISKS = [
    {
        type: "File lampiran",
        risk: "Dapat berisi program yang merugikan saat dibuka.",
    },
    {
        type: "Kode QR",
        risk: "Alamat tujuan tersembunyi sampai dipindai.",
    },
];

const SAFE_ACTIONS = [
    "Tanyakan pada diri sendiri: apakah saya menunggu kiriman ini?",
    "Konfirmasi lewat kontak resmi pengirim atau pemilik tempat yang Anda kenal, bukan lewat kontak di dalam pesan.",
    "Buka atau pindai hanya setelah Anda yakin asal dan tujuannya.",
];

export default function Unit4({
    seconds,
    isSaving,
    errorMessage,
    onFinish,
}: UnitProps) {
    const [activeTab, setActiveTab] = useState<ScenarioTab>("email");
    const [visitedEmail, setVisitedEmail] = useState(true);
    const [visitedWhatsapp, setVisitedWhatsapp] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [attachmentChecked, setAttachmentChecked] = useState(false);
    const [qrPreviewOpen, setQrPreviewOpen] = useState(false);
    const [decision, setDecision] = useState<Decision>(null);
    const [emailNotice, setEmailNotice] = useState<ActionNotice | null>(null);
    const [waNotice, setWaNotice] = useState<ActionNotice | null>(null);
    const simulatorSectionRef = useRef<HTMLElement | null>(null);
    const revealRef = useRef<HTMLDivElement | null>(null);

    const bothCasesViewed = visitedEmail && visitedWhatsapp;
    const isRevealed = bothCasesViewed && decision !== null;
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");

    function selectTab(nextTab: ScenarioTab, scrollToTop = false) {
        setActiveTab(nextTab);
        if (nextTab === "email") {
            setVisitedEmail(true);
        } else {
            setVisitedWhatsapp(true);
        }

        if (scrollToTop) {
            window.requestAnimationFrame(() => {
                const prefersReducedMotion = window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;
                simulatorSectionRef.current?.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "nearest",
                });
            });
        }
    }

    function handleDecision(choice: Exclude<Decision, null>) {
        if (!bothCasesViewed) return;

        setDecision(choice);
        setAttachmentChecked(true);
        setQrPreviewOpen(true);
        setEmailNotice(null);
        setWaNotice(null);

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

    function handleClickAttachment() {
        setAttachmentChecked((prev) => !prev);
        setEmailNotice({
            tone: "caution",
            message:
                "Tahan dulu. Akhiran file ini .exe (program), bukan dokumen PDF. Membuka lampiran tidak dikenal berisiko menjalankan program berbahaya di perangkat Anda.",
        });
    }

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        setEmailNotice({
            tone: "caution",
            message:
                action === "Balas"
                    ? "Jangan membalas email tagihan dari alamat yang tidak dikenal. Cek tagihan langsung di aplikasi resmi penyedia listrik."
                    : "Jangan meneruskan email yang membawa lampiran mencurigakan agar orang lain tidak ikut membukanya.",
        });
    }

    function handleReportSpam() {
        setEmailNotice({
            tone: "positive",
            message:
                "Langkah aman. Email dengan lampiran berekstensi ganda (.pdf.exe) layak langsung dilaporkan sebagai spam atau phishing.",
        });
    }

    function handleDeleteEmail() {
        setEmailNotice({
            tone: "positive",
            message:
                "Menghapus email menghindari lampiran terbuka tanpa sengaja.",
        });
    }

    function handleReportWaNumber() {
        setWaNotice({
            tone: "positive",
            message:
                "Langkah aman. Nomor asing yang mengirim kode QR tanpa konteks jelas sebaiknya dilaporkan dan tidak dipindai.",
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
                            04
                        </span>
                        <div className="max-w-[52ch]">
                            <p className="text-xs font-medium text-[#D8E2EE]">
                                Lampiran file dan kode QR
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white text-balance sm:text-[1.75rem]">
                                Waspadai Lampiran dan QR
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#D8E2EE] text-pretty">
                                Berhenti dan verifikasi dulu sebelum membuka
                                file atau memindai kode QR yang tidak Anda
                                harapkan.
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

            {/* Primary Focal Point: Two Realistic Scenarios (Email Attachment + WhatsApp QR) */}
            <section
                ref={simulatorSectionRef}
                className="mt-6 space-y-3"
                aria-label="Simulasi lampiran email dan kode QR WhatsApp"
            >
                {/* Scenario Switcher with Visit Status */}
                <div
                    role="tablist"
                    aria-label="Pilih simulasi kasus"
                    className="grid grid-cols-2 gap-2 rounded-xl border border-[#DDD9CF] bg-[#EFECE3] p-1.5"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "email"}
                        onClick={() => selectTab("email")}
                        className={`flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#172B45] sm:px-4 sm:text-sm ${
                            activeTab === "email"
                                ? "bg-white text-[#172B45] shadow-xs"
                                : "text-[#4E5A69] hover:text-[#1C2430]"
                        }`}
                    >
                        <span>Kasus 1: Email Lampiran</span>
                        {visitedEmail && (
                            <span
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECF7F1] text-[11px] font-bold text-[#145C3A]"
                                aria-label="Sudah dilihat"
                            >
                                ✓
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "whatsapp"}
                        onClick={() => selectTab("whatsapp")}
                        className={`flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#172B45] sm:px-4 sm:text-sm ${
                            activeTab === "whatsapp"
                                ? "bg-white text-[#172B45] shadow-xs"
                                : "text-[#4E5A69] hover:text-[#1C2430]"
                        }`}
                    >
                        <span>Kasus 2: WhatsApp QR</span>
                        {visitedWhatsapp ? (
                            <span
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECF7F1] text-[11px] font-bold text-[#145C3A]"
                                aria-label="Sudah dilihat"
                            >
                                ✓
                            </span>
                        ) : (
                            <span className="shrink-0 rounded-md bg-[#FEF6E7] px-2 py-0.5 text-[11px] font-semibold text-[#8A4B08]">
                                Belum dilihat
                            </span>
                        )}
                    </button>
                </div>

                {/* Scenario 1: Realistic Email with Double-Extension Attachment */}
                {activeTab === "email" && (
                    <GmailSimulator
                        subject="Rincian Tagihan Listrik Bulan Ini - ID 5384102991"
                        senderName="Layanan Tagihan Listrik"
                        senderEmail="billing@info-tagihan-listrik.net"
                        senderInitials="LT"
                        senderAvatarColor="#475569"
                        timestamp="08.35 (20 menit lalu)"
                        details={{
                            fromName: "Layanan Tagihan Listrik",
                            fromEmail: "billing@info-tagihan-listrik.net",
                            toEmail: "pelanggan@gmail.com",
                            dateLabel: "Hari ini, 08.35 WIB",
                            subject:
                                "Rincian Tagihan Listrik Bulan Ini - ID 5384102991",
                            mailedBy: "info-tagihan-listrik.net",
                            securityLabel: "Enkripsi standar (TLS)",
                        }}
                        detailsOpen={detailsOpen}
                        onToggleDetails={() => setDetailsOpen((prev) => !prev)}
                        onCloseDetails={() => setDetailsOpen(false)}
                        onReplyClick={() => handleAttemptEmailAction("Balas")}
                        onForwardClick={() =>
                            handleAttemptEmailAction("Teruskan")
                        }
                        onReportSpamClick={handleReportSpam}
                        onDeleteClick={handleDeleteEmail}
                        actionFeedback={
                            emailNotice ? (
                                <div
                                    role="status"
                                    className={`animate-reveal-in flex items-start justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-xs leading-relaxed ${
                                        emailNotice.tone === "positive"
                                            ? "border-[#B9DFC8] bg-[#ECF7F1] text-[#145C3A]"
                                            : "border-[#E6C88C] bg-[#FEF6E7] text-[#8A4B08]"
                                    }`}
                                >
                                    <p>{emailNotice.message}</p>
                                    <button
                                        type="button"
                                        onClick={() => setEmailNotice(null)}
                                        aria-label="Tutup pesan"
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#172B45]"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : null
                        }
                    >
                        <div className="space-y-3 text-sm leading-relaxed text-[#1F1F1F]">
                            <p>Yth. Pelanggan,</p>

                            <p>
                                Terlampir rincian pemakaian dan tagihan listrik
                                periode bulan ini. Silakan buka dokumen di bawah
                                untuk memeriksa nominal sebelum batas pembayaran
                                berakhir.
                            </p>

                            {/* Authentic Gmail-style Attachment Chip */}
                            <div className="pt-1">
                                <p className="mb-2 text-xs font-medium text-[#5E5E5E]">
                                    1 lampiran · Klik untuk memeriksa detail file
                                </p>

                                <button
                                    type="button"
                                    onClick={handleClickAttachment}
                                    aria-expanded={attachmentChecked}
                                    className={`flex w-full max-w-sm items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                        isRevealed || attachmentChecked
                                            ? "border-[#E8B7AC] bg-[#FDF1EE]"
                                            : "border-[#DADCE0] bg-[#F8F9FA] hover:border-[#172B45] hover:bg-white"
                                    }`}
                                >
                                    <span
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#A62D14] text-[11px] font-bold tracking-tight text-white"
                                        aria-hidden="true"
                                    >
                                        FILE
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block break-all font-mono text-xs font-semibold text-[#1F1F1F]">
                                            Tagihan-Listrik.pdf
                                            <span
                                                className={
                                                    isRevealed ||
                                                    attachmentChecked
                                                        ? "rounded bg-[#A62D14] px-1 py-0.5 text-white"
                                                        : ""
                                                }
                                            >
                                                .exe
                                            </span>
                                        </span>
                                        <span className="mt-0.5 block text-[11px] text-[#5F6368]">
                                            {isRevealed || attachmentChecked
                                                ? "428 KB · File program (.exe)"
                                                : "428 KB · Klik untuk memeriksa"}
                                        </span>
                                    </span>
                                </button>

                                {attachmentChecked && (
                                    <div
                                        role="status"
                                        className="animate-reveal-in mt-2.5 max-w-md rounded-lg border border-[#E8B7AC] bg-[#FDF1EE] px-3.5 py-2.5 text-xs leading-relaxed text-[#A62D14]"
                                    >
                                        <p className="font-semibold">
                                            Pemeriksaan ekstensi ganda:
                                        </p>
                                        <p className="mt-1 text-[#1C2430]">
                                            Nama{" "}
                                            <span className="font-mono font-semibold">
                                                .pdf
                                            </span>{" "}
                                            hanya penyamaran. Akhiran sebenarnya
                                            adalah{" "}
                                            <span className="font-mono font-semibold text-[#A62D14]">
                                                .exe
                                            </span>{" "}
                                            (file program yang bisa merugikan
                                            perangkat saat dibuka).
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[#ECEEF2] pt-3 text-xs leading-relaxed text-[#5E5E5E]">
                                <p className="font-semibold text-[#1F1F1F]">
                                    Administrasi Tagihan Otomatis
                                </p>
                                <p>ID Pelanggan 5384102991</p>
                            </div>
                        </div>
                    </GmailSimulator>
                )}

                {/* Scenario 2: Authentic WhatsApp Chat with Real SVG QR */}
                {activeTab === "whatsapp" && (
                    <WhatsAppSimulator
                        senderNumber="+62 813-4820-9174"
                        senderStatus="Tidak ada di kontak"
                        timestamp="14.18"
                        message="Halo, ini foto dokumentasi acara kemarin, scan QR di atas ya biar bisa langsung unduh albumnya."
                        qrPreviewOpen={qrPreviewOpen}
                        qrDestination="https://drive-akses-gratis.net/unduh-album"
                        onToggleQrPreview={() =>
                            setQrPreviewOpen((prev) => !prev)
                        }
                        onBlockOrReportClick={handleReportWaNumber}
                        highlightQr={isRevealed}
                        actionFeedback={
                            waNotice ? (
                                <div
                                    role="status"
                                    className="animate-reveal-in flex items-start justify-between gap-3 rounded-lg border border-[#B9DFC8] bg-[#ECF7F1] px-3.5 py-2.5 text-xs leading-relaxed text-[#145C3A]"
                                >
                                    <p>{waNotice.message}</p>
                                    <button
                                        type="button"
                                        onClick={() => setWaNotice(null)}
                                        aria-label="Tutup pesan"
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#172B45]"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : null
                        }
                    />
                )}

                <p className="text-xs text-[#4E5A69]">
                    Simulasi latihan. Nama layanan, nomor telepon, file, dan
                    kode QR di atas hanya rekaan.
                </p>
            </section>

            {/* Step 1 -> Step 2 Guided Progression Card (Prevents skipping Kasus 2 WhatsApp QR) */}
            {!bothCasesViewed && (
                <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#8A4B08]">
                                Langkah 1 dari 2 · Lanjut ke simulasi kedua
                            </p>
                            <p className="mt-1 text-base font-semibold leading-snug text-[#172B45] text-balance">
                                Setelah memeriksa lampiran email di atas, buka
                                Kasus 2 untuk melihat simulasi kode QR di
                                WhatsApp.
                            </p>
                            <p className="mt-1 text-xs text-[#4E5A69]">
                                Pertanyaan simulasi akan terbuka setelah Anda
                                melihat kedua kasus.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => selectTab("whatsapp", true)}
                            className="min-h-12 shrink-0 rounded-lg bg-[#172B45] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Lanjut ke Kasus 2: WhatsApp QR
                        </button>
                    </div>
                </section>
            )}

            {/* Equal-Weight Decision Prompt (Unlocked after viewing both Email & WhatsApp QR cases) */}
            {bothCasesViewed && !isRevealed && (
                <section className="animate-reveal-in mt-6 rounded-xl border border-[#DDD9CF] bg-white px-5 py-5 sm:px-6">
                    <p className="text-xs font-semibold text-[#145C3A]">
                        Langkah 2 dari 2 · Kedua kasus sudah dilihat
                    </p>
                    <p className="mt-1 text-base font-semibold leading-snug text-[#172B45] text-balance">
                        Anda tidak sedang menunggu kiriman tagihan pada Kasus 1
                        maupun foto acara dari nomor asing pada Kasus 2. Apa
                        langkah paling aman?
                    </p>
                    <p className="mt-1 text-xs text-[#4E5A69]">
                        Anda masih dapat berpindah antara tab Kasus 1 dan Kasus
                        2 di atas sebelum memilih jawaban.
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleDecision("open_first")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Buka lampiran dan pindai QR dulu untuk mengecek isi
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDecision("verify_first")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Jangan buka lampiran dan jangan pindai QR dulu
                        </button>
                    </div>
                </section>
            )}

            {/* Post-Decision Reveal */}
            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-7 space-y-7"
                >
                    {/* Section A: Unified 2-Case Red Flag Strip (Clickable to switch between Kasus 1 & Kasus 2) */}
                    <section className="rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                        <div className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    decision === "verify_first"
                                        ? "bg-[#ECF7F1] text-[#145C3A]"
                                        : "bg-[#FEF6E7] text-[#8A4B08]"
                                }`}
                                aria-hidden="true"
                            >
                                {decision === "verify_first" ? "✓" : "!"}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-semibold leading-snug sm:text-base ${
                                        decision === "verify_first"
                                            ? "text-[#145C3A]"
                                            : "text-[#8A4B08]"
                                    }`}
                                >
                                    {decision === "verify_first"
                                        ? "Tepat. Verifikasi dulu sebelum membuka lampiran atau memindai QR."
                                        : "Membuka file atau memindai QR lebih dulu justru memberi celah bagi program berbahaya atau tautan jebakan."}
                                </p>
                                <p className="mt-1 text-xs text-[#4E5A69]">
                                    Klik salah satu blok di bawah untuk
                                    menampilkan kembali simulasi terkait di
                                    atas:
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-[#DDD9CF]">
                            <div className="grid grid-cols-1 divide-y divide-[#DDD9CF] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                <button
                                    type="button"
                                    onClick={() => selectTab("email")}
                                    aria-pressed={activeTab === "email"}
                                    className={`bg-[#FDF1EE] px-4 py-3.5 text-left transition-opacity focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#172B45] ${
                                        activeTab === "email"
                                            ? "opacity-100"
                                            : "opacity-85 hover:opacity-100"
                                    }`}
                                >
                                    <p className="text-[11px] font-semibold text-[#A62D14]">
                                        1. Lampiran tidak ditunggu (Kasus 1)
                                    </p>
                                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#1C2430]">
                                        Tagihan-Listrik.pdf
                                        <span className="text-[#A62D14]">
                                            .exe
                                        </span>
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                        Anda tidak sedang menunggu tagihan ini,
                                        dan nama serta ekstensi ganda filenya
                                        janggal.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => selectTab("whatsapp")}
                                    aria-pressed={activeTab === "whatsapp"}
                                    className={`bg-[#FEF6E7] px-4 py-3.5 text-left transition-opacity focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#172B45] ${
                                        activeTab === "whatsapp"
                                            ? "opacity-100"
                                            : "opacity-85 hover:opacity-100"
                                    }`}
                                >
                                    <p className="text-[11px] font-semibold text-[#8A4B08]">
                                        2. QR dari pengirim tak dikenal (Kasus 2)
                                    </p>
                                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#1C2430]">
                                        drive-akses-gratis.net
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                        Tidak ada kejelasan asal pengirim, dan
                                        tujuan QR tersembunyi sampai dipindai.
                                    </p>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Section B: Core Concept & Risk Comparison */}
                    <section className="px-1">
                        <h2 className="text-lg font-semibold leading-snug text-[#172B45] text-balance">
                            File atau QR yang tidak diharapkan harus
                            diverifikasi sebelum dibuka atau dipindai.
                        </h2>
                        <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-[#4E5A69] text-pretty">
                            Pertanyaan pertamanya:{" "}
                            <span className="font-semibold text-[#1C2430]">
                                apakah saya memang menunggu kiriman ini?
                            </span>{" "}
                            Jika tidak, perlakukan dengan hati-hati. Dua media
                            yang sering dipakai:
                        </p>

                        <dl className="mt-4 divide-y divide-[#DDD9CF] border-y border-[#DDD9CF]">
                            {RISKS.map((item) => (
                                <div
                                    key={item.type}
                                    className="grid grid-cols-1 gap-1 py-2.5 text-sm sm:grid-cols-[11rem_1fr] sm:gap-4"
                                >
                                    <dt className="font-semibold text-[#172B45]">
                                        {item.type}
                                    </dt>
                                    <dd className="text-[#4E5A69]">
                                        {item.risk}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    {/* Section C: Concise Safe Actions */}
                    <section className="grid grid-cols-1 gap-4 px-1 sm:grid-cols-12">
                        <div className="sm:col-span-5">
                            <p className="text-xs font-semibold text-[#145C3A]">
                                Tindakan aman
                            </p>
                            <h2 className="mt-1 text-base font-semibold leading-snug text-[#172B45] text-balance">
                                Belum yakin? Jangan buka, jangan pindai
                            </h2>
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
                        Unit 5, Kode rahasia dan MFA
                    </span>
                </p>

                <button
                    type="button"
                    onClick={onFinish}
                    disabled={!bothCasesViewed || !isRevealed || isSaving}
                    className="min-h-12 w-full rounded-lg bg-[#172B45] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] disabled:bg-[#E6E2D8] disabled:text-[#4E5A69] disabled:active:scale-100 sm:w-auto sm:min-w-48"
                >
                    {isSaving
                        ? "Menyimpan..."
                        : !bothCasesViewed
                          ? "Lihat Kasus 2 (QR) dulu"
                          : isRevealed
                            ? "Selesaikan Unit 4"
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