"use client";

import { useEffect, useRef, useState } from "react";
import Unit1 from "@/components/microlearning/Unit1";
import Unit2 from "@/components/microlearning/Unit2";
import Unit3 from "@/components/microlearning/Unit3";
import Unit4 from "@/components/microlearning/Unit4";
import Unit5 from "@/components/microlearning/Unit5";
import Unit6 from "@/components/microlearning/Unit6";
import { CloseIcon } from "@/components/microlearning/UnitParts";

const UNITS = [
    { number: 1, label: "U1", Component: Unit1 },
    { number: 2, label: "U2", Component: Unit2 },
    { number: 3, label: "U3", Component: Unit3 },
    { number: 4, label: "U4", Component: Unit4 },
    { number: 5, label: "U5", Component: Unit5 },
    { number: 6, label: "U6", Component: Unit6 },
] as const;

export default function DevPreviewShell() {
    const [unitNumber, setUnitNumber] = useState<number>(1);
    const [resetKey, setResetKey] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const confirmContinueRef = useRef<HTMLButtonElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [unitNumber, resetKey]);

    const currentUnit = UNITS[unitNumber - 1];
    const UnitComponent = currentUnit.Component;
    const isLastUnit = unitNumber === 6;
    const isTimeLocked = seconds < 60;

    function handleSelectUnit(nextUnit: number) {
        setUnitNumber(nextUnit);
        setSeconds(0);
        setShowConfirmModal(false);
    }

    function handleReset() {
        setResetKey((prev) => prev + 1);
        setSeconds(0);
        setShowConfirmModal(false);
    }

    function handleContinue() {
        if (isTimeLocked) return;
        setShowConfirmModal(false);
        if (!isLastUnit) {
            handleSelectUnit(unitNumber + 1);
        }
    }

    function handleFinish() {
        if (isTimeLocked) return;
        setShowConfirmModal(true);
    }

    useEffect(() => {
        if (!showConfirmModal) return;

        previouslyFocusedRef.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        confirmContinueRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.stopImmediatePropagation();
                setShowConfirmModal(false);
                return;
            }
            if (event.key === "Tab" && dialogRef.current) {
                const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
                );
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown, true);
        return () => {
            window.removeEventListener("keydown", handleKeyDown, true);
            previouslyFocusedRef.current?.focus();
        };
    }, [showConfirmModal]);

    return (
        <>
            {/* Dev Preview Bar */}
            <div className="sticky top-0 z-40 border-b border-[#1E293B] bg-[#0F172A] px-3 py-1.5 text-white sm:px-4">
                <div className="mx-auto flex max-w-[780px] flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#CBD5E1]">
                                DEV PREVIEW
                            </span>
                            <span className="hidden text-xs text-[#CBD5E1] md:inline">
                                Lokal tanpa Supabase
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:hidden">
                            <button
                                type="button"
                                onClick={() =>
                                    setSeconds((prev) =>
                                        Math.max(prev + 60, 60)
                                    )
                                }
                                className="min-h-11 rounded-md border border-white/20 px-3 text-xs font-medium text-[#CBD5E1] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                title="Lewati batas baca 60 detik (khusus mode preview)"
                            >
                                +60d
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="min-h-11 rounded-md border border-white/20 px-3 text-xs font-medium text-[#CBD5E1] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <div className="grid w-full grid-cols-6 rounded-lg bg-white/10 p-0.5 sm:flex sm:w-auto sm:items-center">
                            {UNITS.map((unit) => {
                                const isActive = unit.number === unitNumber;
                                return (
                                    <button
                                        key={unit.number}
                                        type="button"
                                        onClick={() =>
                                            handleSelectUnit(unit.number)
                                        }
                                        className={`inline-flex min-h-11 items-center justify-center rounded-md px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-9 sm:min-w-9 ${
                                            isActive
                                                ? "bg-white text-[#0F172A]"
                                                : "text-[#CBD5E1] hover:text-white"
                                        }`}
                                    >
                                        {unit.label}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setSeconds((prev) => Math.max(prev + 60, 60))
                            }
                            className="hidden min-h-9 rounded-md border border-white/20 px-3 text-xs font-medium text-[#CBD5E1] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex sm:items-center"
                            title="Lewati batas baca 60 detik (khusus mode preview)"
                        >
                            +60d
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="hidden min-h-9 rounded-md border border-white/20 px-3 text-xs font-medium text-[#CBD5E1] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex sm:items-center"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Clean Neutral Canvas */}
            <main className="min-h-screen w-full bg-surface-canvas px-4 py-6 sm:px-8 sm:py-10">
                <div className="mx-auto w-full max-w-[780px]">
                    <div className="mb-6">
                        <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink-secondary">
                            <span>Microlearning A03</span>
                            <span className="tabular-nums">
                                Unit {unitNumber} dari 6
                            </span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-strong">
                            <div
                                className="h-full rounded-full bg-ink-brand transition-[width] duration-300"
                                style={{
                                    width: `${(unitNumber / 6) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <section className="w-full">
                        <UnitComponent
                            key={`${unitNumber}-${resetKey}`}
                            seconds={seconds}
                            isSaving={false}
                            isTimeLocked={isTimeLocked}
                            errorMessage=""
                            onFinish={handleFinish}
                        />
                    </section>
                </div>
            </main>

            {showConfirmModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink-primary/50 px-4 py-6"
                    onClick={() => setShowConfirmModal(false)}
                >
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="preview-confirm-title"
                        onClick={(event) => event.stopPropagation()}
                        className="animate-popover-in relative w-full max-w-md overscroll-contain rounded-2xl border border-border-subtle bg-white p-6 shadow-xl sm:p-8"
                    >
                        <button
                            type="button"
                            onClick={() => setShowConfirmModal(false)}
                            aria-label="Tutup dialog"
                            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-ink-brand"
                        >
                            <CloseIcon className="h-5 w-5" />
                        </button>

                        <div className="mb-5 text-center">
                            <h2
                                id="preview-confirm-title"
                                className="px-8 text-xl font-semibold text-ink-brand"
                            >
                                Unit Berhasil Diselesaikan
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                                Anda telah menyelesaikan materi Unit{" "}
                                {unitNumber}. Silakan lanjutkan ke tahap
                                berikutnya.
                            </p>

                            <p className="mt-2.5 text-xs font-medium leading-relaxed text-ink-secondary">
                                Perhatian: setelah melanjutkan, Anda tidak dapat
                                kembali ke unit sebelumnya. (Mode preview)
                            </p>
                        </div>

                        <button
                            ref={confirmContinueRef}
                            type="button"
                            onClick={handleContinue}
                            className="min-h-12 w-full rounded-lg bg-ink-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand"
                        >
                            {isLastUnit
                                ? "Selesai Preview (U6)"
                                : `Lanjut ke Unit ${unitNumber + 1}`}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
