(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* Terapkan konfigurasi ke halaman */
  document.documentElement.style.setProperty("--main", C.WARNA_UTAMA || "#0B3B6F");
  document.documentElement.style.setProperty("--aksen", C.WARNA_AKSEN || "#F26B1D");
  document.title = (C.NAMA_INSTANSI || "Portal Pelayanan");

  var logo = $("#logo");
  if (C.LOGO_URL) {
    logo.innerHTML = '<img src="' + esc(C.LOGO_URL) + '" alt="Logo ' + esc(C.NAMA_INSTANSI) + '">';
  } else {
    logo.textContent = (C.NAMA_SINGKAT || "PP").slice(0, 3);
  }
  $("#namaSingkat").textContent = C.NAMA_SINGKAT || "";
  $("#namaPanjang").textContent = C.NAMA_INSTANSI || "";
  $("#tagline").textContent = C.TAGLINE || "";
  $("#alamat").textContent = C.ALAMAT || "";
  $("#jam").textContent = C.JAM_LAYANAN || "";
  $("#telepon").textContent = C.TELEPON || "";
  $("#email").textContent = C.EMAIL || "";
  $("#footNama").textContent = "© " + new Date().getFullYear() + " " + (C.NAMA_INSTANSI || "");

  /* Daftar layanan dengan filter kategori */
  var layanan = C.LAYANAN || [];
  var kategori = ["Semua"];
  layanan.forEach(function (l) { if (kategori.indexOf(l.kategori) < 0) kategori.push(l.kategori); });

  function renderLayanan(filter) {
    var list = layanan.filter(function (l) { return filter === "Semua" || l.kategori === filter; });
    $("#daftarLayanan").innerHTML = list.map(function (l, i) {
      return '<article class="item" style="animation-delay:' + (i * 40) + 'ms">' +
        '<span class="tag">' + esc(l.kategori) + "</span>" +
        "<h3>" + esc(l.nama) + "</h3>" +
        "<p>" + esc(l.deskripsi) + "</p>" +
        '<div class="meta"><span>' + esc(l.tarif) + "</span><span>" + esc(l.durasi) + "</span></div>" +
        "</article>";
    }).join("") || '<p class="msg">Belum ada layanan di kategori ini.</p>';
  }

  $("#filters").innerHTML = kategori.map(function (k) {
    return '<button type="button" aria-pressed="' + (k === "Semua") + '" data-k="' + esc(k) + '">' + esc(k) + "</button>";
  }).join("");
  $("#filters").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-k]");
    if (!b) return;
    Array.prototype.forEach.call($("#filters").querySelectorAll("button"), function (x) {
      x.setAttribute("aria-pressed", x === b ? "true" : "false");
    });
    renderLayanan(b.getAttribute("data-k"));
  });
  renderLayanan("Semua");

  /* Pendaftaran */
  function validEmail(v) { return /^\S+@\S+\.\S+$/.test(v); }

  $("#formDaftar").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, msg = $("#msgDaftar"), ok = true, data = {};
    Array.prototype.forEach.call(f.querySelectorAll("input,select"), function (el) {
      var bad = !el.value || (el.type === "email" && !validEmail(el.value));
      el.classList.toggle("bad", bad);
      if (bad) ok = false;
      data[el.name] = el.value;
    });
    if (!ok) { msg.className = "msg err"; msg.textContent = "Lengkapi kolom yang belum benar."; return; }

    if (!C.API_URL) {
      msg.className = "msg err";
      msg.textContent = "Layanan pendaftaran belum tersambung. Isi API_URL di config.js.";
      return;
    }
    msg.className = "msg"; msg.textContent = "Mengirim...";
    fetch(C.API_URL + "/pendaftaran", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error("gagal");
      return r.json();
    }).then(function (j) {
      msg.className = "msg ok";
      msg.textContent = "Pendaftaran diterima. Nomor pendaftaran: " + (j.nomor || "-");
      f.reset();
    }).catch(function () {
      msg.className = "msg err";
      msg.textContent = "Pendaftaran belum bisa dikirim. Coba lagi atau hubungi kami.";
    });
  });

  /* Cek status */
  $("#formStatus").addEventListener("submit", function (e) {
    e.preventDefault();
    var no = e.target.no.value.trim(), msg = $("#msgStatus");
    if (!no) { msg.className = "msg err"; msg.textContent = "Masukkan nomor pendaftaran."; return; }
    if (!C.API_URL) {
      msg.className = "msg err";
      msg.textContent = "Cek status belum tersambung. Isi API_URL di config.js.";
      return;
    }
    msg.className = "msg"; msg.textContent = "Memeriksa...";
    fetch(C.API_URL + "/status?no=" + encodeURIComponent(no))
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (j) { msg.className = "msg ok"; msg.textContent = "Status: " + (j.status || "-"); })
      .catch(function () { msg.className = "msg err"; msg.textContent = "Nomor tidak ditemukan atau layanan sedang gangguan."; });
  });
})();
