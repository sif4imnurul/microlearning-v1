"use client";

import { useRef, useState } from "react";
import BrowserBarSimulator from "@/components/microlearning/simulators/BrowserBarSimulator";
import GmailSimulator from "@/components/microlearning/simulators/GmailSimulator";
import type { UnitProps } from "@/components/microlearning/UnitParts";

type Decision = "trust_https" | "verify_official" | null;

type ActionNotice = {
    tone: "caution" | "positive";
    message: string;
};

const DISTINCTIONS = [
    {
        visible: "Teks pada tombol atau tautan",
        meaning: "Belum tentu sama dengan alamat tujuan sebenarnya.",
    },
    {
        visible: "Gembok atau HTTPS",
        meaning: "Koneksi aman dan terenkripsi, tetapi bukan bukti situs tepercaya.",
    },
];

const SAFE_ACTIONS = [
    "Arahkan kursor atau tekan lama pada tautan untuk melihat alamat tujuan.",
    "Jika domain tidak sesuai atau Anda ragu, jangan klik.",
    "Ketik sendiri alamat resmi atau buka aplikasi resminya.",
];

export default function Unit3({
    seconds,
    isSaving,
    errorMessage,
    onFinish,
}: UnitProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
    const [urlPinned, setUrlPinned] = useState(false);
    const [browserOpen, setBrowserOpen] = useState(false);
    const [padlockOpen, setPadlockOpen] = useState(false);
    const [decision, setDecision] = useState<Decision>(null);
    const [actionNotice, setActionNotice] = useState<ActionNotice | null>(null);
    const revealRef = useRef<HTMLDivElement | null>(null);

    const isRevealed = decision !== null;
    const showStatusUrl = hoveredUrl || urlPinned;
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");

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
                block: "nearest",
            });
        });
    }

    function handleOpenTrackPreview() {
        setBrowserOpen(true);
        setActionNotice({
            tone: "caution",
            message:
                "Perhatikan address bar pratinjau di bawah email. Meski ada ikon gembok HTTPS, domain tujuannya nusantaraexpress-cek.com, bukan nusantaraexpress.co.id.",
        });
    }

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        setActionNotice({
            tone: "caution",
            message:
                action === "Balas"
                    ? "Jangan membalas email pelacakan yang mencurigakan. Cek nomor resi langsung di situs atau aplikasi resmi kurir."
                    : "Jangan meneruskan tautan yang belum dipastikan domain aslinya agar orang lain tidak ikut mengklik.",
        });
    }

    function handleReportSpam() {
        setActionNotice({
            tone: "positive",
            message:
                "Langkah aman. Email pelacakan paket dengan domain tujuan palsu layak dilaporkan sebagai phishing atau spam.",
        });
    }

    function handleDeleteEmail() {
        setActionNotice({
            tone: "positive",
            message:
                "Menghapus email mencegah klik tidak sengaja. Jika memang menunggu paket, cek langsung lewat aplikasi resmi kurir.",
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
                            03
                        </span>
                        <div className="max-w-[52ch]">
                            <p className="text-xs font-medium text-[#D8E2EE]">
                                Tautan dan tanda HTTPS
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white text-balance sm:text-[1.75rem]">
                                Periksa Tautan dan Gembok
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#D8E2EE] text-pretty">
                                Periksa domain tujuan sebuah tautan dan pahami
                                batas dari tanda gembok HTTPS.
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

            {/* Primary Focal Point: Courier Email + Hover Status URL + Browser Bar Preview */}
            <section className="mt-6 space-y-3" aria-label="Simulasi email pelacakan paket">
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
                        subject: "Paket #NE-884120 tertahan di gudang transit",
                        mailedBy: "nusantaraexpress-cek.com",
                        securityLabel: "Enkripsi standar (TLS)",
                    }}
                    detailsOpen={detailsOpen}
                    onToggleDetails={() => setDetailsOpen((prev) => !prev)}
                    onCloseDetails={() => setDetailsOpen(false)}
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
                    <div className="space-y-3 text-sm leading-relaxed text-[#1F1F1F]">
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
                            Lacak status paket dan perbarui catatan pengiriman
                            melalui tombol di bawah ini:
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
                                onClick={() => setUrlPinned((prev) => !prev)}
                                aria-pressed={urlPinned}
                                className={`inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#172B45] ${
                                    urlPinned
                                        ? "border-[#172B45] bg-[#EDF2F7] text-[#172B45]"
                                        : "border-[#DADCE0] bg-[#FAF9F5] text-[#4E5A69] hover:border-[#172B45] hover:text-[#172B45]"
                                }`}
                            >
                                {urlPinned
                                    ? "Sembunyikan alamat tujuan"
                                    : "Pratinjau alamat tujuan"}
                            </button>
                        </div>

                        <p className="text-xs text-[#444746]">
                            Tautan langsung:{" "}
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
                                className="break-all font-mono text-[#1A73E8] underline underline-offset-2 hover:text-[#174EA6] focus-visible:outline-2 focus-visible:outline-[#172B45]"
                            >
                                nusantaraexpress.co.id/lacak/NE-884120
                            </button>
                        </p>

                        {/* Authentic Browser Bottom-Left Hover URL Preview */}
                        {showStatusUrl && (
                            <div
                                role="status"
                                className="animate-reveal-in flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-[#DADCE0] bg-[#F1F3F4] px-3 py-1.5 font-mono text-xs text-[#1F1F1F]"
                            >
                                <span className="shrink-0 font-sans text-[11px] font-medium text-[#5F6368]">
                                    Tujuan asli:
                                </span>
                                <span className="break-all">
                                    https://
                                    <span className="rounded bg-[#FDF1EE] px-1 font-semibold text-[#A62D14]">
                                        nusantaraexpress-cek.com
                                    </span>
                                    /track
                                </span>
                            </div>
                        )}

                        <div className="border-t border-[#ECEEF2] pt-3 text-xs leading-relaxed text-[#5E5E5E]">
                            <p className="font-semibold text-[#1F1F1F]">
                                Tim Layanan Pengiriman Nusantara Express
                            </p>
                            <p>Resi #NE-884120 · Layanan Pelanggan 24 Jam</p>
                        </div>
                    </div>
                </GmailSimulator>

                {/* Mini Browser Bar Preview when link clicked or after reveal */}
                {browserOpen && (
                    <BrowserBarSimulator
                        protocol="https"
                        domain="nusantaraexpress-cek.com"
                        path="/track"
                        officialDomain="nusantaraexpress.co.id"
                        padlockOpen={padlockOpen}
                        onTogglePadlock={() => setPadlockOpen((prev) => !prev)}
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
                )}

                <p className="text-xs text-[#4E5A69]">
                    Simulasi latihan. Nama layanan pengiriman, nomor resi, dan
                    alamat di atas hanya rekaan.
                </p>
            </section>

            {/* Equal-Weight Decision Prompt */}
            {!isRevealed && (
                <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white px-5 py-5 sm:px-6">
                    <p className="text-base font-semibold leading-snug text-[#172B45] text-balance">
                        Email ini meminta Anda melacak paket tertahan lewat
                        tombol di atas, dan halaman tujuannya punya ikon gembok
                        HTTPS. Apa keputusan terbaik?
                    </p>
                    <p className="mt-1 text-xs text-[#4E5A69]">
                        Coba arahkan kursor atau klik{" "}
                        <span className="font-medium text-[#1C2430]">
                            Pratinjau alamat tujuan
                        </span>{" "}
                        dan{" "}
                        <span className="font-medium text-[#1C2430]">
                            Lacak Paket
                        </span>{" "}
                        untuk memeriksa gembok HTTPS sebelum menjawab.
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleDecision("trust_https")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Aman diklik karena halaman punya gembok HTTPS
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDecision("verify_official")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Jangan klik dan buka situs resmi sendiri
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
                    {/* Section A: Unified 3-Part Link & HTTPS Anatomy */}
                    <section className="rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                        <div className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    decision === "verify_official"
                                        ? "bg-[#ECF7F1] text-[#145C3A]"
                                        : "bg-[#FEF6E7] text-[#8A4B08]"
                                }`}
                                aria-hidden="true"
                            >
                                {decision === "verify_official" ? "✓" : "!"}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-semibold leading-snug sm:text-base ${
                                        decision === "verify_official"
                                            ? "text-[#145C3A]"
                                            : "text-[#8A4B08]"
                                    }`}
                                >
                                    {decision === "verify_official"
                                        ? "Tepat. Teks tautan dan ikon gembok HTTPS tidak menjamin situs itu resmi."
                                        : "Hati-hati. Ikon gembok HTTPS tetap bisa muncul pada situs tiruan."}
                                </p>
                                <p className="mt-1 text-xs text-[#4E5A69]">
                                    Tiga tanda bahaya yang terlihat pada
                                    simulasi di atas:
                                </p>
                            </div>
                        </div>

                        {/* Unified 3-block strip with subtle tints */}
                        <div className="mt-4 overflow-hidden rounded-xl border border-[#DDD9CF]">
                            <div className="grid grid-cols-1 divide-y divide-[#DDD9CF] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                <div className="bg-[#FEF6E7] px-4 py-3.5">
                                    <p className="text-[11px] font-semibold text-[#8A4B08]">
                                        1. Teks yang terlihat
                                    </p>
                                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#1C2430]">
                                        nusantaraexpress.co.id/lacak
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                        Teks tautan bisa dibuat menyerupai situs
                                        resmi, padahal bukan tujuan sebenarnya.
                                    </p>
                                </div>

                                <div className="bg-[#FDF1EE] px-4 py-3.5">
                                    <p className="text-[11px] font-semibold text-[#A62D14]">
                                        2. Domain tujuan asli
                                    </p>
                                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#A62D14]">
                                        nusantaraexpress-cek.com
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                        Domain berbeda dari situs resmi{" "}
                                        <span className="font-mono font-medium text-[#1C2430]">
                                            nusantaraexpress.co.id
                                        </span>
                                        .
                                    </p>
                                </div>

                                <div className="bg-[#EDF2F7] px-4 py-3.5">
                                    <p className="text-[11px] font-semibold text-[#172B45]">
                                        3. Gembok / HTTPS
                                    </p>
                                    <p className="mt-1 font-mono text-xs font-semibold text-[#145C3A]">
                                        https:// (koneksi aman)
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                        Data terenkripsi, tetapi gembok tidak
                                        mengubah fakta bahwa domainnya tiruan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section B: Core Concept & Distinctions */}
                    <section className="px-1">
                        <h2 className="text-lg font-semibold leading-snug text-[#172B45] text-balance">
                            Teks pada tombol bukan tujuan sebenarnya. HTTPS
                            mengamankan koneksi, bukan membuktikan situs
                            tepercaya.
                        </h2>
                        <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-[#4E5A69] text-pretty">
                            Gembok atau HTTPS berarti data tidak mudah disadap
                            di tengah jalan, tetapi pemilik situs tetap bisa
                            siapa saja, termasuk pelaku penipuan. Dua hal yang
                            perlu dibedakan:
                        </p>

                        <dl className="mt-4 divide-y divide-[#DDD9CF] border-y border-[#DDD9CF]">
                            {DISTINCTIONS.map((item) => (
                                <div
                                    key={item.visible}
                                    className="grid grid-cols-1 gap-1 py-2.5 text-sm sm:grid-cols-[14rem_1fr] sm:gap-4"
                                >
                                    <dt className="font-semibold text-[#172B45]">
                                        {item.visible}
                                    </dt>
                                    <dd className="text-[#4E5A69]">
                                        {item.meaning}
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
                                Periksa tujuan sebelum menekan
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
                        Unit 4, Waspadai lampiran dan QR
                    </span>
                </p>

                <button
                    type="button"
                    onClick={onFinish}
                    disabled={!isRevealed || isSaving}
                    className="min-h-12 w-full rounded-lg bg-[#172B45] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] disabled:bg-[#E6E2D8] disabled:text-[#4E5A69] disabled:active:scale-100 sm:w-auto sm:min-w-48"
                >
                    {isSaving
                        ? "Menyimpan..."
                        : isRevealed
                          ? "Selesaikan Unit 3"
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