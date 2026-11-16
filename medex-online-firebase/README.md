# Medex Online — versi Firebase

Portal ini berjalan dalam dua mode:

- **Mode demo** (default): dipakai selama `firebase-config.js` masih berisi `GANTI`. Data hanya ada di memori browser dan hilang saat halaman dimuat ulang.
- **Mode Firebase**: aktif setelah konfigurasi proyek diisi. Data tersimpan di Firestore, berkas di Cloud Storage, dan login memakai Firebase Authentication.

## 1. Siapkan proyek Firebase

1. Buka https://console.firebase.google.com lalu buat proyek baru.
2. **Authentication** > Sign-in method > aktifkan **Email/Password**.
3. **Firestore Database** > Create database > pilih mode production dan lokasi terdekat.
4. **Storage** > Get started. Untuk proyek baru, Storage memerlukan paket Blaze (berbayar sesuai pemakaian).
5. **Project settings** > Your apps > tambahkan aplikasi Web, lalu salin objek konfigurasi ke `firebase-config.js`.

## 2. Pasang aturan keamanan dan hosting

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pilih proyek yang dibuat
firebase deploy
```

Perintah di atas mengunggah `firestore.rules`, `storage.rules`, dan semua berkas situs ke Firebase Hosting.

## 3. Buat akun admin pertama

1. Buka situs, pilih **Daftar akun pasien**, lalu daftarkan akun Anda sendiri.
2. Di Firebase Console > Firestore > koleksi `users`, buka dokumen akun tersebut dan ubah field `role` menjadi `admin`.
3. Masuk lagi. Sekarang Anda bisa mengatur peran pengguna lain lewat menu **Pengguna**.

Akun assessor dibuat dengan cara yang sama: daftar akun, lalu admin mengubah perannya di menu **Pengguna**.

## 4. Isi data resmi

- Menu **Pengaturan** (admin): nama, alamat, jam, dan telepon klinik.
- Menu **Layanan** dan **Dokter** (admin): tarif, deskripsi, dan jadwal dokter.
- Menu **Jadwal** (admin): kapasitas per tanggal.

Data contoh tidak diisi otomatis. Layanan dan dokter contoh di kode dipakai sebagai nilai awal, lalu admin menyimpannya ke Firestore saat pertama kali masuk.

## Keterbatasan yang perlu diketahui

- Kuota dihitung lewat transaksi di dokumen `quota`. Mengubah tanggal pemeriksaan belum memindahkan kuota secara otomatis.
- Pemeriksaan bentrok jam dokter belum dicegah di sisi server.
- Tautan unduhan berkas di Storage memakai token. Siapa pun yang memegang tautan bisa membukanya.
- Data kesehatan termasuk data pribadi sensitif. Sebelum dipakai untuk pasien sungguhan, tinjau aturan keamanan, konfigurasi App Check, kebijakan retensi, dan kepatuhan dengan regulasi perlindungan data yang berlaku.
- Logika demo di halaman tetap ada agar pratinjau tanpa Firebase tetap berfungsi.

## Jika Firebase gagal dimuat

Halaman tetap terbuka dan menampilkan pesan "Firebase belum bisa dimuat". Periksa koneksi internet dan nilai `firebase-config.js`.
