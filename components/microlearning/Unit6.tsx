import {
    Bullets,
    Section,
    UnitFooter,
    UnitHeader,
    type UnitProps,
} from "@/components/microlearning/UnitParts";

const STEPS = [
    {
        title: "1. BERHENTI",
        text: "Jangan langsung membalas pesan, mengeklik tautan, atau mengikuti instruksi yang diberikan.",
    },
    {
        title: "2. VERIFIKASI",
        text: "Pastikan kebenaran informasi melalui kanal resmi, seperti aplikasi resmi atau kontak layanan yang dicari sendiri.",
    },
    {
        title: "3. LAPORKAN",
        text: "Jika pesan atau aktivitas tetap mencurigakan, laporkan melalui fitur atau mekanisme pelaporan resmi pada platform terkait.",
    },
];

export default function Unit6(props: UnitProps) {
    return (
        <article className="space-y-6">
            <UnitHeader
                eyebrow={
                    <>
                        MICROLEARNING • SISTEM KEAMANAN INFORMASI
                        <br />
                        UNIT 6
                    </>
                }
                title="Verifikasi dan Laporkan"
                meta="Microlearning A03 · Unit 6 dari 6"
            />

            <Section title="1. Tujuan Pembelajaran">
                <p>
                    Setelah menyelesaikan unit ini, peserta mampu mengetahui
                    langkah yang perlu dilakukan ketika menerima pesan atau
                    menemukan aktivitas mencurigakan: berhenti sejenak,
                    memverifikasi informasi melalui kanal resmi, lalu
                    melaporkannya melalui mekanisme resmi.
                </p>
            </Section>

            <Section title="2. Konsep Utama">
                <p>
                    Jika menemukan pesan atau aktivitas yang mencurigakan,
                    jangan langsung percaya, membalas, mengeklik tautan, atau
                    mengikuti instruksi yang diberikan. Lakukan tiga langkah
                    berikut:
                </p>

                <div className="overflow-hidden rounded-md border border-slate-200">
                    {STEPS.map((step) => (
                        <div
                            key={step.title}
                            className="grid gap-1 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4"
                        >
                            <p className="font-semibold text-[#172B45]">
                                {step.title}
                            </p>
                            <p>{step.text}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="3. Contoh Kasus (Simulasi Fiktif)">
                <p>
                    Bayangkan kamu sedang bertransaksi di sebuah marketplace.
                    Tiba-tiba, seseorang yang mengaku sebagai penjual mengirim
                    pesan berikut:
                </p>

                <blockquote className="select-none rounded-md border border-slate-300 bg-white p-4 italic">
                    &ldquo;Halo! Agar transaksi lebih cepat dan tidak terkena
                    biaya tambahan, silakan lanjutkan komunikasi melalui
                    WhatsApp dan lakukan pembayaran langsung ke rekening
                    berikut.&rdquo;
                </blockquote>

                <p>
                    Pesan tersebut mengajak kamu keluar dari aplikasi
                    marketplace dan melakukan pembayaran secara langsung.
                    Situasi ini perlu diwaspadai karena:
                </p>

                <Bullets
                    items={[
                        "Penjual mengajak berpindah ke luar platform resmi.",
                        "Pembayaran diminta dilakukan secara langsung.",
                        "Transaksi tidak lagi melalui mekanisme perlindungan marketplace.",
                    ]}
                />

                <p>
                    Ajakan tersebut belum membuktikan bahwa pesan pasti
                    penipuan, tetapi cukup menjadi alasan untuk tidak langsung
                    mengikuti instruksi dan melakukan verifikasi terlebih
                    dahulu.
                </p>
            </Section>

            <Section title="4. Tindakan Aman">
                <p>
                    Jika menghadapi situasi seperti contoh tersebut, lakukan hal
                    berikut:
                </p>

                <Bullets
                    items={[
                        "Jangan mengikuti ajakan pindah komunikasi atau melakukan pembayaran di luar platform.",
                        "Periksa informasi transaksi melalui aplikasi marketplace resmi.",
                        "Laporkan akun atau pesan mencurigakan menggunakan fitur pelaporan resmi.",
                    ]}
                />

                <div className="rounded-md border border-[#172B45]/30 bg-slate-50 p-3 text-center font-semibold text-[#172B45]">
                    INGAT: BERHENTI • VERIFIKASI • LAPORKAN
                </div>

                <p className="text-center text-xs italic text-slate-500">
                    Pastikan informasi melalui kanal resmi sebelum mengambil
                    tindakan.
                </p>
            </Section>

            <p className="text-center text-xs text-slate-400">
                Unit 6 — Verifikasi dan Laporkan • A03 Microlearning
            </p>

            <UnitFooter unit={6} {...props} />
        </article>
    );
}