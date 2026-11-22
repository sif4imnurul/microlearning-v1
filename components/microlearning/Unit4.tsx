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

export default function Unit4(props: UnitProps) {
    return (
        <article className="space-y-6">
            <UnitHeader
                title="Unit 4: Waspadai Lampiran dan QR"
                meta="Microlearning A03 · Unit 4 dari 6"
            />

            <Section title="Tujuan">
                <p>
                    Setelah unit ini, Anda berhenti dan memverifikasi dulu
                    sebelum membuka file atau memindai kode QR yang tidak Anda
                    harapkan.
                </p>
            </Section>

            <Section title="Konsep Utama">
                <Key>
                    File atau QR yang tidak diharapkan harus diverifikasi
                    sebelum dibuka atau dipindai.
                </Key>

                <p>
                    Pertanyaan pertamanya: apakah saya memang menunggu kiriman
                    ini? Jika tidak, perlakukan dengan hati-hati. Dua hal yang
                    sering dipakai:
                </p>

                <Table
                    head={["Jenis", "Risikonya"]}
                    rows={[
                        [
                            "File lampiran",
                            "Dapat berisi program yang merugikan saat dibuka",
                        ],
                        [
                            "Kode QR",
                            "Alamat tujuan tersembunyi sampai dipindai",
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
                            EMAIL
                        </p>
                        <p>
                            <strong>Subjek:</strong> Tagihan bulan ini
                        </p>
                        <p>
                            <strong>Lampiran:</strong>{" "}
                            <span className="font-mono text-xs">
                                Tagihan-Listrik.pdf.exe
                            </span>{" "}
                            <strong>(1)</strong>
                        </p>
                    </Mock>

                    <Mock>
                        <p className="text-xs font-semibold tracking-wide text-slate-500">
                            CHAT DARI NOMOR TIDAK DIKENAL
                        </p>
                        <p>&ldquo;Ini foto acara kemarin, scan ya.&rdquo;</p>
                        <div className="flex items-center gap-2">
                            <div className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed border-slate-400 text-xs text-slate-500">
                                gambar QR
                            </div>
                            <strong>(2)</strong>
                        </div>
                    </Mock>
                </div>

                <p className="font-medium text-slate-800">
                    Penjelasan tanda bahaya pada contoh di atas:
                </p>

                <Bullets
                    items={[
                        <>
                            <strong>Lampiran tidak ditunggu.</strong> Anda tidak
                            sedang menunggu tagihan, dan nama serta ekstensi
                            filenya janggal.
                        </>,
                        <>
                            <strong>QR dari pengirim tak dikenal.</strong> Tidak
                            ada keterangan yang jelas tentang ke mana QR itu
                            mengarah.
                        </>,
                    ]}
                />
            </Section>

            <Section title="Tindakan Aman: Belum yakin? Jangan buka, jangan pindai">
                <Bullets
                    items={[
                        "Tanyakan pada diri sendiri: apakah saya menunggu kiriman ini?",
                        "Konfirmasi lewat kontak resmi pengirim atau pemilik tempat yang Anda kenal, bukan lewat kontak di dalam pesan.",
                        "Buka atau pindai hanya setelah Anda yakin asal dan tujuannya.",
                    ]}
                />
            </Section>

            <NextHint>Berikutnya: Unit 5 · Kode rahasia dan MFA</NextHint>

            <UnitFooter unit={4} {...props} />
        </article>
    );
}