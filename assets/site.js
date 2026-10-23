(function () {
  "use strict";
  var cfg = window.ZYNVERIX_CONFIG || {};
  var email = cfg.email || "info@zynverix.com";
  var isHttps = function (u) { return /^https:\/\//i.test(u || ""); };
  document.documentElement.classList.add("js");

  // ---- Booking links: go to the Contact page (set in the HTML). If a booking URL is configured, use it instead.
  document.querySelectorAll("[data-book]").forEach(function (a) {
    if (/^https:\/\//i.test(cfg.bookingUrl || "")) { a.href = cfg.bookingUrl; a.target = "_blank"; a.rel = "noopener"; }
    else if (a.getAttribute("href") === "#contact-form") {
      a.addEventListener("click", function () {
        var sel = document.getElementById("f-service"); if (sel) sel.value = "audit";
        setTimeout(function () { var n = document.getElementById("f-name"); if (n) n.focus({ preventScroll: true }); }, 500);
      });
    }
  });
  // ---- Email links
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.href = "mailto:" + email;
    if (a.hasAttribute("data-email-text")) a.textContent = email;
  });

  // ---- Company LinkedIn: show only when configured
  // ---- Testimonials: render only real entries from config; otherwise the section stays hidden
  (function () {
    var sec = document.querySelector("[data-testimonials]"), list = sec && sec.querySelector("[data-testi-list]");
    var items = (cfg.testimonials || []).filter(function (t) { return t && t.quote && t.name; });
    if (!sec || !list || !items.length) return;
    items.forEach(function (t) {
      var li = document.createElement("li"); li.className = "testi";
      var q = document.createElement("blockquote"); q.textContent = "\u201C" + t.quote + "\u201D";
      var who = document.createElement("div"); who.className = "testi-who";
      if (t.photo) { var im = document.createElement("img"); im.src = t.photo; im.alt = "Photo of " + t.name; im.width = 56; im.height = 56; im.loading = "lazy"; who.appendChild(im); }
      else { var ini = document.createElement("span"); ini.className = "testi-ini"; ini.setAttribute("aria-hidden", "true"); ini.textContent = t.name.trim().charAt(0).toUpperCase(); who.appendChild(ini); }
      var meta = document.createElement("div"), nm = document.createElement("b"), rl = document.createElement("span");
      nm.textContent = t.name; rl.textContent = [t.role, t.company].filter(Boolean).join(", ");
      meta.appendChild(nm); meta.appendChild(rl); who.appendChild(meta);
      li.appendChild(q); li.appendChild(who); list.appendChild(li);
    });
    sec.hidden = false;
  })();
  document.querySelectorAll("[data-social-linkedin]").forEach(function (a) {
    if (isHttps(cfg.linkedinUrl)) { a.href = cfg.linkedinUrl; a.hidden = false; } else { a.hidden = true; }
  });
  document.querySelectorAll("[data-linkedin]").forEach(function (el) {
    var a = el.tagName === "A" ? el : el.querySelector("a");
    if (isHttps(cfg.linkedinUrl)) { a.href = cfg.linkedinUrl; el.hidden = false; } else { el.hidden = true; }
  });

  // ---- Team photos and LinkedIn (photo paths are relative to the site root)
  var team = cfg.team || {};
  var me = document.querySelector('script[src$="assets/site.js"]');
  var siteRoot = me ? me.getAttribute("src").replace(/assets\/site\.js$/, "") : "";
  function fromRoot(p) { return /^(https?:)?\/\//i.test(p) || p.charAt(0) === "/" ? p : siteRoot + p; }
  document.querySelectorAll("[data-member]").forEach(function (card) {
    var m = team[card.getAttribute("data-member")] || {};
    var name = (card.querySelector("h3") || {}).textContent || "";
    var av = card.querySelector(".avatar");
    if (av && m.photo && !av.querySelector("img")) {
      var img = new Image();
      img.alt = name; img.decoding = "async"; img.src = fromRoot(m.photo);
      img.onload = function () { av.textContent = ""; av.appendChild(img); av.removeAttribute("aria-hidden"); };
    }
    var li = card.querySelector("[data-member-linkedin]");
    if (li && isHttps(m.linkedin)) { li.href = m.linkedin; li.hidden = false; }
  });

  // ---- Setup time (FAQ)
  var st = document.querySelector("[data-setup-time]");
  if (st && cfg.setupTime) { st.textContent = cfg.setupTime; st.hidden = false; }

  // ---- Demo videos
  var demos = cfg.demos || {};
  document.querySelectorAll("[data-demo]").forEach(function (frame) {
    var src = demos[frame.getAttribute("data-demo")];
    if (!isHttps(src)) return;
    var title = frame.getAttribute("data-title") || "Zynverix demo";
    var el;
    if (/\.(mp4|webm)(\?|$)/i.test(src)) {
      el = document.createElement("video");
      el.controls = true; el.preload = "metadata"; el.playsInline = true; el.src = src;
    } else {
      el = document.createElement("iframe");
      el.src = src; el.loading = "lazy"; el.allowFullscreen = true;
      el.allow = "fullscreen; picture-in-picture";
    }
    el.title = title;
    var ph = frame.querySelector(".placeholder");
    if (ph) ph.remove();
    frame.appendChild(el);
  });

  // ---- Header background on scroll
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 12); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---- Desktop dropdowns (Services, Industries)
  var menus = Array.prototype.slice.call(document.querySelectorAll(".has-menu"));
  function setMega(m, open) {
    m.classList.toggle("open", open);
    m.querySelector(".nav-trigger").setAttribute("aria-expanded", String(open));
  }
  menus.forEach(function (m) {
    var t = m.querySelector(".nav-trigger");
    t.addEventListener("click", function () {
      var open = t.getAttribute("aria-expanded") !== "true";
      menus.forEach(function (o) { if (o !== m) setMega(o, false); });
      setMega(m, open);
    });
    m.addEventListener("focusout", function (e) { if (!m.contains(e.relatedTarget)) setMega(m, false); });
    m.addEventListener("mouseleave", function () { setMega(m, false); });
  });
  document.addEventListener("click", function (e) { menus.forEach(function (m) { if (!m.contains(e.target)) setMega(m, false); }); });

  // ---- Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 960) setMenu(false); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    menus.forEach(function (m) { if (m.classList.contains("open")) { setMega(m, false); m.querySelector(".nav-trigger").focus(); } });
    setMenu(false);
  });

  // ---- Hero flow animation
  var flow = document.querySelector(".flow");
  if (flow) requestAnimationFrame(function () { flow.classList.add("is-playing"); });

  // ---- Contact form
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var provider = "https://formspree.io/f/mwlvgqyr"; // <--- Updated to your Formspree link
    var select = form.querySelector("#f-service");
    var pre = new URLSearchParams(location.search).get("service");
    if (pre && select && select.querySelector('option[value="' + pre.replace(/[^a-z-]/g, "") + '"]')) select.value = pre;

    function show(kind, msg) {
      status.className = "form-status show " + kind;
      status.innerHTML = msg;
    }
    function fieldOk(input) {
      var v = input.value.trim();
      var ok = v.length > 0 && (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      input.closest(".field").classList.toggle("invalid", !ok);
      return ok;
    }
    form.querySelectorAll("[required]").forEach(function (inp) {
      inp.addEventListener("blur", function () { if (inp.value) fieldOk(inp); });
      inp.addEventListener("input", function () { if (inp.getAttribute("aria-invalid") === "true") fieldOk(inp); });
    });

    form.addEventListener("submit", function (e) {
      var bad = null;
      form.querySelectorAll("[required]").forEach(function (inp) { if (!fieldOk(inp) && !bad) bad = inp; });
      if (bad) { e.preventDefault(); bad.focus(); show("err-box", "Please fix the highlighted fields."); return; }

      var d = new FormData(form);
      e.preventDefault();

      if (provider === "netlify") {
        var sbtn = form.querySelector('button[type="submit"]');
        sbtn.disabled = true; show("info", "Sending…");
        fetch(form.getAttribute("action") || "/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(d).toString() })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            if (window.gtag) window.gtag("event", "generate_lead", { form: "contact" });
            window.location.href = form.getAttribute("action");
          })
          .catch(function () {
            show("err-box", 'Sorry, your message couldn\'t be sent from this page.');
            sbtn.disabled = false;
          });
        return;
      }

      // This block will now execute because provider is your Formspree HTTPS link!
      {
        var btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        show("info", "Sending…");
        fetch(provider, { method: "POST", body: d, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            form.reset();
            show("ok", "Thanks, your message was sent. We'll reply by email.");
            // Optional redirect to your thank you page:
            setTimeout(function() { window.location.href = "/thank-you/"; }, 1500);
          })
          .catch(function () {
            show("err-box", 'Sorry, your message couldn\'t be sent. Please try again later.');
          })
          .then(function () { if (btn) btn.disabled = false; });
        return;
      }
    });
  }

  // ---- Year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    var y = new Date().getFullYear();
    if (y > 2026) el.textContent = "2026–" + y;
  });
})();
/* ---- Motion layer: reveals, chat sequences, spotlight, progress ---- */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".progress");

  // Scroll progress bar
  if (bar) {
    var tick = false;
    var upd = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ")";
      tick = false;
    };
    window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  // Spotlight cards (pointer-follow glow)
  var spotSel = ".svc, .rel, .inc, .problem-card, .step, .sys-col, .c-card, .person, .honest-card, .aud, .side-card, .audit-card, .member";
  document.querySelectorAll(spotSel).forEach(function (el) { el.classList.add("spot"); });
  if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".spot");
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  if (reduce || !("IntersectionObserver" in window)) return;

  // Scroll reveals: only for elements below the first screen, so the opening view is never blank
  var revealSel = [".section-head", ".problem-card", ".svc", ".inc", ".rel", ".step", ".aud", ".honest-card", ".faq details",
    ".demo", ".person", ".member", ".c-card", ".form-card", ".side-card", ".prose", ".auto-note", ".complete", ".audit-card",
    ".sys-col", ".system-tagline > div", ".empty-state", ".pick-note", ".problem-bridge", ".core-wrap", ".cat-label",
    ".final .container > *", ".ind-links.big", ".center-link"].join(",");
  var fold = window.innerHeight * 0.9;
  var counts = new Map();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { var t = en.target; t.classList.add("in"); io.unobserve(t);
        setTimeout(function () { t.classList.remove("rv", "in"); t.style.removeProperty("--rd"); }, 1300); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  document.querySelectorAll(revealSel).forEach(function (el) {
    if (el.closest(".mega, .mobile-menu, .hero, .page-hero")) return;
    if (el.getBoundingClientRect().top < fold) return;
    var p = el.parentElement, n = counts.get(p) || 0;
    counts.set(p, n + 1);
    el.style.setProperty("--rd", Math.min(n * 0.08, 0.4) + "s");
    el.classList.add("rv");
    io.observe(el);
  });
  // Safety: anything still hidden after a jump (e.g. anchor link or Find) becomes visible
  window.addEventListener("hashchange", function () { document.querySelectorAll(".rv:not(.in)").forEach(function (el) { el.classList.add("in"); }); });

  // Chat / mock sequences: items appear one by one; replies "type" first
  function play(body) {
    var items = Array.prototype.slice.call(body.children);
    items.forEach(function (el) { el.classList.add("seq-hide"); });
    var t = 250;
    items.forEach(function (el) {
      var isReply = el.classList.contains("bubble") && el.classList.contains("out");
      setTimeout(function () {
        el.classList.remove("seq-hide"); el.classList.add("seq-in");
        if (isReply) el.classList.add("is-typing");
      }, t);
      if (isReply) { t += 1200; setTimeout(function () { el.classList.remove("is-typing"); }, t); t += 300; }
      else { t += 420; }
    });
  }
  var mio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { play(en.target); mio.unobserve(en.target); } });
  }, { threshold: 0.25 });
  document.querySelectorAll(".mock .mock-body").forEach(function (b) { mio.observe(b); });
})();

/* ---- 3D tilt on cards (desktop pointers only) ---- */
(function () {
  if (!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var sel = ".svc, .rel, .inc, .problem-card, .step, .person, .honest-card, .c-card, .aud, .sys-col, .flow-panel, .demo .video-frame";
  document.addEventListener("pointermove", function (e) {
    var el = e.target.closest && e.target.closest(sel);
    document.querySelectorAll(".tilting").forEach(function (o) { if (o !== el) { o.classList.remove("tilting"); o.style.removeProperty("--rx"); o.style.removeProperty("--ry"); } });
    if (!el) return;
    var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    var k = el.classList.contains("flow-panel") || el.classList.contains("sys-col") ? 5 : 8;
    el.classList.add("tilting");
    el.style.setProperty("--rx", (-y * k).toFixed(2) + "deg");
    el.style.setProperty("--ry", (x * k).toFixed(2) + "deg");
  }, { passive: true });
  document.addEventListener("pointerleave", function () { document.querySelectorAll(".tilting").forEach(function (o) { o.classList.remove("tilting"); }); });
})();

/* ---- FAQ: smooth open / close ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !Element.prototype.animate) return;
  document.querySelectorAll(".faq details").forEach(function (d) {
    var s = d.querySelector("summary"), a = d.querySelector(".ans");
    if (!s || !a) return;
    s.addEventListener("click", function (e) {
      e.preventDefault();
      if (d.dataset.busy) return;
      d.dataset.busy = "1";
      if (!d.open) {
        d.open = true;
        var h = a.scrollHeight;
        a.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" })
          .onfinish = function () { delete d.dataset.busy; };
      } else {
        var h2 = a.offsetHeight;
        var an = a.animate([{ height: h2 + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 300, easing: "cubic-bezier(.4,0,.6,1)" });
        an.onfinish = function () { d.open = false; delete d.dataset.busy; };
      }
    });
  });
})();

/* ---- Home hero background: horizontal 3D double helix, rotating ---- */
(function () {
  var hero = document.querySelector(".hero");
  if (!hero || !document.createElement("canvas").getContext) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cv = document.createElement("canvas");
  cv.className = "hero-helix-fx"; cv.setAttribute("aria-hidden", "true");
  hero.insertBefore(cv, hero.firstChild.nextSibling);
  var g = cv.getContext("2d"), DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  var W = 0, H = 0, visible = true, t = 0;
  // soft glowing sprite for the base-pair nodes
  function sprite(rgb) {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.18, "rgba(" + rgb + ",1)");
    gr.addColorStop(0.45, "rgba(" + rgb + ",.35)"); gr.addColorStop(1, "rgba(" + rgb + ",0)");
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c;
  }
  var CYAN = "86,230,255", BLUE = "96,165,250", sA = sprite(CYAN), sB = sprite(BLUE);
  function size() {
    var r = hero.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (reduce) draw();
  }
  function draw() {
    g.clearRect(0, 0, W, H);
    var mobile = W < 1024;
    var cy = H * 0.56, R = Math.min(150, H * 0.17); // desktop: axis through the middle of the hero
    if (mobile) {                                     // mobile: run it behind the headline
      var h1 = hero.querySelector(".h1-main"), hr = hero.getBoundingClientRect();
      cy = h1 ? h1.getBoundingClientRect().top - hr.top + h1.offsetHeight / 2 : 260;
      R = Math.min(62, W * 0.16);
    }
    var k = (Math.PI * 2) / (mobile ? 300 : 520);    // one full turn per N px
    var tilt = mobile ? -0.05 : -0.09, step = 4, rungGap = mobile ? 18 : 24;
    var pts = [], rungs = [];
    for (var x = -60; x <= W + 60; x += step) {
      var ph = x * k + t;
      pts.push({ x: x, ph: ph });
    }
    function pos(x, ph) {
      var y = cy + R * Math.sin(ph) + (x - W / 2) * tilt, z = Math.cos(ph);
      return { x: x, y: y, z: z };
    }
    // strand segments, split by depth so the back strand is drawn first
    var segs = [];
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i];
      for (var s = 0; s < 2; s++) {
        var o = s * Math.PI, a = pos(p0.x, p0.ph + o), b = pos(p1.x, p1.ph + o);
        segs.push({ a: a, b: b, z: (a.z + b.z) / 2, s: s });
      }
    }
    for (var x2 = -60 + ((t / k) % rungGap); x2 <= W + 60; x2 += rungGap) {
      var ph2 = x2 * k + t, A = pos(x2, ph2), B = pos(x2, ph2 + Math.PI);
      rungs.push({ A: A, B: B, z: 0 });
    }
    // fade at the edges, and keep it quieter behind the text so the copy stays easy to read
    function edgeFade(x) {
      var e = Math.max(0, Math.min(1, x / (W * 0.12), (W - x) / (W * 0.12)));
      if (mobile) return e * 0.45;
      var q = Math.max(0, Math.min(1, (x - W * 0.3) / (W * 0.22)));
      return e * (0.38 + 0.62 * q);
    }
    function strand(list, front) {
      for (var j = 0; j < list.length; j++) {
        var sg = list[j]; if ((sg.z >= 0) !== front) continue;
        var d = (sg.z + 1) / 2, f = edgeFade(sg.a.x);
        g.strokeStyle = "rgba(" + (sg.s ? BLUE : CYAN) + "," + ((0.18 + d * 0.72) * f).toFixed(3) + ")";
        g.lineWidth = 1.2 + d * 2.6;
        g.beginPath(); g.moveTo(sg.a.x, sg.a.y); g.lineTo(sg.b.x, sg.b.y); g.stroke();
      }
    }
    g.lineCap = "round";
    strand(segs, false);
    // base-pair rungs: two halves, one colour from each strand, meeting in the middle
    for (var r = 0; r < rungs.length; r++) {
      var A2 = rungs[r].A, B2 = rungs[r].B, f2 = edgeFade(A2.x);
      if (f2 <= 0) continue;
      var mx = (A2.x + B2.x) / 2, my = (A2.y + B2.y) / 2, depth = 1 - Math.abs(A2.z) * 0.55;
      g.lineWidth = 1.6;
      g.strokeStyle = "rgba(" + CYAN + "," + (0.32 * depth * f2).toFixed(3) + ")";
      g.beginPath(); g.moveTo(A2.x, A2.y); g.lineTo(mx, my); g.stroke();
      g.strokeStyle = "rgba(" + BLUE + "," + (0.32 * depth * f2).toFixed(3) + ")";
      g.beginPath(); g.moveTo(mx, my); g.lineTo(B2.x, B2.y); g.stroke();
      // glowing nodes where the rung meets each strand, sized by depth
      var nodes = [[A2, sA], [B2, sB]];
      for (var n = 0; n < 2; n++) {
        var P = nodes[n][0], dd = (P.z + 1) / 2, sz = (mobile ? 9 : 12) + dd * (mobile ? 12 : 18);
        g.globalAlpha = (0.25 + dd * 0.75) * f2;
        g.drawImage(nodes[n][1], P.x - sz / 2, P.y - sz / 2, sz, sz);
      }
      g.globalAlpha = 1;
    }
    strand(segs, true);
  }
  size();
  if ("ResizeObserver" in window) new ResizeObserver(size).observe(hero); else window.addEventListener("resize", size);
  if (reduce) return;
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
  var prev = performance.now();
  function loop(now) {
    var dt = Math.min((now - prev) / 16.67, 3); prev = now;
    if (visible && !document.hidden) { t += 0.011 * dt; draw(); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ---- Homepage carousel: autoplay, arrows, dots, swipe, keyboard ---- */
(function () {
  document.querySelectorAll(".carousel").forEach(function (car) {
    var track = car.querySelector(".carousel-track"), slides = Array.prototype.slice.call(car.querySelectorAll(".slide"));
    var dots = Array.prototype.slice.call(car.querySelectorAll(".dot")), bar = car.querySelector(".car-progress span");
    var pauseBtn = car.querySelector(".pause"), n = slides.length, i = 0, timer = null, start = 0, DUR = 6000;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var userPaused = reduce, hover = false, inView = true;
    function go(k, user) {
      i = (k + n) % n;
      track.style.transform = "translateX(" + (-100 * i) + "%)";
      slides.forEach(function (s, j) {
        var on = j === i;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
        s.querySelectorAll("a, button").forEach(function (el) { if (on) el.removeAttribute("tabindex"); else el.setAttribute("tabindex", "-1"); });
      });
      dots.forEach(function (d, j) { if (j === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      start = performance.now();
      if (user) car.setAttribute("aria-live", "polite");
    }
    function running() { return !userPaused && !hover && inView && !document.hidden; }
    function tick(now) {
      if (running()) {
        var t = Math.min((now - start) / DUR, 1);
        if (bar) bar.style.transform = "scaleX(" + t + ")";
        if (t >= 1) go(i + 1);
      } else { start = now - (bar ? parseFloat((bar.style.transform.match(/[\d.]+/) || [0])[0]) * DUR : 0); }
      timer = requestAnimationFrame(tick);
    }
    car.querySelector(".next").addEventListener("click", function () { go(i + 1, true); });
    car.querySelector(".prev").addEventListener("click", function () { go(i - 1, true); });
    dots.forEach(function (d, j) { d.addEventListener("click", function () { go(j, true); }); });
    if (pauseBtn) pauseBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
      pauseBtn.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
    });
    if (pauseBtn && reduce) { pauseBtn.setAttribute("aria-pressed", "true"); pauseBtn.setAttribute("aria-label", "Play slideshow"); }
    car.addEventListener("mouseenter", function () { hover = true; });
    car.addEventListener("mouseleave", function () { hover = false; });
    car.addEventListener("focusin", function () { hover = true; });
    car.addEventListener("focusout", function (e) { if (!car.contains(e.relatedTarget)) hover = false; });
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(i + 1, true); e.preventDefault(); }
      if (e.key === "ArrowLeft") { go(i - 1, true); e.preventDefault(); }
    });
    // swipe
    var x0 = null, y0 = null;
    var vp = car.querySelector(".carousel-viewport");
    vp.addEventListener("dragstart", function (e) { e.preventDefault(); });
    vp.addEventListener("pointerdown", function (e) { x0 = e.clientX; y0 = e.clientY; });
    vp.addEventListener("pointercancel", function () { x0 = null; });
    vp.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1), true);
    });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: 0.3 }).observe(car);
    go(0);
    timer = requestAnimationFrame(tick);
  });
})();

/* ---- Animated counters: count up every time they scroll into view (down or up) ---- */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll(".counter"));
  if (!items.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { items.forEach(function (li) { li.classList.add("counted"); }); return; }
  function reset(li) {
    if (li._raf) cancelAnimationFrame(li._raf);
    li._timer && clearTimeout(li._timer);
    li.classList.remove("counted");
    li.querySelector(".num").textContent = "0";
  }
  function run(li) {
    var el = li.querySelector(".num"), target = parseFloat(el.getAttribute("data-count")) || 0;
    void li.offsetWidth;                       // restart CSS animations
    li.classList.add("counted");
    var t0 = performance.now(), dur = 1600 + target * 8;
    (function step(now) {
      var t = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * e);
      if (t < 1) li._raf = requestAnimationFrame(step);
    })(t0);
  }
  items.forEach(reset);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      var li = en.target;
      if (en.isIntersecting) { li._timer = setTimeout(function () { run(li); }, items.indexOf(li) * 150); }
      else { reset(li); }
    });
  }, { threshold: 0.35 });
  items.forEach(function (li) { io.observe(li); });
})();

/* ---- Google Analytics 4 (loads only when a Measurement ID is set in config.js) ---- */
(function () {
  var id = ((window.ZYNVERIX_CONFIG || {}).gaMeasurementId || "").trim();
  if (!/^G-[A-Z0-9]+$/i.test(id) || /^(localhost|127\.)/.test(location.hostname) || location.protocol === "file:") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id);
  var sc = document.createElement("script"); sc.async = true; sc.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(sc);
  // track audit-booking clicks as conversions
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-book]");
    if (a) window.gtag("event", "book_audit_click", { link_url: a.href });
  });
})();
