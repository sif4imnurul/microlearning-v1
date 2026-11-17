
export const PRETEST_QUESTIONS = [
    {
        id: "P1",
        question: `Anda menerima email "Reset akun kampus sekarang" dari support-kampus@akun-verifikasi.net. Tombol mengarah ke akun-verifikasi.net/login.`,
        options: [
            { label: "A", text: "Langsung login agar akun tidak ditutup" },
            { label: "B", text: "Periksa kanal resmi kampus dan jangan gunakan link tersebut" },
            { label: "C", text: "Balas email dengan password lama" },
            { label: "D", text: "Teruskan ke teman untuk menanyakan apakah mereka juga mendapatkannya" },
        ],
    },
    {
        id: "P2",
        question: `Sebuah halaman login menampilkan logo layanan yang Anda kenal, tetapi alamatnya adalah secure-login-service.example.info.`,
        options: [
            { label: "A", text: "Masukkan password karena logonya benar" },
            { label: "B", text: "Cek domain resmi melalui bookmark/aplikasi resmi sebelum login" },
            { label: "C", text: "Masukkan password lalu ganti setelahnya" },
            { label: "D", text: "Matikan antivirus agar halaman tidak diblokir" },
        ],
    },
    {
        id: "P3",
        question: `Pesan chat mengaku dari "Dekan" dan meminta Anda mengirim kode OTP dalam 5 menit agar akses akademik tidak dibekukan.`,
        options: [
            { label: "A", text: "Kirim OTP karena berasal dari pejabat" },
            { label: "B", text: "Kirim separuh OTP" },
            { label: "C", text: "Jangan kirim OTP dan verifikasi melalui kontak resmi" },
            { label: "D", text: "Screenshot OTP lalu kirim sebagai gambar" },
        ],
    },
    {
        id: "P4",
        question: `Anda mendapat lampiran "Invoice_Kampus.zip" yang tidak Anda tunggu dari pengirim yang belum dikenal.`,
        options: [
            { label: "A", text: "Buka untuk mengetahui isinya" },
            { label: "B", text: "Upload ke grup kelas agar orang lain mencoba" },
            { label: "C", text: "Verifikasi pengirim/konteks terlebih dahulu dan jangan membuka sebelum yakin" },
            { label: "D", text: "Ubah ekstensi file lalu buka" },
        ],
    },
    {
        id: "P5",
        question: `Telepon Anda menampilkan permintaan persetujuan login MFA padahal Anda tidak sedang login.`,
        options: [
            { label: "A", text: "Approve agar notifikasi hilang" },
            { label: "B", text: "Deny/tolak dan periksa keamanan akun melalui kanal resmi" },
            { label: "C", text: "Approve sekali lalu logout" },
            { label: "D", text: "Nonaktifkan MFA" },
        ],
    },
    {
        id: "P6",
        question: `Anda membuka portal kampus melalui bookmark resmi yang biasa digunakan. Di dalam portal muncul pengumuman pemeliharaan sistem; tidak ada permintaan password/OTP tambahan.`,
        options: [
            { label: "A", text: "Perlakukan otomatis sebagai phishing" },
            { label: "B", text: "Lanjutkan membaca pengumuman melalui portal resmi sambil tetap waspada" },
            { label: "C", text: "Kirim password ke admin untuk memastikan akun aktif" },
            { label: "D", text: "Pindahkan pengumuman ke situs lain" },
        ],
    },
    {
        id: "P7",
        question: `Poster digital menyatakan "Wi-Fi gratis mahasiswa" dan hanya menampilkan QR code dari sumber yang tidak jelas.`,
        options: [
            { label: "A", text: "Scan dan login dengan akun utama" },
            { label: "B", text: "Verifikasi sumber/tujuan QR sebelum membuka atau memasukkan data" },
            { label: "C", text: "Foto QR dan kirim ke banyak orang" },
            { label: "D", text: "Matikan MFA agar login lebih mudah" },
        ],
    },
    {
        id: "P8",
        question: `Situs yang Anda buka menggunakan HTTPS dan ikon gembok, tetapi domainnya berbeda dari domain organisasi yang ingin Anda akses.`,
        options: [
            { label: "A", text: "Aman karena ada gembok" },
            { label: "B", text: "Periksa domain; HTTPS saja tidak membuktikan organisasi tersebut asli" },
            { label: "C", text: "Aman jika tampilannya mirip" },
            { label: "D", text: "Masukkan password untuk menguji" },
        ],
    },
    {
        id: "P9",
        question: `Anda sendiri memulai reset password melalui aplikasi resmi. Beberapa detik kemudian aplikasi meminta Anda membuat password baru di dalam aplikasi yang sama; tidak ada permintaan OTP via chat.`,
        options: [
            { label: "A", text: "Lanjutkan proses di aplikasi resmi" },
            { label: "B", text: "Kirim password baru ke admin" },
            { label: "C", text: "Pindah ke link yang dikirim akun media sosial" },
            { label: "D", text: "Gunakan password yang sama di semua layanan" },
        ],
    },
    {
        id: "P10",
        question: `Seseorang menelepon mengaku helpdesk dan meminta password agar dapat "mengecek masalah akun".`,
        options: [
            { label: "A", text: "Berikan password jika penelepon tahu nama Anda" },
            { label: "B", text: "Berikan satu karakter saja" },
            { label: "C", text: "Tolak dan hubungi helpdesk melalui nomor resmi yang Anda cari sendiri" },
            { label: "D", text: "Berikan password lama" },
        ],
    },
    {
        id: "P11",
        question: `Pesan menyatakan Anda menang hadiah kampus dan harus login dalam 10 menit melalui link pendek yang tidak dikenal.`,
        options: [
            { label: "A", text: "Login karena hadiah terbatas" },
            { label: "B", text: "Verifikasi pengumuman melalui kanal resmi dan jangan gunakan link tersebut" },
            { label: "C", text: "Masukkan data palsu lalu lihat" },
            { label: "D", text: "Kirim link ke teman lebih dahulu" },
        ],
    },
    {
        id: "P12",
        question: `Anda menemukan email mencurigakan di inbox kampus. Kebijakan kampus menyediakan tombol "Report phishing".`,
        options: [
            { label: "A", text: "Report melalui fitur resmi lalu hapus/abaikan sesuai prosedur" },
            { label: "B", text: "Balas email untuk mengejek pengirim" },
            { label: "C", text: "Klik link untuk memastikan phishing" },
            { label: "D", text: "Teruskan ke seluruh kontak" },
        ],
    },
];
