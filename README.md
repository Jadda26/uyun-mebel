# Website Uyun Mebel

Website katalog kasur, sofa, dan mebel. Pelanggan melihat produk, lalu menekan tombol **Pesan** yang membuka WhatsApp dengan pesan yang sudah terisi. Admin menambah dan mengubah produk lewat halaman `/adminku`.

Dibuat sesederhana mungkin: hanya HTML, CSS, dan JavaScript biasa (tanpa framework, tanpa proses build). Data produk dan foto disimpan di **Supabase** (gratis), website di-hosting di **GitHub Pages** (gratis).

---

## 1. Isi folder dan fungsinya

```
uyun-mebel/
├── index.html          Beranda
├── katalog.html        Daftar produk + filter + pencarian
├── produk.html         Detail satu produk (dipakai semua produk: produk.html?id=...)
├── custom.html         Formulir pesanan custom -> dikirim ke WhatsApp
├── kontak.html         Alamat, jam buka, media sosial
├── adminku/
│   ├── index.html      Halaman admin (login + kelola produk)
│   └── admin.css       Tampilan halaman admin
├── css/
│   └── style.css       Tampilan seluruh website (warna ada di bagian atas file)
├── js/
│   ├── config.js       ⭐ PENGATURAN: nomor WhatsApp, alamat, jam buka, sosial media, kunci database
│   ├── common.js       Fungsi bersama: header, footer, tombol WhatsApp, kartu produk
│   ├── demo-data.js    Produk CONTOH (hanya tampil sebelum database disambungkan)
│   ├── home.js         Isi dinamis beranda (produk unggulan)
│   ├── katalog.js      Filter, pencarian, urutan di katalog
│   ├── produk.js       Isi halaman detail produk
│   ├── custom.js       Menyusun pesan WhatsApp dari formulir custom
│   ├── kontak.js       Isi halaman kontak
│   └── admin.js        Seluruh logika halaman admin
├── assets/
│   ├── logo.svg        Logo bulat (sementara; ganti dengan logo asli klien)
│   └── placeholder.svg Gambar pengganti jika produk belum punya foto
├── database/
│   └── setup.sql       Perintah membuat tabel & aturan keamanan (dijalankan sekali di Supabase)
└── README.md           Panduan ini
```

**Cara kerja singkat:** setiap halaman publik memuat `config.js` -> `common.js` -> file js miliknya. `common.js` mengambil produk dari Supabase (atau data contoh jika belum disambungkan), lalu halaman menampilkannya. Link WhatsApp dibuat di satu tempat saja, yaitu fungsi `linkWA()` di `common.js`.

---

## 2. Mencoba di komputer (VS Code)

1. Buka folder `uyun-mebel` di VS Code (File > Open Folder).
2. Pasang ekstensi **Live Server** (menu Extensions, cari "Live Server" oleh Ritwick Dey).
3. Klik kanan `index.html` > **Open with Live Server**. Website terbuka di browser dan otomatis menyegarkan setiap file disimpan.

Sebelum Supabase diisi, website menampilkan 6 **produk contoh** (harga dan data hanyalah contoh, bukan harga sebenarnya).

---

## 3. Mengisi pengaturan dasar (`js/config.js`)

Buka `js/config.js`, lalu ganti:

| Isi | Keterangan |
|---|---|
| `whatsapp` | Nomor klien dalam format `62...` tanpa 0 di depan dan tanpa `+`. Contoh `08123456789` ditulis `628123456789`. Saat ini masih nomor contoh. |
| `alamat` | Alamat workshop lengkap (sekarang masih "Kabupaten Tegal, Jawa Tengah"). |
| `jamBuka` | Jam buka sebenarnya (sekarang hanya contoh). |
| `areaLayanan` | Kalimat tentang area layanan. Ubah bila area bertambah. |
| `sosial` | Nama akun media sosial tanpa @ (sekarang `mebel_uyun`). |
| `templatePesan` | Isi pesan otomatis WhatsApp. Jangan hapus `{nama_produk}`, `{kategori}`, `{url_produk}`. |

---

## 4. Setup Supabase (database, login admin, penyimpanan foto)

Langkah ini dilakukan sekali. Tampilan Supabase bisa berubah sewaktu-waktu, jadi nama menu di bawah mungkin sedikit berbeda.

1. Daftar di **supabase.com** (bisa pakai akun GitHub), lalu **New project**.
   - Name: `uyun-mebel`
   - Database password: buat yang kuat, **simpan di tempat aman**.
   - Region: pilih yang terdekat dengan Indonesia (Singapore).
2. Tunggu project selesai dibuat (beberapa menit).
3. Buka **SQL Editor** > **New query**, tempel seluruh isi `database/setup.sql`, tekan **Run**. Ini membuat tabel `produk`, aturan keamanan, dan tempat foto `foto-produk`.
4. **Matikan pendaftaran pengguna baru (penting untuk keamanan).** Buka **Authentication**, cari pengaturan *Sign In / Providers*, lalu matikan opsi **"Allow new users to sign up"**. Tanpa ini, orang asing bisa mendaftar sendiri dan ikut mengubah katalog.
5. **Buat akun admin.** Buka **Authentication > Users > Add user > Create new user**:
   - Email: `admin@admin.uyunmebel.com` (ini adalah `username` + `@` + `domainAdmin` dari `config.js`; username-nya jadi `admin`)
   - Password: yang kuat
   - Centang **Auto Confirm User**
   
   Untuk username lain (misalnya `uyun`), buat email `uyun@admin.uyunmebel.com`. Email ini tidak pernah dikirimi apa pun, hanya dipakai sebagai nama akun.
6. **Salin kunci.** Buka **Project Settings > API** (atau menu *API Keys*):
   - **Project URL** -> isi ke `supabaseUrl` di `js/config.js`
   - Kunci **anon public** (di tampilan baru bisa bernama *publishable key*) -> isi ke `supabaseKey`
   
   Kunci ini memang boleh terlihat publik karena dijaga aturan keamanan di `setup.sql`. **Jangan pernah** memasukkan kunci `service_role` / *secret* ke file mana pun di folder ini.

Selesai. Muat ulang website: produk contoh hilang dan katalog kini kosong sampai admin menambah produk.

> Catatan: paket gratis Supabase dapat menjeda project yang lama tidak aktif. Jika admin tiba-tiba tidak bisa login atau produk tidak muncul, buka dashboard Supabase dan aktifkan kembali project-nya. Periksa kebijakan terbaru di situs Supabase.

---

## 5. Cara admin memakai website

1. Buka `namawebsite.com/adminku/`, masuk dengan username dan password.
2. **+ Tambah produk**: isi nama, kategori, harga (kosongkan bila "hubungi kami"), ukuran, bahan, warna, deskripsi, lalu pilih foto (boleh beberapa, langsung dari HP). Foto otomatis dikecilkan agar website cepat.
3. Di daftar produk, kontrol cepat tersedia untuk **status** (ready / pre-order / habis), **Tampil** (sembunyikan tanpa menghapus), dan **Unggulan** (muncul di beranda, maksimal 4 yang tampil).
4. **Ubah** untuk mengedit; di formulir, foto bisa dijadikan utama atau dihapus.

Alamat `/adminku` hanya membuat halaman tidak mudah ditemukan, bukan pengaman utama. Yang benar-benar menjaga adalah password yang kuat dan aturan database.

---

## 6. Hosting gratis di GitHub Pages

Alamat awal website berbentuk `https://USERNAME.github.io/uyun-mebel/` (ada nama GitHub di dalamnya). Alamat ini bisa diganti dengan domain sendiri nanti (bagian 7).

**A. Lewat VS Code (tanpa mengetik perintah)**

1. Pasang **Git** (git-scm.com) dan buat akun di **github.com**.
2. Di VS Code, buka ikon **Source Control** (cabang) > **Initialize Repository**.
3. Tulis pesan commit, misalnya `versi awal`, lalu klik **Commit**.
4. Klik **Publish Branch**, masuk dengan akun GitHub, beri nama repo `uyun-mebel`. Pilih **Public** (Pages gratis memerlukan repo publik).

**B. Lewat perintah (opsional)**

```bash
git init
git add .
git commit -m "versi awal"
git branch -M main
git remote add origin https://github.com/USERNAME/uyun-mebel.git
git push -u origin main
```

**Lalu aktifkan Pages:** di halaman repo GitHub, buka **Settings > Pages**. Pada **Source** pilih **Deploy from a branch**, Branch `main`, folder `/ (root)`, tekan **Save**. Tunggu 1–2 menit, alamat website muncul di halaman itu.

**Setiap ada perubahan kode:** simpan file, **Commit**, lalu **Sync / Push**. Website ikut diperbarui dalam 1–2 menit. Perubahan produk lewat halaman admin tidak perlu commit karena datanya ada di Supabase.

---

## 7. Domain sendiri (nanti, setelah klien setuju)

1. Beli domain di penyedia domain Indonesia (misalnya Niagahoster, Rumahweb, atau Domainesia). Domain `.my.id` atau `.web.id` biasanya termurah, tetapi harga berubah-ubah, jadi bandingkan dulu.
2. Di GitHub: **Settings > Pages > Custom domain**, isi domainnya, simpan. GitHub membuat file `CNAME` di repo.
3. Di pengelola DNS domain, arahkan sesuai petunjuk GitHub (untuk `www`: record CNAME ke `USERNAME.github.io`; untuk domain utama: record A ke alamat IP GitHub Pages yang tercantum di dokumentasi resmi GitHub).
4. Setelah DNS aktif, centang **Enforce HTTPS** di pengaturan Pages.

Dengan begitu `namawebsite.com/adminku/` bekerja sesuai rencana. Alternatif hosting gratis lain yang sama mudahnya: Cloudflare Pages dan Netlify.

---

## 8. Perawatan dan dokumentasi

**Pekerjaan yang sering dilakukan**

| Ingin... | Lakukan |
|---|---|
| Ganti nomor WhatsApp | Ubah `whatsapp` di `js/config.js` |
| Ganti alamat, jam buka, sosial media | Ubah di `js/config.js` |
| Ganti logo | Ganti file `assets/logo.svg` dengan logo asli (nama file sama). Jika logo berbentuk PNG, ganti tulisan `logo.svg` di `js/common.js`, `adminku/index.html`, dan `<link rel="icon">` di tiap file HTML. |
| Ganti warna | Ubah nilai warna di bagian `:root` paling atas `css/style.css` |
| Ubah tulisan beranda | Edit teks di `index.html` |
| Tambah halaman baru | Salin `kontak.html`, ubah isinya, tambahkan ke daftar `MENU` di `js/common.js` |
| Ganti password admin | Supabase > Authentication > Users > pilih akun > atur ulang password |
| Tambah admin lain | Supabase > Authentication > Users > Add user (email `username@admin.uyunmebel.com`) |
| Cadangan data | Simpan salinan repo GitHub, dan secara berkala unduh cadangan database dari dashboard Supabase |

**Jika ada masalah**

| Gejala | Kemungkinan penyebab |
|---|---|
| Yang tampil produk contoh terus | `supabaseUrl` / `supabaseKey` di `config.js` masih kosong atau salah |
| Katalog kosong padahal sudah ada produk | Produk belum dicentang **Tampil**, atau `setup.sql` belum dijalankan |
| Tidak bisa login | Username/password salah, akun belum dibuat di Supabase, **Auto Confirm User** belum dicentang, atau `domainAdmin` di `config.js` tidak sama dengan email akun |
| Gagal mengunggah foto | `setup.sql` belum dijalankan (tempat foto belum ada), atau belum login |
| Tombol WhatsApp salah nomor | Format `whatsapp` di `config.js` harus `62...` tanpa 0 dan tanpa `+` |
| Perubahan kode belum muncul di website | Belum di-commit dan push; tunggu 1–2 menit; segarkan dengan Ctrl+F5 |

**Catatan teknis untuk pengembang berikutnya**

- Semua tampilan dibuat dengan HTML + CSS biasa; tidak ada proses build.
- Data produk hanya satu tabel (`produk`); daftar foto disimpan sebagai array link di kolom `foto`.
- Halaman publik membaca data lewat REST Supabase memakai kunci publik; halaman admin memakai library `supabase-js`.
- Keamanan data diatur oleh *Row Level Security* di `database/setup.sql`: pengunjung hanya membaca produk yang `tampil = true`, hanya akun yang sudah login yang boleh menambah, mengubah, menghapus.
- Belum ada: keranjang/pembayaran online, akun pelanggan, ongkos kirim otomatis (sesuai ruang lingkup versi 1 di PRD).
