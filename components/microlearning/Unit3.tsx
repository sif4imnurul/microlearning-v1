
type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit3({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <article className="space-y-6 text-slate-700">
            <header>
                <p className="text-sm font-medium text-slate-500">UNIT 3 DARI 6</p>
                <h1 className="mt-2 text-2xl font-bold text-[#172B45]">
                    Mengenali Tautan dan Keamanan HTTPS
                </h1>
                <p className="mt-2">Pelajari cara memeriksa tautan sebelum membuka halaman web.</p>
            </header>

            <section className="space-y-4 leading-7">
                <h2 className="text-lg font-semibold text-[#172B45]">1. Periksa alamat tautan</h2>
                <p>
                    Tautan phishing dapat dibuat menyerupai alamat situs resmi. Pelaku dapat
                    menggunakan nama domain yang mirip, tambahan karakter, atau alamat yang
                    tidak berhubungan dengan layanan yang disebutkan.
                </p>
                <p>
                    Sebelum membuka tautan, periksa alamat tujuan dengan teliti. Pada komputer,
                    arahkan kursor ke tautan untuk melihat alamat tujuan tanpa membukanya.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">2. Memahami HTTPS</h2>
                <p>
                    HTTPS menggunakan enkripsi untuk melindungi komunikasi antara browser dan
                    situs web. Namun, keberadaan HTTPS tidak menjamin bahwa situs tersebut
                    merupakan situs resmi atau aman dari penipuan.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-[#172B45]">Perlu diperhatikan</p>
                    <p className="mt-2 text-sm">
                        Situs palsu juga dapat menggunakan HTTPS. Jangan hanya mengandalkan ikon
                        gembok atau awalan https://.
                    </p>
                </div>

                <h2 className="text-lg font-semibold text-[#172B45]">3. Akses situs melalui alamat resmi</h2>
                <p>
                    Jika menerima tautan yang meminta login atau verifikasi akun, lebih baik
                    buka browser dan ketik alamat situs resmi secara langsung. Kamu juga dapat
                    menggunakan aplikasi resmi yang sudah terpasang.
                </p>

                <div className="rounded-lg border border-[#172B45]/20 p-4">
                    <p className="font-semibold text-[#172B45]">Hal yang perlu diingat</p>
                    <p className="mt-2 text-sm">Periksa domain dan alamat tujuan. HTTPS saja tidak cukup untuk membuktikan sebuah situs dapat dipercaya.</p>
                </div>
            </section>

            <UnitFooter seconds={seconds} isSaving={isSaving} errorMessage={errorMessage} onFinish={onFinish} />
        </article>
    );
}

function UnitFooter({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <footer className="space-y-4 border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">Waktu membaca: {Math.floor(seconds / 60)} menit {seconds % 60} detik</p>
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button onClick={onFinish} disabled={isSaving} className="w-full rounded-lg bg-[#172B45] px-5 py-3 font-medium text-white hover:bg-[#243F60] disabled:opacity-50">
                {isSaving ? "Menyimpan..." : "Selesaikan Unit 3"}
            </button>
        </footer>
    );
}
