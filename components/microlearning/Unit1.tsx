import {
    Bullets,
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

export default function Unit1(props: UnitProps) {
    return (
        <article className="space-y-6">
            <UnitHeader
                title="Unit 1: Kenali Siapa Pengirimnya"
                meta="Microlearning A03 · Unit 1 dari 6"
            />

            <Section title="Tujuan">
                <p>
                    Setelah unit ini, Anda dapat membedakan nama tampilan dari
                    alamat pengirim yang sebenarnya.
                </p>
            </Section>

            <Section title="Konsep Utama">
                <Key>
                    Nama tampilan bisa dipalsukan. Periksa alamat dan domain
                    pengirim.
                </Key>

                <p>
                    Nama tampilan hanyalah teks yang bisa ditulis siapa saja,
                    misalnya nama bank atau layanan yang Anda kenal. Domain
                    palsu sering dibuat mirip dengan yang asli dengan menambah
                    kata, mengganti huruf, atau memakai ekstensi lain. Tiga hal
                    yang perlu dibedakan:
                </p>

                <Table
                    head={["Bagian", "Yang perlu dilakukan"]}
                    rows={[
                        [
                            "Nama tampilan",
                            "Bisa ditulis siapa saja, jadi belum membuktikan apa pun",
                        ],
                        [
                            "Alamat email",
                            "Baca lengkap, terutama domain di belakang tanda @",
                        ],
                        [
                            "Domain",
                            "Bandingkan dengan domain resmi yang Anda kenal",
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
                        <strong>Dari:</strong> Bank Contoh Care <strong>(1)</strong>{" "}
                        &lt;cs@bankcontoh-notifikasi.example&gt;{" "}
                        <strong>(2)</strong>
                    </p>
                    <p>
                        <strong>Perihal:</strong> Pemberitahuan layanan
                    </p>

                    <hr className="border-slate-200" />

                    <p>
                        Yth. Nasabah, terdapat pembaruan layanan pada akun Anda.
                    </p>
                </Mock>

                <p className="font-medium text-slate-800">
                    Penjelasan pada email di atas:
                </p>

                <Bullets
                    items={[
                        <>
                            <strong>Nama tampilan.</strong> &ldquo;Bank Contoh
                            Care&rdquo; bisa ditulis siapa saja, jadi belum
                            membuktikan apa pun.
                        </>,
                        <>
                            <strong>Alamat dan domain.</strong>{" "}
                            bankcontoh-notifikasi.example berbeda dari domain
                            resmi bank yang Anda kenal, yaitu bankcontoh.example.
                        </>,
                    ]}
                />
            </Section>

            <Section title="Tindakan Aman: Baca alamat lengkapnya, lalu bandingkan">
                <Bullets
                    items={[
                        "Lihat alamat email lengkap dan domainnya, bukan hanya nama pengirim.",
                        "Bandingkan dengan alamat resmi yang Anda ketahui dari kanal resmi.",
                        "Jika berbeda atau Anda ragu, jangan klik dan jangan balas dulu.",
                        "Pemeriksaan ini untuk memastikan, bukan untuk mencurigai semua pesan.",
                    ]}
                />
            </Section>

            <NextHint>Berikutnya: Unit 2 · Jangan mudah terpancing</NextHint>

            <UnitFooter unit={1} {...props} />
        </article>
    );
}