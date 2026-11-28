"use client";

import { useEffect, useState, type ReactNode } from "react";

export type GmailSenderDetails = {
    fromName: string;
    fromEmail: string;
    toEmail: string;
    dateLabel: string;
    subject: string;
    mailedBy: string;
    securityLabel?: string;
};

type GmailSimulatorProps = {
    subject: string;
    label?: string;
    senderName: string;
    senderEmail: string;
    senderInitials: string;
    senderAvatarColor?: string;
    timestamp: string;
    recipientLabel?: string;
    details: GmailSenderDetails;
    detailsOpen: boolean;
    onToggleDetails: () => void;
    onCloseDetails?: () => void;
    /** Subtle post-decision highlight on sender name and suspicious domain segment */
    revealAnnotations?: boolean;
    suspiciousPart?: string;
    /** Functional toolbar and action callbacks (R-26: zero dead controls) */
    onReplyClick?: () => void;
    onForwardClick?: () => void;
    onReportSpamClick?: () => void;
    onDeleteClick?: () => void;
    /** Non-shifting Chrome-style bottom-left URL preview shown on link hover */
    hoverStatusUrl?: string | null;
    /** Transitional prop retained until Units 2-4 migrate to ActionNoticeToast */
    actionFeedback?: ReactNode;
    children: ReactNode;
};

function renderHighlightedEmail(email: string, suspiciousPart?: string) {
    if (!suspiciousPart || !email.includes(suspiciousPart)) {
        return (
            <span className="font-mono font-semibold text-[#B42318] [overflow-wrap:anywhere]">
                {email}
            </span>
        );
    }
    const [before, after] = email.split(suspiciousPart);
    const atIndex = before.indexOf("@");
    const beforeWithBreak =
        atIndex > -1 ? (
            <>
                {before.slice(0, atIndex + 1)}
                <wbr />
                {before.slice(atIndex + 1)}
            </>
        ) : (
            before
        );
    return (
        <span className="font-mono text-[#1F1F1F] [overflow-wrap:anywhere]">
            {beforeWithBreak}
            <wbr />
            <mark className="inline-block whitespace-nowrap rounded-sm bg-[#FEF3F2] px-[1px] font-semibold text-[#B42318] underline decoration-[#B42318]/45 underline-offset-2">
                {suspiciousPart}
            </mark>
            {after}
        </span>
    );
}

export default function GmailSimulator({
    subject,
    label = "Kotak Masuk",
    senderName,
    senderEmail,
    senderInitials,
    senderAvatarColor = "#1A73E8",
    timestamp,
    recipientLabel = "kepada saya",
    details,
    detailsOpen,
    onToggleDetails,
    onCloseDetails,
    revealAnnotations = false,
    suspiciousPart,
    onReplyClick,
    onForwardClick,
    onReportSpamClick,
    onDeleteClick,
    hoverStatusUrl,
    actionFeedback,
    children,
}: GmailSimulatorProps) {
    const [isStarred, setIsStarred] = useState(false);

    useEffect(() => {
        if (!detailsOpen || !onCloseDetails) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                if (document.querySelector('[role="dialog"]')) return;
                onCloseDetails?.();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [detailsOpen, onCloseDetails]);

    return (
        <div
            className="relative overflow-hidden rounded-xl border border-[#CBD5E1] bg-[#F6F8FC] shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.06)]"
            style={{
                fontFamily:
                    "Roboto, 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            {/* Authentic Gmail Top Header Bar */}
            <div className="flex items-center justify-between gap-3 border-b border-[#E3E7EE] bg-[#F6F8FC] px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                    <svg
                        viewBox="0 0 24 18"
                        className="h-4 w-5 shrink-0"
                        aria-hidden="true"
                    >
                        <path
                            d="M1.636 18h3.818V8.727L0 4.636v11.728C0 17.268.733 18 1.636 18Z"
                            fill="#4285F4"
                        />
                        <path
                            d="M18.545 18h3.819C23.268 18 24 17.268 24 16.364V4.636l-5.455 4.091V18Z"
                            fill="#34A853"
                        />
                        <path
                            d="M18.545 1.636v7.091L24 4.636V2.455C24 .431 21.69-.724 20.073.491l-1.528 1.145Z"
                            fill="#FBBC04"
                        />
                        <path
                            d="M5.455 8.727V1.636L12 6.545l6.545-4.909v7.091L12 13.636 5.455 8.727Z"
                            fill="#EA4335"
                        />
                        <path
                            d="M0 2.455v2.181l5.455 4.091V1.636L3.927.491C2.31-.724 0 .431 0 2.455Z"
                            fill="#C5221F"
                        />
                    </svg>
                    <span className="text-sm font-medium tracking-tight text-[#444746]">
                        Gmail
                    </span>
                </div>

                <span className="text-xs font-medium text-[#5E5E5E]">
                    Kotak masuk
                </span>
            </div>

            {/* White Message Surface */}
            <div className="bg-white">
                {/* Functional Message Action Bar (every button has real behavior, 44px tap target) */}
                <div className="flex items-center justify-between border-b border-[#EEF0F3] px-2 py-1 sm:px-3">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={onReportSpamClick}
                            title="Laporkan spam"
                            aria-label="Laporkan spam"
                            className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#444746] transition-colors hover:bg-[#F1F3F4] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[18px] w-[18px] shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4m0 4h.01"
                                />
                            </svg>
                            <span className="hidden sm:inline">
                                Laporkan spam
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={onDeleteClick}
                            title="Hapus email"
                            aria-label="Hapus email"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#444746] transition-colors hover:bg-[#F1F3F4] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[18px] w-[18px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsStarred((prev) => !prev)}
                            aria-pressed={isStarred}
                            title={
                                isStarred
                                    ? "Hapus tanda bintang"
                                    : "Tandai dengan bintang"
                            }
                            aria-label={
                                isStarred
                                    ? "Hapus tanda bintang"
                                    : "Tandai dengan bintang"
                            }
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-[#F1F3F4] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                isStarred ? "text-[#B45309]" : "text-[#444746]"
                            }`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[18px] w-[18px]"
                                fill={isStarred ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="1.75"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3Z"
                                />
                            </svg>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onToggleDetails}
                        aria-expanded={detailsOpen}
                        className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                            detailsOpen
                                ? "bg-[#E8F0FE] text-[#174EA6]"
                                : "text-[#444746] hover:bg-[#F1F3F4]"
                        }`}
                    >
                        <span>
                            {detailsOpen ? "Tutup header" : "Detail header"}
                        </span>
                        <svg
                            viewBox="0 0 20 20"
                            className={`h-4 w-4 transition-transform duration-150 ${
                                detailsOpen ? "rotate-180" : ""
                            }`}
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Email Content */}
                <div className="px-4 py-5 sm:px-6 sm:py-6">
                    {/* Subject Line + Kotak Masuk Tag */}
                    <div className="flex flex-wrap items-center gap-2.5 pl-0 sm:pl-[52px]">
                        <h2 className="text-xl font-normal leading-snug tracking-[-0.01em] text-[#1F1F1F]">
                            {subject}
                        </h2>
                        <span className="inline-flex items-center rounded bg-[#EAECEF] px-2 py-0.5 text-xs font-medium text-[#444746]">
                            {label}
                        </span>
                    </div>

                    {/* Sender Header Row */}
                    <div className="mt-5 flex items-start gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white select-none"
                            style={{ backgroundColor: senderAvatarColor }}
                            aria-hidden="true"
                        >
                            {senderInitials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1.5 gap-y-1">
                                    <span
                                        className={`text-sm font-semibold text-[#1F1F1F] transition-colors ${
                                            revealAnnotations
                                                ? "underline decoration-[#94A3B8] decoration-dotted underline-offset-4"
                                                : ""
                                        }`}
                                    >
                                        {senderName}
                                    </span>

                                    <span
                                        className={`min-w-0 max-w-full py-0.5 text-left text-xs leading-snug transition-colors [overflow-wrap:anywhere] ${
                                            revealAnnotations
                                                ? "text-[#1F1F1F]"
                                                : "px-0.5 text-[#5E5E5E]"
                                        }`}
                                    >
                                        &lt;
                                        {revealAnnotations
                                            ? renderHighlightedEmail(
                                                  senderEmail,
                                                  suspiciousPart
                                              )
                                            : senderEmail}
                                        &gt;
                                    </span>
                                </div>

                                <span className="hidden shrink-0 pt-0.5 text-xs whitespace-nowrap tabular-nums text-[#5E5E5E] sm:inline">
                                    {timestamp}
                                </span>
                            </div>

                            {/* "kepada saya ▾" interactive trigger with full 44px touch area */}
                            <div className="mt-0.5 flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    onClick={onToggleDetails}
                                    aria-expanded={detailsOpen}
                                    aria-label="Tampilkan detail header pengirim"
                                    className={`-ml-2 inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs text-[#5E5E5E] transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45] ${
                                        detailsOpen
                                            ? "bg-[#E8EAED] text-[#1F1F1F]"
                                            : "hover:bg-[#F1F3F4] hover:text-[#1F1F1F]"
                                    }`}
                                >
                                    <span>{recipientLabel}</span>
                                    <svg
                                        viewBox="0 0 20 20"
                                        className={`h-3.5 w-3.5 transition-transform duration-150 ${
                                            detailsOpen ? "rotate-180" : ""
                                        }`}
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                <span className="text-xs tabular-nums text-[#5E5E5E] sm:hidden">
                                    {timestamp}
                                </span>
                            </div>

                            {/* Authentic Gmail Header Details Popover */}
                            {detailsOpen && (
                                <div className="animate-popover-in mt-1.5 max-w-md origin-top-left rounded-lg border border-[#D4D8DF] bg-white p-3.5 text-xs shadow-[0_6px_20px_rgba(23,43,69,0.12)] sm:p-4">
                                    <dl className="grid grid-cols-[4.25rem_1fr] gap-x-2.5 gap-y-2 sm:grid-cols-[5.25rem_1fr] sm:gap-x-3">
                                        <dt className="text-right text-[#5E5E5E]">
                                            dari:
                                        </dt>
                                        <dd className="min-w-0 text-[#1F1F1F] [overflow-wrap:anywhere]">
                                            <span className="font-semibold">
                                                {details.fromName}
                                            </span>{" "}
                                            <span className="text-[#5E5E5E]">
                                                &lt;
                                                {revealAnnotations
                                                    ? renderHighlightedEmail(
                                                          details.fromEmail,
                                                          suspiciousPart
                                                      )
                                                    : details.fromEmail}
                                                &gt;
                                            </span>
                                        </dd>

                                        <dt className="text-right text-[#5E5E5E]">
                                            ke:
                                        </dt>
                                        <dd className="min-w-0 text-[#1F1F1F] [overflow-wrap:anywhere]">
                                            {details.toEmail}
                                        </dd>

                                        <dt className="text-right text-[#5E5E5E]">
                                            tanggal:
                                        </dt>
                                        <dd className="min-w-0 text-[#1F1F1F]">
                                            {details.dateLabel}
                                        </dd>

                                        <dt className="text-right text-[#5E5E5E]">
                                            subjek:
                                        </dt>
                                        <dd className="min-w-0 text-[#1F1F1F]">
                                            {details.subject}
                                        </dd>

                                        <dt className="text-right text-[#5E5E5E]">
                                            dikirim oleh:
                                        </dt>
                                        <dd className="min-w-0 font-mono text-[#1F1F1F] [overflow-wrap:anywhere]">
                                            {revealAnnotations
                                                ? renderHighlightedEmail(
                                                      details.mailedBy,
                                                      suspiciousPart
                                                  )
                                                : details.mailedBy}
                                        </dd>

                                        {details.securityLabel && (
                                            <>
                                                <dt className="text-right text-[#5E5E5E]">
                                                    keamanan:
                                                </dt>
                                                <dd className="flex items-center gap-1.5 text-[#1F1F1F]">
                                                    <svg
                                                        viewBox="0 0 20 20"
                                                        className="h-3.5 w-3.5 shrink-0 text-[#5E5E5E]"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span>
                                                        {details.securityLabel}
                                                    </span>
                                                </dd>
                                            </>
                                        )}
                                    </dl>
                                </div>
                            )}

                            {/* Email Body */}
                            <div className="mt-4 space-y-3 border-t border-[#F1F3F4] pt-5 text-sm leading-relaxed text-[#1F1F1F] text-pretty">
                                {children}
                            </div>

                            {/* Authentic Gmail Reply / Forward Buttons (44px tap targets) */}
                            <div className="mt-6 flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={onReplyClick}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#747775]/55 bg-white px-4 py-2 text-sm font-medium text-[#444746] transition-colors hover:bg-[#F2F2F2] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 14 4 9l5-5"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20 20v-7a4 4 0 0 0-4-4H4"
                                        />
                                    </svg>
                                    Balas
                                </button>

                                <button
                                    type="button"
                                    onClick={onForwardClick}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#747775]/55 bg-white px-4 py-2 text-sm font-medium text-[#444746] transition-colors hover:bg-[#F2F2F2] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m15 14 5-5-5-5"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 20v-7a4 4 0 0 1 4-4h12"
                                        />
                                    </svg>
                                    Teruskan
                                </button>
                            </div>
                            {actionFeedback && (
                                <div className="mt-4">{actionFeedback}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {hoverStatusUrl && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 max-w-full truncate rounded-tr-md border-t border-r border-[#CBD5E1] bg-[#F1F3F4]/95 px-2.5 py-1 font-mono text-[11px] text-[#334155] shadow-xs"
                >
                    {hoverStatusUrl}
                </div>
            )}
        </div>
    );
}
