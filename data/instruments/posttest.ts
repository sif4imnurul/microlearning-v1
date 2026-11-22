export type InstrumentOption = {
    label: "A" | "B" | "C" | "D";
    text: string;
};

export type InstrumentQuestion = {
    id: string;
    question: string;
    options: InstrumentOption[];
};

export const POSTTEST_QUESTIONS: InstrumentQuestion[] = [
    {
        id: "Q1",
        question:
            'Email "Verifikasi beasiswa" datang dari beasiswa@pusat-akademik.co dan meminta login, sedangkan domain resmi kampus adalah kampus.ac.id.',
        options: [
            { label: "A", text: "Login karena subjeknya relevan" },
            {
                label: "B",
                text: "Verifikasi melalui situs/kanal kampus resmi dan hindari link email",
            },
            { label: "C", text: "Balas dengan NIM dan password" },
            { label: "D", text: "Nonaktifkan browser warning" },
        ],
    },
    {
        id: "Q2",
        question:
            'Anda mendapat link ke halaman "Cloud Drive" dengan desain yang identik, tetapi URL-nya cloud-drive-auth.example.org.',
        options: [
            {
                label: "A",
                text: "Gunakan password utama karena tampilannya identik",
            },
            {
                label: "B",
                text: "Buka layanan dari aplikasi/bookmark resmi dan bandingkan domain",
            },
            { label: "C", text: "Coba credential orang lain" },
            { label: "D", text: "Matikan HTTPS warning" },
        ],
    },
    {
        id: "Q3",
        question:
            'Pesan mengaku dari "Kepala IT" meminta recovery code MFA karena ada "audit mendadak hari ini".',
        options: [
            {
                label: "A",
                text: "Kirim recovery code untuk membantu audit",
            },
            {
                label: "B",
                text: "Tolak dan verifikasi melalui kontak resmi IT",
            },
            {
                label: "C",
                text: "Kirim foto recovery code yang diburamkan sebagian",
            },
            { label: "D", text: "Nonaktifkan MFA" },
        ],
    },
    {
        id: "Q4",
        question:
            'Email tak dikenal berisi "Nilai_Revisi.xlsm" dan meminta Anda mengaktifkan macro agar file terbuka.',
        options: [
            {
                label: "A",
                text: "Aktifkan macro karena file akademik",
            },
            {
                label: "B",
                text: "Verifikasi sumber dan jangan mengaktifkan macro/file yang tidak diharapkan",
            },
            {
                label: "C",
                text: "Upload ke komputer publik untuk mencoba",
            },
            { label: "D", text: "Ubah nama file menjadi .pdf" },
        ],
    },
    {
        id: "Q5",
        question:
            "Anda menerima tiga notifikasi MFA berturut-turut tanpa memulai login.",
        options: [
            { label: "A", text: "Approve salah satu agar berhenti" },
            {
                label: "B",
                text: "Tolak semua, periksa akun, dan ubah credential bila diperlukan melalui kanal resmi",
            },
            { label: "C", text: "Matikan notifikasi" },
            { label: "D", text: "Bagikan kode MFA ke teman" },
        ],
    },
    {
        id: "Q6",
        question:
            "Anda sedang berada di aplikasi resmi bank dan aplikasi memberi notifikasi bahwa versi baru tersedia melalui app store resmi; tidak meminta password lewat pesan.",
        options: [
            {
                label: "A",
                text: "Periksa/update melalui app store resmi sesuai kebutuhan",
            },
            {
                label: "B",
                text: "Anggap pasti phishing hanya karena ada update",
            },
            {
                label: "C",
                text: "Cari APK dari link acak agar lebih cepat",
            },
            { label: "D", text: "Kirim PIN ke customer service" },
        ],
    },
    {
        id: "Q7",
        question:
            'Meja kafe memiliki stiker QR "menu digital", tetapi stiker tampak menutupi QR asli dan mengarah ke halaman login email.',
        options: [
            { label: "A", text: "Login email agar menu terbuka" },
            {
                label: "B",
                text: "Hentikan, verifikasi dengan staf, dan jangan memasukkan credential",
            },
            { label: "C", text: "Bagikan QR ke media sosial" },
            { label: "D", text: "Scan dengan akun admin" },
        ],
    },
    {
        id: "Q8",
        question:
            'Situs promo memiliki HTTPS valid, tetapi meminta Anda memasukkan password email untuk "klaim voucher" pada domain yang tidak terkait dengan penyedia email.',
        options: [
            { label: "A", text: "Aman karena HTTPS" },
            {
                label: "B",
                text: "Jangan masukkan password; cek domain dan tujuan permintaan credential",
            },
            {
                label: "C",
                text: "Aman bila sertifikat tidak kedaluwarsa",
            },
            {
                label: "D",
                text: "Gunakan password utama lalu ganti nanti",
            },
        ],
    },
    {
        id: "Q9",
        question:
            "Anda baru saja login sendiri ke akun email pada laptop baru dan segera menerima prompt MFA yang cocok dengan lokasi/perangkat Anda.",
        options: [
            { label: "A", text: "Tolak selalu semua MFA" },
            {
                label: "B",
                text: "Verifikasi detail lalu approve karena login memang Anda mulai",
            },
            { label: "C", text: "Bagikan prompt kepada teman" },
            { label: "D", text: "Nonaktifkan MFA" },
        ],
    },
    {
        id: "Q10",
        question:
            "Chat pribadi mengaku admin sistem dan meminta Anda menjalankan link remote-access lalu mengirim password.",
        options: [
            { label: "A", text: "Ikuti karena admin perlu akses" },
            {
                label: "B",
                text: "Tolak dan hubungi admin melalui kanal bantuan resmi",
            },
            { label: "C", text: "Kirim password sementara" },
            { label: "D", text: "Matikan antivirus dulu" },
        ],
    },
    {
        id: "Q11",
        question:
            'Email menyatakan "akun Anda sedang diselidiki" dan meminta pembayaran serta login dalam 15 menit melalui link pendek.',
        options: [
            { label: "A", text: "Ikuti agar masalah selesai" },
            {
                label: "B",
                text: "Jangan gunakan link; verifikasi melalui layanan resmi/otoritas yang benar",
            },
            { label: "C", text: "Kirim data identitas lebih dulu" },
            { label: "D", text: "Teruskan ke semua kontak" },
        ],
    },
    {
        id: "Q12",
        question:
            "Setelah memastikan pesan mencurigakan, Anda melihat prosedur resmi organisasi meminta pengguna meneruskan header email ke tim keamanan.",
        options: [
            {
                label: "A",
                text: "Ikuti prosedur pelaporan resmi tanpa mengklik isi pesan",
            },
            {
                label: "B",
                text: "Klik semua link agar tim keamanan mendapat bukti",
            },
            {
                label: "C",
                text: "Balas pengirim dengan password palsu",
            },
            {
                label: "D",
                text: "Unggah email beserta data pribadi ke media sosial",
            },
        ],
    },
];