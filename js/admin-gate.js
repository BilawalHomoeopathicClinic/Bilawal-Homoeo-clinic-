/* ==========================================================================
   Doctor sign-in for the manager pages (admin, offers, blog, timings).
   Uses the same Firebase login as reviews-admin.html. The page stays hidden
   until the doctor signs in. Needs js/config.js and js/firebase.js first.

   Note: these pages only make files for you to download. They cannot change
   the live website, so this lock is a convenience, not the website's security.
   ========================================================================== */
(function () {
  "use strict";
  var DB = window.CLINIC_DB;
  var main = document.querySelector("main.adm");
  if (!main) return;

  var style = document.createElement("style");
  style.textContent =
    ".adm-locked main.adm > *:not(.adm-gate) { display: none !important; }" +
    ".adm-gate { max-width: 30rem; margin: 3rem auto 0; }" +
    ".adm-gate h2 { font-size: var(--step-2); }" +
    ".adm-bar { display: flex; flex-wrap: wrap; gap: .6rem 1rem; align-items: center; justify-content: space-between; margin-bottom: 1.4rem; padding: .7rem 1.1rem; background: #fff; border: 1px solid var(--line); border-radius: var(--r-m); font-size: var(--step--1); }" +
    ".adm-bar button { padding: .5rem 1rem; border-radius: 999px; border: 1.5px solid var(--line); background: transparent; color: var(--pine); font-weight: 600; cursor: pointer; }" +
    ".adm-bar button:hover { border-color: var(--pine); }";
  document.head.appendChild(style);

  /* If sign-in is not set up at all, do not lock the doctor out */
  if (!DB || !DB.enabled) {
    var warn = document.createElement("div");
    warn.className = "adm-bar";
    warn.textContent = "Sign-in is not switched on yet (Firebase settings are missing), so this page is open to anyone who has the file.";
    main.insertBefore(warn, main.firstChild);
    return;
  }

  document.documentElement.classList.add("adm-locked");

  var gate = document.createElement("section");
  gate.className = "panel adm-gate";
  gate.innerHTML =
    "<h2>Doctor sign in</h2>" +
    '<form class="form" novalidate>' +
    '<div class="field"><label for="gate-em">Email</label><input id="gate-em" type="email" autocomplete="username" required></div>' +
    '<div class="field"><label for="gate-pw">Password</label><input id="gate-pw" type="password" autocomplete="current-password" required></div>' +
    '<button class="btn btn--pine" type="submit">Sign in</button>' +
    '<p class="form__err" role="alert" hidden></p>' +
    '<p class="form__note" id="gate-wait">Checking sign-in...</p>' +
    "</form>";
  main.appendChild(gate);

  var bar = document.createElement("div");
  bar.className = "adm-bar";
  bar.hidden = true;
  bar.innerHTML = '<span>Signed in as <b></b></span><button type="button">Sign out</button>';
  main.insertBefore(bar, main.firstChild);

  var form = gate.querySelector("form");
  var err = gate.querySelector(".form__err");
  var submit = form.querySelector("button");

  function explain(e) {
    var code = (e && e.code) || "";
    if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(code)) return "Sign in failed. Check the email and password.";
    if (/too-many-requests/.test(code)) return "Too many attempts. Please wait a few minutes and try again.";
    if (/operation-not-supported|web-storage/.test(code)) return "This browser cannot sign in when the page is opened straight from a file. Open the website through its address (or a local server) instead.";
    if (/network/.test(code)) return "No internet connection. Check your connection and try again.";
    return "Sign in failed" + (code ? " (" + code + ")" : "") + ".";
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    err.hidden = true;
    submit.disabled = true;
    DB.signIn(gate.querySelector("#gate-em").value.trim(), gate.querySelector("#gate-pw").value).catch(function (e) {
      err.textContent = explain(e);
      err.hidden = false;
    }).then(function () { submit.disabled = false; });
  });
  bar.querySelector("button").addEventListener("click", function () { DB.signOut(); });

  DB.onAuth(function (user) {
    var wait = gate.querySelector("#gate-wait");
    if (wait) wait.hidden = true;
    if (user) {
      document.documentElement.classList.remove("adm-locked");
      gate.hidden = true;
      bar.hidden = false;
      bar.querySelector("b").textContent = user.email || "the doctor";
    } else {
      document.documentElement.classList.add("adm-locked");
      gate.hidden = false;
      bar.hidden = true;
    }
  }).catch(function (e) {
    var wait = gate.querySelector("#gate-wait");
    if (wait) wait.hidden = true;
    err.textContent = explain(e);
    err.hidden = false;
  });
})();
