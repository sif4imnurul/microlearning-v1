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

export default function Unit3(props: UnitProps) {
    return (
        <article className="space-y-6">
            <UnitHeader
                title="Unit 3: Periksa Tautan dan Gembok"
                meta="Microlearning A03 · Unit 3 dari 6"
            />

            <Section title="Tujuan">
                <p>
                    Setelah unit ini, Anda dapat memeriksa domain tujuan sebuah
                    tautan dan memahami batas dari tanda HTTPS.
                </p>
            </Section>

            <Section title="Konsep Utama">
                <Key>
                    Teks pada tombol bukan tujuan sebenarnya. HTTPS mengamankan
                    koneksi, bukan membuktikan situs tepercaya.
                </Key>

                <p>
                    Tulisan atau tombol dapat dibuat berbeda dari alamat yang
                    dibuka saat ditekan. Gembok atau HTTPS berarti data yang
                    dikirim tidak mudah disadap di tengah jalan, tetapi pemilik
                    situs tetap bisa siapa saja, termasuk pelaku penipuan. Dua
                    hal yang perlu dibedakan:
                </p>

                <Table
                    head={["Yang terlihat", "Artinya"]}
                    rows={[
                        [
                            "Teks pada tombol atau tautan",
                            "Belum tentu sama dengan alamat tujuan sebenarnya",
                        ],
                        [
                            "Gembok atau HTTPS",
                            "Koneksi aman, tetapi bukan bukti situs tepercaya",
                        ],
                    ]}
                />
            </Section>

            <Section title="Contoh">
                <Note>
                    Contoh fiktif untuk latihan. Nama, perusahaan, dan alamat
                    hanya rekaan.
                </Note>

                <Mock>
                    <p>
                        <strong>Subjek:</strong> Paket Anda tertahan
                    </p>

                    <hr className="border-slate-200" />

                    <p>
                        Paket belum dapat dikirim. Lacak statusnya melalui
                        tombol di bawah.
                    </p>

                    <FakeButton>Lacak paket</FakeButton>

                    <p>
                        <strong>Teks yang terlihat:</strong>{" "}
                        kurircontoh.example/lacak <strong>(1)</strong>
                    </p>
                    <p>
                        <strong>Tujuan asli saat ditekan:</strong>{" "}
                        kurircontoh-cek.example/track <strong>(2)</strong> ·
                        HTTPS dengan gembok <strong>(3)</strong>
                    </p>
                </Mock>

                <p className="font-medium text-slate-800">
                    Penjelasan tanda bahaya pada email di atas:
                </p>

                <Bullets
                    items={[
                        <>
                            <strong>Teks tidak sama dengan tujuan.</strong> Yang
                            tertulis pada tombol berbeda dari alamat yang
                            sebenarnya dibuka.
                        </>,
                        <>
                            <strong>Domain tujuan berbeda.</strong> Domain
                            tujuan tidak sama dengan domain jasa kurir yang Anda
                            kenal.
                        </>,
                        <>
                            <strong>Gembok bukan jaminan.</strong> Ada gembok,
                            tetapi itu tidak mengubah poin sebelumnya.
                        </>,
                    ]}
                />
            </Section>

            <Section title="Tindakan Aman: Periksa tujuan sebelum menekan">
                <Bullets
                    items={[
                        "Arahkan kursor atau tekan lama pada tautan untuk melihat alamat tujuan.",
                        "Jika domain tidak sesuai atau Anda ragu, jangan klik.",
                        "Ketik sendiri alamat resmi atau buka aplikasi resminya.",
                    ]}
                />
            </Section>

            <NextHint>Berikutnya: Unit 4 · Waspadai lampiran dan QR</NextHint>

            <UnitFooter unit={3} {...props} />
        </article>
    );
}