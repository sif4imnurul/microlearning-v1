"use client";

import type { ReactNode } from "react";

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
    actionFeedback?: ReactNode;
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
    actionFeedback,
}: MarketplaceChatSimulatorProps) {
    return (
        <div
            className="overflow-hidden rounded-xl border border-[#DADCE0] bg-white shadow-[0_2px_10px_rgba(23,43,69,0.08)]"
            style={{
                fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            {/* Marketplace Chat Top Bar */}
            <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] bg-white px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#172B45] text-xs font-semibold text-white"
                        aria-hidden="true"
                    >
                        SJ
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#172B45]">
                            {storeName}
                        </p>
                        <p className="truncate text-xs text-[#4E5A69]">
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
                            ? "border-[#B9DFC8] bg-[#ECF7F1] text-[#145C3A]"
                            : "border-[#E8B7AC] bg-[#FDF1EE] text-[#A62D14] hover:bg-[#FBE4DF]"
                    }`}
                >
                    {reported ? "Penjual dilaporkan" : "Laporkan"}
                </button>
            </div>

            {/* Attached Product Card Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] bg-[#FAF9F5] px-4 py-2.5 text-xs">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DDD9CF] bg-white text-[#172B45]"
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
                        <p className="font-semibold text-[#1C2430]">
                            {productName}
                        </p>
                        <p className="mt-0.5 font-mono font-semibold text-[#172B45]">
                            {productPrice}
                        </p>
                    </div>
                </div>

                <span className="rounded-md bg-[#ECF7F1] px-2.5 py-1 text-[11px] font-medium text-[#145C3A]">
                    Proteksi Transaksi Aktif
                </span>
            </div>

            {/* Platform Built-in Safety Banner */}
            <div className="border-b border-[#E6C88C]/60 bg-[#FEF6E7] px-4 py-2 text-xs text-[#8A4B08]">
                Demi keamanan, tetap berkomunikasi dan bertransaksi di dalam
                aplikasi marketplace.
            </div>

            {/* Chat Conversation Canvas */}
            <div className="space-y-3 bg-[#F6F7F9] px-4 py-5 sm:px-6">
                {/* Buyer Bubble */}
                <div className="flex justify-end">
                    <div className="max-w-[22rem] rounded-xl rounded-tr-sm bg-[#172B45] px-3.5 py-2.5 text-sm leading-relaxed text-white">
                        <p>Halo kak, barangnya ready untuk dikirim hari ini?</p>
                        <p className="mt-1 text-right text-[11px] text-[#D8E2EE]">
                            16.04
                        </p>
                    </div>
                </div>

                {/* Seller Bubble */}
                <div className="flex justify-start">
                    <div
                        className={`max-w-[27rem] rounded-xl rounded-tl-sm border bg-white px-4 py-3 text-sm leading-relaxed text-[#1F1F1F] shadow-[0_1px_2px_rgba(17,24,39,0.06)] ${
                            highlightRisks
                                ? "border-[#E8B7AC]"
                                : "border-[#E5E7EB]"
                        }`}
                    >
                        <p>
                            Halo kak, barang ready. Agar proses lebih cepat dan
                            tidak terkena biaya tambahan, silakan lanjutkan
                            komunikasi lewat WhatsApp{" "}
                            <button
                                type="button"
                                onClick={onClickOffPlatform}
                                className={`inline rounded px-1 py-0.5 font-mono text-xs font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#172B45] ${
                                    highlightRisks
                                        ? "bg-[#FDF1EE] text-[#A62D14]"
                                        : "text-[#172B45] hover:bg-[#EDF2F7]"
                                }`}
                            >
                                {whatsappNumber}
                            </button>{" "}
                            dan lakukan{" "}
                            <span
                                className={
                                    highlightRisks
                                        ? "rounded bg-[#FEF6E7] px-1 py-0.5 font-semibold text-[#8A4B08]"
                                        : ""
                                }
                            >
                                pembayaran langsung ke rekening pribadi saya
                            </span>
                            .
                        </p>
                        <p className="mt-1.5 text-right text-[11px] text-[#4E5A69]">
                            16.05
                        </p>
                    </div>
                </div>

                {actionFeedback && <div>{actionFeedback}</div>}
            </div>

            {/* Bottom In-App Quick Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E7EB] bg-white px-4 py-3">
                <span className="text-xs text-[#4E5A69]">
                    Aksi cepat di dalam aplikasi:
                </span>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onClickVerifyInApp}
                        className="min-h-11 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-3.5 py-2 text-xs font-semibold text-[#172B45] transition-colors hover:border-[#172B45] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#172B45]"
                    >
                        Cek transaksi resmi
                    </button>

                    <button
                        type="button"
                        onClick={onClickOffPlatform}
                        className="min-h-11 rounded-lg border border-[#C6C1B5] bg-[#FAF9F5] px-3.5 py-2 text-xs font-semibold text-[#1C2430] transition-colors hover:border-[#172B45] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#172B45]"
                    >
                        Lanjut ke WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}
