"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Stage =
    | "demographic"
    | "pretest"
    | "microlearning"
    | "posttest"
    | "done";

const ROUTES = {
    start: "/consent",
    demographic: "/demographic",
    pretest: "/pretest",
    posttest: "/posttest",
    done: "/terima-kasih",
};

function routeFor(stage: Stage, currentUnit?: number) {
    if (stage === "microlearning") {
        return `/microlearning/U${currentUnit ?? 1}`;
    }

    return ROUTES[stage];
}

export function useStageGuard(
    page: "demographic" | "pretest" | "posttest" | "done"
) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function check() {
            const respondentId = sessionStorage.getItem("respondent_id");

            if (!respondentId) {
                if (page === "demographic") {
                    setIsChecking(false);
                } else {
                    router.replace(ROUTES.start);
                }
                return;
            }

            try {
                const response = await fetch(
                    `/api/status?respondentId=${encodeURIComponent(respondentId)}`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    if (!cancelled) setIsChecking(false);
                    return;
                }

                const data = await response.json();

                if (cancelled) return;

                if (data.stage !== page) {
                    router.replace(routeFor(data.stage, data.currentUnit));
                    return;
                }

                setIsChecking(false);
            } catch (error) {
                console.error("Gagal memeriksa tahap:", error);
                if (!cancelled) setIsChecking(false);
            }
        }

        check();

        function handlePageShow(event: PageTransitionEvent) {
            if (event.persisted) {
                setIsChecking(true);
                check();
            }
        }

        window.addEventListener("pageshow", handlePageShow);

        return () => {
            cancelled = true;
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [page, router]);

    return isChecking;
}