/* =====================================================================
   katalog.js  –  HALAMAN KATALOG
   Alur: ambil semua produk -> saring (kategori + kata kunci) -> urutkan -> tampilkan
   Link seperti katalog.html?kategori=sofa langsung membuka filter sofa.
   ===================================================================== */

let semuaProduk = [];
let kategoriAktif = "semua";

function tampilkan() {
  const kata = $("#cari").value.trim().toLowerCase();
  const urut = $("#urut").value;

  let hasil = semuaProduk.filter((p) => {
    const cocokKategori = kategoriAktif === "semua" || p.kategori === kategoriAktif;
    const teks = (p.nama + " " + (p.bahan || "") + " " + (p.warna || "")).toLowerCase();
    return cocokKategori && (!kata || teks.includes(kata));
  });

  // Produk tanpa harga selalu ditaruh di paling akhir saat diurutkan menurut harga
  const adaHarga = (p) => p.harga !== null && p.harga !== undefined;
  const urutHarga = (naik) => (a, b) => {
    if (!adaHarga(a) && !adaHarga(b)) return 0;
    if (!adaHarga(a)) return 1;
    if (!adaHarga(b)) return -1;
    return naik ? a.harga - b.harga : b.harga - a.harga;
  };
  if (urut === "murah") hasil.sort(urutHarga(true));
  if (urut === "mahal") hasil.sort(urutHarga(false));

  $("#daftar-produk").innerHTML = hasil.length
    ? hasil.map(kartuProduk).join("")
    : '<p class="kosong">Belum ada produk yang cocok. Coba kata kunci lain atau <a href="custom.html">pesan custom</a>.</p>';
}

function pilihKategori(k) {
  kategoriAktif = k;
  document.querySelectorAll("#filter-kategori .chip").forEach((c) =>
    c.classList.toggle("aktif", c.dataset.kategori === k)
  );
  tampilkan();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll("#filter-kategori .chip").forEach((c) =>
    c.addEventListener("click", () => pilihKategori(c.dataset.kategori))
  );
  $("#cari").addEventListener("input", tampilkan);
  $("#urut").addEventListener("change", tampilkan);

  try {
    semuaProduk = await ambilProduk();
    const awal = new URLSearchParams(location.search).get("kategori");
    pilihKategori(["kasur", "sofa", "mebel"].includes(awal) ? awal : "semua");
  } catch (e) {
    $("#daftar-produk").innerHTML = '<p class="kosong">Produk belum bisa dimuat. Coba muat ulang halaman.</p>';
    console.error(e);
  }
});
