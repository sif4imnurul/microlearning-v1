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
            <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#243247] bg-[#111827] text-white shadow-[0_2px_10px_rgba(17,24,39,0.16)]">
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
                            className={`rounded-xl border px-3.5 py-3 text-xs leading-relaxed ${
                                highlightRisks
                                    ? "border-[#E8B7AC]/60 bg-[#3B1D19] text-[#FEE2E2]"
                                    : "border-white/15 bg-white/8 text-[#F3F4F6]"
                            }`}
                        >
                            <p className="text-[11px] font-medium text-[#CBD5E1]">
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
                        <div className="mt-2.5 rounded-lg border border-white/15 bg-[#1F2937] px-3 py-2 text-[11px] leading-relaxed text-[#F3F4F6]">
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
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                callAction === "give_otp"
                                    ? "border-[#FCA5A5] bg-[#7F1D1D] text-white"
                                    : "border-white/20 bg-[#1F2937] text-[#F3F4F6] hover:bg-[#374151]"
                            }`}
                        >
                            Sebutkan kode OTP
                        </button>

                        <button
                            type="button"
                            onClick={() => onCallAction("hang_up")}
                            aria-pressed={callAction === "hang_up"}
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                callAction === "hang_up"
                                    ? "border-[#86EFAC] bg-[#145C3A] text-white"
                                    : "border-white/20 bg-[#1F2937] text-[#F3F4F6] hover:bg-[#374151]"
                            }`}
                        >
                            Tutup telepon
                        </button>
                    </div>

                    {callAction && (
                        <div
                            role="status"
                            className={`animate-reveal-in mt-2.5 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                                callAction === "hang_up"
                                    ? "border-[#86EFAC]/40 bg-[#145C3A]/35 text-[#ECFDF5]"
                                    : "border-[#FCA5A5]/45 bg-[#7F1D1D]/55 text-[#FEF2F2]"
                            }`}
                        >
                            {callAction === "hang_up"
                                ? "Langkah aman. Petugas resmi tidak pernah meminta OTP, PIN, atau password lewat telepon."
                                : "Berbahaya. Memberikan OTP justru membuat pelaku bisa langsung mengambil alih akun dan transaksi Anda."}
                        </div>
                    )}
                </div>
            </div>

            {/* Panel 2: Realistic Interactive MFA Push Prompt */}
            <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#DADCE0] bg-white shadow-[0_2px_10px_rgba(23,43,69,0.08)]">
                <div>
                    {/* Push Header */}
                    <div className="flex items-center justify-between border-b border-[#ECEEF2] bg-[#F8F9FA] px-4 py-2.5 text-[11px] text-[#4E5A69]">
                        <span className="font-semibold text-[#172B45]">
                            Notifikasi Keamanan · DompetKu
                        </span>
                        <span>Baru saja</span>
                    </div>

                    <div className="p-5">
                        <div className="flex items-start gap-3">
                            <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172B45] text-white"
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
                                <p className="mt-0.5 text-xs text-[#4E5A69]">
                                    Seseorang mencoba masuk ke akun DompetKu
                                    Anda.
                                </p>
                            </div>
                        </div>

                        {/* Request Metadata */}
                        <dl
                            className={`mt-4 space-y-2 rounded-xl border px-3.5 py-3 text-xs ${
                                highlightRisks
                                    ? "border-[#E8B7AC] bg-[#FDF1EE]"
                                    : "border-[#E5E7EB] bg-[#FAF9F5]"
                            }`}
                        >
                            <div className="flex justify-between gap-3">
                                <dt className="text-[#4E5A69]">Perangkat</dt>
                                <dd className="text-right font-medium text-[#1C2430]">
                                    Chrome · Windows 11
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-[#4E5A69]">Lokasi</dt>
                                <dd className="text-right font-medium text-[#1C2430]">
                                    Surabaya, Indonesia
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3 border-t border-[#E5E7EB] pt-2">
                                <dt className="text-[#4E5A69]">Aktivitas</dt>
                                <dd className="text-right font-semibold text-[#A62D14]">
                                    Anda tidak sedang login
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* MFA Push Equal-Weight Actions */}
                <div className="border-t border-[#ECEEF2] bg-[#FAF9F5] px-4 py-3.5">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => onMfaAction("approve")}
                            aria-pressed={mfaAction === "approve"}
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                mfaAction === "approve"
                                    ? "border-[#A62D14] bg-[#FDF1EE] text-[#A62D14]"
                                    : "border-[#C6C1B5] bg-white text-[#1C2430] hover:border-[#172B45]"
                            }`}
                        >
                            Setujui
                        </button>

                        <button
                            type="button"
                            onClick={() => onMfaAction("reject")}
                            aria-pressed={mfaAction === "reject"}
                            className={`min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                mfaAction === "reject"
                                    ? "border-[#145C3A] bg-[#ECF7F1] text-[#145C3A]"
                                    : "border-[#C6C1B5] bg-white text-[#1C2430] hover:border-[#172B45]"
                            }`}
                        >
                            Tolak
                        </button>
                    </div>

                    {mfaAction && (
                        <div
                            role="status"
                            className={`animate-reveal-in mt-2.5 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                                mfaAction === "reject"
                                    ? "border-[#B9DFC8] bg-[#ECF7F1] text-[#145C3A]"
                                    : "border-[#E8B7AC] bg-[#FDF1EE] text-[#A62D14]"
                            }`}
                        >
                            {mfaAction === "reject"
                                ? "Langkah aman. Permintaan login yang tidak Anda mulai langsung diblokir."
                                : "Berbahaya. Menekan Setujui padahal Anda tidak sedang login langsung membuka akses akun untuk pelaku."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
