
type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit5({ seconds, isSaving, errorMessage, onFinish }: Props) {
    return (
        <article className="space-y-6 text-slate-700">
            <header>
                <p className="text-sm font-medium text-slate-500">UNIT 5 DARI 6</p>
                <h1 className="mt-2 text-2xl font-bold text-[#172B45]">
                    Melindungi OTP dan Multi-Factor Authentication
                </h1>
                <p className="mt-2">Pahami pentingnya menjaga kode verifikasi dan keamanan autentikasi akun.</p>
            </header>

            <section className="space-y-4 leading-7">
                <h2 className="text-lg font-semibold text-[#172B45]">1. Mengenal OTP</h2>
                <p>
                    One-Time Password (OTP) adalah kode sekali pakai yang digunakan sebagai
                    bagian dari proses verifikasi identitas. Kode ini biasanya dikirim melalui
                    SMS, email, atau aplikasi autentikasi.
                </p>
                <p>
                    OTP bersifat rahasia. Pihak lain yang memperoleh kode tersebut berpotensi
                    menyalahgunakannya untuk mengakses akun.
                </p>

                <h2 className="text-lg font-semibold text-[#172B45]">2. Jangan membagikan kode verifikasi</h2>
                <p>
                    Pelaku social engineering dapat berpura-pura menjadi petugas layanan dan
                    meminta kode OTP dengan alasan verifikasi, pembatalan transaksi, atau
                    pemulihan akun.
                </p>
                <p>
                    Jangan pernah memberikan OTP kepada orang lain, termasuk kepada pihak
                    yang mengaku sebagai petugas resmi.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-[#172B45]">Contoh ilustrasi</p>
                    <p className="mt-2 text-sm">
                        Seseorang menghubungi pengguna dan meminta kode verifikasi yang baru saja
                        diterima dengan alasan membantu proses keamanan akun.
                    </p>
                    <p className="mt-3 text-sm">Permintaan kode verifikasi dari orang lain merupakan tanda bahaya.</p>
                </div>

                <h2 className="text-lg font-semibold text-[#172B45]">3. Memahami MFA</h2>
                <p>
                    Multi-Factor Authentication (MFA) menambahkan lapisan keamanan dengan
                    meminta lebih dari satu faktor autentikasi. Contohnya kombinasi kata
                    sandi dan aplikasi autentikasi.
                </p>
                <p>
                    Jika menerima permintaan persetujuan login yang tidak kamu lakukan,
                    jangan menyetujuinya. Segera periksa keamanan akun melalui layanan resmi.
                </p>

                <div className="rounded-lg border border-[#172B45]/20 p-4">
                    <p className="font-semibold text-[#172B45]">Hal yang perlu diingat</p>
                    <p className="mt-2 text-sm">Jaga kerahasiaan OTP dan jangan menyetujui permintaan autentikasi yang tidak kamu lakukan.</p>
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
                {isSaving ? "Menyimpan..." : "Selesaikan Unit 5"}
            </button>
        </footer>
    );
}
