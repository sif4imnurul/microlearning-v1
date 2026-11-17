
import UnitLayout from "./UnitLayout";

type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit6(props: Props) {
    return (
        <UnitLayout
            {...props}
            unitNumber={6}
            title="Verifikasi dan Laporkan"
            intro="Ketika menemukan pesan mencurigakan, berhenti sejenak, lakukan verifikasi, dan laporkan melalui saluran yang tepat."
            scenario="Seorang penjual marketplace meminta kamu melanjutkan percakapan di luar aplikasi dan melakukan pembayaran langsung. Apa yang sebaiknya dilakukan?"
            reminder="Ingat tiga langkah: Stop, Verify, Report. Jangan pindah ke saluran lain atau melakukan pembayaran sebelum memastikan keabsahannya."
        >
            <section>
                <h3 className="font-bold text-gray-900">
                    Stop
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Jangan klik tautan, membuka lampiran,
                    membagikan informasi rahasia, atau mengikuti
                    instruksi yang belum jelas.
                </p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900">
                    Verify dan Report
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Hubungi organisasi melalui nomor, aplikasi,
                    atau situs resmi yang dicari secara mandiri.
                    Jika tersedia, gunakan fitur pelaporan phishing.
                </p>
            </section>
        </UnitLayout>
    );
}
