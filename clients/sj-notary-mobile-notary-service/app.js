(function () {
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

  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panel = trigger.nextElementSibling;
      const icon = trigger.querySelector(".faq-icon");
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
      if (icon) icon.textContent = expanded ? "+" : "−";
    });
  });

  const form = document.getElementById("consultForm");
  if (form) {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const nameInput = form.querySelector('input[name="name"]');
      const contactName = nameInput ? nameInput.value.trim() : "Client";
      if (status) {
        status.textContent = `Thank you, ${contactName}. Your mobile notary request is logged in this demo preview — for live 24-hour dispatch across Harris County, call SJ's Mobile Notary Services at (404) 919-0273.`;
      }
      form.reset();
    });
  }

  const PALETTES = [
    {
      name: "SJ Notary Navy & Crimson",
      swatches: ["#0B3052", "#B00E0E"],
      vars: {
        "--navy": "#0b3052",
        "--navy-dark": "#071d33",
        "--navy-light": "#16446e",
        "--accent": "#b00e0e",
        "--accent-hover": "#8e0b0b",
        "--accent-soft": "#fdf2f2",
        "--gold": "#b08938",
        "--gold-soft": "#d4af6a",
        "--bg": "#faf8f5"
      }
    },
    {
      name: "Ivory, Navy & Antique Gold",
      swatches: ["#102A43", "#D4A253"],
      vars: {
        "--navy": "#102a43",
        "--navy-dark": "#0a1929",
        "--navy-light": "#1e3a5f",
        "--accent": "#9a6b25",
        "--accent-hover": "#7a531a",
        "--accent-soft": "#fbf5e8",
        "--gold": "#9a6b25",
        "--gold-soft": "#d4a253",
        "--bg": "#faf8f4"
      }
    },
    {
      name: "Oxford Burgundy & Cream",
      swatches: ["#4A192C", "#9E1B32"],
      vars: {
        "--navy": "#4a192c",
        "--navy-dark": "#330f1d",
        "--navy-light": "#66243d",
        "--accent": "#9e1b32",
        "--accent-hover": "#7d1427",
        "--accent-soft": "#fdf2f4",
        "--gold": "#9a6b25",
        "--gold-soft": "#d4a253",
        "--bg": "#fbf9f5"
      }
    },
    {
      name: "Executive Charcoal & Crimson",
      swatches: ["#1F2937", "#B00E0E"],
      vars: {
        "--navy": "#1f2937",
        "--navy-dark": "#111827",
        "--navy-light": "#374151",
        "--accent": "#b00e0e",
        "--accent-hover": "#8e0b0b",
        "--accent-soft": "#fef2f2",
        "--gold": "#b45309",
        "--gold-soft": "#e5b869",
        "--bg": "#f9fafb"
      }
    },
    {
      name: "Heritage Forest & Brass",
      swatches: ["#143326", "#B08938"],
      vars: {
        "--navy": "#143326",
        "--navy-dark": "#0b1f17",
        "--navy-light": "#1e4736",
        "--accent": "#8f5e1c",
        "--accent-hover": "#724912",
        "--accent-soft": "#faf5ea",
        "--gold": "#9a6b25",
        "--gold-soft": "#d4a253",
        "--bg": "#f8faf7"
      }
    }
  ];

  const FONTS = [
    { name: "Editorial Serif + Clean Sans", heading: 'Georgia, "Times New Roman", serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: "Modern Geometric Sans", heading: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif', body: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif' },
    { name: "Classic Executive Serif", heading: 'Georgia, Cambria, "Times New Roman", Times, serif', body: 'Georgia, Cambria, "Times New Roman", Times, serif' }
  ];

  const STYLE_KEY = "demo_style_sj_notary";
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
  const MODAL_KEY = "demo_modal_seen_sj_notary";
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
  const COOKIE_KEY = "demo_cookie_consent_sj_notary";
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
