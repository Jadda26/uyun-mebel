/* =====================================================================
   admin.js  –  PANEL ADMIN (dipakai oleh adminku/index.html)
   Isi file ini:
   1. Persiapan & login/logout
   2. Menampilkan daftar produk + kontrol cepat (status, tampil, unggulan)
   3. Formulir tambah/ubah produk (termasuk unggah & kompres foto)
   4. Hapus produk
   Keamanan: yang menentukan siapa boleh mengubah data adalah aturan di database
   (database/setup.sql), bukan halaman ini. Tanpa login, perubahan akan ditolak.
   ===================================================================== */

const BUCKET = "foto-produk"; // nama tempat penyimpanan foto di Supabase
let db = null;                // koneksi Supabase
let daftarProduk = [];        // produk yang sedang ditampilkan
let sedangEdit = null;        // id produk yang diubah (null = produk baru)
let fotoForm = [];            // link foto di formulir; yang pertama = foto utama

const $ = (s) => document.querySelector(s);
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

function tulisPesan(selektor, teks, sukses = false) {
  const el = $(selektor);
  el.textContent = teks;
  el.classList.toggle("ok", sukses);
}

/* ---------- 1. Persiapan & login ---------- */

async function mulai() {
  if (!supabaseAktif()) {
    $("#belum-siap").hidden = false;
    return;
  }
  db = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

  const { data } = await db.auth.getSession();
  if (data.session) tampilPanel();
  else $("#form-login").hidden = false;
}

$("#form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  tulisPesan("#pesan-login", "");
  // Username diubah menjadi email di balik layar (lihat config.js > domainAdmin)
  const username = $("#username").value.trim().toLowerCase();
  const { error } = await db.auth.signInWithPassword({
    email: username + "@" + CONFIG.domainAdmin,
    password: $("#password").value
  });
  if (error) {
    tulisPesan("#pesan-login", "Username atau password salah.");
    return;
  }
  $("#password").value = "";
  $("#form-login").hidden = true;
  tampilPanel();
});

$("#keluar").addEventListener("click", async () => {
  await db.auth.signOut();
  location.reload();
});

function tampilPanel() {
  $("#panel").hidden = false;
  muatProduk();
}

/* ---------- 2. Daftar produk ---------- */

async function muatProduk() {
  const { data, error } = await db.from("produk").select("*").order("dibuat", { ascending: false });
  if (error) {
    tulisPesan("#pesan-panel", "Gagal memuat produk: " + error.message);
    return;
  }
  daftarProduk = data;
  renderDaftar();
}

function renderDaftar() {
  if (!daftarProduk.length) {
    $("#daftar").innerHTML = '<p class="kosong">Belum ada produk. Tekan "+ Tambah produk" untuk mulai.</p>';
    return;
  }
  $("#daftar").innerHTML = daftarProduk.map((p) => `
    <div class="item${p.tampil ? "" : " tersembunyi"}" data-id="${esc(p.id)}">
      <img src="${esc(p.foto && p.foto.length ? p.foto[0] : "../assets/placeholder.svg")}" alt="">
      <div>
        <h3>${esc(p.nama)}</h3>
        <div class="info">${esc(p.kategori)} · ${p.harga != null ? (p.harga_mulai_dari ? "mulai dari " : "") + rupiah(p.harga) : "tanpa harga"}${p.tampil ? "" : " · DISEMBUNYIKAN"}</div>
      </div>
      <div class="kontrol">
        <select data-aksi="status" aria-label="Status">
          ${["ready", "pre-order", "habis"].map((s) => `<option value="${s}"${p.status === s ? " selected" : ""}>${s}</option>`).join("")}
        </select>
        <label><input type="checkbox" data-aksi="tampil"${p.tampil ? " checked" : ""}> Tampil</label>
        <label><input type="checkbox" data-aksi="unggulan"${p.unggulan ? " checked" : ""}> Unggulan</label>
        <button class="btn kecil" data-aksi="ubah">Ubah</button>
        <button class="btn kecil bahaya" data-aksi="hapus">Hapus</button>
      </div>
    </div>`).join("");
}

// Satu penangkap klik/ubah untuk semua kontrol di daftar
$("#daftar").addEventListener("change", async (e) => {
  const aksi = e.target.dataset.aksi;
  const id = e.target.closest(".item")?.dataset.id;
  if (!aksi || !id) return;
  const nilai = e.target.type === "checkbox" ? e.target.checked : e.target.value;
  const { error } = await db.from("produk").update({ [aksi]: nilai }).eq("id", id);
  if (error) tulisPesan("#pesan-panel", "Gagal menyimpan: " + error.message);
  else tulisPesan("#pesan-panel", "Tersimpan.", true);
  muatProduk();
});

$("#daftar").addEventListener("click", (e) => {
  const aksi = e.target.dataset.aksi;
  const id = e.target.closest(".item")?.dataset.id;
  if (aksi === "ubah") bukaForm(daftarProduk.find((p) => p.id === id));
  if (aksi === "hapus") hapusProduk(daftarProduk.find((p) => p.id === id));
});

/* ---------- 3. Formulir tambah / ubah ---------- */

$("#tambah").addEventListener("click", () => bukaForm(null));
$("#batal").addEventListener("click", () => ($("#lapisan").hidden = true));

function bukaForm(p) {
  sedangEdit = p ? p.id : null;
  $("#judul-form").textContent = p ? "Ubah Produk" : "Tambah Produk";
  $("#f-nama").value = p?.nama ?? "";
  $("#f-kategori").value = p?.kategori ?? "kasur";
  $("#f-status").value = p?.status ?? "ready";
  $("#f-harga").value = p?.harga ?? "";
  $("#f-mulai").checked = p?.harga_mulai_dari ?? false;
  $("#f-ukuran").value = p?.ukuran ?? "";
  $("#f-warna").value = p?.warna ?? "";
  $("#f-bahan").value = p?.bahan ?? "";
  $("#f-deskripsi").value = p?.deskripsi ?? "";
  $("#f-unggulan").checked = p?.unggulan ?? false;
  $("#f-tampil").checked = p?.tampil ?? true;
  $("#f-foto").value = "";
  fotoForm = p?.foto ? [...p.foto] : [];
  tulisPesan("#pesan-form", "");
  renderFoto();
  $("#lapisan").hidden = false;
}

function renderFoto() {
  $("#foto-daftar").innerHTML = fotoForm.map((url, i) => `
    <div class="foto-kotak${i === 0 ? " utama" : ""}">
      <img src="${esc(url)}" alt="">
      ${i === 0 ? '<span class="tanda">Utama</span>' : ""}
      <div class="aksi-foto">
        ${i > 0 ? `<button type="button" data-foto="utama" data-i="${i}">Utama</button>` : ""}
        <button type="button" data-foto="hapus" data-i="${i}">Hapus</button>
      </div>
    </div>`).join("");
}

$("#foto-daftar").addEventListener("click", (e) => {
  const jenis = e.target.dataset.foto;
  const i = Number(e.target.dataset.i);
  if (jenis === "hapus") fotoForm.splice(i, 1);
  if (jenis === "utama") fotoForm.unshift(fotoForm.splice(i, 1)[0]);
  if (jenis) renderFoto();
});

// Mengecilkan foto (maks 1200 piksel) dan mengubahnya ke WebP supaya website cepat
// meskipun foto asli dari HP berukuran besar.
function kompresGambar(file, maks = 1200) {
  return new Promise((selesai, gagal) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const skala = Math.min(1, maks / Math.max(img.width, img.height));
      const kanvas = document.createElement("canvas");
      kanvas.width = Math.round(img.width * skala);
      kanvas.height = Math.round(img.height * skala);
      kanvas.getContext("2d").drawImage(img, 0, 0, kanvas.width, kanvas.height);
      URL.revokeObjectURL(url);
      kanvas.toBlob((b) => (b ? selesai(b) : gagal(new Error("Foto gagal diproses"))), "image/webp", 0.8);
    };
    img.onerror = () => gagal(new Error("Foto tidak bisa dibaca: " + file.name));
    img.src = url;
  });
}

async function unggahFoto(file) {
  const blob = await kompresGambar(file);
  const ekstensi = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg" }[blob.type] || "jpg";
  const nama = crypto.randomUUID() + "." + ekstensi;
  const { error } = await db.storage.from(BUCKET).upload(nama, blob, { contentType: blob.type });
  if (error) throw error;
  return db.storage.from(BUCKET).getPublicUrl(nama).data.publicUrl;
}

$("#form-produk").addEventListener("submit", async (e) => {
  e.preventDefault();
  const tombol = $("#simpan");
  tombol.disabled = true;
  tulisPesan("#pesan-form", "Menyimpan…", true);

  try {
    // Unggah foto baru (jika ada) lalu tambahkan ke daftar foto
    for (const file of $("#f-foto").files) {
      tulisPesan("#pesan-form", "Mengunggah foto " + file.name + "…", true);
      fotoForm.push(await unggahFoto(file));
    }

    const hargaMentah = $("#f-harga").value;
    const data = {
      nama: $("#f-nama").value.trim(),
      kategori: $("#f-kategori").value,
      status: $("#f-status").value,
      harga: hargaMentah === "" ? null : Number(hargaMentah),
      harga_mulai_dari: $("#f-mulai").checked,
      ukuran: $("#f-ukuran").value.trim() || null,
      warna: $("#f-warna").value.trim() || null,
      bahan: $("#f-bahan").value.trim() || null,
      deskripsi: $("#f-deskripsi").value.trim() || null,
      foto: fotoForm,
      unggulan: $("#f-unggulan").checked,
      tampil: $("#f-tampil").checked
    };

    const { error } = sedangEdit
      ? await db.from("produk").update(data).eq("id", sedangEdit)
      : await db.from("produk").insert(data);
    if (error) throw error;

    $("#lapisan").hidden = true;
    tulisPesan("#pesan-panel", "Produk tersimpan.", true);
    muatProduk();
  } catch (err) {
    tulisPesan("#pesan-form", "Gagal menyimpan: " + (err.message || err));
  } finally {
    tombol.disabled = false;
  }
});

/* ---------- 4. Hapus produk ---------- */

async function hapusProduk(p) {
  if (!p || !confirm('Hapus produk "' + p.nama + '"? Tindakan ini tidak bisa dibatalkan.')) return;

  const { error } = await db.from("produk").delete().eq("id", p.id);
  if (error) {
    tulisPesan("#pesan-panel", "Gagal menghapus: " + error.message);
    return;
  }
  // Hapus juga file fotonya agar penyimpanan tidak penuh
  const namaFile = (p.foto || []).map((u) => u.split("/" + BUCKET + "/")[1]).filter(Boolean);
  if (namaFile.length) await db.storage.from(BUCKET).remove(namaFile);

  tulisPesan("#pesan-panel", "Produk dihapus.", true);
  muatProduk();
}

mulai();
