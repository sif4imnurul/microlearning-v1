"use client";

type WhatsAppSimulatorProps = {
    senderNumber: string;
    senderStatus: string;
    timestamp: string;
    message: string;
    qrPreviewOpen: boolean;
    qrDestination: string;
    onToggleQrPreview: () => void;
    onBlockOrReportClick: () => void;
    highlightQr?: boolean;
};

// Deterministic 21x21 QR-like pattern (non-scannable dummy visual for training safety)
const QR_GRID: string[] = [
    "111111101011001111111",
    "100000100100101000001",
    "101110101110001011101",
    "101110100011101011101",
    "101110101001001011101",
    "100000101100101000001",
    "111111101010101111111",
    "000000001101000000000",
    "101101110010110110101",
    "010010001101001001010",
    "110110111010111011001",
    "001001010101000100110",
    "101110101110110101101",
    "000000001001010010010",
    "111111101100101101101",
    "100000100011010010010",
    "101110101101101110101",
    "101110100110010001011",
    "101110101001101101100",
    "100000101100010010011",
    "111111100110101101101",
];

function RealisticQrGraphic() {
    const rects: Array<{ x: number; y: number }> = [];
    QR_GRID.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
            if (row[x] === "1") {
                rects.push({ x, y });
            }
        }
    });

    return (
        <svg
            viewBox="0 0 25 25"
            className="h-36 w-36 rounded-lg border border-[#E2E8F0] bg-white p-1.5"
            role="img"
            aria-label="Contoh kode QR latihan"
        >
            <rect width="25" height="25" fill="#FFFFFF" />
            {rects.map(({ x, y }) => (
                <rect
                    key={`${x}-${y}`}
                    x={x + 2}
                    y={y + 2}
                    width="1"
                    height="1"
                    fill="#111827"
                />
            ))}
        </svg>
    );
}

export default function WhatsAppSimulator({
    senderNumber,
    senderStatus,
    timestamp,
    message,
    qrPreviewOpen,
    qrDestination,
    onToggleQrPreview,
    onBlockOrReportClick,
    highlightQr = false,
}: WhatsAppSimulatorProps) {
    return (
        <div
            className="overflow-hidden rounded-xl border border-[#CBD5E1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.06)]"
            style={{
                fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            {/* Authentic WhatsApp Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#075E54] px-3.5 py-3 text-white sm:flex-nowrap sm:gap-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white sm:h-10 sm:w-10"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="currentColor"
                        >
                            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.86 0-7 1.79-7 4v1h14v-1c0-2.21-3.14-4-7-4Z" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-white">
                            {senderNumber}
                        </p>
                        <p className="text-xs text-[#D9F0EC]">
                            {senderStatus}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onBlockOrReportClick}
                    className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-white/25 bg-white/10 px-3 text-xs font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <span className="sm:hidden">Laporkan</span>
                    <span className="hidden sm:inline">Laporkan nomor</span>
                </button>
            </div>

            {/* Unknown Contact Safety Banner */}
            <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-center text-xs text-[#475569]">
                Pengirim ini tidak ada di daftar kontak Anda.
            </div>

            {/* Chat Canvas (Authentic WhatsApp sand canvas) */}
            <div className="bg-[#EFEAE2] px-4 py-5 sm:px-6">
                <div className="max-w-[26rem] rounded-xl rounded-tl-sm bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.12)]">
                    {/* QR Image Card inside chat bubble */}
                    <div
                        className={`flex flex-col items-center rounded-lg border p-3.5 ${
                            highlightQr
                                ? "border-[#F5C2C0] bg-[#FFF8F7]"
                                : "border-[#E2E8F0] bg-[#F8FAFC]"
                        }`}
                    >
                        <RealisticQrGraphic />
                        <p
                            className={`mt-2 text-[11px] font-medium ${
                                highlightQr
                                    ? "text-[#7A1A14]"
                                    : "text-[#475569]"
                            }`}
                        >
                            Album_Foto_Acara.png · Kode QR
                        </p>

                        <button
                            type="button"
                            onClick={onToggleQrPreview}
                            aria-expanded={qrPreviewOpen}
                            className="mt-2.5 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs font-semibold text-[#172B45] transition-colors hover:border-[#172B45] hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-[#172B45]"
                        >
                            {qrPreviewOpen
                                ? "Tutup pratinjau tujuan QR"
                                : "Pratinjau tujuan QR"}
                        </button>

                        {qrPreviewOpen && (
                            <div
                                role="status"
                                className="animate-reveal-in mt-2.5 w-full rounded-lg border border-[#F5C2C0] bg-[#FEF3F2] px-3 py-2 text-left text-xs leading-relaxed text-[#7A1A14]"
                            >
                                <p className="font-semibold text-[#B42318]">
                                    Alamat tersembunyi di balik QR:
                                </p>
                                <p className="mt-0.5 font-mono text-[11px] font-semibold text-[#B42318] [overflow-wrap:anywhere]">
                                    {qrDestination}
                                </p>
                                <p className="mt-1 text-[#7A1A14]">
                                    Sebelum dipindai, Anda tidak bisa melihat ke
                                    mana QR ini mengarah.
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#1F1F1F]">
                        {message}
                    </p>

                    <div className="mt-1.5 flex justify-end">
                        <span className="text-[11px] text-[#5F6368]">
                            {timestamp}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
