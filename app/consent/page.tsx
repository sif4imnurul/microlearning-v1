
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  function handleContinue() {
    router.push("/demographic");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">

        {/* PANEL KIRI */}
        <section className="flex flex-col justify-between bg-[#172B45] p-8 text-white sm:p-10">

          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-300">
              INFORMATION SECURITY
            </p>

            <h1 className="mt-12 text-3xl font-semibold leading-tight tracking-tight">
              Kenali Ancaman,
              <br />
              Lindungi Diri.
            </h1>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
              Tingkatkan kesadaran keamanan informasi melalui pembelajaran microlearning.
            </p>
          </div>

          <div className="mt-16 border-t border-slate-600 pt-5">
            <p className="text-xs text-slate-300">
              Penelitian Keamanan Informasi
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Kelompok A03
            </p>
          </div>

        </section>

        {/* PANEL KANAN */}
        <section className="flex flex-col justify-center p-8 sm:p-10">

          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-600">
              PENELITIAN KEAMANAN INFORMASI
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              Persetujuan Responden
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Penelitian ini membahas penerapan pembelajaran berbasis Microlearning untuk meningkatkan kemampuan dalam mengenali ancaman phishing dan social engineering.
            </p>
          </div>

          <div className="mt-7 rounded-lg border border-slate-200 bg-slate-50 p-5">

            <h3 className="text-sm font-semibold text-slate-900">
              Informasi Penelitian
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Data yang diperoleh dari penelitian ini akan digunakan untuk keperluan akademis dan dijaga kerahasiaannya. Pengisian kuesioner tidak memerlukan nama maupun identitas pribadi responden.
            </p>

          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3">

            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(event) =>
                setIsAgreed(event.target.checked)
              }
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#172B45]"
            />

            <span className="text-sm leading-6 text-slate-600">
              Saya telah membaca dan memahami informasi penelitian serta bersedia mengikuti seluruh tahapan penelitian.
            </span>

          </label>

          <button
            onClick={handleContinue}
            disabled={!isAgreed}
            className="mt-7 w-full cursor-pointer rounded-lg bg-[#172B45] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243B59] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Lanjutkan
          </button>

        </section>

      </div>
    </main>
  );
}
