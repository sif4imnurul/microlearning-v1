"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Unit1 from "@/components/microlearning/Unit1";
import Unit2 from "@/components/microlearning/Unit2";
import Unit3 from "@/components/microlearning/Unit3";
import Unit4 from "@/components/microlearning/Unit4";
import Unit5 from "@/components/microlearning/Unit5";
import Unit6 from "@/components/microlearning/Unit6";
import { CloseIcon } from "@/components/microlearning/UnitParts";

type Props = {
    unitNumber: number;
};

type UnitProps = {
    seconds: number;
    isSaving: boolean;
    isTimeLocked: boolean;
    errorMessage: string;
    onFinish: () => void;
};

type ProgressResponse = {
    success?: boolean;
    progress?: {
        current_unit?: number;
        completed_units?: string[];
    };
    message?: string;
};

const unitComponents = [Unit1, Unit2, Unit3, Unit4, Unit5, Unit6];

function getElapsedSeconds(startedAt: number) {
    return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

export default function MicrolearningUnitContent({ unitNumber }: Props) {
    const router = useRouter();

    const [respondentId, setRespondentId] = useState("");
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [seconds, setSeconds] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const confirmContinueRef = useRef<HTMLButtonElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const isSavingRef = useRef(false);

    useEffect(() => {
        isSavingRef.current = isSaving;
    }, [isSaving]);

    const isLastUnit = unitNumber === 6;
    const startKey = `microlearning_start_U${unitNumber}`;

    useEffect(() => {
        let isMounted = true;

        async function loadProgress() {
            try {
                if (unitNumber < 1 || unitNumber > 6) {
                    router.replace("/consent");
                    return;
                }

                const id = sessionStorage.getItem("respondent_id");

                if (!id) {
                    router.replace("/consent");
                    return;
                }

                if (isMounted) {
                    setRespondentId(id);
                }

                const response = await fetch(
                    `/api/microlearning?respondentId=${encodeURIComponent(id)}`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                if (response.status === 403) {
                    router.replace("/pretest");
                    return;
                }

                const result: ProgressResponse = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Gagal mengambil progres microlearning."
                    );
                }

                const currentUnit = Number(result.progress?.current_unit);

                if (!Number.isInteger(currentUnit) || currentUnit < 1) {
                    throw new Error(
                        "Data progres microlearning tidak valid."
                    );
                }

                if (currentUnit === 7) {
                    router.replace("/posttest");
                    return;
                }

                if (unitNumber !== currentUnit) {
                    router.replace(`/microlearning/U${currentUnit}`);
                    return;
                }

                let start = Number(sessionStorage.getItem(startKey));

                if (!Number.isFinite(start) || start <= 0 || start > Date.now()) {
                    start = Date.now();
                    sessionStorage.setItem(startKey, String(start));
                }

                if (isMounted) {
                    setErrorMessage("");
                    setStartedAt(start);
                    setSeconds(getElapsedSeconds(start));
                }
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(
                        error instanceof Error
                            ? error.message
                            : "Terjadi kesalahan saat memuat unit."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProgress();

        function handlePageShow(event: PageTransitionEvent) {
            if (event.persisted) {
                setIsLoading(true);
                loadProgress();
            }
        }

        window.addEventListener("pageshow", handlePageShow);

        return () => {
            isMounted = false;
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [unitNumber, router, startKey]);

    useEffect(() => {
        if (startedAt === null || isDone) {
            return;
        }

        const interval = window.setInterval(() => {
            setSeconds(getElapsedSeconds(startedAt));
        }, 1000);

        return () => window.clearInterval(interval);
    }, [startedAt, isDone]);

    useEffect(() => {
        if (!showConfirmModal) return;

        previouslyFocusedRef.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        confirmContinueRef.current?.focus();

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.stopImmediatePropagation();
                if (!isSavingRef.current) {
                    setShowConfirmModal(false);
                }
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

        window.addEventListener("keydown", onKeyDown, true);

        return () => {
            window.removeEventListener("keydown", onKeyDown, true);
            previouslyFocusedRef.current?.focus();
        };
    }, [showConfirmModal]);

    const isTimeLocked = seconds < 60;

    const handleFinish = useCallback(() => {
        if (!respondentId || isSaving) {
            return;
        }

        if (getElapsedSeconds(startedAt ?? Date.now()) < 60) {
            return;
        }

        setErrorMessage("");
        setShowConfirmModal(true);
    }, [respondentId, isSaving, startedAt]);

    function closeModal() {
        if (isSaving) return;

        setErrorMessage("");
        setShowConfirmModal(false);
    }

    async function handleContinue() {
        if (!respondentId || startedAt === null || isSaving) {
            return;
        }

        if (getElapsedSeconds(startedAt) < 60) {
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            const duration = Math.min(
                3600,
                Math.max(1, getElapsedSeconds(startedAt))
            );

            const response = await fetch("/api/microlearning", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    respondentId,
                    unitNumber,
                    duration,
                }),
            });

            const result = await response.json();

            if (!response.ok && response.status !== 409) {
                throw new Error(
                    result.message || "Gagal menyimpan progres unit."
                );
            }

            setIsDone(true);
            setSeconds(duration);
            sessionStorage.removeItem(startKey);

            if (isLastUnit) {
                router.replace("/posttest");
            } else {
                router.replace(`/microlearning/U${unitNumber + 1}`);
            }
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat menyimpan progres."
            );
            setIsSaving(false);
        }
    }

    const UnitComponent = unitComponents[unitNumber - 1];

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-surface-canvas px-4">
                <p className="text-sm text-ink-secondary">
                    Memuat materi microlearning…
                </p>
            </main>
        );
    }

    if (errorMessage && startedAt === null) {
        return (
            <main className="min-h-screen w-full bg-surface-canvas px-4 py-8 sm:px-8 sm:py-12">
                <div className="mx-auto w-full max-w-[780px] space-y-4 rounded-xl border border-[#E2E8F0] bg-white p-6">
                    <p
                        role="alert"
                        className="rounded-lg border border-[#F5C2C0] bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]"
                    >
                        {errorMessage}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="min-h-11 rounded-lg bg-[#172B45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Muat Ulang Halaman
                        </button>

                        <button
                            type="button"
                            onClick={() => router.replace("/pretest")}
                            className="min-h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#172B45] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172B45]"
                        >
                            Kembali ke Pre-test
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!UnitComponent) {
        return null;
    }

    const unitProps: UnitProps = {
        seconds,
        isSaving,
        isTimeLocked,
        errorMessage: showConfirmModal ? "" : errorMessage,
        onFinish: handleFinish,
    };

    return (
        <>
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
                        <UnitComponent {...unitProps} />
                    </section>
                </div>
            </main>

            {showConfirmModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 px-4 py-6"
                    onClick={closeModal}
                >
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="unit-confirm-title"
                        onClick={(event) => event.stopPropagation()}
                        className="animate-popover-in relative w-full max-w-md overscroll-contain rounded-2xl border border-border-subtle bg-white p-6 shadow-xl sm:p-8"
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={isSaving}
                            aria-label="Tutup dialog"
                            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-ink-brand disabled:opacity-40"
                        >
                            <CloseIcon className="h-5 w-5" />
                        </button>

                        <div className="mb-5 text-center">
                            <h2
                                id="unit-confirm-title"
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
                                kembali ke unit sebelumnya.
                            </p>
                        </div>

                        {errorMessage && (
                            <p
                                role="alert"
                                className="mb-4 rounded-lg border border-signal-danger-border bg-signal-danger-bg px-3 py-2 text-center text-xs text-signal-danger"
                            >
                                {errorMessage}
                            </p>
                        )}

                        <button
                            ref={confirmContinueRef}
                            type="button"
                            onClick={handleContinue}
                            disabled={isSaving}
                            className="min-h-12 w-full rounded-lg bg-ink-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-brand disabled:opacity-50"
                        >
                            {isSaving
                                ? "Menyimpan…"
                                : isLastUnit
                                    ? "Lanjut ke Post-test"
                                    : "Lanjut ke Unit Berikutnya"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}