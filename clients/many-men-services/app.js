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

  const form = document.getElementById("estimateForm");
  if (form) {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const nameInput = form.querySelector('input[name="name"]');
      const serviceSelect = form.querySelector('select[name="service"]');
      const caller = nameInput ? nameInput.value.trim() : "Homeowner";
      const service = serviceSelect ? serviceSelect.value : "Cleaning Service";
      if (status) {
        status.textContent = `Quote request logged for ${caller} (${service}) in this demo preview. For live Atlanta scheduling, call Many Men Services at (404) 399-4765.`;
      }
      form.reset();
    });
  }

  const PALETTES = [
    {
      name: "Many Men Royal Blue & Navy",
      swatches: ["#0052C2", "#0F2038"],
      vars: {
        "--primary": "#0052c2",
        "--primary-hover": "#003e96",
        "--primary-soft": "#e6f0fc",
        "--navy": "#0f2038",
        "--navy-dark": "#091526",
        "--surface-alt": "#f4f8fc",
        "--border": "#dbe6f3"
      }
    },
    {
      name: "Teal Fresh & Deep Slate",
      swatches: ["#0D9488", "#0F172A"],
      vars: {
        "--primary": "#0d9488",
        "--primary-hover": "#0f766e",
        "--primary-soft": "#e6f7f5",
        "--navy": "#0f172a",
        "--navy-dark": "#020617",
        "--surface-alt": "#f2fbfa",
        "--border": "#ccebe7"
      }
    },
    {
      name: "Cobalt & Sparkle Gold",
      swatches: ["#1D4ED8", "#F59E0B"],
      vars: {
        "--primary": "#1d4ed8",
        "--primary-hover": "#1e40af",
        "--primary-soft": "#e8effe",
        "--navy": "#172554",
        "--navy-dark": "#0f172a",
        "--surface-alt": "#f5f8ff",
        "--border": "#d7e3fc"
      }
    },
    {
      name: "Executive Charcoal & Sky",
      swatches: ["#1F2937", "#0284C7"],
      vars: {
        "--primary": "#0284c7",
        "--primary-hover": "#0369a1",
        "--primary-soft": "#e6f4fc",
        "--navy": "#1f2937",
        "--navy-dark": "#111827",
        "--surface-alt": "#f4f8fb",
        "--border": "#dbe5ee"
      }
    },
    {
      name: "Fresh Emerald & Navy",
      swatches: ["#047857", "#0F2038"],
      vars: {
        "--primary": "#047857",
        "--primary-hover": "#065f46",
        "--primary-soft": "#e6f5ef",
        "--navy": "#0f2038",
        "--navy-dark": "#091526",
        "--surface-alt": "#f3faf7",
        "--border": "#cfe8de"
      }
    }
  ];

  const FONTS = [
    { name: "Modern Geometric Sans", heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: "Editorial Serif + Clean Sans", heading: 'Georgia, "Times New Roman", serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: "Classic Executive Serif", heading: 'Georgia, Cambria, "Times New Roman", Times, serif', body: 'Georgia, Cambria, "Times New Roman", Times, serif' }
  ];

  const STYLE_KEY = "demo_style_many_men_services";
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
  const MODAL_KEY = "demo_modal_seen_many_men_services";
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
  const COOKIE_KEY = "demo_cookie_consent_many_men_services";
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
