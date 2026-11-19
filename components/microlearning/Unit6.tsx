
type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit6({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <article className="space-y-6 text-slate-700">
            <header>
                <p className="text-sm font-medium text-slate-500">UNIT 6 DARI 6</p>
                <h1 className="mt-2 text-2xl font-bold text-[#172B45]">
                    Verifikasi dan Pelaporan Insiden
                </h1>
                <p className="mt-2">Pelajari tindakan yang tepat ketika menerima pesan atau menemukan aktivitas mencurigakan.</p>
            </header>

            <section className="space-y-4 leading-7">
                <h2 className="text-lg font-semibold text-[#172B45]">1. Lakukan verifikasi melalui saluran resmi</h2>
                <p>
                    Ketika menerima permintaan mencurigakan, jangan langsung membalas pesan
                    atau mengikuti tautan yang diberikan. Hubungi pihak terkait melalui
                    nomor telepon, alamat email, atau aplikasi resmi yang sudah diketahui.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">2. Hindari memberikan informasi sensitif</h2>
                <p>
                    Jangan memberikan kata sandi, PIN, OTP, kode pemulihan, atau informasi
                    keuangan melalui pesan yang tidak dapat diverifikasi.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">3. Laporkan pesan mencurigakan</h2>
                <p>
                    Jika menemukan pesan phishing atau indikasi social engineering,
                    laporkan kepada pihak yang bertanggung jawab, seperti tim teknologi
                    informasi, administrator sistem, atau layanan resmi terkait.
                </p>
                <p>
                    Jika pesan diterima melalui email, gunakan fitur pelaporan phishing
                    atau spam apabila tersedia. Jangan meneruskan tautan atau lampiran
                    berbahaya kepada orang lain.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">4. Jika sudah terlanjur berinteraksi</h2>
                <p>
                    Segera hentikan interaksi. Jika informasi akun telah diberikan, ubah
                    kata sandi melalui situs atau aplikasi resmi, aktifkan MFA, dan hubungi
                    penyedia layanan. Jika perangkat terindikasi terinfeksi, minta bantuan
                    tim teknis.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-[#172B45]">Contoh tindakan</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                        <li>Hentikan komunikasi dengan pengirim mencurigakan.</li>
                        <li>Periksa informasi melalui saluran resmi.</li>
                        <li>Laporkan pesan kepada pihak terkait.</li>
                        <li>Amankan akun jika sudah terlanjur memberikan informasi.</li>
                    </ol>
                </div>

                <div className="rounded-lg border border-[#172B45]/20 p-4">
                    <p className="font-semibold text-[#172B45]">Hal yang perlu diingat</p>
                    <p className="mt-2 text-sm">Verifikasi sebelum bertindak dan laporkan aktivitas mencurigakan melalui saluran yang tepat.</p>
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
                {isSaving ? "Menyimpan..." : "Selesaikan Unit 6"}
            </button>
        </footer>
    );
}
