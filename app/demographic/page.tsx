"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStageGuard } from "@/lib/useStageGuard";

type FieldName =
    | "usia"
    | "bidangStudi"
    | "riwayatPelatihan"
    | "pengalamanPhishing"
    | "penggunaanMfa"
    | "frekuensiEmail";

type Question = {
    name: FieldName;
    label: string;
    options: string[];
};

const QUESTIONS: Question[] = [
    {
        name: "usia",
        label: "D1. Rentang usia",
        options: ["18-20", "21-23", "24+"],
    },
    {
        name: "bidangStudi",
        label: "D2. Bidang studi",
        options: ["IT/Komputer", "Non-IT", "Lainnya"],
    },
    {
        name: "riwayatPelatihan",
        label:
            "D3. Apakah Anda pernah mengikuti pelatihan keamanan siber atau security awareness?",
        options: ["Tidak", "Ya"],
    },
    {
        name: "pengalamanPhishing",
        label:
            "D4. Apakah Anda pernah menerima pesan yang dicurigai sebagai phishing?",
        options: ["Tidak", "Ya"],
    },
    {
        name: "penggunaanMfa",
        label:
            "D5. Apakah Anda menggunakan MFA pada minimal satu akun penting?",
        options: ["Tidak", "Ya"],
    },
    {
        name: "frekuensiEmail",
        label: "D6. Seberapa sering Anda menggunakan email?",
        options: ["Jarang", "Beberapa kali/minggu", "Setiap hari"],
    },
];

const OPTION_LABELS: Record<string, string> = {
    "18-20": "18–20",
    "21-23": "21–23",
};

export default function DemographicPage() {
    const router = useRouter();
    const isChecking = useStageGuard("demographic");

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [respondentId, setRespondentId] = useState("");
    const [isRestored, setIsRestored] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pesanError, setPesanError] = useState("");

    const radioClass =
        "h-4 w-4 shrink-0 cursor-pointer accent-[#172B45]";

    const labelClass =
        "flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50";

    const questionClass =
        "mb-3 text-sm font-semibold leading-6 text-slate-900";

    useEffect(() => {
        let savedRespondentId = sessionStorage.getItem("respondent_id");

        if (!savedRespondentId) {
            savedRespondentId = `A03-${crypto.randomUUID()}`;
            sessionStorage.setItem("respondent_id", savedRespondentId);
        }

        setRespondentId(savedRespondentId);

        const savedProgress = sessionStorage.getItem(
            `demographic_progress_${savedRespondentId}`
        );

        if (savedProgress) {
            try {
                const parsedProgress = JSON.parse(savedProgress);
                setAnswers(parsedProgress.answers || {});
            } catch (error) {
                console.error("Gagal memulihkan jawaban:", error);
            }
        }

        setIsRestored(true);
    }, []);

    useEffect(() => {
        if (!isRestored || !respondentId) return;

        sessionStorage.setItem(
            `demographic_progress_${respondentId}`,
            JSON.stringify({ answers })
        );
    }, [answers, respondentId, isRestored]);

    function handleAnswer(name: FieldName, value: string) {
        setAnswers((previous) => ({
            ...previous,
            [name]: value,
        }));

        setPesanError("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isLoading) return;

        const activeRespondentId =
            respondentId || sessionStorage.getItem("respondent_id");

        if (!activeRespondentId) {
            setPesanError(
                "ID responden tidak ditemukan. Silakan muat ulang halaman."
            );
            return;
        }

        setIsLoading(true);
        setPesanError("");

        try {
            const response = await fetch("/api/demographic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...answers,
                    respondentId: activeRespondentId,
                }),
            });

            const hasil = await response.json();

            if (!response.ok) {
                setPesanError(
                    hasil.message || "Gagal menyimpan data demografi."
                );
                return;
            }

            router.push("/pretest");
        } catch (error) {
            console.error("Kesalahan:", error);

            setPesanError(
                "Terjadi kesalahan koneksi. Silakan coba kembali."
            );
        } finally {
            setIsLoading(false);
        }
    }

    function renderQuestion(question: Question) {
        return (
            <section key={question.name}>
                <p className={questionClass}>{question.label}</p>

                <div>
                    {question.options.map((option) => (
                        <label key={option} className={labelClass}>
                            <input
                                type="radio"
                                name={question.name}
                                value={option}
                                checked={answers[question.name] === option}
                                onChange={() =>
                                    handleAnswer(question.name, option)
                                }
                                required
                                className={radioClass}
                            />
                            {OPTION_LABELS[option] ?? option}
                        </label>
                    ))}
                </div>
            </section>
        );
    }

    if (!isRestored || isChecking) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-slate-500">
                    Memuat data demografi...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-white px-5 py-8 sm:px-10 lg:px-16">
            <div className="w-full">
                <header className="border-b border-slate-200 pb-7">
                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                        PENELITIAN KEAMANAN INFORMASI
                    </p>

                    <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#172B45] sm:text-3xl">
                        Demografi Responden
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                        Silakan lengkapi informasi berikut sebelum melanjutkan
                        ke tahap penelitian.
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-9 py-8 md:grid-cols-[1fr_1px_1fr] md:gap-x-10">
                        <div className="space-y-9">
                            {QUESTIONS.slice(0, 3).map(renderQuestion)}
                        </div>

                        <div className="hidden w-px bg-slate-200 md:block" />

                        <div className="space-y-9">
                            {QUESTIONS.slice(3).map(renderQuestion)}
                        </div>
                    </div>

                    {pesanError && (
                        <p className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {pesanError}
                        </p>
                    )}

                    <footer className="border-t border-slate-200 py-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer rounded-md bg-[#172B45] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-48"
                        >
                            {isLoading ? "Menyimpan..." : "Lanjut"}
                        </button>

                        <p className="mt-5 text-xs text-slate-400">
                            Penelitian Keamanan Informasi · A03
                        </p>
                    </footer>
                </form>
            </div>
        </main>
    );
}