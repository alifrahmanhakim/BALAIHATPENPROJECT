// Lapisan Firebase: Authentication, Firestore, dan Storage.
// Dimuat oleh index.html hanya jika firebase-config.js sudah diisi.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, onSnapshot, setDoc, updateDoc, addDoc, getDoc,
  query, where, orderBy, limit, serverTimestamp, runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytesResumable, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

export function createBridge(config, h) {
  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const api = { ready: false, uid: null, role: null };
  let priv = [];
  const docsOf = s => s.docs.map(d => ({ id: d.id, ...d.data() }));
  const stopPriv = () => { priv.forEach(u => u()); priv = []; };

  // Data publik: layanan, dokter, kuota, dan profil klinik (dibaca tanpa login).
  onSnapshot(collection(db, "services"), s => h.onCollection("services", docsOf(s)), e => h.onError("Layanan: " + e.code));
  onSnapshot(collection(db, "doctors"), s => h.onCollection("doctors", docsOf(s)), e => h.onError("Dokter: " + e.code));
  onSnapshot(collection(db, "quota"), s => h.onCollection("quota", docsOf(s)), e => h.onError("Kuota: " + e.code));
  onSnapshot(doc(db, "config", "clinic"),
    s => h.onCollection("clinic", s.exists() ? [{ id: "clinic", ...s.data() }] : []),
    e => h.onError("Profil klinik: " + e.code));
  api.ready = true;

  // Data pribadi: pasien hanya melihat miliknya, staf melihat semua.
  function startPriv(role, uid) {
    stopPriv();
    const pq = role === "patient"
      ? query(collection(db, "patients"), where("owner", "==", uid))
      : collection(db, "patients");
    priv.push(onSnapshot(pq, s => h.onCollection("patients", docsOf(s)), e => h.onError("Pendaftaran: " + e.code)));
    if (role === "patient") return;
    priv.push(onSnapshot(query(collection(db, "logs"), orderBy("createdAt", "desc"), limit(30)),
      s => h.onCollection("logs", docsOf(s)), () => {}));
    if (role === "admin") {
      priv.push(onSnapshot(collection(db, "users"), s => h.onCollection("users", docsOf(s)), () => {}));
    }
  }

  onAuthStateChanged(auth, async user => {
    if (!user) { api.uid = null; api.role = null; stopPriv(); h.onAuth(null, null); return; }
    api.uid = user.uid;
    const ref0 = doc(db, "users", user.uid);
    let snap = await getDoc(ref0);
    if (!snap.exists()) {
      await setDoc(ref0, { role: "patient", name: user.displayName || user.email || "", email: user.email || "", active: true, createdAt: serverTimestamp() }, { merge: true });
      snap = await getDoc(ref0);
    }
    const prof = { uid: user.uid, ...snap.data() };
    api.role = ["patient", "assessor", "admin"].includes(prof.role) ? prof.role : "patient";
    h.onAuth(user, prof);
    startPriv(api.role, user.uid);
  });

  // Autentikasi
  api.signIn = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
  api.signUp = async (name, email, pw) => {
    const c = await createUserWithEmailAndPassword(auth, email, pw);
    await updateProfile(c.user, { displayName: name });
    await setDoc(doc(db, "users", c.user.uid), { role: "patient", name, email, active: true, createdAt: serverTimestamp() }, { merge: true });
  };
  api.signOut = () => signOut(auth);
  api.resetPassword = email => sendPasswordResetEmail(auth, email);

  // Pengguna dan log
  api.updateUser = (uid, data) => updateDoc(doc(db, "users", uid), data);
  api.addLog = e => addDoc(collection(db, "logs"), { t: e.t, x: e.x, createdAt: serverTimestamp() });

  // Kuota: n = kapasitas, used = terpakai. Pendaftaran menaikkan used lewat transaksi.
  api.createBooking = (date, rec) => runTransaction(db, async tx => {
    const r = doc(db, "quota", date);
    const s = await tx.get(r);
    const d = s.exists() ? s.data() : { n: 12, used: 0 };
    if ((d.used || 0) >= (d.n || 12)) throw new Error("penuh");
    if (s.exists()) tx.update(r, { used: (d.used || 0) + 1 });
    else tx.set(r, { n: 12, used: 1 });
    tx.set(doc(db, "patients", rec.id), rec);
  });
  async function setQuota(date, n) {
    const r = doc(db, "quota", date);
    await runTransaction(db, async tx => {
      const s = await tx.get(r);
      if (s.exists()) tx.update(r, { n });
      else tx.set(r, { n, used: 0 });
    });
  }

  // Tulis perubahan dari antarmuka (dicek berkala oleh syncWrites di halaman)
  api.write = async ops => {
    for (const o of ops) {
      try {
        if (o.op === "quota") await setQuota(o.id, o.data.n);
        else if (o.op === "update") await updateDoc(doc(db, o.col, o.id), o.data);
        else await setDoc(doc(db, o.col, o.id), o.data);
      } catch (e) {
        h.onError("Gagal menyimpan " + o.col + " " + o.id + ": " + (e.code || e.message));
      }
    }
  };

  // Unggahan berkas (foto dokumen, gambar hasil pemeriksaan)
  api.upload = (path, file, onPct) => new Promise((resolve, reject) => {
    const r = ref(storage, path);
    const task = uploadBytesResumable(r, file, { contentType: file.type });
    task.on("state_changed",
      s => { if (onPct && s.totalBytes) onPct(Math.round(s.bytesTransferred / s.totalBytes * 100)); },
      reject,
      async () => resolve({ url: await getDownloadURL(task.snapshot.ref), path }));
  });

  return api;
}
