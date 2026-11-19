
type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit1({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <article className="space-y-6 text-slate-700">
            <header>
                <p className="text-sm font-medium text-slate-500">UNIT 1 DARI 6</p>
                <h1 className="mt-2 text-2xl font-bold text-[#172B45]">
                    Mengenali Pemalsuan Pengirim dan Domain
                </h1>
                <p className="mt-2">Pelajari cara mengenali identitas pengirim dan alamat domain yang mencurigakan.</p>
            </header>

            <section className="space-y-4 leading-7">
                <h2 className="text-lg font-semibold text-[#172B45]">1. Periksa identitas pengirim</h2>
                <p>
                    Pelaku phishing sering menyamar sebagai pihak yang dikenal, seperti bank,
                    layanan digital, institusi pendidikan, atau perusahaan tertentu. Nama yang
                    terlihat pada email belum tentu menunjukkan identitas pengirim sebenarnya.
                </p>
                <p>
                    Jangan hanya melihat nama pengirim. Periksa alamat email secara lengkap,
                    termasuk bagian setelah tanda @.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">2. Perhatikan nama domain</h2>
                <p>
                    Domain palsu dapat dibuat menyerupai domain resmi dengan menambahkan
                    karakter, mengganti huruf, atau menggunakan ekstensi domain yang berbeda.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-[#172B45]">Contoh ilustrasi</p>
                    <p className="mt-2 text-sm">Domain resmi: <strong>contoh-bank.com</strong></p>
                    <p className="text-sm">Domain mencurigakan: <strong>contoh-b4nk.com</strong></p>
                    <p className="mt-3 text-sm">Perubahan satu karakter dapat membuat alamat terlihat mirip, tetapi mengarah ke pihak berbeda.</p>
                </div>

                <h2 className="text-lg font-semibold text-[#172B45]">3. Jangan langsung percaya pada nama tampilan</h2>
                <p>
                    Nama pengirim seperti Administrator, Customer Service, atau Tim Keamanan
                    dapat digunakan oleh siapa saja. Lakukan pemeriksaan melalui alamat dan
                    saluran komunikasi resmi.
                </p>

                <div className="rounded-lg border border-[#172B45]/20 p-4">
                    <p className="font-semibold text-[#172B45]">Hal yang perlu diingat</p>
                    <p className="mt-2 text-sm">Periksa alamat pengirim dan domain sebelum mempercayai pesan atau mengikuti instruksinya.</p>
                </div>
            </section>

            <UnitFooter seconds={seconds} isSaving={isSaving} errorMessage={errorMessage} onFinish={onFinish} />
        </article>
    );
}

function UnitFooter({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <footer className="space-y-4 border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
                Waktu membaca: {Math.floor(seconds / 60)} menit {seconds % 60} detik
            </p>
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button onClick={onFinish} disabled={isSaving} className="w-full rounded-lg bg-[#172B45] px-5 py-3 font-medium text-white hover:bg-[#243F60] disabled:opacity-50">
                {isSaving ? "Menyimpan..." : "Selesaikan Unit 1"}
            </button>
        </footer>
    );
}
