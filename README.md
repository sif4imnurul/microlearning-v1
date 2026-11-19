## Panduan Instalasi dan Menjalankan Aplikasi

1. Clone repository:
   ```bash
   git clone https://github.com/USERNAME/microlearning-v1.git
   ```

2. Masuk ke direktori project:
   ```bash
   cd microlearning-v1
   ```

3. Salin file konfigurasi environment:
   ```powershell
   Copy-Item .env.local-example .env.local
   ```

4. Buka file `.env.local`, kemudian isi `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` menggunakan kredensial Supabase masing-masing.

5. Instal seluruh dependency:
   ```bash
   npm install
   ```

6. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

7. Buka browser dan akses:
   `http://localhost:3000`

**Catatan:** Pastikan telah memiliki project Supabase dan struktur database yang sesuai sebelum menjalankan aplikasi.

