"use client";

import { useRef, useState } from "react";
import PhoneMfaSimulator from "@/components/microlearning/simulators/PhoneMfaSimulator";
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

type Decision = "comply" | "reject" | null;
type CallAction = "give_otp" | "hang_up" | null;
type MfaAction = "approve" | "reject" | null;

const SITUATIONS = [
    {
        situation: "Diminta password, PIN, OTP, atau recovery code MFA",
        stance: "Selalu tolak. Petugas resmi, atasan, atau tim IT tidak pernah memintanya lewat chat, email, maupun telepon.",
    },
    {
        situation: "Prompt MFA muncul sekali atau berturut-turut tanpa Anda login",
        stance: "Tolak semuanya (jangan disetujui agar berhenti), lalu ganti password lewat aplikasi resmi.",
    },
    {
        situation: "Prompt MFA muncul tepat setelah Anda sendiri login",
        stance: "Wajar. Cek kecocokan perangkat dan lokasinya, lalu boleh disetujui.",
    },
    {
        situation: "Pengaturan MFA pada akun penting",
        stance: "Tetap aktifkan untuk perlindungan tambahan; jangan dimatikan saat menerima serangan.",
    },
];

const SAFE_ACTIONS = [
    "Jangan menyebutkan, mengetik, atau mengirim foto kode rahasia (OTP, PIN, password, recovery code) kepada siapa pun.",
    "Tolak semua permintaan persetujuan MFA yang tidak Anda mulai sendiri, termasuk jika datang berulang kali.",
    "Segera cek riwayat aktivitas dan ganti password lewat aplikasi atau situs resmi yang Anda buka sendiri.",
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

    function handleCallAction(action: Exclude<CallAction, null>) {
        setCallAction(action);
        if (action === "hang_up") {
            showNotice(
                "positive",
                "Petugas resmi tidak pernah meminta OTP, PIN, atau password lewat telepon."
            );
        } else {
            showNotice(
                "danger",
                "Memberikan OTP justru membuat pelaku bisa langsung mengambil alih akun dan transaksi Anda."
            );
        }
    }

    function handleMfaAction(action: Exclude<MfaAction, null>) {
        setMfaAction(action);
        if (action === "reject") {
            showNotice(
                "positive",
                "Permintaan login yang tidak Anda mulai langsung diblokir."
            );
        } else {
            showNotice(
                "danger",
                "Menekan Setujui padahal Anda tidak sedang login langsung membuka akses akun untuk pelaku."
            );
        }
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

    return (
        <article className="mx-auto w-full max-w-[780px] text-[#0F172A]">
            <UnitHeaderBand
                unitCode="05"
                title="Kode Rahasia dan MFA"
                subtitle="Jangan berikan kode rahasia kepada siapa pun dan bedakan prompt MFA yang sah dari upaya pembobolan."
                seconds={seconds}
            />

            <ScenarioBriefingStrip
                roleTitle="Anda pengguna akun dompet digital DompetKu"
                situation="Saat ini Anda tidak sedang bertransaksi atau login di perangkat mana pun. Tiba-tiba masuk telepon mengaku CS sekaligus notifikasi persetujuan login MFA di layar ponsel Anda."
                referenceLabel="Status aktivitas Anda"
                referenceValue="Tidak sedang login atau bertransaksi"
                referenceTone="neutral"
            />

            {/* Stage 02: Elevated Hero Simulator */}
            <section
                className="mt-10"
                aria-label="Simulasi telepon meminta OTP dan notifikasi MFA"
            >
                <StageHeader
                    step="02"
                    label="Periksa simulasi"
                    hint="Anda bisa mencoba tombol respons di bawah ini"
                />

                <div className="mt-3.5">
                    <PhoneMfaSimulator
                        callAction={callAction}
                        mfaAction={mfaAction}
                        onCallAction={handleCallAction}
                        onMfaAction={handleMfaAction}
                        highlightRisks={isRevealed}
                    />
                </div>

                <p className="mt-3 text-xs text-ink-secondary">
                    Simulasi latihan. Nama layanan, nomor telepon, nominal, dan
                    kode OTP di atas hanya rekaan.
                </p>
            </section>

            {/* Stage 03: Unboxed Decision Prompt -> Elevated 2-Step Pembahasan */}
            {!isRevealed && (
                <DecisionPromptSection
                    question="Penelepon yang mengaku CS meminta kode OTP, lalu muncul notifikasi persetujuan login padahal Anda tidak sedang login. Apa tindakan paling aman?"
                    helper="Anda dapat mencoba tombol respons pada kedua simulasi di atas sebelum menentukan jawaban."
                    optionA="Sebutkan OTP agar transaksi batal dan setujui login"
                    optionB="Tutup telepon dan tolak permintaan login"
                    onSelectA={() => handleDecision("comply")}
                    onSelectB={() => handleDecision("reject")}
                />
            )}

            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-11 scroll-mt-20"
                >
                    <PostDecisionStepper
                        isCorrect={decision === "reject"}
                        verdictTitle={
                            decision === "reject"
                                ? "Tepat. Kode OTP dan persetujuan MFA adalah kunci akun Anda."
                                : "Memberikan OTP atau menyetujui prompt asing justru membuka akses akun langsung untuk pelaku."
                        }
                        verdictSubtitle="Bandingkan kapan permintaan MFA wajib ditolak dan kapan wajar disetujui."
                        step1Label="1. Ditolak vs Aman"
                        step2Label="2. Inti & Langkah Aman"
                        step1Content={
                            <div className="grid grid-cols-1 divide-y divide-border-subtle md:grid-cols-2 md:divide-x md:divide-y-0">
                                <div className="border-t-[3px] border-t-signal-danger bg-white p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-danger">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-danger"
                                            aria-hidden="true"
                                        />
                                        Wajib ditolak (bukan aktivitas Anda)
                                    </p>
                                    <ul className="mt-3 list-disc space-y-2 pl-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <li>
                                            Muncul notifikasi login padahal Anda
                                            tidak sedang login, atau datang{" "}
                                            <strong className="font-semibold text-ink-primary">
                                                berturut-turut beberapa kali
                                            </strong>{" "}
                                            agar Anda kesal lalu menekan
                                            Setujui.
                                        </li>
                                        <li>
                                            Penelepon atau chat mengaku CS /
                                            Kepala IT meminta{" "}
                                            <strong className="font-semibold text-ink-primary">
                                                OTP, PIN, password, atau
                                                recovery code MFA
                                            </strong>
                                            .
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t-[3px] border-t-signal-safe bg-[#F8FAFC] p-5 sm:p-7">
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-signal-safe">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full bg-signal-safe"
                                            aria-hidden="true"
                                        />
                                        Prompt MFA asli yang aman
                                    </p>
                                    <p className="mt-3 text-sm font-semibold text-ink-brand">
                                        Login yang baru saja Anda mulai sendiri
                                    </p>
                                    <p className="mt-2 text-[15px] leading-[1.6] text-[#334155]">
                                        Anda baru login di laptop atau ponsel
                                        Anda sendiri, lalu muncul prompt MFA
                                        yang menampilkan perangkat dan lokasi
                                        sesuai. Cek detailnya, lalu boleh tekan{" "}
                                        <strong className="font-semibold text-signal-safe">
                                            Setujui
                                        </strong>
                                        .
                                    </p>
                                </div>
                            </div>
                        }
                        step2Content={
                            <div>
                                <div className="px-5 py-6 sm:px-7 sm:py-7">
                                    <h2 className="text-base font-semibold leading-snug text-ink-brand">
                                        Kode rahasia tidak pernah diberikan
                                        lewat email, chat, atau telepon
                                    </h2>
                                    <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-secondary">
                                        Jangan pula mengirim sebagian kode atau
                                        foto kode yang diburamkan. Ringkasan
                                        sikap untuk empat situasi autentikasi:
                                    </p>

                                    <dl className="mt-4 max-w-[62ch] divide-y divide-border-subtle border-y border-border-subtle">
                                        {SITUATIONS.map((item) => (
                                            <div
                                                key={item.situation}
                                                className="grid grid-cols-1 gap-1 py-3.5 text-[15px] sm:grid-cols-[16.5rem_1fr] sm:gap-4"
                                            >
                                                <dt className="font-semibold text-ink-brand">
                                                    {item.situation}
                                                </dt>
                                                <dd className="leading-[1.6] text-ink-secondary">
                                                    {item.stance}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <SafeActionList
                                    title="Langkah aman: kode tetap rahasia, permintaan asing ditolak"
                                    items={SAFE_ACTIONS}
                                />
                            </div>
                        }
                    />
                </div>
            )}

            <UnitFooterBar
                unitNumber={5}
                nextTitle="Unit 6, Verifikasi dan laporkan"
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