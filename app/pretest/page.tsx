
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRETEST_QUESTIONS } from "@/data/instruments/pretest";

type AnswerData = {
    answer: string;
    confidence: string;
};

export default function PretestPage() {
    const router = useRouter();

    const [answers, setAnswers] = useState<
        Record<string, AnswerData>
    >({});

    const [isLoading, setIsLoading] = useState(false);
    const [pesanError, setPesanError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    function handleAnswer(questionId: string, value: string) {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: {
                ...previous[questionId],
                answer: value,
                confidence:
                    previous[questionId]?.confidence || "",
            },
        }));
    }

    function handleConfidence(questionId: string, value: string) {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: {
                ...previous[questionId],
                answer: previous[questionId]?.answer || "",
                confidence: value,
            },
        }));
    }

    const isComplete = PRETEST_QUESTIONS.every(
        (question) =>
            answers[question.id]?.answer &&
            answers[question.id]?.confidence
    );

    const answeredCount = PRETEST_QUESTIONS.filter(
        (question) =>
            answers[question.id]?.answer &&
            answers[question.id]?.confidence
    ).length;

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!isComplete || isLoading) return;

        setIsLoading(true);
        setPesanError("");

        try {
            const respondentId =
                sessionStorage.getItem("respondent_id");

            if (!respondentId) {
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
                    respondentId,
                    answers,
                }),
            });

            const hasil = await response.json();

            if (!response.ok) {
                setPesanError(
                    hasil.message ||
                    "Gagal menyimpan jawaban Pre-test."
                );
                return;
            }

            // Tampilkan popup setelah data berhasil disimpan.
            setShowSuccess(true);

        } catch (error) {
            console.error("Kesalahan:", error);

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

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-md sm:p-8">

                <p className="text-sm font-semibold text-blue-600">
                    SISTEM KEAMANAN INFORMASI - KLASTER A
                </p>

                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                    Pre-test Security Awareness
                </h1>

                <p className="mt-3 leading-7 text-gray-600">
                    Pilih satu tindakan paling aman pada setiap
                    skenario, kemudian isi tingkat keyakinan
                    (confidence) terhadap jawabanmu.
                </p>

                <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                    <strong>Petunjuk pengerjaan:</strong>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>Pilih satu jawaban A–D.</li>
                        <li>Isi confidence dengan skala 1–5.</li>
                        <li>Kerjakan secara mandiri.</li>
                        <li>Jangan berdiskusi atau membuka sumber lain.</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit}>
                    {PRETEST_QUESTIONS.map((question) => (
                        <section
                            key={question.id}
                            className="mt-8 border-b border-gray-200 pb-8 last:border-0"
                        >
                            <h2 className="font-bold leading-7 text-gray-900">
                                {question.id}. {question.question}
                            </h2>

                            <div className="mt-4 space-y-3">
                                {question.options.map((option) => (
                                    <label
                                        key={option.label}
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${answers[question.id]?.answer ===
                                            option.label
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`${question.id}-answer`}
                                            value={option.label}
                                            checked={
                                                answers[question.id]?.answer ===
                                                option.label
                                            }
                                            onChange={() =>
                                                handleAnswer(
                                                    question.id,
                                                    option.label
                                                )
                                            }
                                            className="mt-1"
                                        />

                                        <span className="text-sm leading-6 text-gray-800">
                                            <strong>{option.label}.</strong>{" "}
                                            {option.text}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-6">
                                <p className="mb-3 font-semibold text-gray-900">
                                    Tingkat Keyakinan (Confidence)
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <label
                                            key={value}
                                            className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border font-semibold transition ${answers[question.id]?.confidence ===
                                                String(value)
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`${question.id}-confidence`}
                                                value={value}
                                                checked={
                                                    answers[question.id]?.confidence ===
                                                    String(value)
                                                }
                                                onChange={() =>
                                                    handleConfidence(
                                                        question.id,
                                                        String(value)
                                                    )
                                                }
                                                className="sr-only"
                                            />

                                            {value}
                                        </label>
                                    ))}
                                </div>

                                <p className="mt-2 text-xs text-gray-500">
                                    1 = Sangat tidak yakin
                                    {" | "}
                                    5 = Sangat yakin
                                </p>
                            </div>
                        </section>
                    ))}

                    <div className="mt-8">
                        <div className="mb-4 flex justify-between text-sm">
                            <span className="text-gray-600">
                                Pertanyaan terisi
                            </span>

                            <strong className="text-gray-900">
                                {answeredCount}/12
                            </strong>
                        </div>

                        <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all"
                                style={{
                                    width: `${(answeredCount / 12) * 100}%`,
                                }}
                            />
                        </div>

                        {pesanError && (
                            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {pesanError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isComplete || isLoading}
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {isLoading
                                ? "Menyimpan Jawaban..."
                                : "Selesaikan Pre-test"}
                        </button>
                    </div>
                </form>
            </div>

            {/* POPUP BERHASIL */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-9 w-9 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-4 text-center text-xl font-bold text-gray-900">
                            Pre-test Berhasil!
                        </h2>

                        <p className="mt-3 text-center leading-6 text-gray-600">
                            Jawaban Pre-test kamu berhasil disimpan.
                            Selanjutnya, kamu akan memasuki tahap
                            Microlearning.
                        </p>

                        <div className="mt-5 rounded-xl bg-blue-50 p-4">
                            <p className="font-semibold text-blue-900">
                                Aturan Microlearning
                            </p>

                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-blue-900">
                                <li>
                                    Microlearning terdiri dari 6 unit
                                    yang harus dikerjakan secara berurutan,
                                    mulai dari U1 sampai U6.
                                </li>
                                <li>
                                    Kamu harus menyelesaikan satu unit
                                    sebelum melanjutkan ke unit berikutnya.
                                </li>
                                <li>
                                    Setelah menekan tombol
                                    "Selesaikan Unit dan Lanjut",
                                    kamu tidak dapat kembali membaca
                                    unit sebelumnya.
                                </li>
                                <li>
                                    Setelah menyelesaikan U6, kamu akan
                                    melanjutkan ke tahap Post-test.
                                </li>
                            </ul>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-500">
                            Pastikan kamu membaca setiap materi
                            dengan teliti sebelum melanjutkan.
                        </p>

                        <button
                            type="button"
                            onClick={handleStartMicrolearning}
                            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Mulai Microlearning
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
