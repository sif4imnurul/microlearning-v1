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

export default function Unit2(props: UnitProps) {
    return (
        <article className="space-y-6">
            <UnitHeader
                title="Unit 2: Jangan Mudah Terpancing"
                meta="Microlearning A03 · Unit 2 dari 6"
            />

            <Section title="Tujuan">
                <p>
                    Setelah unit ini, Anda dapat mengenali tekanan di dalam
                    pesan sebagai tanda bahaya, bukan tanda bahwa pesan itu
                    asli.
                </p>
            </Section>

            <Section title="Konsep Utama">
                <Key>
                    Jabatan tinggi, ancaman, dan tenggat singkat bukan bukti
                    bahwa pesan itu asli.
                </Key>

                <p>
                    Pelaku sengaja membuat Anda takut atau segan supaya Anda
                    bertindak cepat sebelum sempat berpikir. Lima pemicu yang
                    sering dipakai:
                </p>

                <Table
                    head={["Pemicu", "Contoh"]}
                    rows={[
                        [
                            "Jabatan tinggi",
                            "Mengatasnamakan direktur, dekan, atau pimpinan",
                        ],
                        ["Ancaman", "Akun ditutup, data dihapus"],
                        [
                            "Tenggat singkat",
                            "\u201CDalam 1 jam\u201D, \u201Chari ini juga\u201D",
                        ],
                        ["Rasa takut", "Denda, sanksi, masalah hukum"],
                        ["Hadiah", "Menang undian, bonus, voucher"],
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
                        <strong>Dari:</strong> Hendra Wirakusuma
                        hendra@contoh-perusahaan.example
                    </p>
                    <p>
                        <strong>Kepada:</strong> Anda
                    </p>
                    <p>
                        <strong>Subjek:</strong> [SEGERA] Akun email Anda
                        ditutup pukul 15.00
                    </p>

                    <hr className="border-slate-200" />

                    <p>Selamat siang,</p>

                    <p>
                        Saya sedang rapat dan tidak bisa ditelepon. Akun email
                        Anda akan <strong>ditutup permanen (2)</strong>{" "}
                        <strong>hari ini pukul 15.00 (3)</strong> jika
                        verifikasi belum selesai.
                    </p>

                    <p>
                        <strong>Ini perintah langsung dari saya. (1)</strong>{" "}
                        Selesaikan sekarang dan{" "}
                        <strong>jangan diskusikan dengan siapa pun. (4)</strong>
                    </p>

                    <FakeButton>Verifikasi sekarang</FakeButton>

                    <p>
                        Hendra Wirakusuma
                        <br />
                        Direktur Operasional
                    </p>
                </Mock>

                <p className="font-medium text-slate-800">
                    Penjelasan tanda bahaya pada email di atas:
                </p>

                <Bullets
                    items={[
                        <>
                            <strong>Jabatan tinggi.</strong> Wewenang atasan
                            dipakai agar Anda tidak berani bertanya.
                        </>,
                        <>
                            <strong>Ancaman.</strong> &ldquo;Ditutup
                            permanen&rdquo; menimbulkan rasa takut kehilangan
                            akun.
                        </>,
                        <>
                            <strong>Tenggat singkat.</strong> Waktu yang sempit
                            membuat Anda tidak sempat memeriksa.
                        </>,
                        <>
                            <strong>Rasa takut dan isolasi.</strong> Dilarang
                            bertanya berarti Anda tidak bisa memastikan.
                        </>,
                    ]}
                />
            </Section>

            <Section title="Tindakan Aman: Berhenti sebentar, lalu verifikasi">
                <Bullets
                    items={[
                        "Jangan klik tombol dan jangan membalas pesan.",
                        "Tanyakan pada diri sendiri: mengapa pesan ini memaksa saya bertindak cepat?",
                        "Hubungi pengirim lewat kanal resmi yang sudah Anda kenal, bukan lewat kontak yang tertulis di dalam pesan.",
                    ]}
                />
            </Section>

            <NextHint>Berikutnya: Unit 3 · Periksa tautan dan gembok</NextHint>

            <UnitFooter unit={2} {...props} />
        </article>
    );
}