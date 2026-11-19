"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Unit1 from "@/components/microlearning/Unit1";
import Unit2 from "@/components/microlearning/Unit2";
import Unit3 from "@/components/microlearning/Unit3";
import Unit4 from "@/components/microlearning/Unit4";
import Unit5 from "@/components/microlearning/Unit5";
import Unit6 from "@/components/microlearning/Unit6";

type Props = {
    unitNumber: number;
};

type UnitProps = {
    seconds: number;
    isSaving: boolean;
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

        return () => {
            isMounted = false;
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

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isSaving) {
                setShowConfirmModal(false);
            }
        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [showConfirmModal, isSaving]);

    const handleFinish = useCallback(() => {
        if (!respondentId || isSaving) {
            return;
        }

        setErrorMessage("");
        setShowConfirmModal(true);
    }, [respondentId, isSaving]);

    function closeModal() {
        if (isSaving) return;

        setErrorMessage("");
        setShowConfirmModal(false);
    }

    async function handleContinue() {
        if (!respondentId || startedAt === null || isSaving) {
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
            <main className="min-h-screen bg-white px-4 py-12">
                <div className="mx-auto w-full max-w-6xl">
                    <p className="text-sm text-slate-500">
                        Memuat materi microlearning...
                    </p>
                </div>
            </main>
        );
    }

    if (errorMessage && !respondentId) {
        return (
            <main className="min-h-screen bg-white px-4 py-12">
                <div className="mx-auto w-full max-w-6xl space-y-4">
                    <p className="text-sm text-red-600">{errorMessage}</p>

                    <button
                        type="button"
                        onClick={() => router.replace("/pretest")}
                        className="rounded-lg bg-[#172B45] px-5 py-3 text-white hover:bg-[#243F60]"
                    >
                        Kembali ke Pre-test
                    </button>
                </div>
            </main>
        );
    }

    if (!UnitComponent) {
        return null;
    }

    const unitProps: UnitProps = {
        seconds,
        isSaving: false,
        errorMessage: showConfirmModal ? "" : errorMessage,
        onFinish: handleFinish,
    };

    return (
        <>
            <main className="min-h-screen w-full bg-white px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="mb-8">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                MICROLEARNING
                            </p>

                            <p className="text-sm text-slate-500">
                                Unit {unitNumber} dari 6
                            </p>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#172B45] transition-all"
                                style={{
                                    width: `${(unitNumber / 6) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <section className="w-full rounded-xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10">
                        <UnitComponent {...unitProps} />
                    </section>
                </div>
            </main>

            {showConfirmModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
                    onClick={closeModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="unit-confirm-title"
                        onClick={(event) => event.stopPropagation()}
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={isSaving}
                            aria-label="Tutup"
                            className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 6l12 12M18 6L6 18"
                                />
                            </svg>
                        </button>

                        <div className="mb-5 text-center">
                            <h2
                                id="unit-confirm-title"
                                className="px-6 text-xl font-bold text-[#172B45]"
                            >
                                Unit Berhasil Diselesaikan!
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                Kamu telah menyelesaikan materi Unit{" "}
                                {unitNumber}. Silakan lanjutkan ke tahap
                                berikutnya.
                            </p>

                            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                                Perhatian: Setelah melanjutkan, kamu tidak
                                dapat kembali ke unit sebelumnya.
                            </p>
                        </div>

                        {errorMessage && (
                            <p className="mb-4 text-center text-sm text-red-600">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={isSaving}
                            className="w-full cursor-pointer rounded-xl bg-[#172B45] px-5 py-3 font-semibold text-white transition hover:bg-[#243F60] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? "Menyimpan..."
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