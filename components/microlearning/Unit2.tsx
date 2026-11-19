
type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit2({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <article className="space-y-6 text-slate-700">
            <header>
                <p className="text-sm font-medium text-slate-500">UNIT 2 DARI 6</p>
                <h1 className="mt-2 text-2xl font-bold text-[#172B45]">
                    Mengenali Tekanan Urgensi dan Otoritas
                </h1>
                <p className="mt-2">Kenali teknik manipulasi psikologis yang mendorong korban mengambil keputusan terburu-buru.</p>
            </header>

            <section className="space-y-4 leading-7">
                <h2 className="text-lg font-semibold text-[#172B45]">1. Tekanan urgensi</h2>
                <p>
                    Pelaku phishing sering menciptakan situasi seolah-olah korban harus segera
                    bertindak. Pesan dapat menyebutkan akun akan diblokir, transaksi dibatalkan,
                    atau kesempatan tertentu segera berakhir.
                </p>
                <p>
                    Tujuannya membuat korban panik sehingga tidak sempat memeriksa kebenaran informasi.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-[#172B45]">Contoh ilustrasi</p>
                    <p className="mt-2 text-sm">
                        "Akun Anda akan dinonaktifkan dalam 10 menit. Segera lakukan verifikasi melalui tautan berikut."
                    </p>
                    <p className="mt-3 text-sm">Ancaman batas waktu yang mendesak perlu diperiksa kebenarannya.</p>
                </div>

                <h2 className="text-lg font-semibold text-[#172B45]">2. Penyalahgunaan otoritas</h2>
                <p>
                    Pelaku dapat berpura-pura menjadi atasan, dosen, petugas bank, atau pihak
                    berwenang. Mereka memanfaatkan rasa hormat dan kepercayaan korban terhadap
                    figur otoritas.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">3. Cara menghadapi tekanan</h2>
                <p>
                    Jangan langsung mengikuti instruksi hanya karena pesan menggunakan nada
                    mengancam atau mengatasnamakan pihak penting. Berhenti sejenak, periksa
                    sumber pesan, dan lakukan konfirmasi melalui saluran resmi.
                </p>

                <div className="rounded-lg border border-[#172B45]/20 p-4">
                    <p className="font-semibold text-[#172B45]">Hal yang perlu diingat</p>
                    <p className="mt-2 text-sm">Pesan yang mendesak dan mengatasnamakan otoritas bukan bukti bahwa pesan tersebut benar.</p>
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
                {isSaving ? "Menyimpan..." : "Selesaikan Unit 2"}
            </button>
        </footer>
    );
}
