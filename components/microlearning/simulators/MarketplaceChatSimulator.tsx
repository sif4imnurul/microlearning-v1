"use client";

type MarketplaceChatSimulatorProps = {
    storeName: string;
    productName: string;
    productPrice: string;
    whatsappNumber: string;
    reported: boolean;
    highlightRisks?: boolean;
    onClickOffPlatform: () => void;
    onClickVerifyInApp: () => void;
    onClickReportSeller: () => void;
};

export default function MarketplaceChatSimulator({
    storeName,
    productName,
    productPrice,
    whatsappNumber,
    reported,
    highlightRisks = false,
    onClickOffPlatform,
    onClickVerifyInApp,
    onClickReportSeller,
}: MarketplaceChatSimulatorProps) {
    return (
        <div
            className="overflow-hidden rounded-xl border border-[#CBD5E1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.06)]"
            style={{
                fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            {/* Marketplace Chat Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#E2E8F0] bg-white px-4 py-3 sm:flex-nowrap sm:gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#172B45] text-xs font-semibold text-white"
                        aria-hidden="true"
                    >
                        SJ
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-[#172B45]">
                            {storeName}
                        </p>
                        <p className="text-xs leading-snug text-[#475569]">
                            Chat Penjual · Aktif 2 menit lalu
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClickReportSeller}
                    aria-pressed={reported}
                    className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                        reported
                            ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
                            : "border-[#CBD5E1] bg-white text-[#B42318] hover:border-[#F5C2C0] hover:bg-[#FEF3F2]"
                    }`}
                >
                    {reported ? "Penjual dilaporkan" : "Laporkan"}
                </button>
            </div>

            {/* Attached Product Card Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-xs">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#172B45]"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 13a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3M4 13v5a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-[#0F172A]">
                            {productName}
                        </p>
                        <p className="mt-0.5 font-mono font-semibold text-[#172B45]">
                            {productPrice}
                        </p>
                    </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#065F46]">
                    <span
                        className="h-1.5 w-1.5 rounded-full bg-[#065F46]"
                        aria-hidden="true"
                    />
                    Proteksi Transaksi Aktif
                </span>
            </div>

            {/* Platform Built-in Safety Notice */}
            <div className="border-b border-[#E2E8F0] bg-[#F1F5F9]/75 px-4 py-2 text-xs text-[#475569]">
                Demi keamanan, tetap berkomunikasi dan bertransaksi di dalam
                aplikasi marketplace.
            </div>

            {/* Chat Conversation Canvas */}
            <div className="space-y-3 bg-[#F8FAFC] px-4 py-5 sm:px-6">
                {/* Buyer Bubble */}
                <div className="flex justify-end">
                    <div className="max-w-[22rem] rounded-xl rounded-tr-sm bg-[#172B45] px-3.5 py-2.5 text-sm leading-relaxed text-white">
                        <p>Halo kak, barangnya ready untuk dikirim hari ini?</p>
                        <p className="mt-1 text-right text-[11px] text-[#CBD5E1]">
                            16.04
                        </p>
                    </div>
                </div>

                {/* Seller Bubble */}
                <div className="flex justify-start">
                    <div
                        className={`max-w-[27rem] rounded-xl rounded-tl-sm border bg-white px-4 py-3 text-sm leading-relaxed text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.05)] ${
                            highlightRisks
                                ? "border-[#F5C2C0]"
                                : "border-[#E2E8F0]"
                        }`}
                    >
                        <p>
                            Halo kak, barang ready. Agar proses lebih cepat dan
                            tidak terkena biaya tambahan, silakan lanjutkan
                            komunikasi lewat WhatsApp{" "}
                            <span
                                className={`inline rounded-sm px-0.5 py-0.5 font-mono text-xs font-semibold ${
                                    highlightRisks
                                        ? "bg-[#FEF3F2] text-[#B42318] underline decoration-[#B42318]/40 underline-offset-2"
                                        : "bg-[#F1F5F9] text-[#172B45]"
                                }`}
                            >
                                {whatsappNumber}
                            </span>{" "}
                            dan lakukan{" "}
                            <span
                                className={
                                    highlightRisks
                                        ? "rounded-sm bg-[#FEF3F2] px-0.5 font-semibold text-[#B42318] underline decoration-[#B42318]/45 underline-offset-2 [box-decoration-break:clone]"
                                        : ""
                                }
                            >
                                pembayaran langsung ke rekening pribadi saya
                            </span>
                            {"."}
                        </p>
                        <p className="mt-1.5 text-right text-[11px] text-[#475569]">
                            16.05
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom In-App Quick Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] bg-white px-4 py-3">
                <span className="text-xs text-[#475569]">
                    Aksi cepat di dalam aplikasi:
                </span>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onClickVerifyInApp}
                        className="min-h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#172B45] transition-colors hover:border-[#172B45] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#172B45]"
                    >
                        Cek transaksi resmi
                    </button>

                    <button
                        type="button"
                        onClick={onClickOffPlatform}
                        className="min-h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#0F172A] transition-colors hover:border-[#172B45] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#172B45]"
                    >
                        Lanjut ke WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}
