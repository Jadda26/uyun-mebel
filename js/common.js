/* =====================================================================
   common.js  –  FUNGSI YANG DIPAKAI SEMUA HALAMAN
   Isi file ini:
   1. Fungsi bantu kecil (format rupiah, aman dari kode berbahaya, dll)
   2. Pembuat link WhatsApp
   3. Pengambil data produk (dari Supabase, atau data contoh)
   4. Kartu produk (dipakai di beranda & katalog)
   5. Header, footer, dan tombol WhatsApp mengambang (otomatis dipasang)
   ===================================================================== */

/* ---------- 1. Fungsi bantu ---------- */

// Singkatan untuk mencari elemen HTML
const $ = (selektor, dalam = document) => dalam.querySelector(selektor);

// Mengamankan teks dari admin sebelum ditampilkan di halaman
function esc(teks) {
  return String(teks ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// 4500000 -> "Rp 4.500.000"
function rupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

// Teks harga untuk kartu/detail produk
function teksHarga(p) {
  if (p.harga === null || p.harga === undefined || p.harga === "") return "Hubungi kami untuk harga";
  return (p.harga_mulai_dari ? "Mulai dari " : "") + rupiah(p.harga);
}

// Foto utama = foto pertama; jika tidak ada pakai gambar pengganti
function fotoUtama(p) {
  return p.foto && p.foto.length ? p.foto[0] : "assets/placeholder.svg";
}

const NAMA_STATUS = { ready: "Ready", "pre-order": "Pre-order", habis: "Habis" };

/* ---------- 2. Link WhatsApp ---------- */

// Membuat link wa.me dengan pesan yang sudah terisi
function linkWA(pesan) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(pesan);
}

// Pesan otomatis untuk satu produk (memakai CONFIG.templatePesan)
function pesanProduk(p) {
  const urlProduk = new URL("produk.html?id=" + encodeURIComponent(p.id), document.baseURI).href;
  return CONFIG.templatePesan
    .replaceAll("{nama_produk}", p.nama)
    .replaceAll("{kategori}", p.kategori)
    .replaceAll("{url_produk}", urlProduk);
}

/* ---------- 3. Data produk ---------- */

// Mengambil semua produk yang ditampilkan (terbaru dulu).
// Jika Supabase belum diisi di config.js, dipakai data contoh.
async function ambilProduk() {
  if (!supabaseAktif()) return DEMO_PRODUK;
  const url = CONFIG.supabaseUrl + "/rest/v1/produk?select=*&tampil=eq.true&order=dibuat.desc";
  const res = await fetch(url, {
    headers: { apikey: CONFIG.supabaseKey, Authorization: "Bearer " + CONFIG.supabaseKey }
  });
  if (!res.ok) throw new Error("Gagal memuat produk (kode " + res.status + ")");
  return res.json();
}

/* ---------- 4. Kartu produk ---------- */

function kartuProduk(p) {
  const habis = p.status === "habis";
  return `
    <a class="kartu" href="produk.html?id=${encodeURIComponent(p.id)}">
      <div class="kartu-foto">
        <img src="${esc(fotoUtama(p))}" alt="${esc(p.nama)}" loading="lazy">
        <span class="lencana lencana-${esc(p.status)}">${esc(NAMA_STATUS[p.status] || p.status)}</span>
      </div>
      <div class="kartu-isi">
        <span class="kartu-kategori">${esc(p.kategori)}</span>
        <h3>${esc(p.nama)}</h3>
        <p class="kartu-harga${habis ? " coret" : ""}">${esc(teksHarga(p))}</p>
      </div>
    </a>`;
}

/* ---------- 5. Header, footer, tombol WA mengambang ---------- */

const MENU = [
  { file: "index.html", teks: "Beranda" },
  { file: "katalog.html", teks: "Katalog" },
  { file: "custom.html", teks: "Pesanan Custom" },
  { file: "kontak.html", teks: "Kontak" }
];

function pasangLayout() {
  const halaman = location.pathname.split("/").pop() || "index.html";
  const menuHTML = MENU.map(
    (m) => `<a href="${m.file}"${m.file === halaman ? ' class="aktif"' : ""}>${m.teks}</a>`
  ).join("");

  const header = $("#header");
  if (header) {
    header.innerHTML = `
      <div class="wadah bar">
        <a class="merek" href="index.html">
          <img src="assets/logo.svg" alt="Logo ${esc(CONFIG.namaUsaha)}" width="44" height="44">
          <span>${esc(CONFIG.namaUsaha)}</span>
        </a>
        <button class="tombol-menu" aria-label="Buka menu" aria-expanded="false">☰</button>
        <nav class="menu" id="menu">${menuHTML}</nav>
      </div>`;
    const tombol = $(".tombol-menu", header);
    tombol.addEventListener("click", () => {
      const buka = $("#menu").classList.toggle("buka");
      tombol.setAttribute("aria-expanded", buka);
    });
  }

  const s = CONFIG.sosial;
  const footer = $("#footer");
  if (footer) {
    footer.innerHTML = `
      <div class="wadah footer-isi">
        <div>
          <strong>${esc(CONFIG.namaUsaha)}</strong>
          <p>Kasur, sofa, dan mebel buatan sendiri. Bisa dipesan sesuai ukuran, bahan, dan warna keinginan Anda.</p>
        </div>
        <div>
          <strong>Hubungi kami</strong>
          <p>${esc(CONFIG.alamat)}<br>${esc(CONFIG.jamBuka)}</p>
          <p><a href="${linkWA("Halo Uyun Mebel, saya ingin bertanya.")}" target="_blank" rel="noopener">WhatsApp</a></p>
        </div>
        <div>
          <strong>Ikuti kami</strong>
          <p>
            <a href="https://instagram.com/${esc(s.instagram)}" target="_blank" rel="noopener">Instagram</a> ·
            <a href="https://tiktok.com/@${esc(s.tiktok)}" target="_blank" rel="noopener">TikTok</a> ·
            <a href="https://facebook.com/${esc(s.facebook)}" target="_blank" rel="noopener">Facebook</a>
          </p>
        </div>
      </div>
      <div class="hak-cipta">© ${new Date().getFullYear()} ${esc(CONFIG.namaUsaha)}</div>`;
  }

  // Tombol WhatsApp mengambang di pojok kanan bawah
  const wa = document.createElement("a");
  wa.className = "wa-mengambang";
  wa.href = linkWA("Halo Uyun Mebel, saya ingin bertanya.");
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Chat WhatsApp");
  wa.textContent = "Chat WhatsApp";
  document.body.appendChild(wa);
}

document.addEventListener("DOMContentLoaded", pasangLayout);
