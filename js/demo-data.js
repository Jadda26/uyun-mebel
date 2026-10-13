/* =====================================================================
   demo-data.js  –  PRODUK CONTOH
   Hanya tampil selama database Supabase belum disambungkan (config.js kosong).
   Setelah database aktif, file ini tidak dipakai lagi (boleh dihapus).
   ===================================================================== */

const DEMO_PRODUK = [
  { id: "demo-1", nama: "Sofa L Minimalis", kategori: "sofa", harga: 4500000, harga_mulai_dari: true,
    ukuran: "250 x 160 cm", bahan: "Kain oscar, rangka kayu jati", warna: "Abu, krem, cokelat",
    deskripsi: "Sofa sudut dengan busa padat dan rangka kayu kuat. Ukuran dan warna bisa disesuaikan dengan ruangan Anda.",
    foto: [], status: "ready", unggulan: true, tampil: true },
  { id: "demo-2", nama: "Sofa 2 Dudukan Klasik", kategori: "sofa", harga: 2800000, harga_mulai_dari: false,
    ukuran: "170 x 80 cm", bahan: "Kain velvet", warna: "Hijau zaitun, navy",
    deskripsi: "Sofa dua dudukan bergaya klasik, cocok untuk ruang tamu kecil.",
    foto: [], status: "pre-order", unggulan: true, tampil: true },
  { id: "demo-3", nama: "Kasur Busa Premium 160", kategori: "kasur", harga: 3200000, harga_mulai_dari: true,
    ukuran: "160 x 200 cm", bahan: "Busa high density, sarung kain rajut", warna: "Putih, abu",
    deskripsi: "Kasur busa dengan tingkat kekerasan bisa dipilih sesuai kebutuhan.",
    foto: [], status: "ready", unggulan: true, tampil: true },
  { id: "demo-4", nama: "Kasur Pegas Single", kategori: "kasur", harga: 1800000, harga_mulai_dari: false,
    ukuran: "100 x 200 cm", bahan: "Pegas bonnell, kain jacquard", warna: "Krem",
    deskripsi: "Kasur pegas single untuk kamar anak atau kamar kos.",
    foto: [], status: "ready", unggulan: false, tampil: true },
  { id: "demo-5", nama: "Lemari Pakaian 3 Pintu", kategori: "mebel", harga: 3900000, harga_mulai_dari: true,
    ukuran: "150 x 55 x 200 cm", bahan: "Multipleks finishing HPL", warna: "Cokelat kayu, putih",
    deskripsi: "Lemari tiga pintu dengan rak dan gantungan. Sekat bagian dalam bisa diatur.",
    foto: [], status: "ready", unggulan: true, tampil: true },
  { id: "demo-6", nama: "Meja Makan 6 Kursi", kategori: "mebel", harga: null, harga_mulai_dari: false,
    ukuran: "160 x 90 cm", bahan: "Kayu jati", warna: "Natural, walnut",
    deskripsi: "Satu set meja makan dengan enam kursi. Harga menyesuaikan jenis kayu dan ukuran.",
    foto: [], status: "pre-order", unggulan: false, tampil: true }
];
