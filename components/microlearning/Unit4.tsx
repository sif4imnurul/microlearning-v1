
import UnitLayout from "./UnitLayout";

type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit4(props: Props) {
    return (
        <UnitLayout
            {...props}
            unitNumber={4}
            title="Waspadai Lampiran dan QR"
            intro="File dan kode QR dari sumber yang tidak dikenal dapat mengarahkan pengguna ke situs atau aktivitas yang berisiko."
            scenario="Kamu menerima file Resi-Pengiriman.zip padahal tidak sedang menunggu paket. Apa tindakan paling aman?"
            reminder="Jangan membuka atau memindai sesuatu hanya karena dikirim bersama pesan yang terlihat meyakinkan. Verifikasi melalui saluran resmi."
        >
            <section>
                <h3 className="font-bold text-gray-900">
                    Lampiran mencurigakan
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Jangan langsung membuka file yang tidak diharapkan,
                    terutama jika pengirim tidak dikenal atau isi pesan
                    tidak sesuai konteks.
                </p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900">
                    Kode QR
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Kode QR dapat menyembunyikan alamat tujuan.
                    Sebelum membuka tautan atau memasukkan informasi,
                    pastikan sumber dan alamat tujuan benar-benar tepercaya.
                </p>
            </section>
        </UnitLayout>
    );
}
