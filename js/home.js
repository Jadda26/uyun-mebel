/* =====================================================================
   home.js  –  ISI DINAMIS BERANDA
   - Menampilkan sampai 4 produk yang ditandai "unggulan" oleh admin
   - Mengisi link WhatsApp dan keterangan area layanan
   ===================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  $("#wa-hero").href = linkWA("Halo Uyun Mebel, saya ingin bertanya.");
  $("#area-layanan").textContent = CONFIG.areaLayanan;

  const wadah = $("#daftar-unggulan");
  try {
    const semua = await ambilProduk();
    let pilihan = semua.filter((p) => p.unggulan).slice(0, 4);
    if (pilihan.length === 0) pilihan = semua.slice(0, 4); // belum ada yang unggulan: ambil yang terbaru
    wadah.innerHTML = pilihan.length
      ? pilihan.map(kartuProduk).join("")
      : '<p class="kosong">Produk akan segera ditambahkan.</p>';
  } catch (e) {
    wadah.innerHTML = '<p class="kosong">Produk belum bisa dimuat. Coba muat ulang halaman.</p>';
    console.error(e);
  }
});
