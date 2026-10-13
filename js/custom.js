/* =====================================================================
   custom.js  –  FORMULIR PESANAN CUSTOM
   Isi formulir disusun menjadi satu pesan WhatsApp. Tidak ada data yang disimpan di server.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  $("#area-layanan").textContent = CONFIG.areaLayanan;

  $("#form-custom").addEventListener("submit", (e) => {
    e.preventDefault();
    const baris = ["Halo " + CONFIG.namaUsaha + ", saya ingin memesan secara custom."];
    baris.push("Jenis: " + $("#jenis").value);
    // Baris lain hanya ditambahkan jika diisi
    const tambah = (label, id) => {
      const nilai = $("#" + id).value.trim();
      if (nilai) baris.push(label + ": " + nilai);
    };
    tambah("Ukuran", "ukuran");
    tambah("Bahan", "bahan");
    tambah("Warna", "warna");
    tambah("Catatan", "catatan");
    window.open(linkWA(baris.join("\n")), "_blank", "noopener");
  });
});
