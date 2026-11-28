"use client";

import {
    useEffect,
    useId,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react";

export type UnitProps = {
    seconds: number;
    isSaving: boolean;
    isTimeLocked: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export function CloseIcon({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    );
}

export function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M4.5 10.5l3.5 3.5 7.5-8" />
        </svg>
    );
}

export function AlertIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M10 6v4.75" />
            <circle cx="10" cy="14" r="0.85" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function ArrowRightIcon({
    className = "h-4 w-4",
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M4.5 10h11M11 5.5L15.5 10 11 14.5" />
        </svg>
    );
}

export function ArrowLeftIcon({
    className = "h-4 w-4",
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M15.5 10h-11M9 5.5L4.5 10 9 14.5" />
        </svg>
    );
}

export function UnitHeaderBand({
    unitCode,
    title,
    subtitle,
    seconds,
}: {
    unitCode: string;
    title: string;
    subtitle: string;
    seconds: number;
}) {
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");

    return (
        <header className="rounded-2xl bg-ink-brand px-6 py-6 text-white shadow-[0_2px_8px_rgba(15,23,42,0.14)] sm:px-8 sm:py-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="max-w-[54ch]">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#CBD5E1]">
                        Unit {unitCode}
                    </p>
                    <h1 className="mt-1.5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-white text-balance sm:text-[1.8rem]">
                        {title}
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1] text-pretty sm:text-[15px]">
                        {subtitle}
                    </p>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 sm:flex-col sm:items-end sm:gap-0.5">
                    <span className="text-xs font-medium text-[#CBD5E1]">
                        Waktu membaca
                    </span>
                    <span className="font-mono text-base font-semibold tabular-nums text-white">
                        {formattedMinutes}:{formattedSeconds}
                    </span>
                </div>
            </div>
        </header>
    );
}

export function StageHeader({
    step,
    label,
    hint,
}: {
    step: string;
    label: string;
    hint?: string;
}) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div className="flex items-center gap-2.5">
                <span className="inline-flex h-6 items-center rounded-md bg-ink-brand px-2 font-mono text-[11px] font-semibold tabular-nums text-white">
                    {step}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.09em] text-ink-brand">
                    {label}
                </span>
            </div>
            {hint && (
                <p className="text-xs text-ink-secondary">{hint}</p>
            )}
        </div>
    );
}

export function ScenarioBriefingStrip({
    roleTitle,
    situation,
    referenceLabel,
    referenceValue,
    referenceMono = false,
    referenceTone = "official",
}: {
    roleTitle: string;
    situation: ReactNode;
    referenceLabel: string;
    referenceValue: string;
    referenceMono?: boolean;
    referenceTone?: "official" | "neutral";
}) {
    const isOfficial = referenceTone === "official";

    return (
        <section aria-label="Konteks skenario" className="mt-9">
            <StageHeader step="01" label="Konteks kasus" />

            <div className="mt-3.5 flex flex-col gap-4 border-l-[3px] border-ink-brand pl-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pl-5">
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold leading-snug text-ink-primary">
                        {roleTitle}
                    </h2>
                    <p className="mt-1 max-w-[58ch] text-[15px] leading-[1.6] text-ink-secondary text-pretty">
                        {situation}
                    </p>
                </div>

                <div className="shrink-0 rounded-xl border border-border-strong bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)] sm:max-w-[16.5rem]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-secondary">
                        {referenceLabel}
                    </p>
                    <p
                        className={`mt-1 text-sm font-semibold leading-snug [overflow-wrap:anywhere] ${
                            isOfficial ? "text-signal-safe" : "text-ink-brand"
                        } ${referenceMono ? "font-mono" : ""}`}
                    >
                        {referenceValue}
                    </p>
                </div>
            </div>
        </section>
    );
}

export function DecisionPromptSection({
    question,
    helper,
    optionA,
    optionB,
    onSelectA,
    onSelectB,
}: {
    question: string;
    helper: ReactNode;
    optionA: string;
    optionB: string;
    onSelectA: () => void;
    onSelectB: () => void;
}) {
    return (
        <section
            aria-label="Keputusan simulasi"
            className="mt-11 scroll-mt-20 border-t-2 border-ink-brand pt-6"
        >
            <StageHeader
                step="03"
                label="Ambil keputusan"
                hint="Pilih satu jawaban untuk membuka pembahasan"
            />

            <h2 className="mt-3.5 max-w-[60ch] text-lg font-semibold leading-snug text-ink-brand text-balance">
                {question}
            </h2>
            <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-ink-secondary text-pretty">
                {helper}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={onSelectA}
                    className="group flex min-h-14 items-center gap-3.5 rounded-xl border border-[#94A3B8] bg-white px-4 py-3.5 text-left text-sm font-semibold leading-snug text-ink-primary shadow-[0_2px_6px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow,transform] hover:border-ink-brand hover:shadow-[0_6px_16px_-4px_rgba(23,43,69,0.16)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand"
                >
                    <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-subtle font-mono text-xs font-semibold text-ink-brand transition-colors group-hover:bg-ink-brand group-hover:text-white"
                        aria-hidden="true"
                    >
                        A
                    </span>
                    <span>{optionA}</span>
                </button>

                <button
                    type="button"
                    onClick={onSelectB}
                    className="group flex min-h-14 items-center gap-3.5 rounded-xl border border-[#94A3B8] bg-white px-4 py-3.5 text-left text-sm font-semibold leading-snug text-ink-primary shadow-[0_2px_6px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow,transform] hover:border-ink-brand hover:shadow-[0_6px_16px_-4px_rgba(23,43,69,0.16)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand"
                >
                    <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-subtle font-mono text-xs font-semibold text-ink-brand transition-colors group-hover:bg-ink-brand group-hover:text-white"
                        aria-hidden="true"
                    >
                        B
                    </span>
                    <span>{optionB}</span>
                </button>
            </div>
        </section>
    );
}

export function VerdictHeader({
    isCorrect,
    title,
    subtitle,
}: {
    isCorrect: boolean;
    title: string;
    subtitle: string;
}) {
    return (
        <div
            className={`flex items-start gap-3.5 border-b border-border-subtle px-5 py-5 sm:px-7 ${
                isCorrect ? "bg-[#ECFDF5]/80" : "bg-[#FFFBEB]/90"
            }`}
        >
            <span
                className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    isCorrect
                        ? "border-signal-safe-border bg-white text-signal-safe"
                        : "border-signal-caution-border bg-white text-signal-caution"
                }`}
                aria-hidden="true"
            >
                {isCorrect ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                    <AlertIcon className="h-3.5 w-3.5" />
                )}
            </span>
            <div className="min-w-0">
                <p
                    className={`text-base font-semibold leading-snug ${
                        isCorrect ? "text-signal-safe" : "text-signal-caution"
                    }`}
                >
                    {title}
                </p>
                <p
                    className={`mt-1 text-sm leading-relaxed ${
                        isCorrect ? "text-[#064E3B]" : "text-[#78350F]"
                    }`}
                >
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

export function PostDecisionStepper({
    isCorrect,
    verdictTitle,
    verdictSubtitle,
    step1Label = "1. Perbandingan",
    step2Label = "2. Inti & Langkah Aman",
    step1Content,
    step2Content,
}: {
    isCorrect: boolean;
    verdictTitle: string;
    verdictSubtitle: string;
    step1Label?: string;
    step2Label?: string;
    step1Content: ReactNode;
    step2Content: ReactNode;
}) {
    const [activeStep, setActiveStep] = useState<1 | 2>(1);
    const uid = useId();
    const containerRef = useRef<HTMLElement | null>(null);
    const tab1Ref = useRef<HTMLButtonElement | null>(null);
    const tab2Ref = useRef<HTMLButtonElement | null>(null);

    const tab1Id = `${uid}-tab-1`;
    const tab2Id = `${uid}-tab-2`;
    const panel1Id = `${uid}-panel-1`;
    const panel2Id = `${uid}-panel-2`;

    function switchStep(next: 1 | 2, scrollIntoView = false) {
        setActiveStep(next);
        if (scrollIntoView) {
            window.requestAnimationFrame(() => {
                const prefersReducedMotion = window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;
                containerRef.current?.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start",
                });
            });
        }
    }

    function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        let next: 1 | 2 | null = null;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            next = activeStep === 1 ? 2 : 1;
        } else if (event.key === "Home") {
            next = 1;
        } else if (event.key === "End") {
            next = 2;
        }

        if (!next) return;
        event.preventDefault();
        setActiveStep(next);
        if (next === 1) {
            tab1Ref.current?.focus();
        } else {
            tab2Ref.current?.focus();
        }
    }

    return (
        <section
            ref={containerRef}
            aria-label="Pembahasan simulasi"
            className="scroll-mt-20"
        >
            <StageHeader
                step="03"
                label="Pembahasan"
                hint="Baca langkah 1 lalu lanjut ke langkah 2"
            />

            <div className="mt-3.5 overflow-hidden rounded-2xl bg-white shadow-[0_2px_6px_rgba(15,23,42,0.05),0_12px_28px_-10px_rgba(15,23,42,0.1)] ring-1 ring-border-strong/70">
                <VerdictHeader
                    isCorrect={isCorrect}
                    title={verdictTitle}
                    subtitle={verdictSubtitle}
                />

                {/* High-Contrast 2-Step Segmented Pill Bar */}
                <div className="border-b border-border-subtle bg-surface-subtle px-4 py-2.5 sm:px-7">
                    <div
                        role="tablist"
                        aria-label="Tahap pembahasan"
                        className="grid grid-cols-2 gap-1.5 rounded-xl bg-border-subtle/80 p-1"
                    >
                        <button
                            ref={tab1Ref}
                            id={tab1Id}
                            type="button"
                            role="tab"
                            aria-selected={activeStep === 1}
                            aria-controls={panel1Id}
                            tabIndex={activeStep === 1 ? 0 : -1}
                            onClick={() => switchStep(1)}
                            onKeyDown={handleTabKeyDown}
                            className={`min-h-11 rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand sm:px-4 sm:text-sm ${
                                activeStep === 1
                                    ? "bg-ink-brand text-white shadow-xs"
                                    : "text-ink-secondary hover:bg-white/70 hover:text-ink-primary"
                            }`}
                        >
                            {step1Label}
                        </button>

                        <button
                            ref={tab2Ref}
                            id={tab2Id}
                            type="button"
                            role="tab"
                            aria-selected={activeStep === 2}
                            aria-controls={panel2Id}
                            tabIndex={activeStep === 2 ? 0 : -1}
                            onClick={() => switchStep(2)}
                            onKeyDown={handleTabKeyDown}
                            className={`min-h-11 rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand sm:px-4 sm:text-sm ${
                                activeStep === 2
                                    ? "bg-ink-brand text-white shadow-xs"
                                    : "text-ink-secondary hover:bg-white/70 hover:text-ink-primary"
                            }`}
                        >
                            {step2Label}
                        </button>
                    </div>
                </div>

                {activeStep === 1 && (
                    <div
                        id={panel1Id}
                        role="tabpanel"
                        aria-labelledby={tab1Id}
                        className="animate-reveal-in"
                    >
                        <div>{step1Content}</div>

                        <div className="flex flex-col gap-3 border-t border-border-subtle bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <p className="text-xs text-ink-secondary">
                                Langkah 1 dari 2 · Lanjut untuk melihat inti
                                aturan dan langkah aman.
                            </p>
                            <button
                                type="button"
                                onClick={() => switchStep(2, true)}
                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-ink-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand"
                            >
                                <span>Lanjut ke {step2Label}</span>
                                <ArrowRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div
                        id={panel2Id}
                        role="tabpanel"
                        aria-labelledby={tab2Id}
                        className="animate-reveal-in"
                    >
                        <div>{step2Content}</div>

                        <div className="flex flex-col gap-3 border-t border-border-subtle bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <p className="text-xs text-ink-secondary">
                                Langkah 2 dari 2 · Ringkasan selesai dibaca.
                            </p>
                            <button
                                type="button"
                                onClick={() => switchStep(1, true)}
                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-strong bg-white px-4 py-2.5 text-sm font-semibold text-ink-brand transition-colors hover:border-ink-brand hover:bg-surface-subtle active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                <span>Kembali ke {step1Label}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export function SafeActionList({
    title,
    note,
    items,
}: {
    title: string;
    note?: string;
    items: string[];
}) {
    return (
        <div className="border-t border-border-subtle px-5 py-6 sm:px-7 sm:py-7">
            <h2 className="text-base font-semibold leading-snug text-ink-brand">
                {title}
            </h2>
            {note && (
                <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-ink-secondary text-pretty">
                    {note}
                </p>
            )}

            <ol className="mt-4 max-w-[62ch] divide-y divide-border-subtle border-y border-border-subtle">
                {items.map((text, idx) => (
                    <li
                        key={text}
                        className="flex items-start gap-3.5 py-3.5 text-[15px] leading-[1.6] text-ink-primary"
                    >
                        <span className="mt-1 font-mono text-xs font-semibold tabular-nums text-ink-brand">
                            0{idx + 1}
                        </span>
                        <span>{text}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export type SimulationNotice = {
    id: number;
    tone: "caution" | "positive" | "danger";
    title?: string;
    message: string;
};

const NOTICE_STYLES: Record<
    SimulationNotice["tone"],
    {
        defaultTitle: string;
        accentBorder: string;
        iconBg: string;
        titleColor: string;
    }
> = {
    positive: {
        defaultTitle: "Langkah aman",
        accentBorder: "border-l-signal-safe",
        iconBg: "bg-signal-safe-bg text-signal-safe ring-1 ring-signal-safe-border",
        titleColor: "text-signal-safe",
    },
    caution: {
        defaultTitle: "Tahan dulu",
        accentBorder: "border-l-signal-caution",
        iconBg: "bg-signal-caution-bg text-signal-caution ring-1 ring-signal-caution-border",
        titleColor: "text-signal-caution",
    },
    danger: {
        defaultTitle: "Berbahaya",
        accentBorder: "border-l-signal-danger",
        iconBg: "bg-signal-danger-bg text-signal-danger ring-1 ring-signal-danger-border",
        titleColor: "text-signal-danger",
    },
};

export function ActionNoticeToast({
    notice,
    onClose,
}: {
    notice: SimulationNotice | null;
    onClose: () => void;
}) {
    const [pausedNoticeId, setPausedNoticeId] = useState<number | null>(null);
    const onCloseRef = useRef(onClose);
    const isPaused = notice !== null && pausedNoticeId === notice.id;

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!notice || isPaused) return;

        const timer = window.setTimeout(() => {
            onCloseRef.current();
        }, 7500);

        return () => window.clearTimeout(timer);
    }, [notice, isPaused]);

    useEffect(() => {
        if (!notice) return;

        function handleKeyDown(event: globalThis.KeyboardEvent) {
            if (event.key !== "Escape") return;
            if (document.querySelector('[role="dialog"]')) return;
            event.stopImmediatePropagation();
            onCloseRef.current();
        }

        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [notice]);

    if (!notice) return null;

    const style = NOTICE_STYLES[notice.tone];
    const heading = notice.title ?? style.defaultTitle;

    return (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[45] mx-auto max-w-[420px] sm:inset-x-auto sm:right-4 sm:bottom-5 sm:mx-0 sm:w-[320px] 2xl:right-6 2xl:w-[360px]">
            <div
                key={notice.id}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                onMouseEnter={() => setPausedNoticeId(notice.id)}
                onMouseLeave={() => setPausedNoticeId(null)}
                onFocus={() => setPausedNoticeId(notice.id)}
                onBlur={() => setPausedNoticeId(null)}
                className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-border-strong border-l-4 ${style.accentBorder} bg-white py-3.5 pl-4 pr-2 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.22),0_4px_10px_-4px_rgba(15,23,42,0.1)]`}
            >
                <span
                    className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
                    aria-hidden="true"
                >
                    {notice.tone === "positive" ? (
                        <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                        <AlertIcon className="h-3.5 w-3.5" />
                    )}
                </span>

                <div className="min-w-0 flex-1 py-0.5">
                    <p
                        className={`text-xs font-semibold uppercase tracking-[0.04em] ${style.titleColor}`}
                    >
                        {heading}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-primary">
                        {notice.message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup notifikasi"
                    className="-mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-ink-brand"
                >
                    <CloseIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export function UnitFooterBar({
    unitNumber,
    nextLabel,
    nextTitle,
    seconds,
    isSaving,
    isTimeLocked,
    isRevealed,
    prerequisiteText,
    errorMessage,
    onFinish,
}: {
    unitNumber: number;
    nextLabel?: string;
    nextTitle: string;
    seconds: number;
    isSaving: boolean;
    isTimeLocked: boolean;
    isRevealed: boolean;
    prerequisiteText?: string;
    errorMessage: string;
    onFinish: () => void;
}) {
    const remaining = Math.max(0, 60 - seconds);
    const isBlockedByPrerequisite = Boolean(prerequisiteText);
    const isDisabled =
        isBlockedByPrerequisite || !isRevealed || isSaving || isTimeLocked;

    let buttonText = `Selesaikan Unit ${unitNumber}`;
    if (isSaving) {
        buttonText = "Menyimpan…";
    } else if (isBlockedByPrerequisite && prerequisiteText) {
        buttonText = prerequisiteText;
    } else if (!isRevealed) {
        buttonText = "Pilih jawaban simulasi dulu";
    } else if (isTimeLocked) {
        buttonText = `Baca materi (${remaining} detik lagi)`;
    }

    return (
        <>
            <footer className="mt-12 border-t border-border-strong pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-ink-secondary">
                            {nextLabel ?? "Berikutnya"}:{" "}
                            <span className="font-semibold text-ink-primary">
                                {nextTitle}
                            </span>
                        </p>
                        {isRevealed && isTimeLocked && !isBlockedByPrerequisite && (
                            <p className="text-xs text-ink-secondary">
                                Luangkan waktu memahami perbandingan dan
                                ringkasan di atas sebelum melanjutkan.
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onFinish}
                        disabled={isDisabled}
                        className="min-h-12 w-full shrink-0 rounded-xl bg-ink-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand disabled:bg-border-strong/80 disabled:text-ink-secondary disabled:active:scale-100 sm:w-auto sm:min-w-52"
                    >
                        {buttonText}
                    </button>
                </div>
            </footer>

            {errorMessage && (
                <p
                    role="alert"
                    className="mt-4 rounded-lg border border-signal-danger-border bg-signal-danger-bg px-4 py-3 text-sm leading-6 text-signal-danger"
                >
                    {errorMessage}
                </p>
            )}
        </>
    );
}