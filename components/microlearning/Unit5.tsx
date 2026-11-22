import {
    Bullets,
    FakeButton,
    Key,
    Mock,
    NextHint,
    Note,
    Section,
    Table,
    UnitFooter,
    UnitHeader,
    type UnitProps,
} from "@/components/microlearning/UnitParts";

export default function Unit5(props: UnitProps) {
    return (
        <article className="space-y-6">
            <UnitHeader
                title="Unit 5: Kode Rahasia dan MFA"
                meta="Microlearning A03 · Unit 5 dari 6"
            />

            <Section title="Tujuan">
                <p>
                    Setelah unit ini, Anda tidak memberikan kode rahasia kepada
                    siapa pun dan menolak permintaan persetujuan MFA yang tidak
                    Anda mulai sendiri.
                </p>
            </Section>

            <Section title="Konsep Utama">
                <Key>
                    Password, PIN, OTP, dan recovery code tidak diberikan lewat
                    email, chat, atau telepon. Jangan menyetujui prompt MFA yang
                    tidak Anda mulai sendiri.
                </Key>

                <p>
                    Petugas yang sebenarnya tidak perlu mengetahui kode
                    tersebut. Siapa pun yang memintanya, termasuk yang mengaku
                    dari layanan resmi, patut dicurigai. MFA tetap dianjurkan
                    untuk akun penting.
                </p>

                <Table
                    head={["Situasi", "Sikap yang aman"]}
                    rows={[
                        [
                            "Diminta password, PIN, OTP, atau recovery code",
                            "Tidak diberikan lewat email, chat, atau telepon",
                        ],
                        [
                            "Muncul prompt MFA yang tidak Anda mulai",
                            "Tolak",
                        ],
                        [
                            "MFA pada akun penting",
                            "Tetap dianjurkan",
                        ],
                    ]}
                />
            </Section>

            <Section title="Contoh">
                <Note>
                    Contoh fiktif untuk latihan. Nama, perusahaan, dan alamat
                    hanya rekaan.
                </Note>

                <div className="grid gap-4 md:grid-cols-2">
                    <Mock>
                        <p className="text-xs font-semibold tracking-wide text-slate-500">
                            TELEPON MASUK
                        </p>
                        <p className="font-semibold text-slate-900">
                            CS e-wallet Contoh
                        </p>
                        <p>
                            &ldquo;Sebutkan kode OTP Anda untuk membatalkan
                            transaksi.&rdquo; <strong>(1)</strong>
                        </p>
                    </Mock>

                    <Mock>
                        <p className="text-xs font-semibold tracking-wide text-slate-500">
                            NOTIFIKASI BEBERAPA SAAT KEMUDIAN
                        </p>
                        <p className="font-semibold text-slate-900">
                            Setujui login? <strong>(2)</strong>
                        </p>
                        <p>Perangkat tidak dikenal. Anda tidak sedang login.</p>
                        <div className="flex gap-2">
                            <FakeButton muted>Setujui</FakeButton>
                            <FakeButton>Tolak</FakeButton>
                        </div>
                    </Mock>
                </div>

                <p className="font-medium text-slate-800">
                    Penjelasan tanda bahaya pada contoh di atas:
                </p>

                <Bullets
                    items={[
                        <>
                            <strong>Kode OTP diminta lewat telepon.</strong> Kode
                            ini adalah kunci akun Anda dan tidak boleh
                            disebutkan.
                        </>,
                        <>
                            <strong>Persetujuan yang tidak Anda mulai.</strong>{" "}
                            Permintaan muncul padahal Anda tidak sedang login.
                            Bisa jadi pelaku sedang mencoba masuk dan menunggu
                            Anda menyetujui.
                        </>,
                    ]}
                />
            </Section>

            <Section title="Tindakan Aman: Kode tetap rahasia, permintaan asing ditolak">
                <Bullets
                    items={[
                        "Jangan menyebutkan atau mengirim kode dalam bentuk apa pun.",
                        "Tolak permintaan persetujuan yang tidak Anda mulai.",
                        "Setelah itu, cek aktivitas dan ganti password melalui aplikasi atau situs resmi.",
                    ]}
                />
            </Section>

            <NextHint>Berikutnya: Unit 6 · Verifikasi dan laporkan</NextHint>

            <UnitFooter unit={5} {...props} />
        </article>
    );
}