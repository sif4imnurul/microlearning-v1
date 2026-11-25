"use client";

import { useRef, useState } from "react";
import PhoneMfaSimulator from "@/components/microlearning/simulators/PhoneMfaSimulator";
import type { UnitProps } from "@/components/microlearning/UnitParts";

type Decision = "comply" | "reject" | null;
type CallAction = "give_otp" | "hang_up" | null;
type MfaAction = "approve" | "reject" | null;

const SITUATIONS = [
    {
        situation: "Diminta password, PIN, OTP, atau recovery code",
        stance: "Tidak diberikan lewat email, chat, atau telepon.",
    },
    {
        situation: "Muncul prompt MFA yang tidak Anda mulai",
        stance: "Tolak segera.",
    },
    {
        situation: "Prompt MFA muncul setelah Anda sendiri memulai login",
        stance: "Wajar. Periksa detailnya, lalu boleh disetujui.",
    },
    {
        situation: "MFA pada akun penting",
        stance: "Tetap dianjurkan untuk perlindungan tambahan.",
    },
];

const SAFE_ACTIONS = [
    "Jangan menyebutkan atau mengirim kode dalam bentuk apa pun.",
    "Tolak permintaan persetujuan yang tidak Anda mulai.",
    "Setelah itu, cek aktivitas dan ganti password melalui aplikasi atau situs resmi.",
];

export default function Unit5({
    seconds,
    isSaving,
    isTimeLocked,
    errorMessage,
    onFinish,
}: UnitProps) {
    const [callAction, setCallAction] = useState<CallAction>(null);
    const [mfaAction, setMfaAction] = useState<MfaAction>(null);
    const [decision, setDecision] = useState<Decision>(null);
    const revealRef = useRef<HTMLDivElement | null>(null);

    const isRevealed = decision !== null;
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");

    function handleDecision(choice: Exclude<Decision, null>) {
        setDecision(choice);

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
                            05
                        </span>
                        <div className="max-w-[52ch]">
                            <p className="text-xs font-medium text-[#D8E2EE]">
                                Autentikasi dan kode rahasia
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white text-balance sm:text-[1.75rem]">
                                Kode Rahasia dan MFA
                            </h1>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#D8E2EE] text-pretty">
                                Jangan berikan kode rahasia kepada siapa pun dan
                                tolak permintaan persetujuan MFA yang tidak Anda
                                mulai sendiri.
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
                    Anda sedang memakai layanan perbankan
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#4E5A69]">
                    Tidak ada transaksi yang Anda mulai. Telepon dan notifikasi
                    MFA datang untuk meminta kode atau persetujuan. Nomor resmi
                    layanan dapat dicek melalui aplikasi atau situs resmi.
                </p>
            </section>

            {/* Primary Focal Point: Incoming Call + Interactive MFA Push */}
            <section
                className="mt-6"
                aria-label="Simulasi telepon meminta OTP dan notifikasi MFA"
            >
                <PhoneMfaSimulator
                    callAction={callAction}
                    mfaAction={mfaAction}
                    onCallAction={setCallAction}
                    onMfaAction={setMfaAction}
                    highlightRisks={isRevealed}
                />

                <p className="mt-2.5 text-xs text-[#4E5A69]">
                    Simulasi latihan. Nama layanan, nomor telepon, nominal, dan
                    kode OTP di atas hanya rekaan.
                </p>
            </section>

            {/* Equal-Weight Decision Prompt */}
            {!isRevealed && (
                <section className="mt-6 rounded-xl border border-[#DDD9CF] bg-white px-5 py-5 sm:px-6">
                    <p className="text-base font-semibold leading-snug text-[#172B45] text-balance">
                        Penelepon yang mengaku CS meminta kode OTP, lalu muncul
                        notifikasi persetujuan login padahal Anda tidak sedang
                        login. Apa tindakan paling aman?
                    </p>
                    <p className="mt-1 text-xs text-[#4E5A69]">
                        Anda dapat mencoba tombol respons pada kedua simulasi di
                        atas sebelum menentukan jawaban.
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleDecision("comply")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Sebutkan OTP agar transaksi batal dan setujui login
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDecision("reject")}
                            className="min-h-12 flex-1 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-4 py-3 text-sm font-semibold text-[#1C2430] transition-all hover:border-[#172B45] hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Tutup telepon dan tolak permintaan login
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
                    {/* Section A: Unified 2-Part Red Flag Breakdown */}
                    <section className="rounded-xl border border-[#DDD9CF] bg-white p-5 sm:p-6">
                        <div className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    decision === "reject"
                                        ? "bg-[#ECF7F1] text-[#145C3A]"
                                        : "bg-[#FEF6E7] text-[#8A4B08]"
                                }`}
                                aria-hidden="true"
                            >
                                {decision === "reject" ? "✓" : "!"}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-semibold leading-snug sm:text-base ${
                                        decision === "reject"
                                            ? "text-[#145C3A]"
                                            : "text-[#8A4B08]"
                                    }`}
                                >
                                    {decision === "reject"
                                        ? "Tepat. Kode OTP dan persetujuan MFA adalah kunci akun Anda."
                                        : "Memberikan OTP atau menyetujui prompt asing justru memberi pelaku akses langsung ke akun Anda."}
                                </p>
                                <p className="mt-1 text-xs text-[#4E5A69]">
                                    Dua tanda bahaya pada simulasi di atas:
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-[#DDD9CF]">
                            <div className="grid grid-cols-1 divide-y divide-[#DDD9CF] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                <div className="bg-[#FDF1EE] px-4 py-3.5">
                                    <p className="text-[11px] font-semibold text-[#A62D14]">
                                        1. Kode OTP diminta lewat telepon
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#1C2430]">
                                        &ldquo;Sebutkan 6 digit kode OTP&rdquo;
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                        Kode OTP adalah kunci akun Anda dan
                                        tidak pernah diminta oleh petugas resmi.
                                    </p>
                                </div>

                                <div className="bg-[#FEF6E7] px-4 py-3.5">
                                    <p className="text-[11px] font-semibold text-[#8A4B08]">
                                        2. Persetujuan yang tidak Anda mulai
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#1C2430]">
                                        &ldquo;Setujui permintaan login?&rdquo;
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#4E5A69]">
                                        Notifikasi muncul padahal Anda tidak
                                        sedang login. Pelaku sedang mencoba
                                        masuk dan menunggu Anda menyetujui.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section B: Core Concept & 4 Situation Rules */}
                    <section className="px-1">
                        <h2 className="text-lg font-semibold leading-snug text-[#172B45] text-balance">
                            Password, PIN, OTP, dan recovery code tidak
                            diberikan lewat email, chat, atau telepon.
                        </h2>
                        <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-[#4E5A69] text-pretty">
                            Petugas yang sebenarnya tidak perlu mengetahui kode
                            tersebut. Jangan menyetujui prompt MFA yang tidak
                            Anda mulai sendiri, namun MFA tetap dianjurkan untuk
                            akun penting:
                        </p>

                        <dl className="mt-4 divide-y divide-[#DDD9CF] border-y border-[#DDD9CF]">
                            {SITUATIONS.map((item) => (
                                <div
                                    key={item.situation}
                                    className="grid grid-cols-1 gap-1 py-2.5 text-sm sm:grid-cols-[17rem_1fr] sm:gap-4"
                                >
                                    <dt className="font-semibold text-[#172B45]">
                                        {item.situation}
                                    </dt>
                                    <dd className="text-[#4E5A69]">
                                        {item.stance}
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
                                Kode tetap rahasia, permintaan asing ditolak
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
                        Unit 6, Verifikasi dan laporkan
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
                            ? "Selesaikan Unit 5"
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