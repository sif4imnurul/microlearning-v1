"use client";

import { useRef, useState } from "react";
import BrowserBarSimulator from "@/components/microlearning/simulators/BrowserBarSimulator";
import GmailSimulator from "@/components/microlearning/simulators/GmailSimulator";
import {
    ActionNoticeToast,
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

type Decision = "trust_https" | "verify_official" | null;

const DISTINCTIONS = [
    {
        visible: "Teks tombol, link, atau tautan pendek",
        meaning:
            "Bisa ditulis menyerupai alamat resmi; tautan pendek juga menyembunyikan domain tujuan aslinya.",
    },
    {
        visible: "Logo dan tampilan login yang identik",
        meaning:
            "Desain halaman mudah ditiru; keaslian situs selalu ditentukan oleh domain sebelum tanda / di address bar.",
    },
    {
        visible: "Ikon gembok atau HTTPS",
        meaning:
            "Hanya mengenkripsi jalur koneksi. Situs palsu atau situs promo tetap bisa memiliki sertifikat HTTPS yang sah.",
    },
];

const SAFE_ACTIONS = [
    "Arahkan kursor atau tekan lama tautan (atau cek address bar) untuk melihat domain tujuan sebelum bertindak.",
    "Buka layanan langsung dari bookmark tersimpan, aplikasi resmi, atau ketik alamat resminya sendiri.",
    "Jangan masukkan password di situs promo atau domain asing meski memakai HTTPS dan ikon gembok.",
];

export default function Unit3({
    seconds,
    isSaving,
    isTimeLocked,
    errorMessage,
    onFinish,
}: UnitProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
    const [urlPinned, setUrlPinned] = useState(false);
    const [browserOpen, setBrowserOpen] = useState(false);
    const [padlockOpen, setPadlockOpen] = useState(false);
    const [decision, setDecision] = useState<Decision>(null);
    const [actionNotice, setActionNotice] = useState<SimulationNotice | null>(
        null
    );
    const noticeIdRef = useRef(0);
    const browserRef = useRef<HTMLDivElement | null>(null);
    const revealRef = useRef<HTMLDivElement | null>(null);

    const isRevealed = decision !== null;

    function showNotice(
        tone: SimulationNotice["tone"],
        message: string,
        title?: string
    ) {
        noticeIdRef.current += 1;
        setActionNotice({ id: noticeIdRef.current, tone, title, message });
    }

    function handleDecision(choice: Exclude<Decision, null>) {
        setDecision(choice);
        setBrowserOpen(true);
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

    function handleOpenTrackPreview() {
        setBrowserOpen(true);
        showNotice(
            "caution",
            "Pratinjau browser dibuka. Meski ada ikon gembok HTTPS, domain tujuannya nusantaraexpress-cek.com, bukan nusantaraexpress.co.id.",
            "Cek address bar"
        );
        window.requestAnimationFrame(() => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            browserRef.current?.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "nearest",
            });
        });
    }

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        showNotice(
            "caution",
            action === "Balas"
                ? "Jangan membalas email pelacakan yang mencurigakan. Cek nomor resi langsung di situs atau aplikasi resmi kurir."
                : "Jangan meneruskan tautan yang belum dipastikan domain aslinya agar orang lain tidak ikut mengklik."
        );
    }

    function handleReportSpam() {
        showNotice(
            "positive",
            "Email pelacakan paket dengan domain tujuan palsu layak dilaporkan sebagai phishing atau spam."
        );
    }

    function handleDeleteEmail() {
        showNotice(
            "positive",
            "Menghapus email mencegah klik tidak sengaja. Jika memang menunggu paket, cek langsung lewat aplikasi resmi kurir."
        );
    }

    return (
        <article className="mx-auto w-full max-w-[780px] text-[#0F172A]">
            <UnitHeaderBand
                unitCode="03"
                title="Periksa Tautan dan Gembok"
                subtitle="Periksa domain tujuan sebuah tautan dan pahami batas dari tanda gembok HTTPS."
                seconds={seconds}
            />

            <ScenarioBriefingStrip
                roleTitle="Anda sedang menunggu paket belanja online"
                situation="Masuk email pelacakan paket ke kotak masuk Anda. Periksa alamat tujuan tautan dan pratinjau browser-nya, lalu cocokkan dengan situs resmi kurir."
                referenceLabel="Situs resmi kurir"
                referenceValue="nusantaraexpress.co.id"
                referenceMono
            />

            {/* Stage 02: Elevated Hero Simulator */}
            <section
                className="mt-10 space-y-3.5"
                aria-label="Simulasi email pelacakan paket"
            >
                <StageHeader
                    step="02"
                    label="Periksa simulasi"
                    hint="Coba pratinjau alamat tujuan atau klik Lacak Paket"
                />

                <div className="rounded-xl shadow-[0_2px_6px_rgba(15,23,42,0.05),0_12px_28px_-10px_rgba(15,23,42,0.1)]">
                    <GmailSimulator
                        subject="Paket #NE-884120 tertahan di gudang transit"
                        senderName="Nusantara Express"
                        senderEmail="notifikasi@nusantaraexpress-cek.com"
                        senderInitials="NE"
                        senderAvatarColor="#1E40AF"
                        timestamp="10.08 (12 menit lalu)"
                        details={{
                            fromName: "Nusantara Express",
                            fromEmail: "notifikasi@nusantaraexpress-cek.com",
                            toEmail: "pelanggan@gmail.com",
                            dateLabel: "Hari ini, 10.08 WIB",
                            subject:
                                "Paket #NE-884120 tertahan di gudang transit",
                            mailedBy: "nusantaraexpress-cek.com",
                            securityLabel: "Enkripsi standar (TLS)",
                        }}
                        detailsOpen={detailsOpen}
                        onToggleDetails={() => setDetailsOpen((prev) => !prev)}
                        onCloseDetails={() => setDetailsOpen(false)}
                        revealAnnotations={isRevealed}
                        suspiciousPart="-cek.com"
                        onReplyClick={() => handleAttemptEmailAction("Balas")}
                        onForwardClick={() =>
                            handleAttemptEmailAction("Teruskan")
                        }
                        onReportSpamClick={handleReportSpam}
                        onDeleteClick={handleDeleteEmail}
                        hoverStatusUrl={hoveredUrl}
                    >
                        <div className="space-y-3.5 text-[15px] leading-relaxed text-[#1F1F1F]">
                            <p>Halo Pelanggan,</p>

                            <p>
                                Pengiriman paket Anda dengan nomor resi{" "}
                                <span className="font-mono font-semibold text-[#172B45]">
                                    #NE-884120
                                </span>{" "}
                                saat ini tertahan di Gudang Sortir Jakarta Timur
                                karena detail alamat belum lengkap.
                            </p>

                            <p>
                                Lacak status paket dan perbarui catatan
                                pengiriman melalui tombol di bawah ini:
                            </p>

                            <div className="flex flex-wrap items-center gap-2.5 pt-1 pb-1">
                                <button
                                    type="button"
                                    onClick={handleOpenTrackPreview}
                                    onMouseEnter={() =>
                                        setHoveredUrl(
                                            "https://nusantaraexpress-cek.com/track"
                                        )
                                    }
                                    onMouseLeave={() => setHoveredUrl(null)}
                                    onFocus={() =>
                                        setHoveredUrl(
                                            "https://nusantaraexpress-cek.com/track"
                                        )
                                    }
                                    onBlur={() => setHoveredUrl(null)}
                                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#172B45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                                >
                                    Lacak Paket
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setUrlPinned((prev) => !prev)
                                    }
                                    aria-pressed={urlPinned}
                                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#172B45] ${
                                        urlPinned
                                            ? "border-[#172B45] bg-[#F1F5F9] text-[#172B45]"
                                            : "border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:border-[#172B45] hover:text-[#172B45]"
                                    }`}
                                >
                                    {urlPinned
                                        ? "Sembunyikan alamat tujuan"
                                        : "Pratinjau alamat tujuan"}
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-[#444746]">
                                <span>Tautan langsung:</span>
                                <button
                                    type="button"
                                    onClick={handleOpenTrackPreview}
                                    onMouseEnter={() =>
                                        setHoveredUrl(
                                            "https://nusantaraexpress-cek.com/track"
                                        )
                                    }
                                    onMouseLeave={() => setHoveredUrl(null)}
                                    onFocus={() =>
                                        setHoveredUrl(
                                            "https://nusantaraexpress-cek.com/track"
                                        )
                                    }
                                    onBlur={() => setHoveredUrl(null)}
                                    className="inline-flex min-h-11 items-center text-left font-mono text-[#1A73E8] underline underline-offset-2 [overflow-wrap:anywhere] hover:text-[#174EA6] focus-visible:outline-2 focus-visible:outline-ink-brand"
                                >
                                    nusantaraexpress.co.id/lacak/NE-884120
                                </button>
                            </div>

                            {urlPinned && (
                                <div
                                    role="status"
                                    aria-live="polite"
                                    className="animate-reveal-in flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-[#CBD5E1] bg-[#F1F3F4] px-3 py-1.5 font-mono text-xs text-[#1F1F1F]"
                                >
                                    <span className="shrink-0 font-sans text-[11px] font-medium text-[#475569]">
                                        Tujuan asli:
                                    </span>
                                    <span className="[overflow-wrap:anywhere]">
                                        {"https://"}
                                        <wbr />
                                        <span className="rounded-sm bg-[#FEF3F2] px-[1px] font-semibold text-[#B42318]">
                                            nusantaraexpress-cek.com
                                        </span>
                                        <wbr />
                                        {"/track"}
                                    </span>
                                </div>
                            )}

                            <div className="border-t border-[#ECEEF2] pt-3 text-xs leading-relaxed text-[#5E5E5E]">
                                <p className="font-semibold text-[#1F1F1F]">
                                    Tim Layanan Pengiriman Nusantara Express
                                </p>
                                <p>
                                    Resi #NE-884120 · Layanan Pelanggan 24 Jam
                                </p>
                            </div>
                        </div>
                    </GmailSimulator>
                </div>

                {/* Mini Browser Bar Preview when link clicked or after reveal */}
                {browserOpen && (
                    <div
                        ref={browserRef}
                        className="scroll-mt-20 rounded-xl shadow-[0_2px_6px_rgba(15,23,42,0.05)]"
                    >
                        <BrowserBarSimulator
                            protocol="https"
                            domain="nusantaraexpress-cek.com"
                            path="/track"
                            officialDomain="nusantaraexpress.co.id"
                            padlockOpen={padlockOpen}
                            onTogglePadlock={() =>
                                setPadlockOpen((prev) => !prev)
                            }
                            onClosePadlock={() => setPadlockOpen(false)}
                            onClosePreview={
                                !isRevealed
                                    ? () => {
                                          setBrowserOpen(false);
                                          setPadlockOpen(false);
                                      }
                                    : undefined
                            }
                            highlightDomain={isRevealed}
                            highlightPadlock={isRevealed}
                        />
                    </div>
                )}

                <p className="text-xs text-ink-secondary">
                    Simulasi latihan. Nama layanan pengiriman, nomor resi, dan
                    alamat di atas hanya rekaan.
                </p>
            </section>

            {/* Stage 03: Unboxed Decision Prompt -> Elevated 2-Step Pembahasan */}
            {!isRevealed && (
                <DecisionPromptSection
                    question="Email ini meminta Anda melacak paket tertahan lewat tombol di atas, dan halaman tujuannya punya ikon gembok HTTPS. Apa keputusan terbaik?"
                    helper={
                        <>
                            Coba klik{" "}
                            <span className="font-semibold text-ink-primary">
                                Pratinjau alamat tujuan
                            </span>{" "}
                            atau{" "}
                            <span className="font-semibold text-ink-primary">
                                Lacak Paket
                            </span>{" "}
                            lalu klik ikon gembok HTTPS sebelum menjawab.
                        </>
                    }
                    optionA="Aman diklik karena halaman punya gembok HTTPS"
                    optionB="Jangan klik dan buka situs resmi sendiri"
                    onSelectA={() => handleDecision("trust_https")}
                    onSelectB={() => handleDecision("verify_official")}
                />
            )}

            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-11 scroll-mt-20"
                >
                    <PostDecisionStepper
                        isCorrect={decision === "verify_official"}
                        verdictTitle={
                            decision === "verify_official"
                                ? "Tepat. Teks tautan dan ikon gembok HTTPS tidak menjamin situs itu resmi."
                                : "Hati-hati. Situs tiruan tetap bisa memakai gembok HTTPS dan tampilan yang identik."
                        }
                        verdictSubtitle="Bandingkan alamat tiruan ber-HTTPS dengan alamat resmi di bawah ini."
                        step1Label="1. Palsu vs Resmi"
                        step2Label="2. Inti & Langkah Aman"
                        step1Content={
                            <div className="grid grid-cols-1 divide-y divide-border-subtle md:grid-cols-2 md:divide-x md:divide-y-0">
                                <div className="border-t-[3px] border-t-signal-danger bg-white p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-danger">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-danger"
                                            aria-hidden="true"
                                        />
                                        Situs tiruan (meski ber-HTTPS)
                                    </p>
                                    <p className="mt-3 font-mono text-xs text-ink-primary [overflow-wrap:anywhere] sm:text-sm">
                                        <span className="text-ink-secondary">
                                            {"https://"}
                                        </span>
                                        <wbr />
                                        <mark className="rounded-sm bg-signal-danger-bg px-[1px] font-bold text-signal-danger">
                                            nusantaraexpress-cek.com
                                        </mark>
                                        <wbr />
                                        <span className="text-ink-secondary">
                                            {"/track"}
                                        </span>
                                    </p>
                                    <p className="mt-3 text-[15px] leading-[1.6] text-[#334155]">
                                        Teks tautan tertulis{" "}
                                        <span className="font-mono text-sm text-ink-primary">
                                            nusantaraexpress.co.id
                                        </span>
                                        , tetapi tujuan sebenarnya berbeda.
                                        Gembok HTTPS hanya mengenkripsi koneksi
                                        ke situs tiruan tersebut.
                                    </p>
                                </div>

                                <div className="border-t-[3px] border-t-signal-safe bg-[#F8FAFC] p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-safe">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-safe"
                                            aria-hidden="true"
                                        />
                                        Contoh alamat resmi
                                    </p>
                                    <p className="mt-3 font-mono text-xs text-ink-primary [overflow-wrap:anywhere] sm:text-sm">
                                        <span className="text-ink-secondary">
                                            {"https://"}
                                        </span>
                                        <wbr />
                                        <mark className="rounded-sm bg-signal-safe-bg px-[1px] font-bold text-signal-safe">
                                            nusantaraexpress.co.id
                                        </mark>
                                        <wbr />
                                        <span className="text-ink-secondary">
                                            {"/lacak"}
                                        </span>
                                    </p>
                                    <p className="mt-3 text-[15px] leading-[1.6] text-[#334155]">
                                        Dibuka langsung dari bookmark atau
                                        aplikasi resmi. Domain sebelum tanda{" "}
                                        <span className="font-mono font-semibold text-ink-primary">
                                            /
                                        </span>{" "}
                                        cocok persis dengan domain resmi kurir.
                                    </p>
                                </div>
                            </div>
                        }
                        step2Content={
                            <div>
                                <div className="px-5 py-6 sm:px-7 sm:py-7">
                                    <h2 className="text-base font-semibold leading-snug text-ink-brand">
                                        HTTPS mengamankan jalur koneksi, bukan
                                        membuktikan situs resmi
                                    </h2>
                                    <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-secondary">
                                        Tiga hal yang wajib dibedakan saat
                                        memeriksa tautan atau halaman login:
                                    </p>

                                    <dl className="mt-4 max-w-[62ch] divide-y divide-border-subtle border-y border-border-subtle">
                                        {DISTINCTIONS.map((item) => (
                                            <div
                                                key={item.visible}
                                                className="grid grid-cols-1 gap-1 py-3.5 text-[15px] sm:grid-cols-[14.5rem_1fr] sm:gap-4"
                                            >
                                                <dt className="font-semibold text-ink-brand">
                                                    {item.visible}
                                                </dt>
                                                <dd className="leading-[1.6] text-ink-secondary">
                                                    {item.meaning}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <SafeActionList
                                    title="Langkah aman: periksa tujuan sebelum menekan"
                                    items={SAFE_ACTIONS}
                                />
                            </div>
                        }
                    />
                </div>
            )}

            <UnitFooterBar
                unitNumber={3}
                nextTitle="Unit 4, Waspadai lampiran dan QR"
                seconds={seconds}
                isSaving={isSaving}
                isTimeLocked={isTimeLocked}
                isRevealed={isRevealed}
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