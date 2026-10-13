/* =====================================================================
   kontak.js  –  ISI HALAMAN KONTAK (diambil dari js/config.js)
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const s = CONFIG.sosial;
  $("#wa-kontak").href = linkWA("Halo " + CONFIG.namaUsaha + ", saya ingin bertanya.");
  $("#alamat").textContent = CONFIG.alamat;
  $("#jam").textContent = "Jam buka: " + CONFIG.jamBuka;
  $("#peta").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.alamat);
  $("#area-layanan").textContent = CONFIG.areaLayanan;
  $("#sosial").innerHTML = `
    <a href="https://instagram.com/${esc(s.instagram)}" target="_blank" rel="noopener">Instagram @${esc(s.instagram)}</a><br>
    <a href="https://tiktok.com/@${esc(s.tiktok)}" target="_blank" rel="noopener">TikTok @${esc(s.tiktok)}</a><br>
    <a href="https://facebook.com/${esc(s.facebook)}" target="_blank" rel="noopener">Facebook ${esc(s.facebook)}</a>`;
});
