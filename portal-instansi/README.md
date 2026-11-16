# Portal Pelayanan (template)

Situs statis tanpa framework. Cukup buka `index.html` di browser untuk pratinjau.

## Isi konfigurasi
Buka `config.js` dan ganti semua nilai bertanda `[ ]` dengan data resmi:
- nama instansi, singkatan, tagline, logo, dan warna
- alamat, telepon, email, dan jam pelayanan
- daftar layanan dan tarif resmi
- `API_URL`: alamat backend milik instansi untuk pendaftaran dan cek status

## Kontrak backend (untuk tim IT)
- `POST {API_URL}/pendaftaran` dengan JSON `{nama, email, telp, kelas, jenis, tanggal}`
  - balasan: `{"nomor": "..."}`
- `GET {API_URL}/status?no=...`
  - balasan: `{"status": "..."}`

Tanpa `API_URL`, form tidak mengirim apa pun dan menampilkan pesan bahwa layanan belum tersambung.

## Publikasi
1. Upload semua file ke hosting atau server resmi instansi.
2. Pastikan domain dan sertifikat HTTPS dikelola oleh instansi.
3. Pastikan data pribadi pendaftar disimpan dan dikirim melalui sistem resmi, bukan di browser.

## Catatan
- Tarif, jadwal, dan regulasi harus diambil dari dokumen resmi.
- Halaman ini tidak menyimpan data pribadi di browser.
