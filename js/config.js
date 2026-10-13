/* =====================================================================
   config.js  –  PUSAT PENGATURAN WEBSITE
   Hampir semua yang sering diganti ada di file ini.
   Cukup ubah tulisan di antara tanda kutip "...", jangan hapus tanda koma.
   ===================================================================== */

const CONFIG = {
  // ---- Identitas usaha ----
  namaUsaha: "Uyun Mebel",
  alamat: "Kabupaten Tegal, Jawa Tengah",          // GANTI dengan alamat lengkap workshop
  jamBuka: "Senin – Sabtu, 08.00 – 17.00",         // GANTI sesuai jam buka sebenarnya
  areaLayanan: "Saat ini melayani wilayah Kabupaten Tegal. Di luar area itu, silakan tanya dulu lewat WhatsApp.",

  // ---- WhatsApp ----
  // Tulis dalam format internasional: awali 62, TANPA 0 di depan, TANPA tanda + atau spasi.
  // Contoh: 08123456789  ->  628123456789
  whatsapp: "6281919523112",                         // GANTI dengan nomor asli klien

  // Isi pesan otomatis saat pelanggan menekan tombol "Pesan".
  // {nama_produk}, {kategori}, {url_produk} akan diisi otomatis.
  templatePesan:
    "Halo Uyun Mebel, saya tertarik dengan {nama_produk} ({kategori}).\n" +
    "Link produk: {url_produk}\n" +
    "Boleh minta info ukuran, bahan, warna, dan estimasi pengerjaannya?",

  // ---- Media sosial (isi nama akun saja, tanpa @) ----
  sosial: {
    instagram: "mebel_uyun",
    tiktok: "mebel_uyun",
    facebook: "mebel_uyun"
  },

  // ---- Database (Supabase) ----
  // Diisi setelah membuat project Supabase (lihat README.md bagian "Setup Supabase").
  // Selama masih kosong, website menampilkan produk CONTOH dari js/demo-data.js.
  supabaseUrl: "https://supabase.com/dashboard/project/olgjdcktzhmenkggcgbm/settings/api-keys",    // contoh: "https://abcdxyz.supabase.co"
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZ2pkY2t0emhtZW5rZ2djZ2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NzU1OTQsImV4cCI6MjEwNzQ1MTU5NH0.A5gQCyelH-cRKnbzNHdcTQjs9oTGOfdpjCAFKyyhPy0",    // isi dengan kunci "anon public" (BUKAN service_role!)

  // ---- Login admin ----
  // Admin login dengan username + password. Di balik layar username diubah menjadi
  // email: username@domainAdmin. Harus sama dengan email akun yang dibuat di Supabase.
  domainAdmin: "admin.uyunmebel.com"
};

// Dipakai file lain untuk mengecek apakah database sudah disambungkan.
function supabaseAktif() {
  return Boolean(CONFIG.supabaseUrl && CONFIG.supabaseKey);
}
