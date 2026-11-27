"use client";

import { useRef, useState } from "react";
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

type Decision = "trusted" | "suspicious" | null;
type AnatomyKey = "displayName" | "emailAddress" | "domain";

const ANATOMY_PARTS: Array<{
    key: AnatomyKey;
    label: string;
    detail: string;
}> = [
    {
        key: "displayName",
        label: "Nama tampilan",
        detail: "Bisa ditulis siapa saja, belum membuktikan pengirimnya asli.",
    },
    {
        key: "emailAddress",
        label: "Alamat lengkap",
        detail: "Baca utuh dari depan sampai belakang, terutama setelah tanda @.",
    },
    {
        key: "domain",
        label: "Domain pengirim",
        detail: "Cocokkan persis dengan domain resmi organisasi yang Anda kenal.",
    },
];

const SAFE_ACTIONS = [
    "Periksa alamat lengkap dan domain setelah tanda @, bukan hanya nama tampilannya.",
    "Bandingkan dengan domain resmi organisasi (misalnya .co.id untuk bank atau .ac.id untuk kampus).",
    "Jika domain berbeda atau ragu, jangan klik tautan dan jangan balas; cek langsung lewat situs atau aplikasi resminya.",
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
    const [actionNotice, setActionNotice] = useState<SimulationNotice | null>(
        null
    );
    const [activeAnatomy, setActiveAnatomy] = useState<AnatomyKey>("domain");
    const noticeIdRef = useRef(0);
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
        setDetailsOpen(true);
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

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        showNotice(
            "caution",
            action === "Balas"
                ? "Jika domain pengirim berbeda dari domain resmi, jangan balas email sebelum memastikan lewat kanal resmi."
                : "Jangan meneruskan email mencurigakan sebelum keaslian pengirimnya dipastikan."
        );
    }

    function handleReportSpam() {
        showNotice(
            "positive",
            "Prosedur lengkap pelaporan email mencurigakan akan dibahas di Unit 6."
        );
    }

    function handleDeleteEmail() {
        showNotice(
            "positive",
            "Menghapus email aman bagi akun Anda, tetapi melaporkannya lewat fitur spam membantu memblokir pengirimnya."
        );
    }

    function handleClickEmailCta(target: "cta" | "help") {
        showNotice(
            "caution",
            target === "cta"
                ? "Email ini dikirim dari banknusantara-notifikasi.com, bukan domain resmi banknusantara.co.id. Cek Detail header di kanan atas sebelum menekan tombol apa pun."
                : "Jangan membuka tautan bantuan dari dalam email yang domain pengirimnya janggal. Buka situs resmi banknusantara.co.id atau aplikasi bank secara langsung.",
            "Hati-hati"
        );
    }

    return (
        <article className="mx-auto w-full max-w-[780px] text-[#0F172A]">
            <UnitHeaderBand
                unitCode="01"
                title="Kenali Siapa Pengirimnya"
                subtitle="Bedakan nama tampilan dari alamat domain pengirim yang sebenarnya."
                seconds={seconds}
            />

            <ScenarioBriefingStrip
                roleTitle="Anda adalah nasabah Bank Nusantara"
                situation="Sebuah email pembaruan layanan baru masuk ke kotak masuk Anda. Periksa pengirimnya dan cocokkan dengan domain resmi bank ini."
                referenceLabel="Domain resmi bank"
                referenceValue="banknusantara.co.id"
                referenceMono
            />

            {/* Stage 02: Elevated Hero Simulator */}
            <section className="mt-10" aria-label="Simulasi email masuk">
                <StageHeader
                    step="02"
                    label="Periksa simulasi"
                    hint="Klik Detail header untuk melihat pengirim lengkap"
                />

                <div className="mt-3.5 rounded-xl shadow-[0_2px_6px_rgba(15,23,42,0.05),0_12px_28px_-10px_rgba(15,23,42,0.1)]">
                    <GmailSimulator
                        subject="Pemberitahuan pembaruan layanan digital"
                        senderName="Bank Nusantara Care"
                        senderEmail="cs@banknusantara-notifikasi.com"
                        senderInitials="BN"
                        senderAvatarColor="#1A56DB"
                        timestamp="10.14 (5 menit lalu)"
                        details={{
                            fromName: "Bank Nusantara Care",
                            fromEmail: "cs@banknusantara-notifikasi.com",
                            toEmail: "nasabah@gmail.com",
                            dateLabel: "Hari ini, 10.14 WIB",
                            subject: "Pemberitahuan pembaruan layanan digital",
                            mailedBy: "banknusantara-notifikasi.com",
                            securityLabel: "Enkripsi standar (TLS)",
                        }}
                        detailsOpen={detailsOpen}
                        onToggleDetails={() => setDetailsOpen((prev) => !prev)}
                        onCloseDetails={() => setDetailsOpen(false)}
                        revealAnnotations={isRevealed}
                        suspiciousPart="-notifikasi.com"
                        onReplyClick={() => handleAttemptEmailAction("Balas")}
                        onForwardClick={() =>
                            handleAttemptEmailAction("Teruskan")
                        }
                        onReportSpamClick={handleReportSpam}
                        onDeleteClick={handleDeleteEmail}
                    >
                        <div className="space-y-3.5 text-[15px] leading-relaxed text-[#222222]">
                            <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-3">
                                <span className="text-sm font-bold tracking-tight text-[#1A56DB]">
                                    Bank Nusantara
                                </span>
                                <span className="text-xs text-[#5E5E5E]">
                                    Info Layanan Digital
                                </span>
                            </div>

                            <p>Yth. Nasabah,</p>
                            <p>
                                Terdapat pembaruan layanan pada akun Anda
                                terkait penyesuaian sistem keamanan dan fitur
                                transaksi digital yang berlaku mulai bulan ini.
                            </p>
                            <p>
                                Agar layanan mobile banking dan notifikasi
                                transaksi tetap berjalan normal, silakan tinjau
                                pembaruan akun Anda melalui tombol berikut:
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
                                    className="inline-flex min-h-11 items-center font-medium text-[#1A56DB] underline underline-offset-2 hover:text-[#1545B5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
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
                    </GmailSimulator>
                </div>

                <p className="mt-3 text-xs text-ink-secondary">
                    Simulasi latihan. Nama bank dan alamat email di atas hanya
                    rekaan.
                </p>
            </section>

            {/* Stage 03: Unboxed Decision Prompt -> Elevated 2-Step Pembahasan */}
            {!isRevealed && (
                <DecisionPromptSection
                    question="Email di atas tertulis dari Bank Nusantara Care. Apakah pengirimnya sudah pasti resmi?"
                    helper={
                        <>
                            Bandingkan alamat setelah tanda{" "}
                            <span className="font-mono font-semibold text-ink-primary">
                                @
                            </span>{" "}
                            dengan domain resmi{" "}
                            <span className="font-mono font-semibold text-signal-safe">
                                banknusantara.co.id
                            </span>{" "}
                            sebelum memilih.
                        </>
                    }
                    optionA="Ya, terlihat resmi"
                    optionB="Belum tentu, perlu dicurigai"
                    onSelectA={() => handleDecision("trusted")}
                    onSelectB={() => handleDecision("suspicious")}
                />
            )}

            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-11 scroll-mt-20"
                >
                    <PostDecisionStepper
                        isCorrect={decision === "suspicious"}
                        verdictTitle={
                            decision === "suspicious"
                                ? "Tepat. Email tadi palsu karena domain pengirimnya bukan domain resmi bank."
                                : "Sekilas tampak rapi, tetapi email tadi palsu karena domain pengirimnya bukan domain resmi bank."
                        }
                        verdictSubtitle="Bandingkan pengirim email palsu dengan contoh email resmi di bawah ini."
                        step1Label="1. Palsu vs Resmi"
                        step2Label="2. Inti & Langkah Aman"
                        step1Content={
                            <div className="grid grid-cols-1 divide-y divide-border-subtle md:grid-cols-2 md:divide-x md:divide-y-0">
                                {/* Left Column: Scam Email */}
                                <div className="flex flex-col border-t-[3px] border-t-signal-danger bg-white p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-danger">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-danger"
                                            aria-hidden="true"
                                        />
                                        Email simulasi (Palsu)
                                    </p>

                                    <div className="mt-4 flex items-start gap-3">
                                        <span
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E293B] text-xs font-semibold text-white"
                                            aria-hidden="true"
                                        >
                                            BN
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-ink-primary">
                                                Bank Nusantara Care
                                            </p>
                                            <p className="mt-0.5 font-mono text-xs text-ink-secondary [overflow-wrap:anywhere]">
                                                {"<cs@"}
                                                <wbr />
                                                {"banknusantara"}
                                                <wbr />
                                                <mark className="rounded-sm bg-signal-danger-bg px-[1px] font-bold text-signal-danger">
                                                    -notifikasi.com
                                                </mark>
                                                {">"}
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="mt-5 list-disc space-y-2 border-t border-border-subtle pt-4 pl-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <li>
                                            Domain ditambah{" "}
                                            <span className="font-mono font-semibold text-signal-danger">
                                                -notifikasi.com
                                            </span>
                                            , bukan{" "}
                                            <span className="font-mono font-semibold text-signal-safe">
                                                .co.id
                                            </span>
                                            .
                                        </li>
                                        <li>
                                            Mengarahkan Anda menekan tombol dari
                                            dalam email, bukan membuka aplikasi
                                            resmi sendiri.
                                        </li>
                                    </ul>
                                </div>

                                {/* Right Column: Authentic Official Email */}
                                <div className="flex flex-col border-t-[3px] border-t-signal-safe bg-[#F8FAFC] p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-safe">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-safe"
                                            aria-hidden="true"
                                        />
                                        Contoh email resmi
                                    </p>

                                    <div className="mt-4 flex items-start gap-3">
                                        <span
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal-safe text-xs font-semibold text-white"
                                            aria-hidden="true"
                                        >
                                            BN
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-ink-primary">
                                                Bank Nusantara
                                            </p>
                                            <p className="mt-0.5 font-mono text-xs text-ink-secondary [overflow-wrap:anywhere]">
                                                {"<notifikasi@"}
                                                <wbr />
                                                <mark className="rounded-sm bg-signal-safe-bg px-[1px] font-bold text-signal-safe">
                                                    banknusantara.co.id
                                                </mark>
                                                {">"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 border-t border-border-subtle pt-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <p className="text-sm font-semibold text-ink-brand">
                                            Subjek: Informasi pembaruan layanan
                                        </p>
                                        <p className="mt-1.5">
                                            &ldquo;Yth. Nasabah, rincian
                                            pembaruan tersedia di aplikasi resmi
                                            Bank Nusantara atau{" "}
                                            <span className="font-mono font-semibold text-signal-safe">
                                                banknusantara.co.id
                                            </span>
                                            . Kami tidak pernah meminta
                                            password, PIN, atau OTP lewat
                                            email.&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                        step2Content={
                            <div>
                                {/* Interactive 3-Part Sender Anatomy */}
                                <div className="px-5 py-6 sm:px-7 sm:py-7">
                                    <h2 className="text-base font-semibold text-ink-brand">
                                        Tiga bagian alamat pengirim
                                    </h2>
                                    <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-secondary">
                                        Pilih tiap bagian untuk melihat mana
                                        yang bisa dipalsukan dan mana yang wajib
                                        dicocokkan.
                                    </p>

                                    <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle bg-white">
                                        <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-[#F8FAFC] px-4 py-3.5 text-sm">
                                            <span className="text-xs font-medium text-ink-secondary">
                                                Dari:
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveAnatomy(
                                                        "displayName"
                                                    )
                                                }
                                                aria-pressed={
                                                    activeAnatomy ===
                                                    "displayName"
                                                }
                                                className={`min-h-11 rounded-md border px-3 py-2 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand sm:text-sm ${
                                                    activeAnatomy ===
                                                    "displayName"
                                                        ? "border-ink-brand bg-ink-brand text-white"
                                                        : "border-border-strong bg-white text-ink-primary hover:border-ink-brand"
                                                }`}
                                            >
                                                Bank Nusantara Care
                                            </button>

                                            <div
                                                className={`inline-flex max-w-full flex-wrap items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] transition-colors sm:flex-nowrap sm:px-2 sm:text-sm ${
                                                    activeAnatomy ===
                                                    "emailAddress"
                                                        ? "border-ink-brand bg-surface-subtle"
                                                        : "border-border-strong bg-white"
                                                }`}
                                            >
                                                <span
                                                    className="select-none text-ink-secondary"
                                                    aria-hidden="true"
                                                >
                                                    &lt;
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveAnatomy(
                                                            "emailAddress"
                                                        )
                                                    }
                                                    aria-pressed={
                                                        activeAnatomy ===
                                                        "emailAddress"
                                                    }
                                                    aria-label="Alamat lengkap pengirim cs@"
                                                    className={`inline-flex min-h-11 shrink-0 items-center justify-end rounded pl-1 pr-0.5 focus-visible:outline-2 focus-visible:outline-ink-brand sm:min-w-11 sm:pl-2 ${
                                                        activeAnatomy ===
                                                        "emailAddress"
                                                            ? "font-semibold text-ink-brand"
                                                            : "text-ink-primary"
                                                    }`}
                                                >
                                                    cs@
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveAnatomy(
                                                            "domain"
                                                        )
                                                    }
                                                    aria-pressed={
                                                        activeAnatomy ===
                                                        "domain"
                                                    }
                                                    className={`inline-flex min-h-11 shrink-0 items-center break-all rounded px-1 font-semibold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ink-brand sm:whitespace-nowrap sm:pl-1 sm:pr-2 ${
                                                        activeAnatomy ===
                                                        "domain"
                                                            ? "bg-signal-danger-bg text-signal-danger ring-1 ring-signal-danger-border"
                                                            : "text-signal-danger hover:bg-signal-danger-bg"
                                                    }`}
                                                >
                                                    banknusantara-notifikasi.com
                                                </button>
                                                <span
                                                    className="select-none pl-0.5 text-ink-secondary"
                                                    aria-hidden="true"
                                                >
                                                    &gt;
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 divide-y divide-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                            {ANATOMY_PARTS.map((part, idx) => {
                                                const isActive =
                                                    activeAnatomy === part.key;
                                                const isDomain =
                                                    part.key === "domain";
                                                return (
                                                    <button
                                                        key={part.key}
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveAnatomy(
                                                                part.key
                                                            )
                                                        }
                                                        aria-pressed={isActive}
                                                        className={`min-h-11 px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink-brand ${
                                                            isActive
                                                                ? isDomain
                                                                    ? "bg-[#FEF3F2]/65 shadow-[inset_0_2px_0_0_#B42318]"
                                                                    : "bg-surface-subtle shadow-[inset_0_2px_0_0_#172B45]"
                                                                : "bg-white hover:bg-[#F8FAFC]"
                                                        }`}
                                                    >
                                                        <p
                                                            className={`text-xs font-semibold ${
                                                                isActive &&
                                                                isDomain
                                                                    ? "text-signal-danger"
                                                                    : "text-ink-brand"
                                                            }`}
                                                        >
                                                            {idx + 1}.{" "}
                                                            {part.label}
                                                        </p>
                                                        <p
                                                            className={`mt-1.5 text-sm leading-relaxed ${
                                                                isActive &&
                                                                isDomain
                                                                    ? "text-[#7A1A14]"
                                                                    : "text-ink-secondary"
                                                            }`}
                                                        >
                                                            {part.detail}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Flat Editorial Callout (No Nested Card Border) */}
                                    <div className="mt-6 max-w-[62ch] border-l-[3px] border-ink-brand bg-[#F8FAFC] py-3 pl-4 pr-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <p className="text-sm font-semibold text-ink-brand">
                                            Berlaku juga untuk kampus, beasiswa,
                                            dan kantor
                                        </p>
                                        <p className="mt-1">
                                            Jika domain resmi kampus{" "}
                                            <span className="font-mono text-sm font-semibold text-ink-primary">
                                                univmerdeka.ac.id
                                            </span>
                                            , email dari{" "}
                                            <span className="font-mono text-sm font-semibold text-signal-danger">
                                                beasiswa@info-beasiswa-edu.net
                                            </span>{" "}
                                            tetap mencurigakan. Sebaliknya,
                                            pengumuman di dalam portal atau
                                            aplikasi resmi tanpa meminta
                                            password atau OTP umumnya aman.
                                        </p>
                                    </div>
                                </div>

                                <SafeActionList
                                    title="Langkah aman: baca alamat lengkapnya, lalu bandingkan"
                                    note="Pemeriksaan ini untuk memastikan keaslian pengirim, bukan mencurigai semua pesan."
                                    items={SAFE_ACTIONS}
                                />
                            </div>
                        }
                    />
                </div>
            )}

            <UnitFooterBar
                unitNumber={1}
                nextTitle="Unit 2, Jangan mudah terpancing"
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