
import UnitLayout from "./UnitLayout";

type Props = {
    seconds: number;
    isSaving: boolean;
    errorMessage: string;
    onFinish: () => void;
};

export default function Unit5(props: Props) {
    return (
        <UnitLayout
            {...props}
            unitNumber={5}
            title="Kode Rahasia dan MFA"
            intro="Password, PIN, OTP, dan kode pemulihan merupakan informasi rahasia yang tidak boleh dibagikan."
            scenario="Saat sedang tidak membuka akun, kamu menerima notifikasi persetujuan login. Apa tindakan yang paling aman?"
            reminder="Jangan bagikan kode rahasia. Tolak permintaan MFA yang tidak kamu lakukan dan periksa akun melalui aplikasi atau situs resmi."
        >
            <section>
                <h3 className="font-bold text-gray-900">
                    Jaga kode rahasia
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Pihak resmi tidak seharusnya meminta password
                    atau OTP melalui percakapan. Jangan mengirim
                    kode tersebut kepada siapa pun.
                </p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900">
                    Gunakan MFA dengan benar
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                    Multi-Factor Authentication (MFA) menambahkan
                    lapisan perlindungan pada akun. Jika muncul
                    permintaan persetujuan login yang tidak kamu
                    lakukan, tolak permintaan tersebut.
                </p>
            </section>
        </UnitLayout>
    );
}
