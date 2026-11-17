
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemographicPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [pesanError, setPesanError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setPesanError("");

        const formData = new FormData(event.currentTarget);

        const jawaban = {
            usia: formData.get("usia"),
            bidangStudi: formData.get("bidangStudi"),
            riwayatPelatihan: formData.get("riwayatPelatihan"),
            pengalamanPhishing: formData.get("pengalamanPhishing"),
            penggunaanMfa: formData.get("penggunaanMfa"),
            frekuensiEmail: formData.get("frekuensiEmail"),
        };

        let respondentId = sessionStorage.getItem("respondent_id");

        if (!respondentId) {
            respondentId = `A03-${crypto.randomUUID()}`;
            sessionStorage.setItem("respondent_id", respondentId);
        }

        try {
            const response = await fetch("/api/demographic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...jawaban,
                    respondentId,
                }),
            });

            const hasil = await response.json();

            if (!response.ok) {
                setPesanError(
                    hasil.message || "Gagal menyimpan data demografi."
                );
                return;
            }

            console.log("Berhasil:", hasil);

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

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-md">
                <form onSubmit={handleSubmit}>
                    <p className="mb-2 text-sm font-semibold text-blue-600">
                        PENELITIAN KEAMANAN INFORMASI
                    </p>

                    <h1 className="mb-4 text-2xl font-bold text-gray-900">
                        Demografi Responden
                    </h1>

                    <p className="text-gray-600">
                        Silakan isi informasi berikut sesuai kondisi Anda.
                    </p>

                    <div className="mt-8">
                        <p className="mb-3 font-semibold text-gray-900">
                            D1. Rentang usia
                        </p>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="usia" value="18-20" required />
                            18–20
                        </label>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="usia" value="21-23" />
                            21–23
                        </label>

                        <label className="flex items-center gap-3">
                            <input type="radio" name="usia" value="24+" />
                            24+
                        </label>
                    </div>

                    <div className="mt-8">
                        <p className="mb-3 font-semibold text-gray-900">
                            D2. Bidang studi
                        </p>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="bidangStudi" value="IT/Komputer" required />
                            IT/Komputer
                        </label>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="bidangStudi" value="Non-IT" />
                            Non-IT
                        </label>

                        <label className="flex items-center gap-3">
                            <input type="radio" name="bidangStudi" value="Lainnya" />
                            Lainnya
                        </label>
                    </div>

                    <div className="mt-8">
                        <p className="mb-3 font-semibold text-gray-900">
                            D3. Apakah Anda pernah mengikuti pelatihan keamanan siber atau security awareness?
                        </p>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="riwayatPelatihan" value="Tidak" required />
                            Tidak
                        </label>

                        <label className="flex items-center gap-3">
                            <input type="radio" name="riwayatPelatihan" value="Ya" />
                            Ya
                        </label>
                    </div>

                    <div className="mt-8">
                        <p className="mb-3 font-semibold text-gray-900">
                            D4. Apakah Anda pernah menerima pesan yang dicurigai sebagai phishing?
                        </p>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="pengalamanPhishing" value="Tidak" required />
                            Tidak
                        </label>

                        <label className="flex items-center gap-3">
                            <input type="radio" name="pengalamanPhishing" value="Ya" />
                            Ya
                        </label>
                    </div>

                    <div className="mt-8">
                        <p className="mb-3 font-semibold text-gray-900">
                            D5. Apakah Anda menggunakan MFA pada minimal satu akun penting?
                        </p>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="penggunaanMfa" value="Tidak" required />
                            Tidak
                        </label>

                        <label className="flex items-center gap-3">
                            <input type="radio" name="penggunaanMfa" value="Ya" />
                            Ya
                        </label>
                    </div>

                    <div className="mt-8">
                        <p className="mb-3 font-semibold text-gray-900">
                            D6. Seberapa sering Anda menggunakan email?
                        </p>

                        <label className="mb-2 flex items-center gap-3">
                            <input type="radio" name="frekuensiEmail" value="Jarang" required />
                            Jarang
                        </label>

                        <label className="mb-2 flex items-center gap-3">
                            <input
                                type="radio"
                                name="frekuensiEmail"
                                value="Beberapa kali/minggu"
                            />
                            Beberapa kali/minggu
                        </label>

                        <label className="flex items-center gap-3">
                            <input type="radio" name="frekuensiEmail" value="Setiap hari" />
                            Setiap hari
                        </label>
                    </div>

                    {pesanError && (
                        <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {pesanError}
                        </p>
                    )}

                    <div className="mt-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Menyimpan..." : "Lanjut"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
