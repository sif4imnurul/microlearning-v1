
import UnitLayout from "./UnitLayout";

type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit3(props: Props) {
    return (
        <UnitLayout
            {...props}
            unitNumber={3}
            title="Periksa Tautan dan Gembok"
            intro="Tampilan tautan dan simbol gembok HTTPS tidak otomatis membuktikan bahwa sebuah situs aman dan resmi."
            scenario="Sebuah email paket menampilkan tautan kurircontoh.example/lacak, tetapi alamat tujuan sebenarnya adalah kurircontoh-cek.example/track. Situs tersebut memiliki simbol gembok. Apa yang harus dilakukan?"
            reminder="Periksa domain dengan teliti. Lebih aman membuka aplikasi atau mengetik alamat resmi sendiri."
        >
            <section>
                <h3 className="font-bold text-gray-900">
                    Periksa alamat tujuan
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Teks tombol atau tautan dapat berbeda dari
                    alamat tujuan sebenarnya. Perhatikan nama domain,
                    ejaan, tambahan kata, dan karakter mencurigakan.
                </p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900">
                    Pahami HTTPS
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    HTTPS membantu mengenkripsi koneksi antara browser
                    dan situs. Namun, situs palsu juga dapat menggunakan
                    HTTPS. Karena itu, HTTPS bukan bukti bahwa
                    organisasi pemilik situs tersebut asli.
                </p>
            </section>
        </UnitLayout>
    );
}
