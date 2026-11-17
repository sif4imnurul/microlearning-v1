

import UnitLayout from "./UnitLayout";

type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit1(props: Props) {
    return (
        <UnitLayout
            {...props}
            unitNumber={1}
            title="Cek Pengirim, Bukan Nama Tampilan"
            intro="Nama pengirim yang terlihat meyakinkan belum tentu berasal dari organisasi yang sebenarnya."
            scenario="Kamu menerima email dari Bank Contoh Care dengan alamat cs@bankcontoh-notifikasi.example. Email meminta kamu memperbarui informasi akun. Apa yang perlu diperiksa terlebih dahulu?"
            reminder="Jangan hanya percaya pada nama tampilan. Periksa alamat email dan domain pengirim melalui sumber resmi."
        >
            <section>
                <h3 className="font-bold text-gray-900">
                    Apa yang perlu diperhatikan?
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Pelaku phishing dapat menggunakan nama tampilan
                    seperti Bank Contoh Care atau Admin Kampus.
                    Namun, alamat email di belakang nama tersebut
                    bisa menggunakan domain yang tidak resmi.
                </p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900">
                    Cara mengenalinya
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Periksa alamat email pengirim secara lengkap.
                    Perhatikan bagian setelah tanda @ dan bandingkan
                    dengan domain resmi organisasi melalui aplikasi
                    atau situs yang sudah kamu ketahui.
                </p>
            </section>
        </UnitLayout>
    );
}
