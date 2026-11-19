"use client";

import { useStageGuard } from "@/lib/useStageGuard";

export default function TerimaKasihPage() {
    const isChecking = useStageGuard("done");

    function handleNewResponse() {
        sessionStorage.clear();
        window.location.href = "/consent";
    }

    if (isChecking) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-slate-500">Memuat...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-5 py-12">
            <div className="w-full max-w-2xl rounded-xl border border-slate-200 p-8 text-center sm:p-12">
                <h1 className="mb-5 text-2xl font-bold text-[#172B45] sm:text-3xl">
                    Terima Kasih!
                </h1>

                <p className="mb-4 leading-relaxed text-slate-700">
                    Terima kasih telah berpartisipasi dalam penelitian
                    mengenai efektivitas Microlearning terhadap kemampuan
                    mendeteksi Phishing dan Social Engineering.
                </p>

                <p className="mb-8 leading-relaxed text-slate-600">
                    Seluruh tahapan penelitian telah berhasil kamu selesaikan.
                    Partisipasi dan jawaban yang telah diberikan sangat
                    berarti bagi penelitian ini.
                </p>

                <button
                    type="button"
                    onClick={handleNewResponse}
                    className="cursor-pointer text-sm font-semibold text-[#172B45] underline underline-offset-4 transition-colors hover:text-[#243B59]"
                >
                    Kirim respons lain
                </button>

                <p className="mt-6 text-sm text-slate-500">
                    Atau kamu dapat menutup halaman ini.
                </p>
            </div>
        </main>
    );
}