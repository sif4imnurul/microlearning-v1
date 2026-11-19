
type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit4({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <article className="space-y-6 text-slate-700">
            <header>
                <p className="text-sm font-medium text-slate-500">UNIT 4 DARI 6</p>
                <h1 className="mt-2 text-2xl font-bold text-[#172B45]">
                    Mengenali Lampiran dan QR Code Berbahaya
                </h1>
                <p className="mt-2">Kenali risiko file lampiran dan kode QR dari sumber yang tidak dikenal.</p>
            </header>

            <section className="space-y-4 leading-7">
                <h2 className="text-lg font-semibold text-[#172B45]">1. Waspadai lampiran mencurigakan</h2>
                <p>
                    Lampiran email atau pesan dapat digunakan untuk menyebarkan malware maupun
                    mengarahkan korban ke halaman phishing. File yang tidak diharapkan perlu
                    diperiksa sebelum dibuka.
                </p>
                <p>
                    Berhati-hatilah terhadap file yang meminta pengguna mengaktifkan macro,
                    menjalankan program, atau memasang aplikasi tambahan.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">2. Perhatikan jenis file</h2>
                <p>
                    File program atau file dengan ekstensi ganda dapat digunakan untuk
                    menyamarkan jenis file sebenarnya. Jangan menganggap lampiran aman hanya
                    karena nama filenya terlihat meyakinkan.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-[#172B45]">Contoh ilustrasi</p>
                    <p className="mt-2 text-sm">
                        Pesan yang tidak dikenal mengirimkan file bernama "Undangan.pdf.exe"
                        dan meminta penerima segera membukanya.
                    </p>
                    <p className="mt-3 text-sm">Ekstensi .exe menunjukkan bahwa file tersebut merupakan program yang dapat dijalankan.</p>
                </div>

                <h2 className="text-lg font-semibold text-[#172B45]">3. Waspadai QR code</h2>
                <p>
                    QR code dapat menyembunyikan alamat situs tujuan. Pelaku dapat
                    memanfaatkannya untuk mengarahkan pengguna ke halaman login palsu atau
                    situs berbahaya.
                </p>
                <p>
                    Sebelum memasukkan informasi pada halaman yang dibuka melalui QR code,
                    periksa alamat situs dan pastikan sumber QR code dapat dipercaya.
                </p>

                <div className="rounded-lg border border-[#172B45]/20 p-4">
                    <p className="font-semibold text-[#172B45]">Hal yang perlu diingat</p>
                    <p className="mt-2 text-sm">Jangan membuka lampiran atau memindai QR code sembarangan. Periksa sumber dan tujuan terlebih dahulu.</p>
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
                {isSaving ? "Menyimpan..." : "Selesaikan Unit 4"}
            </button>
        </footer>
    );
}
