(function () {
  // 1. Sticky Header Scroll State & Mobile Menu
  const header = document.getElementById("siteHeader");
  const menuBtn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("primaryNav");

  function syncHeaderScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", syncHeaderScroll, { passive: true });
  syncHeaderScroll();

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active Navigation Underline + Scroll Reveals + Count-Up Stats
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[data-nav]"));
  const sections = navLinks.map((a) => document.getElementById(a.dataset.nav)).filter(Boolean);

  if ("IntersectionObserver" in window) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((sec) => secObs.observe(sec));

    const revObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => revObs.observe(el));

    const statsStrip = document.getElementById("statsStrip");
    if (statsStrip) {
      const statObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          document.querySelectorAll(".count-num").forEach((el) => {
            const target = Number(el.dataset.target || 0);
            const suffix = el.dataset.suffix || "";
            if (reducedMotion) { el.textContent = `${target}${suffix}`; return; }
            const start = performance.now();
            function tick(now) {
              const p = Math.min((now - start) / 1100, 1);
              el.textContent = `${Math.round(target * p)}${suffix}`;
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          });
        });
      }, { threshold: 0.35 });
      statObs.observe(statsStrip);
    }
  } else {
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll(".count-num").forEach((el) => { el.textContent = `${el.dataset.target || 0}${el.dataset.suffix || ""}`; });
  }

  // Inquiry Pre-selection Helper
  const inquiryTypeSel = document.getElementById("inqType");
  const inquirySec = document.getElementById("inquiry");
  function routeToInquiry(typeValue) {
    if (inquiryTypeSel && typeValue) inquiryTypeSel.value = typeValue;
    if (inquirySec) inquirySec.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }
  document.querySelectorAll(".js-inquire-cake, .js-inquire-class").forEach((btn) => {
    btn.addEventListener("click", () => routeToInquiry(btn.dataset.inquiryType));
  });

  // 4. Custom Cakes Lightbox
  const CAKE_SLIDES = [
    { title: "Wedding Cakes", src: "./assets/wedding-gold-cake.webp", desc: "Architectural multi-tier wedding centerpieces with delicate sugar florals and gold leaf." },
    { title: "Birthday Cakes", src: "./assets/birthday-floral-cake.webp", desc: "Custom buttercream rosettes, piped florals, and celebratory toppers." },
    { title: "Anniversary Cakes", src: "./assets/anniversary-floral-cake.webp", desc: "Romantic tiered floral cakes crafted for milestone anniversaries." },
    { title: "Baptism Cakes", src: "./assets/bridal-strawberries.webp", desc: "Timeless white-on-white designs paired with tiered chocolate-dipped treats." },
    { title: "Baby Shower Cakes", src: "./assets/floral-cupcakes.webp", desc: "Soft pastel cakes, gourmet berry cupcakes, and dessert bundles." },
    { title: "Custom Celebration Cakes", src: "./assets/celebration-collection.webp", desc: "Quinceañeras, Sweet Sixteens, and one-of-a-kind showstopping centerpieces." }
  ];
  const cakeLb = document.getElementById("cakeLightbox");
  const cakeLbTitle = document.getElementById("cakeLightboxTitle");
  const cakeLbImg = document.getElementById("cakeLightboxImg");
  const cakeLbDesc = document.getElementById("cakeLightboxDesc");
  let cakeIdx = 0;

  function showCakeSlide(i) {
    cakeIdx = (i + CAKE_SLIDES.length) % CAKE_SLIDES.length;
    const item = CAKE_SLIDES[cakeIdx];
    if (cakeLbTitle) cakeLbTitle.textContent = item.title;
    if (cakeLbImg) { cakeLbImg.src = item.src; cakeLbImg.alt = item.title; }
    if (cakeLbDesc) cakeLbDesc.textContent = item.desc;
  }

  document.querySelectorAll(".cake-preview-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".cake-card");
      showCakeSlide(Number(card ? card.dataset.cakeIndex : 0));
      if (cakeLb && typeof cakeLb.showModal === "function") cakeLb.showModal();
    });
  });
  document.getElementById("closeCakeLightbox")?.addEventListener("click", () => cakeLb?.close());
  document.getElementById("cakePrevBtn")?.addEventListener("click", () => showCakeSlide(cakeIdx - 1));
  document.getElementById("cakeNextBtn")?.addEventListener("click", () => showCakeSlide(cakeIdx + 1));
  cakeLb?.addEventListener("click", (e) => { if (e.target === cakeLb) cakeLb.close(); });

  // 5. Academy Course Details Modal
  const COURSES = {
    reposteria: {
      title: "Repostería Básica y Avanzada",
      badge: "Beginner → Advanced",
      body: "Bilingual EN/ES hands-on training covering foundational baking science through sharp-edged tiered cakes.",
      syllabus: ["Moist sponge, pound, and chocolate cake ratios", "Swiss & Italian meringue buttercream stability", "Crumb coat, leveling, and sharp-edge finishing", "Filling balance & structural doweling"]
    },
    pasteleria: {
      title: "Pastelería Internacional",
      badge: "All Levels",
      body: "Craft refined European-style desserts, mousses, and boutique dessert-bar assortments.",
      syllabus: ["Classic pastry creams, curds, and ganaches", "Fruit tarts & individual dessert cup layering", "Chocolate tempering & dipped strawberry finishes", "Event dessert bundle presentation"]
    },
    panaderia: {
      title: "Panadería Artesanal",
      badge: "Beginner",
      body: "Practical fermentation and shaping techniques for warm artisan breads and sweet doughs.",
      syllabus: ["Yeast hydration, kneading & proofing control", "Enriched brioche & sweet breakfast rolls", "Scoring, baking temperatures & crust texture", "Small-batch studio workflow"]
    },
    floral: {
      title: "Modern Floral & Fondant Design",
      badge: "All Levels",
      body: "Master buttercream floral bouquets, clean fondant paneling, and pricing your custom cake business.",
      syllabus: ["Russian & petal piping tips for floral cupcakes", "Fondant kneading, paneling & marble effects", "Color harmony & gold-leaf accents", "Client quoting & cost calculation"]
    }
  };
  const courseModal = document.getElementById("courseModal");
  const cTitle = document.getElementById("courseModalTitle");
  const cBadge = document.getElementById("courseModalBadge");
  const cBody = document.getElementById("courseModalBody");
  const cSyllabus = document.getElementById("courseModalSyllabus");

  document.querySelectorAll(".js-open-course").forEach((btn) => {
    btn.addEventListener("click", () => {
      const data = COURSES[btn.dataset.course];
      if (!data || !courseModal) return;
      if (cTitle) cTitle.textContent = data.title;
      if (cBadge) cBadge.textContent = data.badge;
      if (cBody) cBody.textContent = data.body;
      if (cSyllabus) cSyllabus.innerHTML = data.syllabus.map((s) => `<li>${s}</li>`).join("");
      if (typeof courseModal.showModal === "function") courseModal.showModal();
    });
  });
  document.getElementById("closeCourseModal")?.addEventListener("click", () => courseModal?.close());
  document.getElementById("courseModalInquire")?.addEventListener("click", () => {
    courseModal?.close();
    routeToInquiry("Academy / Classes");
  });
  courseModal?.addEventListener("click", (e) => { if (e.target === courseModal) courseModal.close(); });

  // 7. Masonry Gallery Filters & Lightbox
  const filterBtns = Array.from(document.querySelectorAll(".filter-chip"));
  const galleryItems = Array.from(document.querySelectorAll(".masonry-item"));
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter || "all";
      filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      galleryItems.forEach((item) => {
        item.hidden = !(cat === "all" || item.dataset.category === cat);
      });
    });
  });

  const galLb = document.getElementById("galleryLightbox");
  const galLbTitle = document.getElementById("galleryLightboxTitle");
  const galLbImg = document.getElementById("galleryLightboxImg");
  let visibleGallery = galleryItems;
  let galIdx = 0;

  function showGallerySlide(i) {
    if (!visibleGallery.length) return;
    galIdx = (i + visibleGallery.length) % visibleGallery.length;
    const item = visibleGallery[galIdx];
    if (galLbTitle) galLbTitle.textContent = item.dataset.caption || "Creation Preview";
    if (galLbImg) { galLbImg.src = item.dataset.src || ""; galLbImg.alt = item.dataset.caption || ""; }
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      visibleGallery = galleryItems.filter((el) => !el.hidden);
      showGallerySlide(Math.max(0, visibleGallery.indexOf(item)));
      if (galLb && typeof galLb.showModal === "function") galLb.showModal();
    });
  });
  document.getElementById("closeGalleryLightbox")?.addEventListener("click", () => galLb?.close());
  document.getElementById("galPrevBtn")?.addEventListener("click", () => showGallerySlide(galIdx - 1));
  document.getElementById("galNextBtn")?.addEventListener("click", () => showGallerySlide(galIdx + 1));
  galLb?.addEventListener("click", (e) => { if (e.target === galLb) galLb.close(); });
  document.addEventListener("keydown", (e) => {
    if (galLb && galLb.open) {
      if (e.key === "ArrowLeft") showGallerySlide(galIdx - 1);
      if (e.key === "ArrowRight") showGallerySlide(galIdx + 1);
    }
    if (cakeLb && cakeLb.open) {
      if (e.key === "ArrowLeft") showCakeSlide(cakeIdx - 1);
      if (e.key === "ArrowRight") showCakeSlide(cakeIdx + 1);
    }
  });

  // 8. Unified FormSubmit AJAX Form with Validation & 5 MB File Check
  const form = document.getElementById("unifiedInquiryForm");
  const submitBtn = document.getElementById("inquirySubmitBtn");
  const statusBox = document.getElementById("inquiryStatus");
  const photoInput = document.getElementById("inqPhoto");

  if (form && submitBtn && statusBox) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      document.querySelectorAll(".field-error").forEach((el) => { el.textContent = ""; });
      statusBox.textContent = "";
      statusBox.className = "form-status";

      const nameVal = document.getElementById("inqName")?.value.trim() || "";
      const emailVal = document.getElementById("inqEmail")?.value.trim() || "";
      const msgVal = document.getElementById("inqMsg")?.value.trim() || "";
      const consentChecked = document.getElementById("inqConsent")?.checked;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      let valid = true;

      if (!nameVal) { document.getElementById("errName").textContent = "Please enter your full name."; valid = false; }
      if (!emailOk) { document.getElementById("errEmail").textContent = "Please enter a valid email address."; valid = false; }
      if (!msgVal) { document.getElementById("errMsg").textContent = "Please describe your cake or class inquiry."; valid = false; }
      if (!consentChecked) { document.getElementById("errConsent").textContent = "Please accept the Privacy Policy to continue."; valid = false; }
      if (photoInput?.files?.[0] && photoInput.files[0].size > 5 * 1024 * 1024) {
        document.getElementById("errPhoto").textContent = "Reference photo must be under 5 MB.";
        valid = false;
      }
      if (!valid) return;

      submitBtn.disabled = true;
      const labelEl = submitBtn.querySelector(".btn-label");
      if (labelEl) labelEl.textContent = "Sending...";

      try {
        const res = await fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        statusBox.classList.add("is-success");
        statusBox.textContent = `Thank you, ${nameVal}! Your inquiry was sent to Guadalupe's studio — we will reply shortly.`;
        form.reset();
      } catch (err) {
        statusBox.classList.add("is-error");
        statusBox.innerHTML = 'Unable to send right now. Please email <a href="mailto:cakesclasses4you@gmail.com">cakesclasses4you@gmail.com</a> or call (678) 308-9570.';
      } finally {
        submitBtn.disabled = false;
        if (labelEl) labelEl.textContent = "Send Inquiry";
      }
    });
  }

  // Standard 00_demo-sites Proposal Calendar Modal, Brand Customizer, Client Modal & Cookie Banner
  const bookCallBtn = document.getElementById("bookCallBarBtn");
  const calendarModal = document.getElementById("calendarBookingModal");
  const closeCalendarBtn = document.getElementById("closeCalendarModalBtn");
  if (bookCallBtn && calendarModal) {
    bookCallBtn.addEventListener("click", () => {
      if (typeof calendarModal.showModal === "function") calendarModal.showModal();
      else window.open("https://calendar.app.google/Q2oPX485GmtjhGrF7", "_blank", "noopener,noreferrer");
    });
    if (closeCalendarBtn) closeCalendarBtn.addEventListener("click", () => calendarModal.close());
    calendarModal.addEventListener("click", (e) => { if (e.target === calendarModal) calendarModal.close(); });
  }

  const PALETTES = [
    { name: "Boutique Blush & Burgundy", swatches: ["#7d1443", "#df8ab6"], vars: { "--seed-burgundy": "#7d1443", "--seed-burgundy-dark": "#5c0d30", "--seed-blush": "#f7e6ee", "--seed-rose": "#df8ab6", "--seed-ivory": "#fdfaf6", "--seed-cream": "#f5ede4", "--seed-champagne": "#d9b589" } },
    { name: "Champagne Ivory & Espresso", swatches: ["#4a2c22", "#d9b589"], vars: { "--seed-burgundy": "#4a2c22", "--seed-burgundy-dark": "#331d16", "--seed-blush": "#f4eadc", "--seed-rose": "#c89b6e", "--seed-ivory": "#fdfaf6", "--seed-cream": "#f3eae0", "--seed-champagne": "#d9b589" } },
    { name: "Rosewater & Velvet Plum", swatches: ["#5c1d4c", "#e8a5c4"], vars: { "--seed-burgundy": "#5c1d4c", "--seed-burgundy-dark": "#3f1234", "--seed-blush": "#f6e7f0", "--seed-rose": "#e8a5c4", "--seed-ivory": "#fcf9fb", "--seed-cream": "#f4ebf1", "--seed-champagne": "#e4c2a3" } },
    { name: "Peachtree Sage & Gold", swatches: ["#2d5342", "#d9b589"], vars: { "--seed-burgundy": "#2d5342", "--seed-burgundy-dark": "#1e382c", "--seed-blush": "#eaf2ed", "--seed-rose": "#9bbfac", "--seed-ivory": "#fafbf9", "--seed-cream": "#eef2ee", "--seed-champagne": "#d9b589" } },
    { name: "Midnight Patisserie & Blush", swatches: ["#1f2433", "#e6a4be"], vars: { "--seed-burgundy": "#1f2433", "--seed-burgundy-dark": "#131722", "--seed-blush": "#f5e9ef", "--seed-rose": "#e6a4be", "--seed-ivory": "#fafafa", "--seed-cream": "#f1f0f4", "--seed-champagne": "#d9b589" } }
  ];

  const FONTS = [
    { name: "Editorial Serif + Clean Sans", heading: 'Georgia, "Times New Roman", serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: "Modern Geometric Sans", heading: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif', body: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif' },
    { name: "Classic Executive Serif", heading: 'Georgia, Cambria, "Times New Roman", Times, serif', body: 'Georgia, Cambria, "Times New Roman", Times, serif' }
  ];

  const STYLE_KEY = "demo_style_cakes_boutique";
  const toggleBtn = document.getElementById("customizerToggle");
  const panel = document.getElementById("customizerPanel");
  const closeDrawerBtn = document.getElementById("customizerClose");
  const paletteList = document.getElementById("paletteList");
  const fontList = document.getElementById("fontList");
  const activePaletteLabel = document.getElementById("activePaletteName");
  const activeFontLabel = document.getElementById("activeFontName");
  const resetStyleBtn = document.getElementById("resetStyleBtn");

  let state = { palette: PALETTES[0].name, font: FONTS[0].name };
  try {
    const saved = JSON.parse(sessionStorage.getItem(STYLE_KEY) || "null");
    if (saved && saved.palette && saved.font) state = saved;
  } catch (err) {}

  function applyStyleState() {
    const pal = PALETTES.find((p) => p.name === state.palette) || PALETTES[0];
    const fnt = FONTS.find((f) => f.name === state.font) || FONTS[0];
    Object.entries(pal.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    document.documentElement.style.setProperty("--font-heading", fnt.heading);
    document.documentElement.style.setProperty("--font-body", fnt.body);
    if (activePaletteLabel) activePaletteLabel.textContent = pal.name;
    if (activeFontLabel) activeFontLabel.textContent = fnt.name;
    if (paletteList) paletteList.querySelectorAll(".swatch-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.palette === pal.name));
    if (fontList) fontList.querySelectorAll(".font-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.font === fnt.name));
    try { sessionStorage.setItem(STYLE_KEY, JSON.stringify({ palette: pal.name, font: fnt.name })); } catch (err) {}
  }

  if (paletteList) {
    PALETTES.forEach((pal) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch-btn";
      btn.dataset.palette = pal.name;
      btn.innerHTML = `<span class="swatch-dots"><span class="swatch-dot" style="background:${pal.swatches[0]}"></span><span class="swatch-dot" style="background:${pal.swatches[1]}"></span></span><span>${pal.name}</span>`;
      btn.addEventListener("click", () => { state.palette = pal.name; applyStyleState(); });
      paletteList.appendChild(btn);
    });
  }
  if (fontList) {
    FONTS.forEach((fnt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-btn";
      btn.dataset.font = fnt.name;
      btn.textContent = fnt.name;
      btn.addEventListener("click", () => { state.font = fnt.name; applyStyleState(); });
      fontList.appendChild(btn);
    });
  }
  applyStyleState();

  if (toggleBtn && panel) toggleBtn.addEventListener("click", () => { const open = panel.hidden; panel.hidden = !open; toggleBtn.setAttribute("aria-expanded", String(open)); });
  if (closeDrawerBtn && panel && toggleBtn) closeDrawerBtn.addEventListener("click", () => { panel.hidden = true; toggleBtn.setAttribute("aria-expanded", "false"); });
  if (resetStyleBtn) resetStyleBtn.addEventListener("click", () => { state = { palette: PALETTES[0].name, font: FONTS[0].name }; applyStyleState(); });

  const demoModal = document.getElementById("demoDisclaimerModal");
  const exploreDemoBtn = document.getElementById("exploreDemoBtn");
  const closeDemoModalX = document.getElementById("closeDemoModalX");
  const MODAL_KEY = "demo_modal_seen_cakes_boutique";
  function dismissDemoModal() {
    if (!demoModal) return;
    if (demoModal.open) demoModal.close();
    try { sessionStorage.setItem(MODAL_KEY, "1"); } catch (err) {}
  }
  if (demoModal && document.body.dataset.previewMode === "client") {
    let seen = false;
    try { seen = sessionStorage.getItem(MODAL_KEY) === "1"; } catch (err) {}
    if (!seen && typeof demoModal.showModal === "function") demoModal.showModal();
    if (exploreDemoBtn) exploreDemoBtn.addEventListener("click", dismissDemoModal);
    if (closeDemoModalX) closeDemoModalX.addEventListener("click", dismissDemoModal);
    demoModal.addEventListener("cancel", () => { try { sessionStorage.setItem(MODAL_KEY, "1"); } catch (err) {} });
    demoModal.addEventListener("click", (e) => { if (e.target === demoModal) dismissDemoModal(); });
  }

  const cookieBanner = document.getElementById("cookieConsentBanner");
  const cookieAcceptBtn = document.getElementById("cookieAcceptBtn");
  const cookieEssentialBtn = document.getElementById("cookieEssentialBtn");
  const COOKIE_KEY = "demo_cookie_consent_cakes_boutique";
  if (cookieBanner) {
    let storedChoice = null;
    try { storedChoice = localStorage.getItem(COOKIE_KEY); } catch (err) {}
    if (!storedChoice) cookieBanner.hidden = false;
    function saveCookieChoice(choice) {
      try { localStorage.setItem(COOKIE_KEY, choice); } catch (err) {}
      cookieBanner.hidden = true;
    }
    if (cookieAcceptBtn) cookieAcceptBtn.addEventListener("click", () => saveCookieChoice("all"));
    if (cookieEssentialBtn) cookieEssentialBtn.addEventListener("click", () => saveCookieChoice("essential"));
    document.querySelectorAll(".js-open-cookie-prefs").forEach((btn) => btn.addEventListener("click", () => { cookieBanner.hidden = false; }));
  }
})();
