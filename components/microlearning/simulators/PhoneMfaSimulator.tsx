"use client";

type CallAction = "give_otp" | "hang_up" | null;
type MfaAction = "approve" | "reject" | null;

type PhoneMfaSimulatorProps = {
    callAction: CallAction;
    mfaAction: MfaAction;
    onCallAction: (action: Exclude<CallAction, null>) => void;
    onMfaAction: (action: Exclude<MfaAction, null>) => void;
    highlightRisks?: boolean;
};

export default function PhoneMfaSimulator({
    callAction,
    mfaAction,
    onCallAction,
    onMfaAction,
    highlightRisks = false,
}: PhoneMfaSimulatorProps) {
    return (
        <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            style={{
                fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            {/* Panel 1: Realistic Smartphone Incoming Call UI */}
            <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#1E293B] bg-[#0F172A] text-white shadow-[0_1px_2px_rgba(15,23,42,0.12),0_8px_24px_rgba(15,23,42,0.1)]">
                <div>
                    {/* Phone status bar */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[11px] text-[#CBD5E1]">
                        <span className="font-mono tabular-nums">19.24</span>
                        <span>Telepon berlangsung · 00:38</span>
                    </div>

                    {/* Caller Identity */}
                    <div className="px-5 pt-5 pb-4 text-center">
                        <div
                            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-sm font-semibold text-white"
                            aria-hidden="true"
                        >
                            DK
                        </div>
                        <p className="mt-2.5 text-base font-semibold text-white">
                            CS DompetKu Care
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-[#CBD5E1]">
                            +62 21-5098-4112
                        </p>
                    </div>

                    {/* Call Transcript Box */}
                    <div className="px-4 pb-3">
                        <div
                            className={`rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${
                                highlightRisks
                                    ? "border-[#FCA5A5]/45 bg-[#3B1518] text-[#FEE2E2]"
                                    : "border-white/15 bg-white/8 text-[#F1F5F9]"
                            }`}
                        >
                            <p
                                className={`text-[11px] font-medium ${
                                    highlightRisks
                                        ? "text-[#FECACA]"
                                        : "text-[#CBD5E1]"
                                }`}
                            >
                                Suara penelepon:
                            </p>
                            <p className="mt-1">
                                &ldquo;Halo, terdeteksi transaksi Rp2.450.000 di
                                akun Anda. Sebutkan 6 digit kode OTP yang baru
                                masuk agar transaksi bisa segera
                                dibatalkan.&rdquo;
                            </p>
                        </div>

                        {/* Incoming SMS OTP Peek */}
                        <div className="mt-2.5 rounded-lg border border-white/15 bg-[#1E293B] px-3 py-2 text-[11px] leading-relaxed text-[#F1F5F9]">
                            <span className="font-semibold text-white">
                                SMS · DompetKu:
                            </span>{" "}
                            Kode OTP{" "}
                            <span className="font-mono font-semibold text-white">
                                482910
                            </span>
                            . Rahasia, jangan berikan ke siapa pun.
                        </div>
                    </div>
                </div>

                {/* Call Interactive Controls */}
                <div className="border-t border-white/10 px-4 py-3.5">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => onCallAction("give_otp")}
                            aria-pressed={callAction === "give_otp"}
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                callAction === "give_otp"
                                    ? "border-[#FCA5A5] bg-[#7F1D1D] text-white"
                                    : "border-white/20 bg-[#1E293B] text-[#F1F5F9] hover:bg-[#334155]"
                            }`}
                        >
                            Sebutkan kode OTP
                        </button>

                        <button
                            type="button"
                            onClick={() => onCallAction("hang_up")}
                            aria-pressed={callAction === "hang_up"}
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                callAction === "hang_up"
                                    ? "border-[#86EFAC] bg-[#065F46] text-white"
                                    : "border-white/20 bg-[#1E293B] text-[#F1F5F9] hover:bg-[#334155]"
                            }`}
                        >
                            Tutup telepon
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel 2: Realistic Interactive MFA Push Prompt */}
            <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#CBD5E1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.06)]">
                <div>
                    {/* Push Header */}
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[11px] text-[#475569]">
                        <span className="font-semibold text-[#172B45]">
                            Notifikasi Keamanan · DompetKu
                        </span>
                        <span>Baru saja</span>
                    </div>

                    <div className="p-5">
                        <div className="flex items-start gap-3">
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172B45] text-white"
                                aria-hidden="true"
                            >
                                <svg
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 1.5 3.5 4.25v4.92c0 4.02 2.77 7.77 6.5 8.83 3.73-1.06 6.5-4.81 6.5-8.83V4.25L10 1.5Zm0 5a1.25 1.25 0 0 1 1.25 1.25v3a1.25 1.25 0 1 1-2.5 0v-3A1.25 1.25 0 0 1 10 6.5Zm0 7.5a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <div>
                                <p className="text-base font-semibold leading-snug text-[#172B45]">
                                    Setujui permintaan login?
                                </p>
                                <p className="mt-0.5 text-xs text-[#475569]">
                                    Seseorang mencoba masuk ke akun DompetKu
                                    Anda.
                                </p>
                            </div>
                        </div>

                        {/* Request Metadata */}
                        <dl
                            className={`mt-4 space-y-2 rounded-lg border px-3.5 py-3 text-xs ${
                                highlightRisks
                                    ? "border-[#F5C2C0] bg-[#FFF8F7]"
                                    : "border-[#E2E8F0] bg-[#F8FAFC]"
                            }`}
                        >
                            <div className="flex justify-between gap-3">
                                <dt
                                    className={
                                        highlightRisks
                                            ? "text-[#7A1A14]"
                                            : "text-[#475569]"
                                    }
                                >
                                    Perangkat
                                </dt>
                                <dd className="text-right font-medium text-[#0F172A]">
                                    Chrome · Windows 11
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt
                                    className={
                                        highlightRisks
                                            ? "text-[#7A1A14]"
                                            : "text-[#475569]"
                                    }
                                >
                                    Lokasi
                                </dt>
                                <dd className="text-right font-medium text-[#0F172A]">
                                    Surabaya, Indonesia
                                </dd>
                            </div>
                            <div
                                className={`flex justify-between gap-3 border-t pt-2 ${
                                    highlightRisks
                                        ? "border-[#F5C2C0]/70"
                                        : "border-[#E2E8F0]"
                                }`}
                            >
                                <dt
                                    className={
                                        highlightRisks
                                            ? "text-[#7A1A14]"
                                            : "text-[#475569]"
                                    }
                                >
                                    Aktivitas
                                </dt>
                                <dd className="text-right font-semibold text-[#B42318]">
                                    Anda tidak sedang login
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* MFA Push Equal-Weight Actions */}
                <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => onMfaAction("approve")}
                            aria-pressed={mfaAction === "approve"}
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                mfaAction === "approve"
                                    ? "border-[#B42318] bg-[#FEF3F2] text-[#B42318]"
                                    : "border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#172B45]"
                            }`}
                        >
                            Setujui
                        </button>

                        <button
                            type="button"
                            onClick={() => onMfaAction("reject")}
                            aria-pressed={mfaAction === "reject"}
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                mfaAction === "reject"
                                    ? "border-[#065F46] bg-[#ECFDF5] text-[#065F46]"
                                    : "border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#172B45]"
                            }`}
                        >
                            Tolak
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
