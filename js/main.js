/* ==========================================================================
   Shared behaviour: icons, config binding, language, header, data-driven
   sections (offers, doctors, blog, reviews), sliders, forms, thank-you page.
   Plain JS, no build step. Needs config.js, i18n.js and the data files first.
   ========================================================================== */
(function () {
  "use strict";
  const S = window.SITE || {};
  const I = window.I18N || { isUr: false, t: (x) => x, pick: (o, f) => o[f], apply() {}, setLang() {} };
  const UR = I.isUr;
  const t = I.t;
  const pick = I.pick;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LOCALE = UR ? "ur-PK" : "en-GB";
  const params = new URLSearchParams(location.search);

  /* ---------- Icons (inline so pages also work from file://) ---------- */
  const ICONS = {
    leaf: '<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14z"/><path d="M5 19l8-8"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    child: '<circle cx="12" cy="7" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/>',
    skin: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M19 17l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    lungs: '<path d="M12 4v9"/><path d="M12 8c-2-1-6 1-6 6 0 3 1 5 3 5 2 0 3-2 3-4"/><path d="M12 8c2-1 6 1 6 6 0 3-1 5-3 5-2 0-3-2-3-4"/>',
    pulse: '<path d="M3 12h3l2-5 4 10 3-8 2 3h4"/>',
    gut: '<path d="M8 4c4 0 4 4 0 4s-4 4 0 4 8 0 8 4-4 4-8 4"/>',
    joint: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 8l8 8"/>',
    female: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8.3 18.8z"/><path d="M9.2 8.6c-.3 2.4 2.8 5.9 5.9 6.1l1-1.6-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    star: '<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4-5.7-3.1-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-2 4-3 6s-1 4-3.5 4A3.5 3.5 0 0 1 7 15.5"/><path d="M11 9a1.5 1.5 0 0 1 3 0"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
  };
  const DIRECTIONAL = { arrow: 1 };
  function injectIcons(root) {
    $$("i[data-icon]", root).forEach((el) => {
      const d = ICONS[el.dataset.icon];
      if (!d) return;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("class", "i" + (DIRECTIONAL[el.dataset.icon] ? " i--dir" : ""));
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = d;
      el.replaceWith(svg);
    });
  }

  /* ---------- Date and time helpers ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  const todayStr = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  const asDate = (s) => new Date(s + "T00:00:00");
  const fmtDate = (s, long) => asDate(s).toLocaleDateString(LOCALE, { day: "numeric", month: long ? "long" : "short", year: "numeric" });
  const daysBetween = (a, b) => Math.round((asDate(b) - asDate(a)) / 86400000);
  function urPeriod(h, ap) {
    h = +h;
    if (ap === "am") return "صبح";
    if (h === 12 || h <= 4) return "دوپہر";
    return h <= 8 ? "شام" : "رات";
  }
  /* "10:00 am – 6:00 pm" -> Urdu wording; leaves anything else untouched */
  function fmtHours(s) {
    if (!UR) return s;
    const m = /^(\d{1,2}):(\d{2})\s*(am|pm)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(s.trim());
    if (!m) return t(s);
    const [, h1, m1, a1, h2, m2, a2] = m;
    return urPeriod(h1, a1.toLowerCase()) + " " + h1 + ":" + m1 + " تا " + urPeriod(h2, a2.toLowerCase()) + " " + h2 + ":" + m2;
  }

  /* ---------- Config binding (phone, email, address, hours, map) ---------- */
  ["clinic", "tagline", "phone", "email", "address"].forEach((key) => {
    const v = UR && S[key + "Ur"] ? S[key + "Ur"] : S[key];
    if (!v) return;
    $$('[data-cfg="' + key + '"]').forEach((el) => {
      el.textContent = v;
      if (key === "phone" || key === "email") el.setAttribute("dir", "ltr");
    });
  });
  $$("[data-cfg-href]").forEach((el) => {
    const k = el.dataset.cfgHref;
    if (k === "tel" && S.phoneRaw) el.href = "tel:" + S.phoneRaw;
    if (k === "mail" && S.email) el.href = "mailto:" + S.email;
    if (k === "wa" && S.whatsapp) el.href = "https://wa.me/" + S.whatsapp;
  });
  const hourIndexForDay = (d) => (d === 0 ? 6 : d - 1);
  $$("[data-hours]").forEach((ul) => {
    ul.innerHTML = ((window.TIMINGS && window.TIMINGS.hours) || S.hours || [])
      .map((h, i) => '<li class="' + (i === hourIndexForDay(now.getDay()) ? "is-today" : "") + '"><span>' + esc(t(h.day)) + "</span><span>" + esc(fmtHours(h.time)) + "</span></li>")
      .join("");
  });
  const mapQ = encodeURIComponent(S.mapQuery || S.address || "");
  $$("[data-map]").forEach((box) => {
    const frame = $("iframe", box), link = $("a", box);
    if (frame) frame.src = "https://www.google.com/maps?q=" + mapQ + "&hl=" + (UR ? "ur" : "en") + "&output=embed";
    if (link) link.href = S.mapLink || "https://www.google.com/maps/search/?api=1&query=" + mapQ;
  });
  $$("[data-directions]").forEach((a) => { a.href = "https://www.google.com/maps/dir/?api=1&destination=" + mapQ; });

  /* ---------- Language toggle ---------- */
  $$("[data-lang-toggle]").forEach((b) => {
    b.innerHTML = UR ? "English" : '<span lang="ur">اردو</span>';
    b.setAttribute("aria-label", UR ? "Switch to English" : "اردو میں دیکھیں (Switch to Urdu)");
    b.addEventListener("click", () => I.setLang(UR ? "en" : "ur"));
  });

  /* ---------- Offers (js/offers.js) ---------- */
  const offerState = (o) => (o.end && todayStr > o.end ? "expired" : o.start && todayStr < o.start ? "soon" : "live");
  const allOffers = (window.OFFERS || []).map((o) => ({ ...o, state: offerState(o) })).filter((o) => o.state !== "expired");
  const liveOffers = allOffers.filter((o) => o.state === "live").sort((a, b) => (a.end || "9999").localeCompare(b.end || "9999"));
  const soonOffers = allOffers.filter((o) => o.state === "soon").sort((a, b) => a.start.localeCompare(b.start));
  const shownOffers = liveOffers.concat(soonOffers);
  const lowerFirst = (s) => (!UR && /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

  function validText(o) {
    if (o.state === "soon") return (UR ? "آغاز: " : "Starts ") + fmtDate(o.start);
    if (!o.end) return "";
    const left = daysBetween(todayStr, o.end);
    if (UR) return "درست تا " + fmtDate(o.end) + (left === 0 ? " (آخری دن)" : left <= 14 ? " (" + left + " دن باقی)" : "");
    return "Valid until " + fmtDate(o.end) + (left === 0 ? " (last day)" : left <= 14 ? " (" + left + " day" + (left === 1 ? "" : "s") + " left)" : "");
  }
  /* Picture behind the top band of an offer card. picture is one of the ready-made keys
     (files in img/offers), the path of the doctor's own image, "" for none, or left out for automatic. */
  const OFFER_PICS = { camp: "75% 62%", children: "72% 68%", seniors: "68% 55%", women: "70% 45%", general: "82% 60%" };
  function offerPic(o) {
    const k = o.picture === undefined ? (o.type === "camp" ? "camp" : "general") : String(o.picture).trim();
    if (OFFER_PICS[k]) return { src: "img/offers/" + k + ".jpg", pos: OFFER_PICS[k] };
    if (/\.(jpe?g|png|webp|avif)$/i.test(k)) return { src: k.replace(/^\/+/, ""), pos: "70% 50%" };
    return null;
  }
  function offerCard(o, i) {
    const camp = o.type === "camp";
    const pic = offerPic(o);
    const badge = camp ? "<b>" + t("FREE") + "</b><span>" + t("health camp") + "</span>" : "<b>" + esc(o.percent) + "%</b><span>" + t("off") + "</span>";
    const audience = pick(o, "audience") || t("everyone");
    const meta = camp
      ? '<ul class="offer__meta">' +
        (o.date ? '<li><i data-icon="calendar"></i>' + esc(fmtDate(o.date)) + "</li>" : "") +
        (o.time ? '<li><i data-icon="clock"></i>' + esc(fmtHours(pick(o, "time"))) + "</li>" : "") +
        (o.venue ? '<li><i data-icon="pin"></i>' + esc(pick(o, "venue")) + "</li>" : "") + "</ul>"
      : "";
    const valid = validText(o);
    return (
      '<article class="offer offer--' + (camp ? "camp" : "discount") + (o.state === "soon" ? " offer--soon" : "") + '" data-tilt="5" data-reveal style="--i:' + i + '">' +
      '<div class="offer__badge' + (pic ? " offer__badge--photo" : "") + '">' +
      (pic ? '<img src="' + esc(pic.src) + '" alt="" loading="lazy" style="object-position:' + pic.pos + '" data-fallback="badge">' : "") + badge + "</div>" +
      '<div class="offer__body"><span class="kicker">' + (UR ? "برائے " + esc(audience) : "For " + esc(lowerFirst(audience))) + "</span>" +
      "<h3>" + esc(pick(o, "title")) + "</h3><p>" + esc(pick(o, "description")) + "</p>" + meta +
      (valid ? '<p class="offer__valid">' + esc(valid) + "</p>" : "") +
      '<a class="btn btn--pine btn--sm" href="appointment.html?offer=' + encodeURIComponent(o.id) + '">' + t(camp ? "Reserve a place" : "Claim this offer") + ' <i data-icon="arrow"></i></a>' +
      (pick(o, "terms") ? '<p class="offer__terms">' + esc(pick(o, "terms")) + "</p>" : "") + "</div></article>"
    );
  }
  $$("[data-offers]").forEach((box) => {
    const list = shownOffers.slice(0, parseInt(box.dataset.limit, 10) || shownOffers.length);
    if (!list.length) {
      if (box.hasAttribute("data-hide-empty")) { const sec = box.closest("section"); if (sec) sec.hidden = true; return; }
      box.innerHTML = '<div class="offers-empty"><h3>' + t("No offers running right now") + "</h3><p>" + t("New offers and free camps are announced here first. Message the clinic on WhatsApp to hear about the next one.") + "</p></div>";
      box.classList.remove("offers");
      return;
    }
    box.innerHTML = list.map(offerCard).join("");
  });
  $$("[data-offer-bar]").forEach((bar) => {
    const o = liveOffers[0];
    if (!o) return;
    const who = pick(o, "audience") || t("everyone");
    const what = UR
      ? (o.type === "camp" ? "مفت ہیلتھ کیمپ: " + who : o.percent + "% رعایت: " + who)
      : (o.type === "camp" ? "Free health camp for " + lowerFirst(who) : o.percent + "% off for " + lowerFirst(who));
    bar.innerHTML = '<a href="offers.html"><span>' + esc(what) + "</span><span>" + t("See offers") + "</span></a>";
    bar.hidden = false;
  });
  $$("[data-offer-select]").forEach((sel) => {
    shownOffers.forEach((o) => {
      const opt = document.createElement("option");
      opt.value = o.id;
      opt.textContent = (o.type === "camp" ? t("Free camp") + ": " : o.percent + "% " + t("off") + ": ") + pick(o, "title");
      sel.appendChild(opt);
    });
    const p = params.get("offer");
    if (p && shownOffers.some((o) => o.id === p)) sel.value = p;
  });

  /* ---------- Doctors (js/doctors.js) ---------- */
  /* availability text comes from js/timings.js when it has an entry for the doctor */
  const TIM = (window.TIMINGS && window.TIMINGS.doctors) || {};
  const DOCS = (window.DOCTORS || []).map((d) => (Object.prototype.hasOwnProperty.call(TIM, d.id) ? { ...d, timing: TIM[d.id] } : d));
  function doctorCard(d, i, compact) {
    const name = pick(d, "name");
    const focus = (UR && d.focus_ur ? d.focus_ur : d.focus) || [];
    const book = UR ? name + " سے وقت لیں" : "Book with " + name;
    const meta =
      (d.experience ? '<li><i data-icon="award"></i><span>' + esc(pick(d, "experience")) + "</span></li>" : "") +
      (d.patients ? '<li><i data-icon="shield"></i><span>' + esc(pick(d, "patients")) + "</span></li>" : "") +
      (d.timing ? '<li><i data-icon="clock"></i><span>' + esc(pick(d, "timing")) + "</span></li>" : "") +
      (d.languages ? '<li><i data-icon="globe"></i><span>' + esc(pick(d, "languages")) + "</span></li>" : "");
    return (
      '<article class="doc' + (compact ? " doc--compact" : "") + '" data-tilt="5" data-reveal style="--i:' + i + '">' +
      '<div class="doc__photo"><span class="doc__initial" aria-hidden="true">' + esc(Array.from(name.replace(/^(Dr\.?|ڈاکٹر)\s*/i, "") || name)[0] || "") + "</span>" +
      (d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(name) + '" loading="lazy" data-fallback="remove">' : "") + "</div>" +
      '<div class="doc__body"><h3 class="doc__name">' + esc(name) + '</h3><p class="doc__role">' + esc(pick(d, "role")) + "</p>" +
      '<div class="doc__quals">' +
        (d.qualifications ? '<p class="doc__qual"><b>' + esc(pick(d, "qualifications")) + "</b></p>" : "") +
        (d.education ? '<p class="doc__qual">' + esc(pick(d, "education")) + "</p>" : "") + "</div>" +
      '<p class="doc__bio">' + (!compact && d.bio ? esc(pick(d, "bio")) : "") + "</p>" +
      '<ul class="chips">' + focus.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul>" +
      '<ul class="doc__meta">' + (compact ? "" : meta) + "</ul>" +
      '<a class="btn btn--pine btn--sm" href="appointment.html?doctor=' + encodeURIComponent(d.id) + '">' + esc(book) + ' <i data-icon="arrow"></i></a></div></article>'
    );
  }
  $$("[data-doctors]").forEach((box) => {
    const compact = box.hasAttribute("data-compact");
    const list = DOCS.slice(0, parseInt(box.dataset.limit, 10) || DOCS.length);
    if (!list.length) { const sec = box.closest("section"); if (sec) sec.hidden = true; return; }
    box.innerHTML = list.map((d, i) => doctorCard(d, i, compact)).join("");
  });
  $$("[data-doctor-select]").forEach((sel) => {
    DOCS.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = pick(d, "name");
      sel.appendChild(opt);
    });
    const p = params.get("doctor");
    if (p && DOCS.some((d) => d.id === p)) sel.value = p;
  });

  /* ---------- Blog (js/posts.js) ---------- */
  const POSTS = (window.POSTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const readTime = (m) => (UR ? m + " منٹ کا مطالعہ" : m + " min read");
  const postSlug = params.get("slug");
  function postCard(p, i) {
    return (
      '<a class="post-card" href="post.html?slug=' + encodeURIComponent(p.slug) + '" data-tilt="4" data-reveal style="--i:' + i + '">' +
      '<div class="post-card__art">' + (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.alt || "") + '" loading="lazy" data-fallback="remove">' : "") + '</div><div class="post-card__body">' +
      '<span class="post-card__meta">' + esc(pick(p, "category")) + "</span><h3>" + esc(pick(p, "title")) + "</h3><p>" + esc(pick(p, "excerpt")) + "</p>" +
      '<span class="post-card__meta" style="margin-top:.8rem">' + esc(fmtDate(p.date, true)) + ", " + esc(readTime(p.minutes)) + "</span></div></a>"
    );
  }
  $$("[data-posts]").forEach((box) => {
    let list = POSTS.filter((p) => !(box.hasAttribute("data-exclude-current") && p.slug === postSlug));
    list = list.slice(0, parseInt(box.dataset.limit, 10) || list.length);
    if (!list.length) { const sec = box.closest("section"); if (sec) sec.hidden = true; return; }
    box.innerHTML = list.map(postCard).join("");
  });
  const postBody = $("[data-post-body]");
  if (postBody) {
    const p = POSTS.find((x) => x.slug === postSlug) || null;
    if (!p) {
      $("[data-post-title]").textContent = t("Article not found");
      postBody.innerHTML = "<p>" + t("This article is not available. See all articles instead.") + '</p><p><a class="btn btn--pine" href="blog.html">' + t("All articles") + ' <i data-icon="arrow"></i></a></p>';
    } else {
      const title = pick(p, "title");
      document.title = title + " | " + (UR && S.clinicUr ? S.clinicUr : S.clinic);
      const md = $('meta[name="description"]'); if (md) md.content = pick(p, "excerpt");
      $("[data-post-title]").textContent = title;
      const crumb = $("[data-post-crumb]"); if (crumb) crumb.textContent = pick(p, "category");
      const body = (UR && p.body_ur ? p.body_ur : p.body) || [];
      postBody.innerHTML =
        (p.image ? '<figure class="article__cover"><img src="' + esc(p.image) + '" alt="' + esc(p.alt || "") + '" data-fallback="remove-parent"></figure>' : "") +
        '<p class="article__meta">' + esc(pick(p, "category")) + ", " + esc(fmtDate(p.date, true)) + ", " + esc(readTime(p.minutes)) + "</p>" +
        body.map((x) => "<p>" + esc(x) + "</p>").join("") +
        '<p class="article__note">' + t("This article is general information and does not replace a doctor's advice. If you are worried about your health or a child's, please book a consultation.") + "</p>" +
        '<p style="margin-top:1.6rem"><a class="btn btn--pine" href="appointment.html">' + t("Book an appointment") + ' <i data-icon="arrow"></i></a></p>';
    }
  }

  /* ---------- Reviews (js/reviews.js, plus live reviews from Firebase) ---------- */
  const STATIC_REVIEWS = window.REVIEWS || [];
  const TAGS = window.REVIEW_TAGS || {};
  let LIVE = [];
  const allReviews = () => LIVE.concat(STATIC_REVIEWS);
  function reviewCard(r) {
    /* anything coming from the live database is treated as untrusted: check types and lengths */
    const name = String(pick(r, "name") || "").slice(0, 60);
    const tagKnown = r.live && typeof r.tag === "string" && Object.prototype.hasOwnProperty.call(TAGS, r.tag);
    const role = pick(r, "role") || (tagKnown ? TAGS[r.tag][UR ? 1 : 0] : "");
    const rate = Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5));
    const stars = Array.from({ length: 5 }, (_, i) => '<i data-icon="star"' + (i < rate ? "" : ' style="opacity:.25"') + "></i>").join("");
    return (
      '<blockquote class="quote" style="margin:0"><div class="quote__stars" role="img" aria-label="' + rate + (UR ? " میں سے 5" : " out of 5") + '">' + stars + "</div>" +
      "<p>" + esc(String(pick(r, "text") || "").slice(0, 600)) + '</p><footer><span class="avatar" aria-hidden="true">' + esc(Array.from(name)[0] || "") + "</span><span><b>" + esc(name) + "</b>" + esc(role) + "</span></footer></blockquote>"
    );
  }
  const slider = $("[data-reviews-slider]");
  function renderSlider() {
    if (!slider) return;
    const limit = parseInt(slider.dataset.limit, 10) || 6;
    const feat = LIVE.concat(STATIC_REVIEWS.filter((r) => r.featured)).slice(0, limit);
    const list = feat.length ? feat : allReviews().slice(0, limit);
    slider.innerHTML = list.map((r) => '<div class="swiper-slide">' + reviewCard(r) + "</div>").join("");
    const sec = slider.closest("section"); if (sec) sec.hidden = !list.length;
    injectIcons(slider);
  }
  renderSlider();
  const grid = $("[data-reviews-grid]");
  const filterBox = $("[data-review-filter]");
  let activeTag = "all";
  function drawGrid() {
    if (!grid) return;
    const list = allReviews().filter((r) => activeTag === "all" || r.tag === activeTag);
    grid.innerHTML = list.map(reviewCard).join("") || '<p class="offers-empty">' + (activeTag === "all" ? t("No reviews yet.") + ' <a href="#share" data-focus-review>' + t("Be the first to share your experience.") + "</a>" : t("No reviews in this group yet.")) + "</p>";
    injectIcons(grid);
  }
  function drawFilter() {
    if (!filterBox) return;
    const used = Object.keys(TAGS).filter((k) => allReviews().some((r) => r.tag === k));
    const mk = (k, label) => '<button type="button" data-tag="' + k + '" aria-pressed="' + (k === activeTag) + '">' + esc(label) + "</button>";
    filterBox.innerHTML = mk("all", t("All")) + used.map((k) => mk(k, TAGS[k][UR ? 1 : 0])).join("");
  }
  if (filterBox) {
    filterBox.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-tag]"); if (!btn) return;
      activeTag = btn.dataset.tag;
      $$("button", filterBox).forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
      drawGrid();
    });
  }
  drawFilter();
  drawGrid();

  /* "Write a review" button: jump to the form and focus the first field */
  $$("[data-focus-review]").forEach((b) => b.addEventListener("click", () => {
    setTimeout(() => { const f = document.getElementById("rv-name"); if (f) f.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  }));

  /* All dynamic markup is in place: add icons */
  injectIcons(document);

  /* ---------- Header: solid on scroll, mobile menu, progress bar ---------- */
  const header = $("[data-header]");
  const bar = $(".progress");
  const nav = $("#nav");
  const menuBtn = $(".menu-btn");
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-solid", y > 30 && !(nav && nav.classList.contains("is-open")));
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    const swap = menuBtn.querySelector("svg");
    if (swap) swap.innerHTML = ICONS[open ? "close" : "menu"];
    onScroll();
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Scroll motion ----------
     Headings rise out from behind a mask, text and cards slide up and push in one after
     another, pictures are wiped open. Added automatically to every page, so new content
     animates too. Switched off for visitors who prefer reduced motion. */
  const motionOK = "IntersectionObserver" in window && !reduceMotion;
  if (!motionOK) {
    $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  } else {
    try {
      const wide = window.matchMedia("(min-width: 900px)").matches;
      const tagged = [];
      const tag = (el, kind, delay) => {
        if (!el || el.hasAttribute("data-anim")) return;
        if (!wide && (kind === "left" || kind === "right")) kind = "up";
        el.removeAttribute("data-reveal");
        el.setAttribute("data-anim", kind);
        if (delay) el.style.setProperty("--d", delay + "ms");
        if (!el.style.getPropertyValue("--i")) {
          const pos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          el.style.setProperty("--i", String(Math.min(pos, 5)));
        }
        tagged.push(el);
      };
      /* headings: the text slides up from behind a mask */
      $$(".page-hero h1, .section__head h2, .cta h2, .split h2, .article h1").forEach((h) => {
        if (h.querySelector(".mask")) return;
        const inner = document.createElement("span"); inner.className = "mask__in";
        while (h.firstChild) inner.appendChild(h.firstChild);
        const mask = document.createElement("span"); mask.className = "mask";
        mask.appendChild(inner); h.appendChild(mask);
        tag(mask, "mask", 0);
      });
      /* wrappers that only hold animated children should not move themselves */
      $$(".section__head[data-reveal]").forEach((el) => el.removeAttribute("data-reveal"));
      /* small text and buttons */
      [[".page-hero .crumbs", "up", 0], [".section__head .kicker", "up", 0], [".page-hero p, .section__head p, .lead", "up", 160],
       [".cta p", "up", 160], [".cta .btns", "up", 300], [".split > div > p", "up", 120], [".split > div > .ticks", "up", 200]]
        .forEach(([sel, kind, d]) => $$(sel).forEach((el) => tag(el, kind, d)));
      /* blocks and cards: slide up and push in, staggered */
      [[".portrait-wrap", "left"], [".timeline li", "left"], [".cta", "pop"], [".cards .card", "pop"], [".steps .step", "up"],
       [".offers .offer", "pop"], [".docs .doc", "pop"], [".posts .post-card", "pop"], [".values .value", "pop"], [".stats .stat", "pop"],
       [".rv-bar", "up"], [".rv-grid .quote", "pop"], [".treat__group", "up"], [".faq details", "up"], [".panel", "up"], [".map", "up"],
       [".info li", "up"], [".footer__grid > div", "up"], [".article", "up"], [".split > div:first-child", "left"], [".split > div:last-child", "right"],
       [".testi", "up"], [".offers-empty", "up"]]
        .forEach(([sel, kind]) => $$(sel).forEach((el) => tag(el, kind, 0)));
      /* pictures: wiped open with a slow zoom */
      $$(".post-card__art, .doc__photo, .article__cover").forEach((el) => tag(el, "wipe", 180));
      /* anything still marked for the old fade */
      $$("[data-reveal]").forEach((el) => tag(el, "up", 0));

      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add("in");
          io.unobserve(el);
          /* a picture inside the card wipes open with it (a fully clipped picture can't be observed itself) */
          el.querySelectorAll('[data-anim="wipe"]').forEach((w) => {
            w.classList.add("in");
            setTimeout(() => w.removeAttribute("data-anim"), 2600);
          });
          /* once the entrance is over, hand the element back to its normal styles (hover, tilt) */
          const wait = 1900 + (parseInt(el.style.getPropertyValue("--i"), 10) || 0) * 110 + (parseInt(el.style.getPropertyValue("--d"), 10) || 0);
          setTimeout(() => el.removeAttribute("data-anim"), wait);
        });
      }, { threshold: 0.06, rootMargin: "0px 0px -6% 0px" });
      tagged.forEach((el) => { if (el.dataset.anim !== "wipe") io.observe(el); });
      /* safety net: never leave something on screen hidden */
      setTimeout(() => tagged.forEach((el) => {
        if (el.classList.contains("in")) return;
        if (el.dataset.anim === "wipe" && !(el.parentElement && el.parentElement.closest(".in"))) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.05 && r.bottom > 0) el.classList.add("in");
      }), 4500);
    } catch (err) {
      $$("[data-anim]").forEach((el) => el.classList.add("in"));
    }
  }

  /* ---------- Counters ---------- */
  const countVal = (el) => (el.dataset.count === "doctors" ? DOCS.length : parseFloat(el.dataset.count));
  const showCount = (el, v) => { el.textContent = Math.round(v).toLocaleString("en-US") + (el.dataset.suffix || ""); };
  function runCounter(el) {
    const end = countVal(el);
    if (reduceMotion) { showCount(el, end); return; }
    const t0 = performance.now();
    (function frame(nowT) {
      const p = Math.min((nowT - t0) / 1800, 1);
      showCount(el, end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }
  /* the "doctors in our team" figure only makes sense with two or more doctors */
  $$('[data-count="doctors"]').forEach((el) => { if (DOCS.length < 2 && el.closest(".stat")) el.closest(".stat").remove(); });
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  } else {
    counters.forEach((c) => showCount(c, countVal(c)));
  }

  /* ---------- 3D tilt on cards (mouse only) ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt]").forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 7;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add("is-tilting");
        el.style.setProperty("--ry", (px * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * max * 2).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", () => {
        el.classList.remove("is-tilting");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- Hero videos: one loop per slide (phones get the tall versions) ---------- */
  const heroVideos = $$("[data-hero-video]");
  let heroPlay = () => {};
  if (heroVideos.length) {
    const phone = window.matchMedia("(max-width: 760px)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!reduceMotion && !saveData) {
      const NAMES = ["hero", "hero-2", "hero-3"];
      const canWebm = heroVideos[0].canPlayType('video/webm; codecs="vp9"') !== "";
      let current = 0;
      const tryPlay = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
      heroPlay = (i) => {
        current = i;
        heroVideos.forEach((v) => {
          if (Number(v.dataset.heroVideo) !== i) { v.pause(); return; }
          if (!v.getAttribute("src")) {
            v.src = "media/" + NAMES[i] + (phone ? "-m" : "") + (canWebm ? ".webm" : ".mp4");
            v.addEventListener("playing", () => v.classList.add("is-playing"), { once: true });
          }
          tryPlay(v);
        });
      };
      heroPlay(0);
      document.addEventListener("visibilitychange", () => {
        const v = heroVideos.find((x) => Number(x.dataset.heroVideo) === current);
        if (!v) return;
        if (document.hidden) v.pause(); else tryPlay(v);
      });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((e) => {
          const v = heroVideos.find((x) => Number(x.dataset.heroVideo) === current);
          if (!v) return;
          if (e[0].isIntersecting) tryPlay(v); else v.pause();
        }, { threshold: 0.05 }).observe($(".hero__media"));
      }
    }
  }

  /* ---------- Hero slider (fade) ---------- */
  const heroEl = $(".hero-swiper");
  if (heroEl && window.Swiper) {
    const SLIDE_MS = 6500;
    const dots = $$(".hero__dots button");
    const setDots = (i) => dots.forEach((d, n) => {
      d.classList.remove("is-active");
      d.classList.toggle("is-done", n < i);
      if (n === i) { void d.offsetWidth; d.classList.add("is-active"); }
      d.setAttribute("aria-current", n === i ? "true" : "false");
    });
    document.documentElement.style.setProperty("--slide-ms", SLIDE_MS + "ms");
    const hero = new Swiper(heroEl, {
      effect: "fade", fadeEffect: { crossFade: true }, speed: 900, loop: false, rewind: true,
      autoplay: reduceMotion ? false : { delay: SLIDE_MS, disableOnInteraction: false },
      a11y: { enabled: true },
      on: {
        init(sw) { setDots(sw.realIndex); },
        slideChange(sw) {
          setDots(sw.realIndex);
          $$(".hero__bg").forEach((b, i) => b.classList.toggle("is-active", i === sw.realIndex));
          heroPlay(sw.realIndex);
        }
      }
    });
    dots.forEach((d, i) => d.addEventListener("click", () => hero.slideTo(i)));
    const prev = $(".hero__arrows [data-prev]"), next = $(".hero__arrows [data-next]");
    if (prev) prev.addEventListener("click", () => hero.slidePrev());
    if (next) next.addEventListener("click", () => hero.slideNext());
  }

  /* ---------- Testimonials: 3D coverflow ---------- */
  const testiEl = $(".testi");
  let testiSwiper = null;
  function initTesti() {
    if (!testiEl || !window.Swiper || !$$(".swiper-slide", testiEl).length) return;
    if (testiSwiper) { testiSwiper.destroy(true, true); testiSwiper = null; }
    testiSwiper = new Swiper(testiEl, {
      effect: reduceMotion ? "slide" : "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto",
      loop: $$(".swiper-slide", testiEl).length > 3, speed: 700, spaceBetween: 16,
      coverflowEffect: { rotate: 28, stretch: 0, depth: 180, modifier: 1, slideShadows: false },
      autoplay: reduceMotion ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: ".testi .swiper-pagination", clickable: true },
      keyboard: { enabled: true }
    });
  }
  initTesti();

  /* Live reviews (Firebase): fetch once, then refresh whatever shows reviews */
  if (window.CLINIC_DB && window.CLINIC_DB.enabled && (slider || grid)) {
    window.CLINIC_DB.listReviews(60).then((list) => {
      LIVE = list;
      renderSlider(); initTesti(); drawFilter(); drawGrid();
    }).catch(() => { /* keep the reviews from js/reviews.js */ });
  }

  /* ---------- FAQ: one open at a time ---------- */
  $$(".faq details").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) $$(".faq details").forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* ---------- Treatments side nav highlight ---------- */
  const groups = $$(".treat__group");
  if (groups.length && "IntersectionObserver" in window) {
    const links = $$(".treat__nav a");
    const go = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id)); });
    }, { rootMargin: "-35% 0px -55% 0px" });
    groups.forEach((g) => go.observe(g));
  }

  /* ---------- Sending forms: WhatsApp or email, then the thank-you page ---------- */
  function stash(data) { try { sessionStorage.setItem("thanks", JSON.stringify(data)); } catch (e) {} }
  async function emailViaWeb3Forms(subject, d, lines) {
    const body = {
      access_key: S.web3formsKey, subject: subject, from_name: (S.clinic || "Clinic") + " website",
      name: d.name, phone: d.phone || "", message: lines.join("\n"), botcheck: ""
    };
    if (d.email) body.email = d.email;
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) throw new Error(json.message || "Request failed");
  }
  function wireSendForm(form, cfg) {
    const err = $(".form__err", form);
    const buttons = $$('button[type="submit"]', form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (err) err.hidden = true;
      if (!form.reportValidity()) return;
      const bot = form.elements.botcheck;
      if (bot && bot.checked) return;
      const via = (e.submitter && e.submitter.value) || cfg.defaultVia || "whatsapp";
      const d = Object.fromEntries(new FormData(form).entries());
      const lines = cfg.lines(d);
      const state = { kind: cfg.kind, name: d.name, via: via, summary: cfg.summary ? cfg.summary(d) : null };
      if (via === "whatsapp") {
        const url = "https://wa.me/" + (S.whatsapp || "") + "?text=" + encodeURIComponent(lines.join("\n"));
        state.waUrl = url;
        stash(state);
        window.open(url, "_blank", "noopener");
        location.href = "thankyou.html";
        return;
      }
      if (!S.web3formsKey) {
        state.via = "mailto";
        stash(state);
        window.location.href = "mailto:" + (S.email || "") + "?subject=" + encodeURIComponent(cfg.subject(d)) + "&body=" + encodeURIComponent(lines.join("\n"));
        setTimeout(() => { location.href = "thankyou.html"; }, 700);
        return;
      }
      buttons.forEach((b) => { b.disabled = true; });
      try {
        await emailViaWeb3Forms(cfg.subject(d), d, lines);
        stash(state);
        location.href = "thankyou.html";
      } catch (ex) {
        buttons.forEach((b) => { b.disabled = false; });
        if (err) { err.textContent = t("Your message could not be sent by email. Please check your connection and try again, or send it on WhatsApp instead."); err.hidden = false; }
      }
    });
  }

  const apptForm = $("#appointment-form");
  if (apptForm) {
    const dateInput = $("input[type=date]", apptForm);
    if (dateInput) dateInput.min = todayStr;
    const docName = (id) => { const d = DOCS.find((x) => x.id === id); return d ? d.name : "Any available doctor"; };
    const offerTitle = (id) => { const o = shownOffers.find((x) => x.id === id); return o ? o.title : ""; };
    wireSendForm(apptForm, {
      kind: "appointment",
      subject: (d) => "Appointment request from " + d.name,
      lines: (d) => [
        "Appointment request", "Name: " + d.name, "Phone: " + d.phone,
        d.email ? "Email: " + d.email : "", d.age ? "Age: " + d.age : "",
        "Doctor: " + docName(d.doctor), d.offer ? "Offer: " + offerTitle(d.offer) : "",
        "Visit type: " + d.type, "Preferred date: " + (d.date || "any"), "Preferred time: " + d.slot,
        "Concern: " + (d.concern || "-")
      ].filter(Boolean),
      summary: (d) => ({ doctor: d.doctor || "", type: d.type, date: d.date || "", slot: d.slot, offer: d.offer || "" })
    });
  }
  const contactForm = $("#contact-form");
  if (contactForm) {
    wireSendForm(contactForm, {
      kind: "message", defaultVia: "email",
      subject: (d) => "Website enquiry from " + d.name,
      lines: (d) => ["Website enquiry", "Name: " + d.name, d.phone ? "Phone: " + d.phone : "", "Message: " + d.message].filter(Boolean)
    });
  }
  const reviewForm = $("#review-form");
  if (reviewForm) {
    const tagSel = $("[data-review-tag-select]", reviewForm);
    if (tagSel) Object.keys(TAGS).forEach((k) => {
      const opt = document.createElement("option");
      opt.value = k; opt.textContent = TAGS[k][UR ? 1 : 0];
      tagSel.appendChild(opt);
    });
    if (window.CLINIC_DB && window.CLINIC_DB.enabled) {
      /* Firebase is on: reviews are published straight to the site */
      const actions = $("[data-review-actions]", reviewForm);
      if (actions) { actions.innerHTML = '<button class="btn btn--pine" type="submit">' + t("Publish my review") + ' <i data-icon="arrow"></i></button>'; injectIcons(actions); }
      const note = $(".form__note", reviewForm);
      if (note) note.textContent = t("Your review appears on this page straight away.");
      const err = $(".form__err", reviewForm);
      const showErr = (msg) => { if (err) { err.textContent = msg; err.hidden = false; } };
      reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (err) err.hidden = true;
        if (!reviewForm.reportValidity()) return;
        const bot = reviewForm.elements.botcheck;
        if (bot && bot.checked) return;
        let last = 0;
        try { last = parseInt(localStorage.getItem("rv_last"), 10) || 0; } catch (x) {}
        if (Date.now() - last < 10 * 60 * 1000) { showErr(t("You have just sent a review. Please try again in a few minutes.")); return; }
        const d = Object.fromEntries(new FormData(reviewForm).entries());
        const btn = $('button[type="submit"]', reviewForm);
        btn.disabled = true;
        try {
          await window.CLINIC_DB.addReview({ name: d.name.trim(), rating: parseInt(d.rating, 10), text: d.message.trim(), tag: d.tag || "" });
          try { localStorage.setItem("rv_last", String(Date.now())); } catch (x) {}
          stash({ kind: "review", name: d.name, via: "published" });
          location.href = "thankyou.html";
        } catch (ex) {
          btn.disabled = false;
          showErr(t("Your review could not be published. Please check your connection and try again."));
        }
      });
    } else {
      wireSendForm(reviewForm, {
        kind: "review",
        subject: (d) => "Patient review from " + d.name,
        lines: (d) => ["Patient review", "Name: " + d.name, "Rating: " + d.rating + "/5", d.tag && TAGS[d.tag] ? "About: " + TAGS[d.tag][0] : "", "Review: " + d.message].filter(Boolean)
      });
    }
  }

  /* ---------- Thank-you page ---------- */
  const thanks = $("[data-thanks]");
  if (thanks) {
    let st = null;
    try { st = JSON.parse(sessionStorage.getItem("thanks") || "null"); } catch (e) {}
    const h = $("[data-thanks-heading]"), lead = $("[data-thanks-lead]"), grid2 = $("[data-thanks-grid]");
    const first = st && st.name ? st.name.trim().split(/\s+/)[0] : "";
    const hello = (en, ur) => (first ? (UR ? ur.replace("{n}", first) : en.replace("{n}", first)) : (UR ? "شکریہ۔" : "Thank you."));
    h.textContent = hello("Thank you, {n}.", "شکریہ، {n}۔");
    const L = {
      appointment: {
        whatsapp: ["Your appointment request is ready in WhatsApp. If you have not pressed send yet, please do, and we will confirm your slot. We look forward to meeting you.", "آپ کی ملاقات کی درخواست واٹس ایپ میں تیار ہے۔ اگر آپ نے ابھی بھیجی نہیں تو براہِ کرم بھیج دیں، ہم آپ کا وقت طے کر کے آپ کو اطلاع دیں گے۔ ہمیں آپ سے ملنے کا انتظار رہے گا۔"],
        email: ["Your appointment request has reached the clinic by email. We will confirm your slot by phone or WhatsApp. We look forward to meeting you.", "آپ کی ملاقات کی درخواست ای میل کے ذریعے کلینک تک پہنچ گئی ہے۔ ہم فون یا واٹس ایپ پر آپ کا وقت طے کر کے اطلاع دیں گے۔ ہمیں آپ سے ملنے کا انتظار رہے گا۔"],
        mailto: ["Your email is ready in your email app. Please press send there, and the clinic will confirm your slot. We look forward to meeting you.", "آپ کی ای میل آپ کی ای میل ایپ میں تیار ہے۔ براہِ کرم وہاں سے بھیج دیں، کلینک آپ کا وقت طے کر کے اطلاع دے گا۔ ہمیں آپ سے ملنے کا انتظار رہے گا۔"]
      },
      message: {
        _: ["Your message has reached the clinic. We will reply as soon as we can, and we are glad you got in touch.", "آپ کا پیغام کلینک تک پہنچ گیا ہے۔ ہم جلد از جلد جواب دیں گے، اور ہمیں خوشی ہے کہ آپ نے رابطہ کیا۔"]
      },
      review: {
        published: ["Your review is now live on our website. Thank you for taking the time to share it.", "آپ کی رائے اب ہماری ویب سائٹ پر شائع ہو چکی ہے۔ اپنا وقت نکالنے کا شکریہ۔"],
        _: ["Your kind words mean a great deal to our team. We will always ask your permission before showing them anywhere.", "آپ کے مہربان الفاظ ہماری ٹیم کے لیے بہت معنی رکھتے ہیں۔ انہیں کہیں بھی دکھانے سے پہلے ہم ہمیشہ آپ کی اجازت لیں گے۔"]
      }
    };
    let pair = ["Whenever you are ready, we are here to listen.", "جب بھی آپ تیار ہوں، ہم آپ کی بات سننے کے لیے حاضر ہیں۔"];
    if (st && L[st.kind]) pair = L[st.kind][st.via] || L[st.kind]._ || pair;
    lead.textContent = pair[UR ? 1 : 0];

    if (!st || st.kind !== "appointment") {
      const steps = $(".thanks__panel", grid2);
      if (st && st.kind !== "appointment") grid2.hidden = true;
      if (!st) { /* direct visit: keep the general next steps */ }
      if (steps && st && st.kind !== "appointment") steps.hidden = true;
    }
    if (st && st.summary) {
      const s = st.summary, rows = [];
      const doc = DOCS.find((x) => x.id === s.doctor);
      const off = shownOffers.find((x) => x.id === s.offer) || (window.OFFERS || []).find((x) => x.id === s.offer);
      rows.push([t("Doctor"), doc ? pick(doc, "name") : t("Any available doctor")]);
      rows.push([t("Visit type"), t(s.type)]);
      rows.push([t("Preferred date"), s.date ? fmtDate(s.date, true) : t("Any day")]);
      rows.push([t("Preferred time"), t(s.slot)]);
      if (off) rows.push([t("Offer"), pick(off, "title")]);
      rows.push([t("Sent by"), t(st.via === "whatsapp" ? "WhatsApp" : "Email")]);
      const box = $("[data-thanks-summary]");
      $("[data-thanks-list]").innerHTML = rows.map((r) => "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>").join("");
      box.hidden = false;
    }
    const seeReviews = $("[data-thanks-reviews]");
    if (seeReviews && st && st.kind === "review") seeReviews.hidden = false;
    const wa = $("[data-thanks-wa]");
    if (wa && st && st.via === "whatsapp" && typeof st.waUrl === "string" && st.waUrl.indexOf("https://wa.me/") === 0) { wa.href = st.waUrl; wa.hidden = false; }
    try { sessionStorage.removeItem("thanks"); } catch (e) {}
    injectIcons(thanks);
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Finally: translate anything static that was added after i18n ran ---------- */
  if (UR) { I.apply(document.body); }
})();
