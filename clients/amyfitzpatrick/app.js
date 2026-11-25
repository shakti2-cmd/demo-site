(function () {
  // Proposal Preview Bar Calendar Modal
  const bookCallBtn = document.getElementById("bookCallBarBtn");
  const calendarModal = document.getElementById("calendarBookingModal");
  const closeCalendarBtn = document.getElementById("closeCalendarModalBtn");
  if (bookCallBtn && calendarModal) {
    bookCallBtn.addEventListener("click", () => {
      if (typeof calendarModal.showModal === "function") {
        calendarModal.showModal();
      } else {
        window.open("https://calendar.app.google/Q2oPX485GmtjhGrF7", "_blank", "noopener,noreferrer");
      }
    });
    if (closeCalendarBtn) {
      closeCalendarBtn.addEventListener("click", () => calendarModal.close());
    }
    calendarModal.addEventListener("click", (e) => {
      if (e.target === calendarModal) calendarModal.close();
    });
  }

  // Mobile Nav
  const menuBtn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("primaryNav");
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

  // Property Search Filter
  const filterForm = document.getElementById("propertyFilterForm");
  const locationSel = document.getElementById("filterLocation");
  const typeSel = document.getElementById("filterType");
  const summaryEl = document.getElementById("filterSummary");
  const listingCards = Array.from(document.querySelectorAll(".listing-card"));

  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const loc = locationSel ? locationSel.value : "all";
      const type = typeSel ? typeSel.value : "all";
      let shown = 0;
      listingCards.forEach((card) => {
        const matchLoc = loc === "all" || card.dataset.location === loc;
        const matchType = type === "all" || card.dataset.type === type;
        const visible = matchLoc && matchType;
        card.hidden = !visible;
        if (visible) shown += 1;
      });
      if (summaryEl) {
        summaryEl.textContent = shown > 0
          ? `Showing ${shown} matching Charleston & Lowcountry residence${shown === 1 ? "" : "s"}.`
          : "No exact filter match — contact Amy below for off-market MLS listings.";
      }
      const listingsSec = document.getElementById("listings");
      if (listingsSec) listingsSec.scrollIntoView({ behavior: "smooth" });
    });
  }

  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const liked = btn.classList.toggle("is-liked");
      btn.setAttribute("aria-pressed", String(liked));
      btn.innerHTML = liked ? "&#9829;" : "&#9825;";
    });
  });

  // Client Testimonials Carousel (3 verified client reviews)
  const REVIEWS = [
    {
      quote: "“When relocating from out of state it is important that you have an agent working on your behalf who is available and very knowledgeable about the city. Amy worked hard for close to four months and ultimately helped us close on our dream home.”",
      author: "Charleston Relocation Client — 5.0 ★"
    },
    {
      quote: "“Amy is an effective, pro-active real estate agent who recently helped my wife and I relocate across the country. She described schools, neighborhoods, culture, and history—resulting in closing on a home that met all our top priorities.”",
      author: "Cross-Country Buyer — 5.0 ★"
    },
    {
      quote: "“Amy has been helping me to locate an investment property to purchase. She is extremely knowledgeable about the Charleston area and about current market pricing and conditions. I am a very happy customer.”",
      author: "Charleston Investor — 5.0 ★"
    }
  ];

  const quoteEl = document.getElementById("reviewQuote");
  const authorEl = document.getElementById("reviewAuthor");
  const revDots = Array.from(document.querySelectorAll(".rev-dot"));
  const revPrev = document.getElementById("reviewPrev");
  const revNext = document.getElementById("reviewNext");
  let activeRev = 0;

  function renderReview(idx) {
    if (!quoteEl || !authorEl) return;
    activeRev = (idx + REVIEWS.length) % REVIEWS.length;
    quoteEl.textContent = REVIEWS[activeRev].quote;
    authorEl.textContent = REVIEWS[activeRev].author;
    revDots.forEach((d, i) => d.classList.toggle("is-active", i === activeRev));
  }

  renderReview(0);
  let reviewTimer = null;
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startReviewAutoplay() {
    if (prefersReducedMotion || reviewTimer) return;
    reviewTimer = setInterval(() => renderReview(activeRev + 1), 5500);
  }

  function stopReviewAutoplay() {
    if (!reviewTimer) return;
    clearInterval(reviewTimer);
    reviewTimer = null;
  }

  function resetReviewAutoplay() {
    stopReviewAutoplay();
    startReviewAutoplay();
  }

  if (revPrev) revPrev.addEventListener("click", () => { renderReview(activeRev - 1); resetReviewAutoplay(); });
  if (revNext) revNext.addEventListener("click", () => { renderReview(activeRev + 1); resetReviewAutoplay(); });
  revDots.forEach((dot) => dot.addEventListener("click", () => { renderReview(Number(dot.dataset.rev || 0)); resetReviewAutoplay(); }));

  const reviewsSection = document.getElementById("reviews");
  if (reviewsSection) {
    reviewsSection.addEventListener("mouseenter", stopReviewAutoplay);
    reviewsSection.addEventListener("mouseleave", startReviewAutoplay);
    reviewsSection.addEventListener("focusin", stopReviewAutoplay);
    reviewsSection.addEventListener("focusout", startReviewAutoplay);
  }
  startReviewAutoplay();

  // Consultation Form
  const consultForm = document.getElementById("consultForm");
  if (consultForm) {
    const status = consultForm.querySelector(".form-status");
    consultForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!consultForm.reportValidity()) return;
      const nameVal = consultForm.querySelector('input[name="name"]')?.value.trim() || "there";
      if (status) status.textContent = `Thank you, ${nameVal}. Amy will follow up shortly — or call (843) 813-9505 anytime.`;
      consultForm.reset();
    });
  }

  // Floating Brand-Color & Font Previewer
  const PALETTES = [
    { name: "Amy FitzPatrick Lowcountry", swatches: ["#173a35", "#b89352"], vars: { "--seed-pine": "#173a35", "--seed-pine-dark": "#102925", "--seed-gold": "#b89352", "--seed-gold-bright": "#d4b06f", "--seed-linen": "#faf7f2", "--seed-linen-alt": "#f2ece1", "--seed-navy": "#13263a" } },
    { name: "Coastal Slate & Blush Sand", swatches: ["#4a6369", "#dfb9a3"], vars: { "--seed-pine": "#4a6369", "--seed-pine-dark": "#2d3f44", "--seed-gold": "#b67e63", "--seed-gold-bright": "#dfb9a3", "--seed-linen": "#fbf9f7", "--seed-linen-alt": "#f1ece8", "--seed-navy": "#2d3f44" } },
    { name: "Harbor Navy & Champagne", swatches: ["#13263a", "#c8a256"], vars: { "--seed-pine": "#13263a", "--seed-pine-dark": "#0b1826", "--seed-gold": "#c8a256", "--seed-gold-bright": "#e3c37b", "--seed-linen": "#faf8f4", "--seed-linen-alt": "#f0ebe0", "--seed-navy": "#13263a" } },
    { name: "Palmetto Sage & Ivory", swatches: ["#2f5241", "#b89352"], vars: { "--seed-pine": "#2f5241", "--seed-pine-dark": "#1d352a", "--seed-gold": "#b89352", "--seed-gold-bright": "#d4b06f", "--seed-linen": "#faf9f5", "--seed-linen-alt": "#eef0ea", "--seed-navy": "#1f3a2e" } },
    { name: "Charcoal & Warm Terracotta", swatches: ["#1f2937", "#c96f4a"], vars: { "--seed-pine": "#1f2937", "--seed-pine-dark": "#111827", "--seed-gold": "#c96f4a", "--seed-gold-bright": "#e28d68", "--seed-linen": "#faf8f6", "--seed-linen-alt": "#f1ece7", "--seed-navy": "#1f2937" } }
  ];

  const FONTS = [
    { name: "Editorial Serif + Clean Sans", heading: 'Georgia, "Times New Roman", serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: "Modern Geometric Sans", heading: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif', body: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif' },
    { name: "Classic Executive Serif", heading: 'Georgia, Cambria, "Times New Roman", Times, serif', body: 'Georgia, Cambria, "Times New Roman", Times, serif' }
  ];

  const STYLE_KEY = "demo_style_amy_fitzpatrick";
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

  // Client Load Modal
  const demoModal = document.getElementById("demoDisclaimerModal");
  const exploreDemoBtn = document.getElementById("exploreDemoBtn");
  const closeDemoModalX = document.getElementById("closeDemoModalX");
  const MODAL_KEY = "demo_modal_seen_amy_fitzpatrick";
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

  // Cookie & Local Cache Banner
  const cookieBanner = document.getElementById("cookieConsentBanner");
  const cookieAcceptBtn = document.getElementById("cookieAcceptBtn");
  const cookieEssentialBtn = document.getElementById("cookieEssentialBtn");
  const COOKIE_KEY = "demo_cookie_consent_amy_fitzpatrick";
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
