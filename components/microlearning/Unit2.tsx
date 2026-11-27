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

type Decision = "comply" | "verify" | null;

const COMMON_TRIGGERS = [
    {
        name: "Jabatan atau peran resmi",
        example: "Mengaku direktur, dekan, kepala IT, atau admin sistem",
    },
    {
        name: "Ancaman penutupan",
        example: "Akun dibekukan, data dihapus, atau sedang diselidiki",
    },
    {
        name: "Tenggat sangat singkat",
        example: '"Dalam 15 menit", "hari ini pukul 15.00", "audit mendadak"',
    },
    {
        name: "Rasa takut dan sanksi",
        example: "Denda, masalah hukum, atau permintaan pembayaran segera",
    },
    {
        name: "Hadiah terbatas",
        example: "Menang undian, bonus, atau voucher yang harus diklaim cepat",
    },
];

const SAFE_ACTIONS = [
    "Jangan klik tombol, jangan jalankan tautan akses jarak jauh (remote-access), dan jangan membalas pesan.",
    "Berhenti sejenak lalu tanyakan: mengapa pesan ini memaksa saya bertindak cepat atau merahasiakannya?",
    "Konfirmasi langsung ke atasan, helpdesk, atau tim IT lewat kontak resmi yang Anda cari sendiri.",
];

export default function Unit2({
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

    function handleClickVerifyButton() {
        showNotice(
            "caution",
            "Tekanan batas waktu, nama atasan, dan larangan bertanya adalah tanda manipulasi, bukan bukti pesan asli. Verifikasi lewat kanal resmi kantor terlebih dahulu."
        );
    }

    function handleAttemptEmailAction(action: "Balas" | "Teruskan") {
        showNotice(
            "caution",
            action === "Balas"
                ? "Jangan membalas langsung ke email yang menekan Anda. Konfirmasi langsung ke atasan atau tim IT lewat kontak resmi."
                : "Sebelum meneruskan, pastikan keaslian pesan ini lewat kanal internal resmi agar rekan lain tidak ikut terpancing."
        );
    }

    function handleReportSpam() {
        showNotice(
            "positive",
            "Pesan yang memanfaatkan nama atasan untuk memaksa tindakan cepat layak dilaporkan ke tim keamanan."
        );
    }

    function handleDeleteEmail() {
        showNotice(
            "positive",
            "Menghapus pesan menghindari klik tidak sengaja, namun melaporkannya membantu tim keamanan mencegah rekan lain tertipu."
        );
    }

    function highlightPhrase(text: string) {
        if (!isRevealed) {
            return text;
        }
        return (
            <mark className="inline rounded-sm bg-[#FEF3F2] px-1 py-0.5 font-semibold text-[#B42318] underline decoration-[#B42318]/45 underline-offset-2">
                {text}
            </mark>
        );
    }

    return (
        <article className="mx-auto w-full max-w-[780px] text-[#0F172A]">
            <UnitHeaderBand
                unitCode="02"
                title="Jangan Mudah Terpancing"
                subtitle="Kenali tekanan di dalam pesan sebagai tanda bahaya, bukan tanda bahwa pesan itu asli."
                seconds={seconds}
            />

            <ScenarioBriefingStrip
                roleTitle="Anda adalah staf di PT Karya Mandiri Nusantara"
                situation="Di tengah jam kerja, masuk email mendesak yang mengatasnamakan Direktur Operasional. Anda memiliki kontak internal atasan dan helpdesk IT untuk konfirmasi."
                referenceLabel="Domain resmi kantor"
                referenceValue="karyamandiri.co.id"
                referenceMono
            />

            {/* Stage 02: Elevated Hero Simulator */}
            <section className="mt-10" aria-label="Simulasi email mendesak">
                <StageHeader
                    step="02"
                    label="Periksa simulasi"
                    hint="Perhatikan nada mendesak dan domain pengirimnya"
                />

                <div className="mt-3.5 rounded-xl shadow-[0_2px_6px_rgba(15,23,42,0.05),0_12px_28px_-10px_rgba(15,23,42,0.1)]">
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
                            subject:
                                "[SEGERA] Akun email Anda ditutup pukul 15.00",
                            mailedBy: "karyamandiri-mail.com",
                            securityLabel: "Enkripsi standar (TLS)",
                        }}
                        detailsOpen={detailsOpen}
                        onToggleDetails={() => setDetailsOpen((prev) => !prev)}
                        onCloseDetails={() => setDetailsOpen(false)}
                        revealAnnotations={isRevealed}
                        suspiciousPart="-mail.com"
                        onReplyClick={() => handleAttemptEmailAction("Balas")}
                        onForwardClick={() =>
                            handleAttemptEmailAction("Teruskan")
                        }
                        onReportSpamClick={handleReportSpam}
                        onDeleteClick={handleDeleteEmail}
                    >
                        <div className="space-y-3.5 text-[15px] leading-relaxed text-[#1F1F1F]">
                            <p>Selamat siang,</p>

                            <p>
                                Saya sedang rapat dengan direksi dan tidak bisa
                                ditelepon. Akun email kerja Anda akan{" "}
                                {highlightPhrase("ditutup permanen")}{" "}
                                {highlightPhrase("hari ini pukul 15.00")} jika
                                verifikasi belum selesai.
                            </p>

                            <p>
                                {highlightPhrase(
                                    "Ini perintah langsung dari saya."
                                )}{" "}
                                Selesaikan sekarang dan{" "}
                                {highlightPhrase(
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

                            <div className="border-t border-[#ECEEF2] pt-3 text-xs leading-relaxed text-[#475569]">
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
                </div>

                <p className="mt-3 text-xs text-ink-secondary">
                    Simulasi latihan. Nama, jabatan, perusahaan, dan alamat di
                    atas hanya rekaan.
                </p>
            </section>

            {/* Stage 03: Unboxed Decision Prompt -> Elevated 2-Step Pembahasan */}
            {!isRevealed && (
                <DecisionPromptSection
                    question="Email ini mengatasnamakan Direktur Operasional dengan batas waktu pukul 15.00. Tindakan apa yang paling tepat?"
                    helper="Perhatikan nada mendesak, larangan berdiskusi, serta domain pengirim di bagian atas email."
                    optionA="Segera verifikasi sebelum pukul 15.00"
                    optionB="Berhenti dulu, lalu konfirmasi lewat kanal resmi"
                    onSelectA={() => handleDecision("comply")}
                    onSelectB={() => handleDecision("verify")}
                />
            )}

            {isRevealed && (
                <div
                    ref={revealRef}
                    className="animate-reveal-in mt-11 scroll-mt-20"
                >
                    <PostDecisionStepper
                        isCorrect={decision === "verify"}
                        verdictTitle={
                            decision === "verify"
                                ? "Tepat. Tekanan waktu, ancaman, dan jabatan tinggi bukan bukti pesan asli."
                                : "Pelaku sengaja membuat Anda panik agar langsung klik tanpa sempat mengecek keaslian pesan."
                        }
                        verdictSubtitle="Bandingkan tanda manipulasi pada email tadi dengan contoh komunikasi resmi di bawah ini."
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
                                        Email simulasi (Manipulatif)
                                    </p>

                                    <ul className="mt-4 space-y-3 text-[15px] leading-[1.6] text-[#334155]">
                                        <li>
                                            <strong className="font-semibold text-ink-primary">
                                                Jabatan tinggi:
                                            </strong>{" "}
                                            &ldquo;Ini perintah langsung dari
                                            saya.&rdquo; Memakai wewenang
                                            atasan/IT agar Anda segan bertanya.
                                        </li>
                                        <li>
                                            <strong className="font-semibold text-ink-primary">
                                                Ancaman &amp; tenggat:
                                            </strong>{" "}
                                            &ldquo;ditutup permanen hari ini
                                            pukul 15.00&rdquo; agar Anda panik
                                            dan tergesa-gesa.
                                        </li>
                                        <li>
                                            <strong className="font-semibold text-ink-primary">
                                                Larangan bertanya:
                                            </strong>{" "}
                                            &ldquo;jangan diskusikan dengan
                                            siapa pun&rdquo; agar Anda tidak
                                            mengecek ke rekan atau helpdesk.
                                        </li>
                                        <li>
                                            <strong className="font-semibold text-ink-primary">
                                                Domain palsu:
                                            </strong>{" "}
                                            dikirim dari{" "}
                                            <span className="font-mono text-sm font-semibold text-signal-danger">
                                                karyamandiri-mail.com
                                            </span>
                                            , bukan{" "}
                                            <span className="font-mono text-sm font-semibold text-signal-safe">
                                                karyamandiri.co.id
                                            </span>
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
                                        Contoh komunikasi resmi
                                    </p>

                                    <p className="mt-4 font-mono text-xs font-semibold text-signal-safe [overflow-wrap:anywhere]">
                                        it-helpdesk@karyamandiri.co.id
                                    </p>
                                    <p className="mt-2 text-[15px] leading-[1.6] text-[#334155]">
                                        &ldquo;Pemeliharaan email dijadwalkan
                                        Jumat pukul 20.00. Tidak ada tindakan
                                        login yang diminta. Hubungi ekstensi
                                        helpdesk resmi bila ada kendala.&rdquo;
                                    </p>

                                    <div className="mt-5 border-t border-border-subtle pt-4 text-[15px] leading-[1.6] text-[#334155]">
                                        <p className="text-sm font-semibold text-ink-brand">
                                            Ciri pesan resmi (email, chat,
                                            telepon):
                                        </p>
                                        <p className="mt-1.5">
                                            Tidak memaksa bertindak dalam
                                            hitungan menit, tidak melarang
                                            konfirmasi ke helpdesk, dan tidak
                                            pernah meminta password, OTP /
                                            recovery code, pembayaran mendadak,
                                            atau tautan remote-access.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                        step2Content={
                            <div>
                                <div className="px-5 py-6 sm:px-7 sm:py-7">
                                    <h2 className="text-base font-semibold leading-snug text-ink-brand">
                                        Lima pemicu psikologis yang paling sering
                                        dipakai pelaku
                                    </h2>
                                    <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-secondary">
                                        Tekanan emosi dibuat agar Anda langsung
                                        patuh sebelum sempat mengecek keaslian
                                        pesan.
                                    </p>

                                    <dl className="mt-4 max-w-[62ch] divide-y divide-border-subtle border-y border-border-subtle">
                                        {COMMON_TRIGGERS.map((trigger) => (
                                            <div
                                                key={trigger.name}
                                                className="grid grid-cols-1 gap-1 py-3.5 text-[15px] sm:grid-cols-[12.5rem_1fr] sm:gap-4"
                                            >
                                                <dt className="font-semibold text-ink-brand">
                                                    {trigger.name}
                                                </dt>
                                                <dd className="leading-relaxed text-ink-secondary">
                                                    {trigger.example}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <SafeActionList
                                    title="Langkah aman: berhenti sebentar, lalu verifikasi"
                                    items={SAFE_ACTIONS}
                                />
                            </div>
                        }
                    />
                </div>
            )}

            <UnitFooterBar
                unitNumber={2}
                nextTitle="Unit 3, Periksa tautan dan gembok"
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