
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Unit1 from "@/components/microlearning/Unit1";
import Unit2 from "@/components/microlearning/Unit2";
import Unit3 from "@/components/microlearning/Unit3";
import Unit4 from "@/components/microlearning/Unit4";
import Unit5 from "@/components/microlearning/Unit5";
import Unit6 from "@/components/microlearning/Unit6";

const UNIT_COMPONENTS = [
    Unit1,
    Unit2,
    Unit3,
    Unit4,
    Unit5,
    Unit6,
];

export default function MicrolearningUnitPage() {
    const params = useParams();
    const router = useRouter();

    const unitParam = String(params.unit || "");
    const unitNumber = Number(unitParam.replace("U", ""));

    const [respondentId, setRespondentId] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const storageKey = `microlearning_${unitParam}`;

    useEffect(() => {
        const id = sessionStorage.getItem("respondent_id");

        if (!id) {
            router.replace("/consent");
            return;
        }

        let active = true;

        async function loadProgress() {
            try {
                const response = await fetch(
                    `/api/microlearning?respondentId=${encodeURIComponent(id!)}`
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message);
                }

                const currentUnit = result.progress.current_unit;

                if (currentUnit === 7) {
                    router.replace("/posttest");
                    return;
                }

                if (unitNumber !== currentUnit) {
                    router.replace(`/microlearning/U${currentUnit}`);
                    return;
                }

                if (active) {
                    setRespondentId(id!);
                    setSeconds(
                        Number(sessionStorage.getItem(storageKey) || 0)
                    );
                    setIsReady(true);
                }
            } catch (error) {
                if (active) {
                    setErrorMessage(
                        error instanceof Error
                            ? error.message
                            : "Gagal memuat progres."
                    );
                }
            }
        }

        loadProgress();

        return () => {
            active = false;
        };
    }, [router, storageKey, unitNumber]);

    useEffect(() => {
        if (!isReady) return;

        let interval: ReturnType<typeof setInterval> | undefined;

        function startTimer() {
            if (
                document.visibilityState !== "visible" ||
                interval
            ) return;

            interval = setInterval(() => {
                setSeconds((previous) => {
                    const next = previous + 1;
                    sessionStorage.setItem(storageKey, String(next));
                    return next;
                });
            }, 1000);
        }

        function stopTimer() {
            if (interval) {
                clearInterval(interval);
                interval = undefined;
            }
        }

        function handleVisibility() {
            if (document.visibilityState === "visible") {
                startTimer();
            } else {
                stopTimer();
            }
        }

        handleVisibility();

        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );

        return () => {
            stopTimer();
            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );
        };
    }, [isReady, storageKey]);

    async function finishUnit() {
        if (!respondentId || isSaving) return;

        if (seconds < 1) {
            setErrorMessage("Silakan baca materi terlebih dahulu.");
            return;
        }

        if (!window.confirm(
            "Selesaikan unit ini? Kamu tidak dapat kembali ke unit sebelumnya."
        )) return;

        setIsSaving(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/microlearning", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    respondentId,
                    unitNumber,
                    duration: seconds,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            sessionStorage.removeItem(storageKey);

            if (unitNumber === 6) {
                router.replace("/posttest");
            } else {
                router.replace(`/microlearning/U${unitNumber + 1}`);
            }
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Gagal menyimpan unit."
            );
        } finally {
            setIsSaving(false);
        }
    }

    const UnitComponent = UNIT_COMPONENTS[unitNumber - 1];

    if (!UnitComponent) {
        return (
            <main className="p-6">
                Unit tidak ditemukan.
            </main>
        );
    }

    if (!isReady) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100 p-5">
                <p className="text-gray-600">
                    {errorMessage || "Memuat materi..."}
                </p>
            </main>
        );
    }

    return (
        <UnitComponent
            seconds={seconds}
            isSaving={isSaving}
            errorMessage={errorMessage}
            onFinish={finishUnit}
        />
    );
}
