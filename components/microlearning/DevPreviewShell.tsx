"use client";

import { useEffect, useState } from "react";
import Unit1 from "@/components/microlearning/Unit1";
import Unit2 from "@/components/microlearning/Unit2";
import Unit3 from "@/components/microlearning/Unit3";
import Unit4 from "@/components/microlearning/Unit4";
import Unit5 from "@/components/microlearning/Unit5";
import Unit6 from "@/components/microlearning/Unit6";

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

    useEffect(() => {
        const timer = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [unitNumber, resetKey]);

    const currentUnit = UNITS[unitNumber - 1];
    const UnitComponent = currentUnit.Component;
    const isLastUnit = unitNumber === 6;

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
        setShowConfirmModal(false);
        if (!isLastUnit) {
            handleSelectUnit(unitNumber + 1);
        }
    }

    useEffect(() => {
        if (!showConfirmModal) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setShowConfirmModal(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showConfirmModal]);

    return (
        <>
            {/* Dev Preview Bar */}
            <div className="sticky top-0 z-40 border-b border-[#25364E] bg-[#101C2E] px-4 py-2 text-white">
                <div className="mx-auto flex max-w-[780px] flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                        <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#D8E2EE]">
                            DEV PREVIEW
                        </span>
                        <span className="hidden text-xs text-[#D8E2EE] sm:inline">
                            Lokal tanpa Supabase
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg bg-white/10 p-0.5">
                            {UNITS.map((unit) => {
                                const isActive = unit.number === unitNumber;
                                return (
                                    <button
                                        key={unit.number}
                                        type="button"
                                        onClick={() =>
                                            handleSelectUnit(unit.number)
                                        }
                                        className={`inline-flex min-h-8 items-center gap-1 rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                            isActive
                                                ? "bg-white text-[#101C2E]"
                                                : "text-[#D8E2EE] hover:text-white"
                                        }`}
                                    >
                                        {unit.label}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="min-h-8 rounded-md border border-white/20 px-2.5 text-xs font-medium text-[#D8E2EE] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Warm Paper Canvas (#F6F4EE) */}
            <main className="min-h-screen w-full bg-[#F6F4EE] px-4 py-6 sm:px-8 sm:py-9">
                <div className="mx-auto w-full max-w-[780px]">
                    <div className="mb-5">
                        <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#4E5A69]">
                            <span>Microlearning A03</span>
                            <span className="tabular-nums">
                                Unit {unitNumber} dari 6
                            </span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E3DFD5]">
                            <div
                                className="h-full rounded-full bg-[#172B45] transition-all duration-300"
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
                            errorMessage=""
                            onFinish={() => setShowConfirmModal(true)}
                        />
                    </section>
                </div>
            </main>

            {showConfirmModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#101C2E]/55 px-4 py-6"
                    onClick={() => setShowConfirmModal(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="preview-confirm-title"
                        onClick={(event) => event.stopPropagation()}
                        className="animate-popover-in relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                    >
                        <button
                            type="button"
                            onClick={() => setShowConfirmModal(false)}
                            aria-label="Tutup dialog"
                            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-[#4E5A69] transition-colors hover:bg-[#F6F4EE] hover:text-[#1C2430] focus-visible:outline-2 focus-visible:outline-[#172B45]"
                        >
                            ✕
                        </button>

                        <div className="mb-5 text-center">
                            <h2
                                id="preview-confirm-title"
                                className="px-8 text-xl font-semibold text-[#172B45]"
                            >
                                Unit Berhasil Diselesaikan
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-[#4E5A69]">
                                Anda telah menyelesaikan materi Unit{" "}
                                {unitNumber}. Silakan lanjutkan ke tahap
                                berikutnya.
                            </p>

                            <p className="mt-2.5 text-xs font-medium leading-relaxed text-[#4E5A69]">
                                Perhatian: setelah melanjutkan, Anda tidak dapat
                                kembali ke unit sebelumnya. (Mode preview)
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleContinue}
                            className="min-h-12 w-full rounded-lg bg-[#172B45] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
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
