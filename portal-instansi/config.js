/*
  KONFIGURASI SITUS
  Isi semua nilai di bawah dengan data RESMI instansi.
  Nilai dengan tanda [ ] adalah placeholder dan harus diganti sebelum situs dipublikasikan.
*/
window.SITE_CONFIG = {
  NAMA_INSTANSI: "[Nama Instansi Resmi]",
  NAMA_SINGKAT: "[Singkatan]",
  TAGLINE: "[Tagline resmi instansi]",
  LOGO_URL: "",                 // contoh: "assets/logo.svg" (kosongkan untuk pakai inisial)
  WARNA_UTAMA: "#0B3B6F",       // warna resmi instansi
  WARNA_AKSEN: "#F26B1D",

  ALAMAT: "[Alamat lengkap sesuai dokumen resmi]",
  TELEPON: "[Nomor telepon resmi]",
  EMAIL: "[Email resmi]",
  JAM_LAYANAN: "[Jam pelayanan resmi]",

  // Endpoint backend milik instansi untuk pendaftaran dan cek status.
  // Kosongkan jika belum ada; situs akan menampilkan pesan bahwa layanan belum tersambung.
  API_URL: "",

  // Layanan dan tarif: ganti dengan data resmi dari instansi.
  LAYANAN: [
    { kategori: "Medex", nama: "Medex Kelas 1 (Initial / Renewal)", deskripsi: "Pemeriksaan kesehatan untuk pilot komersial.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Medex", nama: "Medex Kelas 2 (Initial / Renewal)", deskripsi: "Pemeriksaan untuk pilot privat, awak kabin, dan siswa pilot.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Medex", nama: "Medex Kelas 3 (Initial / Renewal)", deskripsi: "Pemeriksaan untuk pemandu lalu lintas udara.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Penunjang", nama: "Pemeriksaan Mata & Buta Warna", deskripsi: "Visus, tes buta warna, dan lapang pandang.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Penunjang", nama: "Audiometri & THT", deskripsi: "Tes pendengaran dan pemeriksaan THT.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Penunjang", nama: "EKG & Treadmill", deskripsi: "Rekam jantung istirahat dan tes beban.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Penunjang", nama: "EEG", deskripsi: "Rekam gelombang otak.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Penunjang", nama: "Rontgen Thorax & Spirometri", deskripsi: "Foto dada dan tes fungsi paru.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Penunjang", nama: "Laboratorium", deskripsi: "Pemeriksaan darah, urin, dan kimia klinik.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Penunjang", nama: "Gigi & Mulut", deskripsi: "Pemeriksaan gigi dan mulut.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Layanan Lain", nama: "Fisioterapi", deskripsi: "Layanan fisioterapi sesuai rujukan.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Layanan Lain", nama: "Home Care", deskripsi: "Layanan pemeriksaan di rumah, sesuai ketentuan instansi.", tarif: "[isi tarif resmi]", durasi: "[isi]" },
    { kategori: "Skrining", nama: "Mamografi Digital", deskripsi: "Skrining kanker payudara sesuai indikasi.", tarif: "[isi tarif resmi]", durasi: "[isi]" }
  ]
};
