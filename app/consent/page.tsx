
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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-md">

        <p className="mb-2 text-sm font-semibold text-blue-600">
          PENELITIAN KEAMANAN INFORMASI
        </p>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Persetujuan Responden
        </h1>

        <p className="mb-4 text-gray-600">
          Anda diundang untuk berpartisipasi dalam penelitian
          mengenai pembelajaran keamanan informasi berbasis
          Microlearning.
        </p>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            Informasi Penelitian
          </h2>

          <p className="text-sm leading-relaxed text-gray-600">
            Partisipasi dalam penelitian ini bersifat sukarela.
            Data yang dikumpulkan digunakan untuk kepentingan
            penelitian. Nama dan identitas pribadi tidak diminta
            dalam pengisian kuesioner.
          </p>
        </div>

        <label className="mb-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(event) =>
              setIsAgreed(event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-blue-600"
          />

          <span className="text-sm text-gray-700">
            Saya telah membaca informasi penelitian dan
            bersedia berpartisipasi.
          </span>
        </label>

        <button
          onClick={handleContinue}
          disabled={!isAgreed}
          className="w-full rounded-lg bg-blue-600 px-5 py-3
          font-semibold text-white transition
          hover:bg-blue-700 disabled:cursor-not-allowed
          disabled:bg-gray-300"
        >
          Lanjutkan
        </button>

      </div>
    </main>
  );
}
