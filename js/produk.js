/* =====================================================================
   produk.js  –  HALAMAN DETAIL PRODUK
   Mengambil id dari alamat (produk.html?id=...), mencari produknya,
   lalu menampilkan galeri foto, info, dan tombol pesan WhatsApp.
   ===================================================================== */

function barisInfo(label, nilai) {
  return nilai ? `<tr><th>${label}</th><td>${esc(nilai)}</td></tr>` : "";
}

function tampilDetail(p) {
  document.title = p.nama + " – " + CONFIG.namaUsaha;
  const fotos = p.foto && p.foto.length ? p.foto : ["assets/placeholder.svg"];
  const habis = p.status === "habis";

  $("#isi-produk").innerHTML = `
    <p class="krumb"><a href="katalog.html">Katalog</a> / <a href="katalog.html?kategori=${esc(p.kategori)}">${esc(p.kategori)}</a> / ${esc(p.nama)}</p>
    <div class="detail">
      <div>
        <div class="galeri-besar"><img id="foto-besar" src="${esc(fotos[0])}" alt="${esc(p.nama)}"></div>
        <div class="galeri-mini" id="galeri-mini">
          ${fotos.length > 1 ? fotos.map((f, i) =>
            `<button class="${i === 0 ? "aktif" : ""}" data-foto="${esc(f)}" aria-label="Foto ${i + 1}"><img src="${esc(f)}" alt=""></button>`
          ).join("") : ""}
        </div>
      </div>
      <div>
        <span class="kartu-kategori">${esc(p.kategori)}</span>
        <h1>${esc(p.nama)}</h1>
        <p class="harga-besar">${esc(teksHarga(p))}</p>
        <table class="tabel-info">
          ${barisInfo("Status", NAMA_STATUS[p.status] || p.status)}
          ${barisInfo("Ukuran", p.ukuran)}
          ${barisInfo("Bahan", p.bahan)}
          ${barisInfo("Warna", p.warna)}
        </table>
        ${p.deskripsi ? `<p>${esc(p.deskripsi).replace(/\n/g, "<br>")}</p>` : ""}
        <div class="catatan">Ukuran, bahan, dan warna bisa disesuaikan. Harga akhir dan lama pengerjaan dibicarakan lewat WhatsApp.</div>
        <a class="tombol tombol-wa${habis ? " mati" : ""}" href="${linkWA(pesanProduk(p))}" target="_blank" rel="noopener">
          ${habis ? "Stok sedang habis" : "Pesan via WhatsApp"}
        </a>
        ${habis ? `<p style="margin-top:12px" class="pudar">Stok habis, tetapi bisa dipesan ulang. <a href="${linkWA(pesanProduk(p))}" target="_blank" rel="noopener">Tanya via WhatsApp</a>.</p>` : ""}
      </div>
    </div>`;

  // Klik foto kecil -> ganti foto besar
  $("#galeri-mini").addEventListener("click", (e) => {
    const tombol = e.target.closest("button");
    if (!tombol) return;
    $("#foto-besar").src = tombol.dataset.foto;
    document.querySelectorAll("#galeri-mini button").forEach((b) => b.classList.toggle("aktif", b === tombol));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  try {
    const semua = await ambilProduk();
    const p = semua.find((x) => String(x.id) === id);
    if (!p) {
      $("#isi-produk").innerHTML =
        '<p class="kosong">Produk tidak ditemukan. <a href="katalog.html">Kembali ke katalog</a>.</p>';
      return;
    }
    tampilDetail(p);

    // Produk lain dari kategori yang sama (maksimal 4)
    const lain = semua.filter((x) => x.kategori === p.kategori && x.id !== p.id).slice(0, 4);
    if (lain.length) {
      $("#daftar-terkait").innerHTML = lain.map(kartuProduk).join("");
      $("#bagian-terkait").hidden = false;
    }
  } catch (e) {
    $("#isi-produk").innerHTML = '<p class="kosong">Produk belum bisa dimuat. Coba muat ulang halaman.</p>';
    console.error(e);
  }
});
