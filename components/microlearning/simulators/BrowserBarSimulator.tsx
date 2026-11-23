"use client";

import { useEffect } from "react";

type BrowserBarSimulatorProps = {
    protocol: "https" | "http";
    domain: string;
    path: string;
    officialDomain: string;
    padlockOpen: boolean;
    onTogglePadlock: () => void;
    onClosePadlock: () => void;
    onClosePreview?: () => void;
    highlightDomain?: boolean;
    highlightPadlock?: boolean;
};

export default function BrowserBarSimulator({
    protocol,
    domain,
    path,
    officialDomain,
    padlockOpen,
    onTogglePadlock,
    onClosePadlock,
    onClosePreview,
    highlightDomain = false,
    highlightPadlock = false,
}: BrowserBarSimulatorProps) {
    useEffect(() => {
        if (!padlockOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClosePadlock();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [padlockOpen, onClosePadlock]);

    return (
        <div
            className="animate-reveal-in overflow-hidden rounded-xl border border-[#DADCE0] bg-white shadow-[0_2px_10px_rgba(23,43,69,0.08)]"
            style={{
                fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            {/* Browser Tab Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-[#E0E3E7] bg-[#DEE1E6] px-3 pt-2">
                <div className="flex min-w-0 items-center gap-2 rounded-t-lg bg-white px-3 py-1.5 text-xs font-medium text-[#1F1F1F]">
                    <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#172B45]"
                        aria-hidden="true"
                    />
                    <span className="truncate">
                        Lacak Pengiriman · {domain}
                    </span>
                </div>

                {onClosePreview && (
                    <button
                        type="button"
                        onClick={onClosePreview}
                        aria-label="Tutup pratinjau browser"
                        className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-[#444746] transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#172B45]"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Browser Omnibox / Address Bar */}
            <div className="border-b border-[#ECEEF2] bg-white px-3 py-2.5">
                <div className="flex items-center gap-1.5 rounded-full border border-[#DADCE0] bg-[#F1F3F4] px-1.5 py-1">
                    <button
                        type="button"
                        onClick={onTogglePadlock}
                        aria-expanded={padlockOpen}
                        aria-label="Informasi koneksi situs"
                        title="Klik untuk melihat arti ikon gembok HTTPS"
                        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#172B45] ${
                            padlockOpen || highlightPadlock
                                ? "bg-[#ECF7F1] text-[#145C3A] ring-1 ring-[#145C3A]/35"
                                : "text-[#145C3A] hover:bg-black/5"
                        }`}
                    >
                        <svg
                            viewBox="0 0 20 20"
                            className="h-4 w-4 shrink-0"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4Zm2 6V6a2 2 0 1 0-4 0v2h4Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="hidden sm:inline">HTTPS</span>
                    </button>

                    <div className="min-w-0 flex-1 break-all px-1.5 py-1 font-mono text-[11px] leading-snug sm:text-[13px]">
                        <span className="text-[#5F6368]">{protocol}://</span>
                        <span
                            className={
                                highlightDomain
                                    ? "rounded bg-[#FDF1EE] px-1 py-0.5 font-semibold text-[#A62D14]"
                                    : "font-semibold text-[#1F1F1F]"
                            }
                        >
                            {domain}
                        </span>
                        <span className="text-[#5F6368]">{path}</span>
                    </div>
                </div>

                {/* Inline Chrome-style Site Connection Info Drawer (zero overlap/clipping) */}
                {padlockOpen && (
                    <div
                        role="region"
                        aria-label="Detail koneksi HTTPS"
                        className="animate-reveal-in mt-2.5 rounded-xl border border-[#DADCE0] bg-white p-3.5 text-left shadow-[0_2px_8px_rgba(32,33,36,0.08)]"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ECF7F1] text-[#145C3A]">
                                    <svg
                                        viewBox="0 0 20 20"
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4Zm2 6V6a2 2 0 1 0-4 0v2h4Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-[#145C3A]">
                                        Koneksi aman (HTTPS)
                                    </p>
                                    <p className="font-mono text-[11px] text-[#5F6368]">
                                        {domain}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClosePadlock}
                                aria-label="Tutup info gembok"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xs text-[#5F6368] hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#172B45]"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="mt-2.5 text-xs leading-relaxed text-[#1F1F1F]">
                            Data yang dikirim lewat jalur ini terenkripsi agar
                            tidak mudah disadap di tengah jalan.
                        </p>

                        <div className="mt-2.5 rounded-lg border border-[#E8B7AC] bg-[#FDF1EE] px-3 py-2 text-xs leading-relaxed text-[#A62D14]">
                            <strong>Tetapi hati-hati:</strong> gembok ini hanya
                            milik{" "}
                            <span className="font-mono font-semibold">
                                {domain}
                            </span>
                            , bukan situs resmi{" "}
                            <span className="font-mono font-semibold">
                                {officialDomain}
                            </span>
                            .
                        </div>
                    </div>
                )}
            </div>

            {/* Simulated Destination Page Notice */}
            <div className="bg-[#FAF9F5] px-4 py-3 text-xs leading-relaxed text-[#4E5A69]">
                <span className="font-semibold text-[#1C2430]">
                    Pratinjau aman:
                </span>{" "}
                Tombol tadi mengarah ke{" "}
                <span className="font-mono font-semibold text-[#A62D14]">
                    {domain}
                </span>
                . Meski ada ikon gembok di address bar, coba klik ikon{" "}
                <button
                    type="button"
                    onClick={onTogglePadlock}
                    className="font-semibold text-[#172B45] underline underline-offset-2 hover:text-[#243B59] focus-visible:outline-2 focus-visible:outline-[#172B45]"
                >
                    gembok HTTPS
                </button>{" "}
                di kiri atas untuk melihat arti sebenarnya.
            </div>
        </div>
    );
}
