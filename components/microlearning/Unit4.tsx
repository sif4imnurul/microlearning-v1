"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import GmailSimulator from "@/components/microlearning/simulators/GmailSimulator";
import WhatsAppSimulator from "@/components/microlearning/simulators/WhatsAppSimulator";
import {
    ActionNoticeToast,
    CheckIcon,
    DecisionPromptSection,
    PostDecisionStepper,
    SafeActionList,
    ScenarioBriefingStrip,
    StageHeader,
    UnitFooterBar,
    UnitHeaderBand,
    type SimulationNotice,
    type UnitProps,
} from "@/components/microlearning/UnitParts";

type ScenarioTab = "email" | "whatsapp";
type Decision = "open_first" | "verify_first" | null;

const RISKS = [
    {
        type: "Lampiran file (.exe, .zip, .xlsm)",
        risk: "Dapat menjalankan program berbahaya atau kode macro tersembunyi segera setelah dibuka atau diaktifkan.",
    },
    {
        type: "Kode QR (digital maupun stiker fisik)",
        risk: "Alamat tujuan tersembunyi sampai dipindai. Stiker QR palsu bahkan sering ditempel menutupi QR asli di tempat umum.",
    },
];

const SAFE_ACTIONS = [
    "Tanyakan dulu: apakah saya memang menunggu file atau QR ini dari pengirimnya?",
    "Jangan membuka lampiran tak dikenal dan jangan mengaktifkan macro (Enable Content) pada dokumen yang tidak Anda harapkan.",
    "Verifikasi sumber ke pengirim atau staf tempat lebih dulu, dan hentikan segera jika hasil pindai QR mengarah ke halaman login akun pribadi.",
];

export default function Unit4({
    seconds,
    isSaving,
    isTimeLocked,
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
    const [actionNotice, setActionNotice] = useState<SimulationNotice | null>(
        null
    );
    const noticeIdRef = useRef(0);
    const emailTabRef = useRef<HTMLButtonElement | null>(null);
    const waTabRef = useRef<HTMLButtonElement | null>(null);
    const simulatorSectionRef = useRef<HTMLElement | null>(null);
    const revealRef = useRef<HTMLDivElement | null>(null);

    const bothCasesViewed = visitedEmail && visitedWhatsapp;
    const isRevealed = bothCasesViewed && decision !== null;

    function showNotice(
        tone: SimulationNotice["tone"],
        message: string,
        title?: string
    ) {
        noticeIdRef.current += 1;
        setActionNotice({ id: noticeIdRef.current, tone, title, message });
    }

    function selectTab(nextTab: ScenarioTab, scrollToTop = false) {
        setActiveTab(nextTab);
        setActionNotice(null);
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
                    block: "start",
                });
            });
        }
    }

    function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        let nextTab: ScenarioTab | null = null;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            nextTab = activeTab === "email" ? "whatsapp" : "email";
        } else if (event.key === "Home") {
            nextTab = "email";
        } else if (event.key === "End") {
            nextTab = "whatsapp";
        }

        if (!nextTab) return;
        event.preventDefault();
        selectTab(nextTab);
        if (nextTab === "email") {
            emailTabRef.current?.focus();
        } else {
            waTabRef.current?.focus();
        }
    }

    function handleDecision(choice: Exclude<Decision, null>) {
        if (!bothCasesViewed) return;

        setDecision(choice);
        setAttachmentChecked(true);
        setQrPreviewOpen(true);
        setActionNotice(null);

        window.requestAnimationFrame(() => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            revealRef.current?.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start",
            });
        });
    }

    function handleClickAttachment() {
        setAttachmentChecked(true);
        showNotice(
            "danger",
            "Nama .pdf hanya penyamaran. Akhiran sebenarnya adalah .exe (file program). Jangan buka lampiran tak dikenal atau mengaktifkan macro pada file asing.",
            "Ekstensi ganda (.pdf.exe)"
        );
    }

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        showNotice(
            "caution",
            action === "Balas"
                ? "Jangan membalas email tagihan dari alamat yang tidak dikenal. Cek tagihan langsung di aplikasi resmi penyedia listrik."
                : "Jangan meneruskan email yang membawa lampiran mencurigakan agar orang lain tidak ikut membukanya."
        );
    }

    function handleReportSpam() {
        showNotice(
            "positive",
            "Email dengan lampiran berekstensi ganda (.pdf.exe) layak langsung dilaporkan sebagai spam atau phishing."
        );
    }

    function handleDeleteEmail() {
        showNotice(
            "positive",
            "Menghapus email menghindari lampiran terbuka tanpa sengaja."
        );
    }

    function handleReportWaNumber() {
        showNotice(
            "positive",
            "Nomor asing yang mengirim kode QR tanpa konteks jelas sebaiknya dilaporkan dan tidak dipindai."
        );
    }

    return (
        <article className="mx-auto w-full max-w-[780px] text-[#0F172A]">
            <UnitHeaderBand
                unitCode="04"
                title="Waspadai Lampiran dan QR"
                subtitle="Berhenti dan verifikasi dulu sebelum membuka file, mengaktifkan macro, atau memindai kode QR yang tidak Anda harapkan."
                seconds={seconds}
            />

            <ScenarioBriefingStrip
                roleTitle="Anda menerima kiriman file dan kode QR tak terduga"
                situation="Anda tidak sedang menunggu rincian tagihan maupun tautan foto acara dari nomor asing. Periksa Kasus 1 (Email) dan Kasus 2 (WhatsApp QR) di bawah ini sebelum menjawab."
                referenceLabel="Status kiriman Anda"
                referenceValue="Tidak sedang menunggu kiriman ini"
                referenceTone="neutral"
            />

            {/* Stage 02: Elevated Hero Simulator (2 Cases) */}
            <section
                ref={simulatorSectionRef}
                className="mt-10 scroll-mt-20 space-y-3.5"
                aria-label="Simulasi lampiran email dan kode QR WhatsApp"
            >
                <StageHeader
                    step="02"
                    label="Periksa simulasi"
                    hint="Lihat kedua kasus sebelum menjawab"
                />

                {/* Scenario Switcher with Visit Status */}
                <div
                    role="tablist"
                    aria-label="Pilih simulasi kasus"
                    className="grid grid-cols-2 gap-1.5 rounded-xl bg-border-subtle/90 p-1"
                >
                    <button
                        ref={emailTabRef}
                        id="u4-tab-email"
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "email"}
                        aria-controls="u4-panel-email"
                        tabIndex={activeTab === "email" ? 0 : -1}
                        onClick={() => selectTab("email")}
                        onKeyDown={handleTabKeyDown}
                        className={`flex min-h-11 flex-col items-start justify-center gap-0.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ink-brand sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4 sm:text-sm ${
                            activeTab === "email"
                                ? "bg-white text-ink-brand shadow-xs"
                                : "text-ink-secondary hover:bg-white/60 hover:text-ink-primary"
                        }`}
                    >
                        <span>Kasus 1: Email Lampiran</span>
                        {visitedEmail && (
                            <span
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-signal-safe"
                                aria-label="Sudah dilihat"
                            >
                                <CheckIcon className="h-3.5 w-3.5" />
                                <span>Dilihat</span>
                            </span>
                        )}
                    </button>

                    <button
                        ref={waTabRef}
                        id="u4-tab-whatsapp"
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "whatsapp"}
                        aria-controls="u4-panel-whatsapp"
                        tabIndex={activeTab === "whatsapp" ? 0 : -1}
                        onClick={() => selectTab("whatsapp")}
                        onKeyDown={handleTabKeyDown}
                        className={`flex min-h-11 flex-col items-start justify-center gap-0.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ink-brand sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4 sm:text-sm ${
                            activeTab === "whatsapp"
                                ? "bg-white text-ink-brand shadow-xs"
                                : "text-ink-secondary hover:bg-white/60 hover:text-ink-primary"
                        }`}
                    >
                        <span>Kasus 2: WhatsApp QR</span>
                        {visitedWhatsapp ? (
                            <span
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-signal-safe"
                                aria-label="Sudah dilihat"
                            >
                                <CheckIcon className="h-3.5 w-3.5" />
                                <span>Dilihat</span>
                            </span>
                        ) : (
                            <span className="shrink-0 text-[11px] font-medium text-ink-secondary">
                                Belum dilihat
                            </span>
                        )}
                    </button>
                </div>

                {/* Scenario 1: Realistic Email with Double-Extension Attachment */}
                {activeTab === "email" && (
                    <div
                        id="u4-panel-email"
                        role="tabpanel"
                        aria-labelledby="u4-tab-email"
                        className="rounded-xl shadow-[0_2px_6px_rgba(15,23,42,0.05),0_12px_28px_-10px_rgba(15,23,42,0.1)]"
                    >
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
                            onToggleDetails={() =>
                                setDetailsOpen((prev) => !prev)
                            }
                            onCloseDetails={() => setDetailsOpen(false)}
                            revealAnnotations={isRevealed}
                            suspiciousPart="info-tagihan-listrik.net"
                            onReplyClick={() =>
                                handleAttemptEmailAction("Balas")
                            }
                            onForwardClick={() =>
                                handleAttemptEmailAction("Teruskan")
                            }
                            onReportSpamClick={handleReportSpam}
                            onDeleteClick={handleDeleteEmail}
                        >
                            <div className="space-y-3.5 text-[15px] leading-relaxed text-[#1F1F1F]">
                                <p>Yth. Pelanggan,</p>

                                <p>
                                    Terlampir rincian pemakaian dan tagihan
                                    listrik periode bulan ini. Silakan buka
                                    dokumen di bawah untuk memeriksa nominal
                                    sebelum batas pembayaran berakhir.
                                </p>

                                {/* Authentic Gmail-style Attachment Chip */}
                                <div className="pt-1">
                                    <p className="mb-2 text-xs font-medium text-[#5E5E5E]">
                                        1 lampiran · Klik untuk memeriksa detail
                                        file
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleClickAttachment}
                                        aria-pressed={attachmentChecked}
                                        className={`flex min-h-14 w-full max-w-sm items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand ${
                                            isRevealed || attachmentChecked
                                                ? "border-signal-danger-border bg-signal-danger-bg"
                                                : "border-border-strong bg-surface-subtle hover:border-ink-brand hover:bg-white"
                                        }`}
                                    >
                                        <span
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tracking-tight text-white transition-colors ${
                                                isRevealed || attachmentChecked
                                                    ? "bg-signal-danger"
                                                    : "bg-[#475569]"
                                            }`}
                                            aria-hidden="true"
                                        >
                                            FILE
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-mono text-xs font-semibold text-[#1F1F1F] [overflow-wrap:anywhere]">
                                                Tagihan-Listrik.pdf
                                                <span
                                                    className={
                                                        isRevealed ||
                                                        attachmentChecked
                                                            ? "rounded-sm bg-signal-danger px-1 py-0.5 text-white"
                                                            : ""
                                                    }
                                                >
                                                    .exe
                                                </span>
                                            </span>
                                            <span
                                                className={`mt-0.5 block text-[11px] ${
                                                    isRevealed ||
                                                    attachmentChecked
                                                        ? "text-[#7A1A14]"
                                                        : "text-ink-secondary"
                                                }`}
                                            >
                                                {isRevealed || attachmentChecked
                                                    ? "428 KB · File program (.exe), bukan PDF"
                                                    : "428 KB · Klik untuk memeriksa"}
                                            </span>
                                        </span>
                                    </button>
                                </div>

                                <div className="border-t border-[#ECEEF2] pt-3 text-xs leading-relaxed text-ink-secondary">
                                    <p className="font-semibold text-[#1F1F1F]">
                                        Administrasi Tagihan Otomatis
                                    </p>
                                    <p>ID Pelanggan 5384102991</p>
                                </div>
                            </div>
                        </GmailSimulator>
                    </div>
                )}

                {/* Scenario 2: Authentic WhatsApp Chat with Real SVG QR */}
                {activeTab === "whatsapp" && (
                    <div
                        id="u4-panel-whatsapp"
                        role="tabpanel"
                        aria-labelledby="u4-tab-whatsapp"
                        className="rounded-xl shadow-[0_2px_6px_rgba(15,23,42,0.05),0_12px_28px_-10px_rgba(15,23,42,0.1)]"
                    >
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
                        />
                    </div>
                )}

                <p className="text-xs text-ink-secondary">
                    Simulasi latihan. Nama layanan, nomor telepon, file, dan
                    kode QR di atas hanya rekaan.
                </p>
            </section>

            {/* Stage 03: Guided Case 2 Unlock -> Decision Prompt -> Elevated Pembahasan */}
            {!bothCasesViewed && (
                <section className="mt-11 border-t-2 border-ink-brand pt-6">
                    <StageHeader
                        step="03"
                        label="Lanjut ke kasus 2"
                        hint="1 dari 2 kasus selesai dilihat"
                    />
                    <div className="mt-3.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold leading-snug text-ink-brand text-balance">
                                Buka Kasus 2 untuk melihat simulasi kode QR di
                                WhatsApp.
                            </h2>
                            <p className="mt-1 text-sm text-ink-secondary">
                                Pertanyaan simulasi terbuka otomatis setelah
                                Anda melihat kedua kasus.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => selectTab("whatsapp", true)}
                            className="min-h-12 shrink-0 rounded-xl bg-ink-brand px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand"
                        >
                            Lanjut ke Kasus 2: WhatsApp QR
                        </button>
                    </div>
                </section>
            )}

            {bothCasesViewed && !isRevealed && (
                <DecisionPromptSection
                    question="Anda tidak sedang menunggu kiriman tagihan pada Kasus 1 maupun foto acara dari nomor asing pada Kasus 2. Apa langkah paling aman?"
                    helper="Kedua kasus sudah dilihat. Anda masih bisa berpindah antara tab Kasus 1 dan Kasus 2 di atas sebelum memilih."
                    optionA="Buka lampiran dan pindai QR dulu untuk mengecek isi"
                    optionB="Jangan buka lampiran dan jangan pindai QR dulu"
                    onSelectA={() => handleDecision("open_first")}
                    onSelectB={() => handleDecision("verify_first")}
                />
            )}

            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-11 scroll-mt-20"
                >
                    <PostDecisionStepper
                        isCorrect={decision === "verify_first"}
                        verdictTitle={
                            decision === "verify_first"
                                ? "Tepat. Verifikasi dulu sebelum membuka lampiran atau memindai QR."
                                : "Membuka file atau memindai QR lebih dulu justru memberi celah bagi program berbahaya atau tautan jebakan."
                        }
                        verdictSubtitle="Bandingkan ciri kiriman berbahaya dan aman dari kedua kasus di bawah ini."
                        step1Label="1. Berbahaya vs Aman"
                        step2Label="2. Inti & Langkah Aman"
                        step1Content={
                            <div className="grid grid-cols-1 divide-y divide-border-subtle md:grid-cols-2 md:divide-x md:divide-y-0">
                                <div className="border-t-[3px] border-t-signal-danger bg-white p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-danger">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-danger"
                                            aria-hidden="true"
                                        />
                                        Wajib dihentikan
                                    </p>
                                    <ul className="mt-4 list-disc space-y-2.5 pl-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <li>
                                            <strong className="font-semibold text-ink-primary">
                                                Kasus 1 (lampiran):
                                            </strong>{" "}
                                            <span className="font-mono text-sm font-semibold text-ink-primary">
                                                Tagihan-Listrik.pdf
                                                <span className="text-signal-danger">
                                                    .exe
                                                </span>
                                            </span>
                                            , file{" "}
                                            <span className="font-mono text-sm font-semibold text-signal-danger">
                                                .zip
                                            </span>
                                            , atau dokumen bermakro (
                                            <span className="font-mono text-sm font-semibold text-signal-danger">
                                                .xlsm
                                            </span>
                                            ) yang meminta aktifkan macro.
                                        </li>
                                        <li>
                                            <strong className="font-semibold text-ink-primary">
                                                Kasus 2 (QR asing):
                                            </strong>{" "}
                                            QR mengarah ke domain asing{" "}
                                            <span className="font-mono text-sm font-semibold text-signal-danger">
                                                drive-akses-gratis.net
                                            </span>
                                            , stiker QR fisik yang menimpa QR
                                            asli, atau QR menu/Wi-Fi yang
                                            meminta login email.
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t-[3px] border-t-signal-safe bg-[#F8FAFC] p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-safe">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-safe"
                                            aria-hidden="true"
                                        />
                                        Aman dibuka
                                    </p>
                                    <ul className="mt-4 list-disc space-y-2.5 pl-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <li>
                                            Dokumen memang Anda tunggu dari
                                            pengirim terverifikasi, format
                                            wajar, dan tanpa permintaan macro.
                                        </li>
                                        <li>
                                            QR dari sumber resmi (atau sudah
                                            dikonfirmasi staf), alamat sesuai,
                                            dan tidak meminta password pribadi.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                        step2Content={
                            <div>
                                <div className="px-5 py-6 sm:px-7 sm:py-7">
                                    <h2 className="text-base font-semibold leading-snug text-ink-brand">
                                        Pertanyaan pertama: apakah saya memang
                                        menunggu kiriman ini?
                                    </h2>
                                    <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-secondary">
                                        Mengubah nama file tidak menghilangkan
                                        risikonya. Pahami dua media yang sering
                                        disalahgunakan:
                                    </p>

                                    <dl className="mt-4 max-w-[62ch] divide-y divide-border-subtle border-y border-border-subtle">
                                        {RISKS.map((item) => (
                                            <div
                                                key={item.type}
                                                className="grid grid-cols-1 gap-1 py-3.5 text-[15px] sm:grid-cols-[14rem_1fr] sm:gap-4"
                                            >
                                                <dt className="font-semibold text-ink-brand">
                                                    {item.type}
                                                </dt>
                                                <dd className="leading-[1.6] text-ink-secondary">
                                                    {item.risk}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <SafeActionList
                                    title="Langkah aman: belum yakin? Jangan buka, jangan pindai"
                                    items={SAFE_ACTIONS}
                                />
                            </div>
                        }
                    />
                </div>
            )}

            <UnitFooterBar
                unitNumber={4}
                nextTitle="Unit 5, Kode rahasia dan MFA"
                seconds={seconds}
                isSaving={isSaving}
                isTimeLocked={isTimeLocked}
                isRevealed={isRevealed}
                prerequisiteText={
                    !bothCasesViewed ? "Lihat Kasus 2 (QR) dulu" : undefined
                }
                errorMessage={errorMessage}
                onFinish={onFinish}
            />

            <ActionNoticeToast
                notice={actionNotice}
                onClose={() => setActionNotice(null)}
            />
        </article>
    );
}