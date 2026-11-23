"use client";

import { useRef, useState } from "react";
import GmailSimulator from "@/components/microlearning/simulators/GmailSimulator";
import type { UnitProps } from "@/components/microlearning/UnitParts";

type Decision = "comply" | "verify" | null;
type TriggerKey = "authority" | "threat" | "deadline" | "isolation";

type ActionNotice = {
    tone: "caution" | "positive";
    message: string;
};

const EMAIL_TRIGGERS: Array<{
    key: TriggerKey;
    label: string;
    quote: string;
    reason: string;
    blockBg: string;
    activeRing: string;
    labelColor: string;
}> = [
    {
        key: "authority",
        label: "Jabatan tinggi",
        quote: "Ini perintah langsung dari saya.",
        reason: "Wewenang atasan dipakai agar Anda tidak berani bertanya.",
        blockBg: "bg-[#FEF6E7]",
        activeRing: "ring-2 ring-[#8A4B08]",
        labelColor: "text-[#8A4B08]",
    },
    {
        key: "threat",
        label: "Ancaman",
        quote: "ditutup permanen",
        reason: "Menimbulkan rasa takut kehilangan akses akun kerja.",
        blockBg: "bg-[#FDF1EE]",
        activeRing: "ring-2 ring-[#A62D14]",
        labelColor: "text-[#A62D14]",
    },
    {
        key: "deadline",
        label: "Tenggat singkat",
        quote: "hari ini pukul 15.00",
        reason: "Waktu sempit membuat Anda tidak sempat memeriksa ulang.",
        blockBg: "bg-[#EDF2F7]",
        activeRing: "ring-2 ring-[#172B45]",
        labelColor: "text-[#172B45]",
    },
    {
        key: "isolation",
        label: "Rasa takut dan isolasi",
        quote: "jangan diskusikan dengan siapa pun",
        reason: "Dilarang bertanya berarti Anda tidak bisa memastikan kebenarannya.",
        blockBg: "bg-[#FDF1EE]",
        activeRing: "ring-2 ring-[#A62D14]",
        labelColor: "text-[#A62D14]",
    },
];

const COMMON_TRIGGERS = [
    { name: "Jabatan tinggi", example: "Mengatasnamakan direktur, dekan, atau pimpinan" },
    { name: "Ancaman", example: "Akun ditutup, data dihapus" },
    { name: "Tenggat singkat", example: '"Dalam 1 jam", "hari ini juga"' },
    { name: "Rasa takut", example: "Denda, sanksi, masalah hukum" },
    { name: "Hadiah", example: "Menang undian, bonus, voucher" },
];

const SAFE_ACTIONS = [
    "Jangan klik tombol dan jangan membalas pesan.",
    "Tanyakan pada diri sendiri: mengapa pesan ini memaksa saya bertindak cepat?",
    "Hubungi pengirim lewat kanal resmi yang sudah Anda kenal, bukan lewat kontak yang tertulis di dalam pesan.",
];

export default function Unit2({
    seconds,
    isSaving,
    errorMessage,
    onFinish,
}: UnitProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [decision, setDecision] = useState<Decision>(null);
    const [activeTrigger, setActiveTrigger] = useState<TriggerKey>("authority");
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

    function handleClickVerifyButton() {
        setActionNotice({
            tone: "caution",
            message:
                "Tahan dulu. Tekanan batas waktu, nama atasan, dan larangan bertanya adalah tanda manipulasi, bukan bukti pesan asli. Verifikasi lewat kanal resmi kantor terlebih dahulu.",
        });
    }

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        setActionNotice({
            tone: "caution",
            message:
                action === "Balas"
                    ? "Jangan membalas langsung ke email yang menekan Anda. Konfirmasi langsung ke atasan atau tim IT lewat kontak resmi."
                    : "Sebelum meneruskan, pastikan keaslian pesan ini lewat kanal internal resmi agar rekan lain tidak ikut terpancing.",
        });
    }

    function handleReportSpam() {
        setActionNotice({
            tone: "positive",
            message:
                "Langkah aman. Pesan yang memanfaatkan nama atasan untuk memaksa tindakan cepat layak dilaporkan ke tim keamanan.",
        });
    }

    function handleDeleteEmail() {
        setActionNotice({
            tone: "positive",
            message:
                "Menghapus pesan menghindari klik tidak sengaja, namun melaporkannya membantu tim keamanan mencegah rekan lain tertipu.",
        });
    }

    function highlightSpan(key: TriggerKey, text: string) {
        if (!isRevealed) {
            return text;
        }
        const isSelected = activeTrigger === key;
        const tone =
            key === "authority"
                ? isSelected
                    ? "bg-[#FEF6E7] text-[#8A4B08] ring-2 ring-[#8A4B08]"
                    : "bg-[#FEF6E7] text-[#8A4B08]"
                : key === "deadline"
                  ? isSelected
                      ? "bg-[#EDF2F7] text-[#172B45] ring-2 ring-[#172B45]"
                      : "bg-[#EDF2F7] text-[#172B45]"
                  : isSelected
                    ? "bg-[#FDF1EE] text-[#A62D14] ring-2 ring-[#A62D14]"
                    : "bg-[#FDF1EE] text-[#A62D14]";

        return (
            <button
                type="button"
                onClick={() => setActiveTrigger(key)}
                className={`inline rounded px-1 py-0.5 text-left font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172B45] ${tone}`}
            >
                {text}
            </button>
        );
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
                            02
                        </span>
                        <div className="max-w-[52ch]">
                            <p className="text-xs font-medium text-[#D8E2EE]">
                                Tekanan dan manipulasi sosial
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white text-balance sm:text-[1.75rem]">
                                Jangan Mudah Terpancing
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#D8E2EE] text-pretty">
                                Kenali tekanan di dalam pesan sebagai tanda
                                bahaya, bukan tanda bahwa pesan itu asli.
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

            {/* Primary Focal Point: Realistic Urgent Boss Email in Gmail */}
            <section className="mt-6" aria-label="Simulasi email mendesak">
                <GmailSimulator
                    subject="[SEGERA] Akun email Anda ditutup pukul 15.00"
                    senderName="Hendra Wirakusuma"
                    senderEmail="hendra.wirakusuma@karyamandiri-mail.com"
                    senderInitials="HW"
                    senderAvatarColor="#374151"
                    timestamp="13.42 (3 menit lalu)"
                    details={{
                        fromName: "Hendra Wirakusuma",
                        fromEmail: "hendra.wirakusuma@karyamandiri-mail.com",
                        toEmail: "staf@karyamandiri.co.id",
                        dateLabel: "Hari ini, 13.42 WIB",
                        subject: "[SEGERA] Akun email Anda ditutup pukul 15.00",
                        mailedBy: "karyamandiri-mail.com",
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
                        <p>Selamat siang,</p>

                        <p>
                            Saya sedang rapat dengan direksi dan tidak bisa
                            ditelepon. Akun email kerja Anda akan{" "}
                            {highlightSpan("threat", "ditutup permanen")}{" "}
                            {highlightSpan("deadline", "hari ini pukul 15.00")}{" "}
                            jika verifikasi belum selesai.
                        </p>

                        <p>
                            {highlightSpan(
                                "authority",
                                "Ini perintah langsung dari saya."
                            )}{" "}
                            Selesaikan sekarang dan{" "}
                            {highlightSpan(
                                "isolation",
                                "jangan diskusikan dengan siapa pun"
                            )}{" "}
                            agar proses audit internal tidak terganggu.
                        </p>

                        <div className="pt-1 pb-2">
                            <button
                                type="button"
                                onClick={handleClickVerifyButton}
                                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#172B45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                            >
                                Verifikasi Sekarang
                            </button>
                        </div>

                        <div className="border-t border-[#ECEEF2] pt-3 text-xs leading-relaxed text-[#5E5E5E]">
                            <p className="font-semibold text-[#1F1F1F]">
                                Hendra Wirakusuma
                            </p>
                            <p>
                                Direktur Operasional · PT Karya Mandiri
                                Nusantara
                            </p>
                        </div>
                    </div>
                </GmailSimulator>

                <p className="mt-2.5 text-xs text-[#4E5A69]">
                    Simulasi latihan. Nama, jabatan, perusahaan, dan alamat di
                    atas hanya rekaan.
                </p>
            </section>

            {/* Equal-Weight Decision Prompt */}
            {!isRevealed && (
                <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white px-5 py-5 sm:px-6">
                    <p className="text-base font-semibold leading-snug text-[#172B45] text-balance">
                        Email ini mengatasnamakan Direktur Operasional dengan
                        batas waktu pukul 15.00. Tindakan apa yang paling tepat?
                    </p>
                    <p className="mt-1 text-xs text-[#4E5A69]">
                        Perhatikan nada pesan, batas waktu, serta larangan
                        berdiskusi di dalam email.
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleDecision("comply")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Segera verifikasi sebelum pukul 15.00
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDecision("verify")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Berhenti dulu, lalu konfirmasi lewat kanal resmi
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
                    {/* Section A: Interactive Breakdown of 4 Pressure Tactics */}
                    <section className="rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                        <div className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    decision === "verify"
                                        ? "bg-[#ECF7F1] text-[#145C3A]"
                                        : "bg-[#FEF6E7] text-[#8A4B08]"
                                }`}
                                aria-hidden="true"
                            >
                                {decision === "verify" ? "✓" : "!"}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-semibold leading-snug sm:text-base ${
                                        decision === "verify"
                                            ? "text-[#145C3A]"
                                            : "text-[#8A4B08]"
                                    }`}
                                >
                                    {decision === "verify"
                                        ? "Tepat. Tekanan waktu dan jabatan bukan bukti pesan asli."
                                        : "Pelaku memang ingin Anda panik agar langsung klik tanpa sempat mengecek."}
                                </p>
                                <p className="mt-1 text-xs text-[#4E5A69]">
                                    Pilih tiap blok di bawah untuk menyorot
                                    kalimat pemicunya pada email di atas:
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {EMAIL_TRIGGERS.map((item, idx) => {
                                const isActive = activeTrigger === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() =>
                                            setActiveTrigger(item.key)
                                        }
                                        aria-pressed={isActive}
                                        className={`min-h-11 rounded-lg px-3.5 py-3 text-left transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                            item.blockBg
                                        } ${
                                            isActive
                                                ? item.activeRing
                                                : "opacity-85 hover:opacity-100"
                                        }`}
                                    >
                                        <p
                                            className={`text-xs font-semibold ${item.labelColor}`}
                                        >
                                            {idx + 1}. {item.label}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-[#1C2430]">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-[#4E5A69]">
                                            {item.reason}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Section B: Core Concept & 5 Common Psychological Triggers */}
                    <section className="px-1">
                        <h2 className="text-lg font-semibold leading-snug text-[#172B45] text-balance">
                            Jabatan tinggi, ancaman, dan tenggat singkat bukan
                            bukti pesan asli.
                        </h2>
                        <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-[#4E5A69] text-pretty">
                            Pelaku sengaja membuat Anda takut atau segan supaya
                            bertindak cepat sebelum sempat berpikir. Lima pemicu
                            yang paling sering dipakai:
                        </p>

                        <dl className="mt-4 divide-y divide-[#DDD9CF] border-y border-[#DDD9CF]">
                            {COMMON_TRIGGERS.map((trigger) => (
                                <div
                                    key={trigger.name}
                                    className="grid grid-cols-1 gap-1 py-2.5 text-sm sm:grid-cols-[11rem_1fr] sm:gap-4"
                                >
                                    <dt className="font-semibold text-[#172B45]">
                                        {trigger.name}
                                    </dt>
                                    <dd className="text-[#4E5A69]">
                                        {trigger.example}
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
                                Berhenti sebentar, lalu verifikasi
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
                        Unit 3, Periksa tautan dan gembok
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
                          ? "Selesaikan Unit 2"
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