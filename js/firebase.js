/* ==========================================================================
   Live patient reviews on Firebase Firestore (free "Spark" plan is enough).
   Switched on only when js/config.js has Firebase settings; otherwise
   window.CLINIC_DB.enabled is false and the site falls back to js/reviews.js.

   Firestore collection: "reviews"
     { name, rating (1-5), text, tag (optional), createdAt (server time) }
   Rules (see the private guide) let anyone read and create, but only the signed-in
   doctor can delete.
   ========================================================================== */
window.CLINIC_DB = (function () {
  "use strict";
  var cfg = (window.SITE && window.SITE.firebase) || {};
  var enabled = !!(cfg.apiKey && cfg.projectId);
  var BASE = "https://www.gstatic.com/firebasejs/10.14.1/";
  var cache = {};

  function load(file) { return cache[file] || (cache[file] = import(BASE + file)); }
  function app() {
    return cache.app || (cache.app = load("firebase-app.js").then(function (m) { return m.initializeApp(cfg); }));
  }
  function firestore() {
    return Promise.all([app(), load("firebase-firestore.js")]).then(function (r) { return { db: r[1].getFirestore(r[0]), fs: r[1] }; });
  }
  function auth() {
    return Promise.all([app(), load("firebase-auth.js")]).then(function (r) { return { auth: r[1].getAuth(r[0]), a: r[1] }; });
  }

  function listReviews(max) {
    return firestore().then(function (x) {
      var q = x.fs.query(x.fs.collection(x.db, "reviews"), x.fs.orderBy("createdAt", "desc"), x.fs.limit(max || 60));
      return x.fs.getDocs(q).then(function (snap) {
        return snap.docs.map(function (d) {
          var v = d.data();
          /* data from the database is untrusted: force plain strings and sensible lengths */
          return { id: d.id, name: String(v.name == null ? "" : v.name).slice(0, 60), rating: Math.min(5, Math.max(1, parseInt(v.rating, 10) || 5)), text: String(v.text == null ? "" : v.text).slice(0, 600), tag: typeof v.tag === "string" ? v.tag.slice(0, 20) : "", ms: v.createdAt && v.createdAt.toMillis ? v.createdAt.toMillis() : 0, live: true };
        });
      });
    });
  }
  function addReview(r) {
    return firestore().then(function (x) {
      var data = { name: r.name, rating: r.rating, text: r.text, createdAt: x.fs.serverTimestamp() };
      if (r.tag) data.tag = r.tag;
      return x.fs.addDoc(x.fs.collection(x.db, "reviews"), data);
    });
  }
  function deleteReview(id) {
    return firestore().then(function (x) { return x.fs.deleteDoc(x.fs.doc(x.db, "reviews", id)); });
  }
  function signIn(email, password) {
    return auth().then(function (x) { return x.a.signInWithEmailAndPassword(x.auth, email, password); });
  }
  function signOut() {
    return auth().then(function (x) { return x.a.signOut(x.auth); });
  }
  function onAuth(cb) {
    return auth().then(function (x) { return x.a.onAuthStateChanged(x.auth, cb); });
  }

  return { enabled: enabled, listReviews: listReviews, addReview: addReview, deleteReview: deleteReview, signIn: signIn, signOut: signOut, onAuth: onAuth };
})();
