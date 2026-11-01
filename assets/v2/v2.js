/* Zynverix v2: floating building, services zoom-through, reveals, demo chat, site config */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) doc.classList.add("rm");
  var cfg = window.ZYNVERIX_CONFIG || {};
  var isHttps = function (u) { return /^https:\/\//i.test(u || ""); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var smooth = function (a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* ---- site config: booking links, email, LinkedIn, year ---- */
  document.querySelectorAll("[data-book]").forEach(function (a) {
    if (isHttps(cfg.bookingUrl)) { a.href = cfg.bookingUrl; a.target = "_blank"; a.rel = "noopener"; }
  });
  if (cfg.email) document.querySelectorAll("[data-email]").forEach(function (a) { a.href = "mailto:" + cfg.email; if (a.hasAttribute("data-email-text")) a.textContent = cfg.email; });
  document.querySelectorAll("[data-linkedin]").forEach(function (a) { if (isHttps(cfg.linkedinUrl)) { a.href = cfg.linkedinUrl; a.hidden = false; } else a.hidden = true; });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (cfg.gaMeasurementId && /^G-[A-Z0-9]+$/.test(cfg.gaMeasurementId)) {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.gaMeasurementId; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); }; window.gtag("js", new Date()); window.gtag("config", cfg.gaMeasurementId);
  }

  /* ---- mobile menu ---- */
  var burger = document.querySelector(".v2-burger"), mob = document.getElementById("v2-mobile");
  if (burger && mob) burger.addEventListener("click", function () {
    var open = mob.classList.toggle("open"); burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  if (mob) mob.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { mob.classList.remove("open"); if (burger) burger.setAttribute("aria-expanded", "false"); }); });

  /* ---- reveal on scroll ---- */
  var revealers = document.querySelectorAll(".reveal, .steps, [data-chat]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); if (e.target.hasAttribute("data-chat")) playChat(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    revealers.forEach(function (el) { io.observe(el); });
  } else revealers.forEach(function (el) { el.classList.add("in"); if (el.hasAttribute("data-chat")) playChat(el, true); });

  /* ---- demo phone: messages type in one by one ---- */
  function playChat(box, instant) {
    var items = box.querySelectorAll("[data-step]"), typing = box.querySelector(".typing"), i = 0;
    if (instant) { items.forEach(function (m) { m.classList.add("in-msg"); }); return; }
    (function next() {
      if (i >= items.length) { if (typing) typing.classList.remove("in-msg"); return; }
      var m = items[i++], wait = m.classList.contains("m-in") || m.classList.contains("m-out") ? 900 : 350;
      if (typing && m.classList.contains("m-out")) { typing.classList.add("in-msg"); box.insertBefore(typing, m); }
      setTimeout(function () { if (typing) typing.classList.remove("in-msg"); m.classList.add("in-msg"); next(); }, wait);
    })();
  }

  /* ---- floating building: follows the page down (and back up) ---- */
  var fb = document.querySelector(".float-building");
  var vh = window.innerHeight, docH = 1;
  function measure() { vh = window.innerHeight; docH = Math.max(1, document.documentElement.scrollHeight - vh); }
  measure(); window.addEventListener("resize", function () { measure(); ztMeasure(); onScroll(); });

  /* ---- services zoom-through ---- */
  var zt = document.querySelector("[data-zt]"), scenes = [], track, ztTop = 0, ztLen = 1, N = 0, curShown = -1;
  var titleEl, countEl, descEl, moreEl, dots = [], hint;
  if (zt && !reduce) {
    track = zt.querySelector(".zt-track");
    scenes = Array.prototype.slice.call(zt.querySelectorAll(".zt-scene"));
    N = scenes.length;
    titleEl = zt.querySelector(".zt-title"); moreEl = zt.querySelector(".zt-more"); countEl = zt.querySelector(".zt-count"); descEl = zt.querySelector(".zt-desc"); hint = zt.querySelector(".zt-hint");
    var dotWrap = zt.querySelector(".zt-dots");
    scenes.forEach(function (s, i) {
      // full-screen cover: pin each image's portal to the same spot on any screen shape
      var im = s.querySelector("img"); if (im) im.style.objectPosition = s.getAttribute("data-fx") + "% " + s.getAttribute("data-fy") + "%";
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Go to " + s.getAttribute("data-title"));
      b.addEventListener("click", function () { ztGo(i); });
      dotWrap.appendChild(b); dots.push(b);
    });
    track.style.height = (N * 95) + "svh";
  }
  function ztMeasure() {
    if (!track) return;
    var r = track.getBoundingClientRect(); ztTop = r.top + window.scrollY;
    ztLen = Math.max(1, track.offsetHeight - zt.querySelector(".zt-stage").offsetHeight);
  }
  ztMeasure();
  function setText(i) {
    if (i === curShown) return; curShown = i;
    var s = scenes[i];
    [titleEl, descEl].forEach(function (el) { el.classList.add("zt-swap"); });
    setTimeout(function () {
      titleEl.textContent = s.getAttribute("data-title"); descEl.textContent = s.getAttribute("data-desc"); if (moreEl && s.getAttribute("data-href")) moreEl.href = s.getAttribute("data-href");
      countEl.textContent = (i < 9 ? "0" : "") + (i + 1) + " / " + (N < 10 ? "0" : "") + N;
      [titleEl, descEl].forEach(function (el) { el.classList.remove("zt-swap"); });
    }, 160);
    dots.forEach(function (d, j) { d.classList.toggle("on", j === i); });
  }
  // Smoothing: the zoom chases the scroll position instead of jumping with each wheel step.
  var ztP = -1;
  function ztTarget() { return clamp((window.scrollY - ztTop) / ztLen, 0, 1); }
  function ztRender(p) {
    if (!track || !N) return;
    var seg = p * (N - 1), i = Math.min(N - 2, Math.floor(seg)), t = seg - i;
    if (p >= 1) { i = N - 2; t = 1; }
    var z = ease(clamp((t - 0.12) / 0.88, 0, 1));             // hold each scene, then zoom
    var cur = scenes[i], nxt = scenes[i + 1];
    var fx = cur.getAttribute("data-fx"), fy = cur.getAttribute("data-fy"), K = 4.6;
    for (var j = 0; j < N; j++) if (j !== i && j !== i + 1 && scenes[j].style.visibility !== "hidden") { scenes[j].style.opacity = 0; scenes[j].style.visibility = "hidden"; }
    cur.style.visibility = "visible"; nxt.style.visibility = "visible";
    cur.style.transformOrigin = nxt.style.transformOrigin = fx + "% " + fy + "%";
    cur.style.transform = "translate3d(0,0,0) scale(" + (1 + (K - 1) * z).toFixed(4) + ")";
    cur.style.opacity = (1 - smooth(0.5, 0.92, z)).toFixed(3);
    cur.style.zIndex = 1;
    nxt.style.transform = "translate3d(0,0,0) scale(" + (0.21 + 0.79 * z).toFixed(4) + ")";
    nxt.style.opacity = smooth(0, 0.22, z).toFixed(3);
    nxt.style.zIndex = 2;
    setText(z < 0.5 ? i : i + 1);
    if (hint) hint.style.opacity = p > 0.97 ? 0 : 1;
  }
  var ztRaf = 0;
  function ztLoop() {
    var target = ztTarget();
    if (ztP < 0) ztP = target;
    var d = target - ztP;
    ztP = Math.abs(d) < 0.0004 ? target : ztP + d * (snapping ? 0.2 : 0.09);    // eased follow
    ztRender(ztP);
    ztRaf = ztP === target ? 0 : requestAnimationFrame(ztLoop);
  }
  function ztKick() { if (track && N && !ztRaf) ztRaf = requestAnimationFrame(ztLoop); }

  /* ---- one swipe = one service: wheel / trackpad / touch step through the scenes ---- */
  var snapping = false, gestureUsed = false, lastWheel = 0, lastInput = 0, prevY = window.scrollY, ztIdx = 0;
  var easeIO = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  function idxY(i) { return Math.round(ztTop + (i / Math.max(1, N - 1)) * ztLen); }
  function nearestIdx() { return clamp(Math.round(clamp((window.scrollY - ztTop) / ztLen, 0, 1) * (N - 1)), 0, N - 1); }
  function ztGo(i) {
    if (!track || !N) return;
    i = clamp(i, 0, N - 1); ztIdx = i;
    var from = window.scrollY, to = idxY(i), dist = to - from;
    if (Math.abs(dist) < 2) return;
    var dur = clamp(700 + Math.abs(dist) * 0.25, 900, 1600), t0 = performance.now();
    snapping = true;
    (function step(now) {
      var k = clamp((now - t0) / dur, 0, 1);
      window.scrollTo({ top: from + dist * easeIO(k), behavior: "instant" });
      if (k < 1) requestAnimationFrame(step); else { snapping = false; prevY = window.scrollY; }
    })(t0);
  }
  // inside the pinned stage? (leaving past the first or last service scrolls the page normally)
  function inZone(dir) {
    if (!track || !N) return false;
    var y = window.scrollY;
    if (y < ztTop - 2 || y > ztTop + ztLen + 2) return false;
    var i = nearestIdx();
    if (dir > 0 && i >= N - 1 && y >= idxY(N - 1) - 2) return false;
    if (dir < 0 && i <= 0 && y <= ztTop + 2) return false;
    return true;
  }
  function stepFrom(dir) {
    var p = clamp((window.scrollY - ztTop) / ztLen, 0, 1) * (N - 1);
    var base = dir > 0 ? Math.floor(p + 0.02) : Math.ceil(p - 0.02);
    ztGo(base + dir);
  }
  if (false) {   // step-per-swipe turned off: continuous smooth zoom instead
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      var dir = e.deltaY > 0 ? 1 : -1, now = performance.now(), gap = now - lastWheel;
      lastWheel = lastInput = now;
      if (gap > 260) gestureUsed = false;               // a new swipe starts after a short pause
      if (!snapping && !inZone(dir)) return;            // normal page scrolling outside the services
      e.preventDefault();
      if (snapping || gestureUsed || Math.abs(e.deltaY) < 3) return;
      gestureUsed = true; stepFrom(dir);
    }, { passive: false });

    var tY = null, tUsed = false;
    window.addEventListener("touchstart", function (e) { tY = e.touches[0].clientY; tUsed = false; lastInput = performance.now(); }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (tY === null) return;
      var dy = tY - e.touches[0].clientY, dir = dy > 0 ? 1 : -1;
      lastInput = performance.now();
      if (!snapping && !inZone(dir)) return;
      e.preventDefault();
      if (!snapping && !tUsed && Math.abs(dy) > 28) { tUsed = true; stepFrom(dir); }
    }, { passive: false });
    window.addEventListener("touchend", function () { tY = null; }, { passive: true });

    // a fast fling from above or below lands on the first / last service instead of skipping in
    window.addEventListener("scroll", function () {
      var y = window.scrollY, recent = performance.now() - lastInput < 400;
      if (!snapping && recent) {
        if (prevY < ztTop - 1 && y > ztTop + 1) { window.scrollTo({ top: ztTop, behavior: "instant" }); gestureUsed = true; y = ztTop; }
        else if (prevY > ztTop + ztLen + 1 && y < ztTop + ztLen - 1) { window.scrollTo({ top: ztTop + ztLen, behavior: "instant" }); gestureUsed = true; y = ztTop + ztLen; }
      }
      prevY = y;
    }, { passive: true });
  }
  // decode every scene up front so nothing pops in mid-zoom
  scenes.forEach(function (s) { var im = s.querySelector("img"); if (im) { im.loading = "eager"; if (im.decode) im.decode().catch(function () {}); } });

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (fb && !reduce) {
        var y = window.scrollY, p = clamp(y / docH, 0, 1);
        var drift = Math.min(vh * 0.32, y * 0.18);                 // drifts down as you scroll
        var faded = y > vh * 0.55 ? 0.22 : 1 - smooth(vh * 0.25, vh * 0.55, y) * 0.78; // softer behind content
        var end = smooth(0.9, 1, p);                                 // back to full at the final CTA
        fb.style.transform = "translateY(" + drift + "px) scale(" + (1 - 0.12 * Math.min(1, y / vh)) + ")";
        fb.style.opacity = Math.max(faded, end);
        fb.classList.toggle("is-lit", p > 0.25);
      }
      ztKick();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", function () { measure(); ztMeasure(); onScroll(); });
  onScroll();
})();
