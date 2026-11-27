"use client";

import { useRef, useState } from "react";
import MarketplaceChatSimulator from "@/components/microlearning/simulators/MarketplaceChatSimulator";
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

type Decision = "off_platform" | "stop_verify_report" | null;

const THREE_STEPS = [
    {
        num: "01",
        title: "Berhenti",
        text: "Jangan langsung membalas, mengeklik tautan, atau mengikuti ajakan pindah kanal.",
    },
    {
        num: "02",
        title: "Verifikasi",
        text: "Pastikan lewat aplikasi, situs, atau kontak resmi yang Anda buka sendiri.",
    },
    {
        num: "03",
        title: "Laporkan",
        text: "Gunakan tombol lapor resmi atau prosedur keamanan tanpa klik tautan di dalamnya.",
    },
];

const RISK_REASONS = [
    "Penjual mengajak berpindah komunikasi ke luar aplikasi resmi.",
    "Pembayaran diminta langsung ke rekening pribadi di luar sistem rekening bersama.",
    "Jika terjadi penipuan, transaksi tidak lagi dilindungi proteksi marketplace.",
];

const SAFE_ACTIONS = [
    "Tetap berkomunikasi dan bertransaksi hanya di dalam aplikasi resmi.",
    "Laporkan akun atau email mencurigakan lewat fitur resmi (atau teruskan header sesuai prosedur tim keamanan) tanpa mengeklik tautannya.",
    "Gunakan langkah ini saat ada kejanggalan; notifikasi resmi di dalam aplikasi atau info update di app store resmi tetap aman.",
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
    const [actionNotice, setActionNotice] = useState<SimulationNotice | null>(
        null
    );
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

    function handleClickOffPlatform() {
        showNotice(
            "caution",
            "Pindah ke WhatsApp dan mentransfer langsung ke rekening pribadi membuat transaksi tidak lagi dilindungi sistem marketplace."
        );
    }

    function handleClickVerifyInApp() {
        showNotice(
            "positive",
            "Pastikan detail produk, status pesanan, dan pembayaran hanya melalui sistem resmi di dalam aplikasi marketplace.",
            "Verifikasi tepat"
        );
    }

    function handleClickReportSeller() {
        setReported(true);
        showNotice(
            "positive",
            "Laporan dikirim ke tim keamanan marketplace. Melaporkan lewat fitur resmi membantu melindungi pembeli lain juga.",
            "Penjual dilaporkan"
        );
    }

    return (
        <article className="mx-auto w-full max-w-[780px] text-[#0F172A]">
            <UnitHeaderBand
                unitCode="06"
                title="Verifikasi dan Laporkan"
                subtitle="Saat menemui pesan mencurigakan: berhenti sejenak, verifikasi lewat kanal resmi, lalu laporkan sesuai prosedur."
                seconds={seconds}
            />

            <ScenarioBriefingStrip
                roleTitle="Anda sedang menanyakan stok barang di aplikasi marketplace"
                situation="Penjual membalas chat di dalam aplikasi dan mengajak pindah transaksi ke WhatsApp. Gunakan aturan proteksi aplikasi resmi sebelum memutuskan langkah Anda."
                referenceLabel="Aturan transaksi aman"
                referenceValue="Chat & bayar di dalam aplikasi resmi"
            />

            {/* Stage 02: Elevated Hero Simulator */}
            <section
                className="mt-10"
                aria-label="Simulasi chat penjual di marketplace"
            >
                <StageHeader
                    step="02"
                    label="Periksa simulasi"
                    hint="Anda bisa mencoba tombol di dalam chat marketplace"
                />

                <div className="mt-3.5 rounded-xl shadow-[0_2px_6px_rgba(15,23,42,0.05),0_12px_28px_-10px_rgba(15,23,42,0.1)]">
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
                    />
                </div>

                <p className="mt-3 text-xs text-ink-secondary">
                    Simulasi latihan. Nama toko, produk, harga, dan nomor
                    WhatsApp di atas hanya rekaan.
                </p>
            </section>

            {/* Stage 03: Unboxed Decision Prompt -> Elevated 2-Step Pembahasan */}
            {!isRevealed && (
                <DecisionPromptSection
                    question="Penjual mengajak Anda pindah ke WhatsApp dan mentransfer langsung ke rekening pribadi agar bebas biaya tambahan. Langkah apa yang paling tepat?"
                    helper="Anda dapat mencoba tombol di dalam chat marketplace di atas sebelum menjawab."
                    optionA="Lanjut ke WhatsApp agar proses transaksi lebih cepat"
                    optionB="Berhenti, verifikasi di aplikasi, lalu laporkan"
                    onSelectA={() => handleDecision("off_platform")}
                    onSelectB={() => handleDecision("stop_verify_report")}
                />
            )}

            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-11 scroll-mt-20"
                >
                    <PostDecisionStepper
                        isCorrect={decision === "stop_verify_report"}
                        verdictTitle={
                            decision === "stop_verify_report"
                                ? "Tepat. Terapkan 3 langkah: Berhenti, Verifikasi, dan Laporkan."
                                : "Jangan langsung mengikuti ajakan keluar dari platform resmi. Berhenti dulu, verifikasi, lalu laporkan."
                        }
                        verdictSubtitle="Lihat alur 3 langkah dan cara melapor yang benar di bawah ini."
                        step1Label="1. Langkah & Cara Lapor"
                        step2Label="2. Inti & Langkah Aman"
                        step1Content={
                            <div>
                                {/* Clean 3-Step Horizontal Strip */}
                                <div className="grid grid-cols-1 divide-y divide-border-subtle border-b border-border-subtle bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                    {THREE_STEPS.map((step) => (
                                        <div
                                            key={step.num}
                                            className="px-5 py-4 sm:py-5"
                                        >
                                            <p className="text-sm font-semibold text-ink-brand">
                                                <span className="mr-1.5 font-mono text-xs text-ink-secondary">
                                                    {step.num}
                                                </span>
                                                {step.title}
                                            </p>
                                            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                                                {step.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Contrasting Examples */}
                                <div className="grid grid-cols-1 divide-y divide-border-subtle md:grid-cols-2 md:divide-x md:divide-y-0">
                                    <div className="border-t-[3px] border-t-signal-danger bg-white p-5 sm:p-7">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-danger">
                                            <span
                                                className="h-2 w-2 shrink-0 rounded-full bg-signal-danger"
                                                aria-hidden="true"
                                            />
                                            Kesalahan saat merespons
                                        </p>
                                        <ul className="mt-3 list-disc space-y-2 pl-4 text-[15px] leading-[1.6] text-[#334155]">
                                            <li>
                                                Mengeklik tautan untuk
                                                &ldquo;mengambil bukti&rdquo;
                                                atau membalas dengan data palsu.
                                            </li>
                                            <li>
                                                Meneruskan pesan ke semua kontak
                                                atau menyebar tangkapan layar
                                                berisi data pribadi ke media
                                                sosial.
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border-t-[3px] border-t-signal-safe bg-[#F8FAFC] p-5 sm:p-7">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-safe">
                                            <span
                                                className="h-2 w-2 shrink-0 rounded-full bg-signal-safe"
                                                aria-hidden="true"
                                            />
                                            Cara melapor yang benar
                                        </p>
                                        <ul className="mt-3 list-disc space-y-2 pl-4 text-[15px] leading-[1.6] text-[#334155]">
                                            <li>
                                                Klik{" "}
                                                <strong className="font-semibold text-ink-primary">
                                                    Laporkan / Report Phishing
                                                </strong>{" "}
                                                di aplikasi, atau teruskan
                                                header email ke tim keamanan
                                                sesuai prosedur organisasi.
                                            </li>
                                            <li>
                                                Lakukan pelaporan{" "}
                                                <strong className="font-semibold text-ink-primary">
                                                    tanpa mengklik tautan atau
                                                    membalas pengirim
                                                </strong>
                                                .
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        }
                        step2Content={
                            <div>
                                <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
                                    <div>
                                        <h2 className="text-base font-semibold leading-snug text-ink-brand">
                                            Mengapa ajakan pindah dari
                                            marketplace berisiko?
                                        </h2>
                                        <ul className="mt-3 max-w-[62ch] space-y-2.5 border-y border-border-subtle py-4 text-[15px] leading-[1.6] text-ink-primary">
                                            {RISK_REASONS.map((reason) => (
                                                <li
                                                    key={reason}
                                                    className="flex items-start gap-2.5"
                                                >
                                                    <span
                                                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-danger"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Flat Editorial Callout (No Nested Card Border) */}
                                    <div className="max-w-[62ch] border-l-[3px] border-ink-brand bg-[#F8FAFC] py-3 pl-4 pr-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <p className="text-sm font-semibold text-ink-brand">
                                            Catatan: tidak semua notifikasi
                                            berbahaya
                                        </p>
                                        <p className="mt-1">
                                            Notifikasi di dalam aplikasi atau
                                            portal resmi yang Anda buka sendiri
                                            (misalnya info pemeliharaan atau
                                            pembaruan aplikasi lewat app store
                                            resmi) tanpa meminta password, PIN,
                                            atau OTP adalah hal wajar. Gunakan
                                            3 langkah saat ada kejanggalan,
                                            bukan mencurigai semua pesan.
                                        </p>
                                    </div>
                                </div>

                                <SafeActionList
                                    title="Langkah aman: ingat Berhenti, Verifikasi, Laporkan"
                                    items={SAFE_ACTIONS}
                                />
                            </div>
                        }
                    />
                </div>
            )}

            <UnitFooterBar
                unitNumber={6}
                nextLabel="Tahap berikutnya"
                nextTitle="Post-test"
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