"use client";

import { useEffect, useState } from "react";
import { useStageGuard } from "@/lib/useStageGuard";

export default function TerimaKasihPage() {
    const isChecking = useStageGuard("done");

    const [respondentId, setRespondentId] = useState("");
    const [isExperiment, setIsExperiment] = useState(false);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);

    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFeedbackSent, setIsFeedbackSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        const savedId = sessionStorage.getItem("respondent_id") || "";
        setRespondentId(savedId);

        if (savedId && sessionStorage.getItem(`feedback_sent_${savedId}`)) {
            setIsFeedbackSent(true);
        }

        async function loadConfig() {
            try {
                const response = await fetch("/api/settings", {
                    cache: "no-store",
                });
                const data = await response.json();

                if (isMounted && data?.success) {
                    setIsExperiment(Boolean(data.isExperiment));
                }
            } catch (error) {
                console.error("Gagal memuat pengaturan:", error);
            } finally {
                if (isMounted) {
                    setIsConfigLoaded(true);
                }
            }
        }

        loadConfig();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleFeedbackSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (isSubmitting || isFeedbackSent || !respondentId) return;

        const trimmed = feedback.trim();
        if (!trimmed) {
            setErrorMessage("Silakan tulis saran terlebih dahulu sebelum mengirim.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    respondentId,
                    feedback: trimmed,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    result.message || "Gagal menyimpan saran. Silakan coba lagi."
                );
                return;
            }

            setIsFeedbackSent(true);
            sessionStorage.setItem(`feedback_sent_${respondentId}`, "true");
        } catch (error) {
            console.error("Submit feedback error:", error);
            setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleNewResponse() {
        sessionStorage.clear();
        window.location.href = "/consent";
    }

    if (isChecking || !isConfigLoaded) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-slate-500">Memuat...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-5 py-12">
            <div className="w-full max-w-2xl rounded-xl border border-slate-200 p-8 sm:p-12">
                <div className="text-center">
                    <h1 className="mb-5 text-2xl font-bold text-[#172B45] sm:text-3xl">
                        Terima Kasih!
                    </h1>

                    <p className="mb-4 leading-relaxed text-slate-700">
                        Terima kasih telah berpartisipasi dalam penelitian
                        mengenai efektivitas Microlearning terhadap kemampuan
                        mendeteksi Phishing dan Social Engineering.
                    </p>

                    <p className="mb-6 leading-relaxed text-slate-600">
                        Seluruh tahapan penelitian telah berhasil Anda
                        selesaikan. Partisipasi dan jawaban yang telah
                        diberikan sangat berarti bagi penelitian ini.
                    </p>

                    {respondentId && (
                        <div className="mx-auto mb-6 max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-medium text-slate-500">
                                Kode Responden Anda
                            </p>
                            <p className="mt-1 font-mono text-sm font-semibold text-[#172B45]">
                                {respondentId}
                            </p>
                        </div>
                    )}
                </div>

                {respondentId && !isExperiment && (
                    <section className="mt-6 border-t border-slate-200 pt-6 text-left">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[#172B45]">
                                Saran &amp; Masukan (Opsional)
                            </h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                                Tidak wajib
                            </span>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Apakah ada bagian materi, contoh, atau tampilan
                            aplikasi yang membingungkan atau perlu diperbaiki?
                            Mohon{" "}
                            <strong className="font-semibold text-slate-700">
                                tidak menuliskan nama, NIM, email, atau data
                                rahasia
                            </strong>{" "}
                            apa pun.
                        </p>

                        {isFeedbackSent ? (
                            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#172B45]">
                                Terima kasih, saran dan masukan Anda telah
                                tersimpan.
                            </div>
                        ) : (
                            <form
                                onSubmit={handleFeedbackSubmit}
                                className="mt-4 space-y-3"
                            >
                                <textarea
                                    rows={3}
                                    maxLength={1000}
                                    value={feedback}
                                    onChange={(e) => {
                                        setFeedback(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    placeholder="Tuliskan saran atau kendala yang Anda alami selama menggunakan media ini..."
                                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#172B45] focus:outline-none"
                                />

                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs text-slate-400">
                                        {feedback.length}/1000 karakter
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={
                                            isSubmitting ||
                                            feedback.trim().length === 0
                                        }
                                        className="cursor-pointer rounded-lg bg-[#172B45] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        {isSubmitting
                                            ? "Menyimpan..."
                                            : "Kirim Saran"}
                                    </button>
                                </div>

                                {errorMessage && (
                                    <p className="text-xs text-red-600">
                                        {errorMessage}
                                    </p>
                                )}
                            </form>
                        )}
                    </section>
                )}

                <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                    {!isExperiment && (
                        <button
                            type="button"
                            onClick={handleNewResponse}
                            className="mb-4 cursor-pointer text-sm font-semibold text-[#172B45] underline underline-offset-4 transition-colors hover:text-[#243B59]"
                        >
                            Kirim respons lain
                        </button>
                    )}

                    <p className="text-sm text-slate-500">
                        Anda dapat menutup halaman ini.
                    </p>
                </div>
            </div>
        </main>
    );
}