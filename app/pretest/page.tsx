"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PRETEST_QUESTIONS } from "@/data/instruments/pretest";
import { useStageGuard } from "@/lib/useStageGuard";

type AnswerData = {
    answer: string;
    confidence: string;
};

export default function PretestPage() {
    const router = useRouter();
    const isChecking = useStageGuard("pretest");

    const [answers, setAnswers] = useState<Record<string, AnswerData>>({});
    const [respondentId, setRespondentId] = useState("");
    const [isRestored, setIsRestored] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pesanError, setPesanError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const totalQuestions = PRETEST_QUESTIONS.length;

    const optionClass =
        "flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-sm leading-6 transition-colors";

    const radioClass =
        "mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#172B45]";

    useEffect(() => {
        const savedRespondentId = sessionStorage.getItem("respondent_id");

        if (savedRespondentId) {
            setRespondentId(savedRespondentId);

            const savedProgress = sessionStorage.getItem(
                `pretest_progress_${savedRespondentId}`
            );

            if (savedProgress) {
                try {
                    const parsedProgress = JSON.parse(savedProgress);
                    setAnswers(parsedProgress.answers || {});
                } catch (error) {
                    console.error("Gagal memulihkan jawaban:", error);
                }
            }
        }

        setIsRestored(true);
    }, []);

    useEffect(() => {
        if (!isRestored || !respondentId) return;

        sessionStorage.setItem(
            `pretest_progress_${respondentId}`,
            JSON.stringify({ answers })
        );
    }, [answers, respondentId, isRestored]);

    useEffect(() => {
        if (!showConfirm) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isLoading) {
                setShowConfirm(false);
            }
        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [showConfirm, isLoading]);

    function handleAnswer(questionId: string, value: string) {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: {
                answer: value,
                confidence: previous[questionId]?.confidence || "",
            },
        }));

        setPesanError("");
    }

    function handleConfidence(questionId: string, value: string) {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: {
                answer: previous[questionId]?.answer || "",
                confidence: value,
            },
        }));

        setPesanError("");
    }

    const answeredCount = PRETEST_QUESTIONS.filter(
        (question) =>
            answers[question.id]?.answer &&
            answers[question.id]?.confidence
    ).length;

    const progress =
        totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    const isComplete = PRETEST_QUESTIONS.every(
        (question) =>
            answers[question.id]?.answer &&
            answers[question.id]?.confidence
    );

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isLoading) return;

        if (!isComplete) {
            setPesanError(
                "Masih ada pertanyaan yang belum dijawab. Periksa kembali seluruh pertanyaan."
            );

            const firstIncomplete = PRETEST_QUESTIONS.find(
                (question) =>
                    !answers[question.id]?.answer ||
                    !answers[question.id]?.confidence
            );

            if (firstIncomplete) {
                document
                    .getElementById(`question-${firstIncomplete.id}`)
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
            }

            return;
        }

        setPesanError("");
        setShowConfirm(true);
    }

    async function handleConfirmSubmit() {
        if (isLoading) return;

        setIsLoading(true);
        setPesanError("");

        try {
            const activeRespondentId =
                respondentId || sessionStorage.getItem("respondent_id");

            if (!activeRespondentId) {
                setShowConfirm(false);
                setPesanError(
                    "ID responden tidak ditemukan. Silakan ulangi dari halaman awal."
                );
                return;
            }

            const response = await fetch("/api/pretest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    respondentId: activeRespondentId,
                    answers,
                }),
            });

            const hasil = await response.json();

            if (!response.ok) {
                setShowConfirm(false);
                setPesanError(
                    hasil.message || "Gagal menyimpan jawaban Pre-test."
                );
                return;
            }

            setShowConfirm(false);
            setShowSuccess(true);
        } catch (error) {
            console.error("Kesalahan:", error);

            setShowConfirm(false);
            setPesanError(
                "Terjadi kesalahan koneksi. Silakan coba kembali."
            );
        } finally {
            setIsLoading(false);
        }
    }

    function handleStartMicrolearning() {
        router.replace("/microlearning/U1");
    }

    if (!isRestored || isChecking) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-slate-500">Memuat Pre-test...</p>
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
                        Pre-test Security Awareness
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                        Silakan jawab seluruh pertanyaan berikut berdasarkan
                        pemahaman Anda. Pilih satu jawaban yang paling tepat
                        dan tentukan tingkat keyakinan terhadap jawaban
                        tersebut.
                    </p>
                </header>

                <section className="border-b border-slate-200 py-6">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Petunjuk Pengerjaan
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-500">
                        <li>
                            Pilih satu jawaban dari pilihan A–D pada setiap
                            pertanyaan.
                        </li>
                        <li>
                            Tentukan tingkat keyakinan setelah memilih
                            jawaban.
                        </li>
                        <li>
                            Skala confidence terdiri dari 1 sampai 5. Angka 1
                            berarti sangat tidak yakin, sedangkan angka 5
                            berarti sangat yakin.
                        </li>
                    </ul>
                </section>

                <section className="py-6">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-slate-500">
                                PROGRES PENGERJAAN
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#172B45]">
                                {answeredCount} dari {totalQuestions} pertanyaan
                                selesai
                            </p>
                        </div>

                        <p className="text-sm font-semibold tabular-nums text-slate-600">
                            {Math.round(progress)}%
                        </p>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-[#172B45] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </section>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {PRETEST_QUESTIONS.map((question, index) => {
                            const currentAnswer = answers[question.id];

                            const isAnswered = Boolean(
                                currentAnswer?.answer &&
                                currentAnswer?.confidence
                            );

                            return (
                                <section
                                    key={question.id}
                                    id={`question-${question.id}`}
                                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#172B45] text-sm font-semibold text-white">
                                                {index + 1}
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold tracking-wide text-[#172B45]">
                                                    PERTANYAAN {index + 1}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    {question.id}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${isAnswered
                                                ? "bg-slate-200 text-[#172B45]"
                                                : "border border-slate-200 bg-white text-slate-400"
                                                }`}
                                        >
                                            {isAnswered
                                                ? "Selesai"
                                                : "Belum dijawab"}
                                        </span>
                                    </div>

                                    <div className="p-5 sm:p-7">
                                        <h2 className="text-sm font-semibold leading-7 text-slate-900 sm:text-base">
                                            {question.question}
                                        </h2>

                                        <div className="mt-6">
                                            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500">
                                                PILIHAN JAWABAN
                                            </p>

                                            <div className="space-y-2">
                                                {question.options.map(
                                                    (option) => {
                                                        const isSelected =
                                                            currentAnswer?.answer ===
                                                            option.label;

                                                        return (
                                                            <label
                                                                key={option.label}
                                                                className={`${optionClass} ${isSelected
                                                                    ? "border-[#172B45] bg-slate-50 text-[#172B45]"
                                                                    : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`${question.id}-answer`}
                                                                    value={option.label}
                                                                    checked={isSelected}
                                                                    onChange={() =>
                                                                        handleAnswer(
                                                                            question.id,
                                                                            option.label
                                                                        )
                                                                    }
                                                                    className={radioClass}
                                                                />

                                                                <span>
                                                                    <strong className="mr-1 font-semibold text-[#172B45]">
                                                                        {option.label}.
                                                                    </strong>

                                                                    {option.text}
                                                                </span>
                                                            </label>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-7 border-t border-slate-100 pt-6">
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                Tingkat Keyakinan (Confidence)
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                                Seberapa yakin Anda terhadap
                                                jawaban yang telah dipilih?
                                            </p>

                                            <div className="mt-4 grid max-w-xl grid-cols-5 gap-3">
                                                {[1, 2, 3, 4, 5].map((value) => {
                                                    const isSelected =
                                                        currentAnswer?.confidence ===
                                                        String(value);

                                                    return (
                                                        <label
                                                            key={value}
                                                            className={`flex cursor-pointer flex-col items-center justify-center rounded-md border py-3 transition-colors ${isSelected
                                                                ? "border-[#172B45] bg-[#172B45] text-white"
                                                                : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`${question.id}-confidence`}
                                                                value={value}
                                                                checked={isSelected}
                                                                onChange={() =>
                                                                    handleConfidence(
                                                                        question.id,
                                                                        String(value)
                                                                    )
                                                                }
                                                                className="sr-only"
                                                            />

                                                            <span className="text-base font-semibold">
                                                                {value}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-2 flex max-w-xl justify-between text-xs text-slate-400">
                                                <span>1 - Sangat tidak yakin</span>
                                                <span>5 - Sangat yakin</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    {pesanError && (
                        <p className="mt-6 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                            {pesanError}
                        </p>
                    )}

                    <footer className="mt-8 border-t border-slate-200 py-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Penyelesaian Pre-test
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {isComplete
                                        ? "Seluruh pertanyaan sudah dijawab."
                                        : `Masih ada ${totalQuestions - answeredCount} pertanyaan yang belum lengkap.`}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!isComplete || isLoading}
                                className="w-full cursor-pointer rounded-md bg-[#172B45] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-48"
                            >
                                Kirim Pre-test
                            </button>
                        </div>

                        <p className="mt-5 text-xs text-slate-400">
                            Penelitian Keamanan Informasi · A03
                        </p>
                    </footer>
                </form>
            </div>

            {showConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                    onClick={() => {
                        if (!isLoading) setShowConfirm(false);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirm-title"
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8"
                    >
                        <h2
                            id="confirm-title"
                            className="text-xl font-semibold text-[#172B45]"
                        >
                            Kirim Pre-test?
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            Apakah Anda yakin ingin mengirim jawaban Pre-test?
                            Setelah dikirim, jawaban tidak dapat diubah lagi.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                disabled={isLoading}
                                className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Tidak
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                disabled={isLoading}
                                className="w-full cursor-pointer rounded-md bg-[#172B45] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                            >
                                {isLoading ? "Menyimpan..." : "Ya, Kirim"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="success-title"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-[#172B45]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m5 12 4 4L19 6"
                                />
                            </svg>
                        </div>

                        <h2
                            id="success-title"
                            className="mt-5 text-xl font-semibold text-[#172B45]"
                        >
                            Pre-test Berhasil!
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            Jawaban Pre-test kamu berhasil disimpan.
                            Selanjutnya, kamu akan memasuki tahap
                            Microlearning.
                        </p>

                        <div className="mt-6 border-y border-slate-200 py-5">
                            <h3 className="text-sm font-semibold text-slate-900">
                                Aturan Microlearning
                            </h3>

                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                                <li>
                                    Microlearning terdiri dari 6 unit, mulai
                                    dari U1 sampai U6.
                                </li>
                                <li>
                                    Selesaikan setiap unit secara berurutan.
                                </li>
                                <li>
                                    Setelah menyelesaikan sebuah unit (misalnya
                                    U1), kamu tidak dapat kembali ke unit
                                    sebelumnya.
                                </li>
                                <li>
                                    Setelah menyelesaikan U6, kamu akan
                                    melanjutkan ke tahap Post-test.
                                </li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={handleStartMicrolearning}
                            className="mt-6 w-full cursor-pointer rounded-md bg-[#172B45] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#243B59]"
                        >
                            Mulai Microlearning
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}