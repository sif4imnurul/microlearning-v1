

import UnitLayout from "./UnitLayout";

type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit2(props: Props) {
    return (
        <UnitLayout
            {...props}
            unitNumber={2}
            title="Jangan Mudah Terpancing"
            intro="Pesan yang mendesak, mengancam, atau menjanjikan hadiah dapat digunakan untuk membuat seseorang bertindak tanpa berpikir."
            scenario="Kamu menerima pesan yang mengaku berasal dari Direktur Operasional. Pesan meminta pembaruan akun sebelum pukul 17.00 dan mengancam akun akan ditutup. Apa tindakan yang tepat?"
            reminder="Berhenti sejenak. Jangan mengambil keputusan hanya karena pesan menciptakan rasa takut atau terburu-buru."
        >
            <section>
                <h3 className="font-bold text-gray-900">
                    Teknik manipulasi
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Social engineering memanfaatkan emosi manusia.
                    Pelaku dapat berpura-pura menjadi atasan,
                    petugas layanan, atau pihak berwenang.
                </p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900">
                    Kenali tanda tekanan
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Waspadai kalimat seperti akun akan ditutup,
                    akses akan diblokir, harus segera membayar,
                    atau hadiah akan hangus dalam beberapa menit.
                </p>
            </section>
        </UnitLayout>
    );
}
