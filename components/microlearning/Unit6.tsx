"use client";

import { useRef, useState } from "react";
import MarketplaceChatSimulator from "@/components/microlearning/simulators/MarketplaceChatSimulator";
import type { UnitProps } from "@/components/microlearning/UnitParts";

type Decision = "off_platform" | "stop_verify_report" | null;

type ActionNotice = {
    tone: "caution" | "positive";
    message: string;
};

const THREE_STEPS = [
    {
        num: "1",
        title: "Berhenti",
        text: "Jangan langsung membalas pesan, mengeklik tautan, atau mengikuti instruksi yang diberikan.",
        bg: "bg-[#FEF6E7]",
        labelColor: "text-[#8A4B08]",
    },
    {
        num: "2",
        title: "Verifikasi",
        text: "Pastikan kebenaran informasi melalui kanal resmi, seperti aplikasi resmi atau kontak layanan yang dicari sendiri.",
        bg: "bg-[#EDF2F7]",
        labelColor: "text-[#172B45]",
    },
    {
        num: "3",
        title: "Laporkan",
        text: "Jika pesan atau aktivitas tetap mencurigakan, laporkan melalui fitur atau mekanisme pelaporan resmi pada platform terkait.",
        bg: "bg-[#ECF7F1]",
        labelColor: "text-[#145C3A]",
    },
];

const RISK_REASONS = [
    "Penjual mengajak berpindah ke luar platform resmi.",
    "Pembayaran diminta dilakukan secara langsung ke rekening pribadi.",
    "Transaksi tidak lagi melalui mekanisme perlindungan marketplace.",
];

const SAFE_ACTIONS = [
    "Jangan mengikuti ajakan pindah komunikasi atau melakukan pembayaran di luar platform.",
    "Periksa informasi transaksi melalui aplikasi marketplace resmi.",
    "Laporkan akun atau pesan mencurigakan menggunakan fitur pelaporan resmi.",
];

export default function Unit6({
    seconds,
    isSaving,
    isTimeLocked,
    errorMessage,
    onFinish,
}: UnitProps) {
    const [reported, setReported] = useState(false);
    const [decision, setDecision] = useState<Decision>(null);
    const [actionNotice, setActionNotice] = useState<ActionNotice | null>(null);
    const revealRef = useRef<HTMLDivElement | null>(null);

    const isRevealed = decision !== null;
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");

    function handleDecision(choice: Exclude<Decision, null>) {
        setDecision(choice);
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

    function handleClickOffPlatform() {
        setActionNotice({
            tone: "caution",
            message:
                "Tahan dulu. Pindah ke WhatsApp dan mentransfer langsung ke rekening pribadi membuat transaksi tidak lagi dilindungi sistem marketplace.",
        });
    }

    function handleClickVerifyInApp() {
        setActionNotice({
            tone: "positive",
            message:
                "Langkah verifikasi tepat. Pastikan detail produk, status pesanan, dan pembayaran hanya melalui sistem resmi di dalam aplikasi marketplace.",
        });
    }

    function handleClickReportSeller() {
        setReported(true);
        setActionNotice({
            tone: "positive",
            message:
                "Laporan dikirim ke tim keamanan marketplace. Melaporkan pesan mencurigakan lewat fitur resmi membantu melindungi pembeli lain juga.",
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
                            06
                        </span>
                        <div className="max-w-[52ch]">
                            <p className="text-xs font-medium text-[#D8E2EE]">
                                Respons terhadap aktivitas mencurigakan
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white text-balance sm:text-[1.75rem]">
                                Verifikasi dan Laporkan
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#D8E2EE] text-pretty">
                                Saat menerima pesan atau aktivitas mencurigakan:
                                berhenti sejenak, verifikasi lewat kanal resmi,
                                lalu laporkan melalui mekanisme resmi.
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
            <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4E5A69]">
                    Konteks skenario
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[#172B45]">
                    Anda baru menyelesaikan transaksi di marketplace
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#4E5A69]">
                    Penjual mengajak Anda melanjutkan transaksi di luar aplikasi.
                    Riwayat pesanan, identitas toko, dan status pembayaran dapat
                    diverifikasi melalui fitur marketplace resmi.
                </p>
            </section>

            {/* Primary Focal Point: Authentic Marketplace Chat Simulation */}
            <section
                className="mt-6"
                aria-label="Simulasi chat penjual di marketplace"
            >
                <MarketplaceChatSimulator
                    storeName="Toko Sinar Jaya Elektronik"
                    productName="Headphone Wireless ANC"
                    productPrice="Rp485.000"
                    whatsappNumber="0812-9410-3382"
                    reported={reported}
                    highlightRisks={isRevealed}
                    onClickOffPlatform={handleClickOffPlatform}
                    onClickVerifyInApp={handleClickVerifyInApp}
                    onClickReportSeller={handleClickReportSeller}
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
                />

                <p className="mt-2.5 text-xs text-[#4E5A69]">
                    Simulasi latihan. Nama toko, produk, harga, dan nomor
                    WhatsApp di atas hanya rekaan.
                </p>
            </section>

            {/* Equal-Weight Decision Prompt */}
            {!isRevealed && (
                <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white px-5 py-5 sm:px-6">
                    <p className="text-base font-semibold leading-snug text-[#172B45] text-balance">
                        Penjual mengajak Anda pindah ke WhatsApp dan mentransfer
                        langsung ke rekening pribadi agar bebas biaya tambahan.
                        Langkah apa yang paling tepat?
                    </p>
                    <p className="mt-1 text-xs text-[#4E5A69]">
                        Anda dapat mencoba tombol di dalam chat marketplace di
                        atas sebelum menjawab.
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleDecision("off_platform")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Lanjut ke WhatsApp agar proses transaksi lebih cepat
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDecision("stop_verify_report")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Berhenti, verifikasi di aplikasi, lalu laporkan
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
                    {/* Section A: Unified 3-Step Framework Strip */}
                    <section className="rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                        <div className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    decision === "stop_verify_report"
                                        ? "bg-[#ECF7F1] text-[#145C3A]"
                                        : "bg-[#FEF6E7] text-[#8A4B08]"
                                }`}
                                aria-hidden="true"
                            >
                                {decision === "stop_verify_report" ? "✓" : "!"}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-semibold leading-snug sm:text-base ${
                                        decision === "stop_verify_report"
                                            ? "text-[#145C3A]"
                                            : "text-[#8A4B08]"
                                    }`}
                                >
                                    {decision === "stop_verify_report"
                                        ? "Tepat. Terapkan 3 langkah: Berhenti, Verifikasi, dan Laporkan."
                                        : "Jangan langsung mengikuti ajakan keluar dari platform resmi. Berhenti dulu, verifikasi, lalu laporkan."}
                                </p>
                                <p className="mt-1 text-xs text-[#4E5A69]">
                                    Tiga langkah saat menghadapi pesan atau
                                    aktivitas yang mencurigakan:
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-[#DDD9CF]">
                            <div className="grid grid-cols-1 divide-y divide-[#DDD9CF] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                {THREE_STEPS.map((step) => (
                                    <div
                                        key={step.num}
                                        className={`${step.bg} px-4 py-3.5`}
                                    >
                                        <p
                                            className={`text-xs font-semibold ${step.labelColor}`}
                                        >
                                            {step.num}. {step.title}
                                        </p>
                                        <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                            {step.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section B: Why This Case Needs Caution + Balanced Nuance */}
                    <section className="space-y-4 px-1">
                        <div>
                            <h2 className="text-lg font-semibold leading-snug text-[#172B45] text-balance">
                                Mengapa ajakan pindah dari marketplace perlu
                                diwaspadai?
                            </h2>
                            <ul className="mt-3 space-y-2 border-y border-[#DDD9CF] py-3 text-sm leading-relaxed text-[#1C2430]">
                                {RISK_REASONS.map((reason) => (
                                    <li
                                        key={reason}
                                        className="flex items-start gap-2.5"
                                    >
                                        <span
                                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A62D14]"
                                            aria-hidden="true"
                                        />
                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-[#4E5A69] text-pretty">
                                Ajakan tersebut belum membuktikan bahwa pesan
                                pasti penipuan, tetapi cukup menjadi alasan
                                untuk tidak langsung mengikuti instruksi dan
                                melakukan verifikasi terlebih dahulu.
                            </p>
                        </div>

                        {/* Balanced Benign-Message Note (Preserved from research revision) */}
                        <div className="rounded-xl border border-[#DDD9CF] bg-[#EDF2F7] px-4 py-3.5 text-sm leading-relaxed text-[#172B45]">
                            <p className="font-semibold">
                                Catatan penting: tidak semua pesan berbahaya
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[#4E5A69] sm:text-sm">
                                Pesan, pemberitahuan, atau pembaruan yang
                                berasal dari aplikasi atau kanal resmi yang Anda
                                buka sendiri umumnya aman. Langkah Berhenti,
                                Verifikasi, dan Laporkan dipakai saat Anda ragu,
                                bukan untuk mencurigai semua hal.
                            </p>
                        </div>
                    </section>

                    {/* Section C: Concise Safe Actions */}
                    <section className="grid grid-cols-1 gap-4 px-1 sm:grid-cols-12">
                        <div className="sm:col-span-5">
                            <p className="text-xs font-semibold text-[#145C3A]">
                                Tindakan aman
                            </p>
                            <h2 className="mt-1 text-base font-semibold leading-snug text-[#172B45] text-balance">
                                Ingat: Berhenti, Verifikasi, Laporkan
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
                    Tahap berikutnya:{" "}
                    <span className="font-semibold text-[#1C2430]">
                        Post-test
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
                            ? "Selesaikan Unit 6"
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