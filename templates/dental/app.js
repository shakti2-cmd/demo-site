(function () {
  const proposalBar = document.getElementById("proposalPreviewBar");
  const dismissBtn = document.getElementById("dismissProposalBar");
  const STORAGE_KEY = "demo_proposal_bar_dismissed";

  if (proposalBar && sessionStorage.getItem(STORAGE_KEY) === "1") {
    proposalBar.hidden = true;
  }

  if (dismissBtn && proposalBar) {
    dismissBtn.addEventListener("click", () => {
      proposalBar.hidden = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
    });
  }

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
    nav.querySelectorAll("a, button").forEach((item) => {
      item.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  const modal = document.getElementById("bookingModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
  }

  document.querySelectorAll(".js-open-booking").forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target && event.target.dataset.closeModal === "true") {
        closeModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
  }

  function bindBookingForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const nameInput = form.querySelector('input[name="name"]');
      const patientName = nameInput ? nameInput.value.trim() : "there";
      if (status) {
        status.textContent = `Thanks, ${patientName}. Our care coordinator will call shortly to confirm your slot.`;
      }
      form.reset();
    });
  }

  bindBookingForm("inlineBookingForm");
  bindBookingForm("modalBookingForm");

  const PALETTES = [
    { name: "Porcelain & Clinical Teal", swatches: ["#0f766e", "#ccfbf1"], vars: { "--primary": "#0f766e", "--primary-dark": "#115e59", "--accent-soft": "#ccfbf1", "--bg": "#f8fafc" } },
    { name: "Ocean Blue & Crisp White", swatches: ["#1d4ed8", "#dbeafe"], vars: { "--primary": "#1d4ed8", "--primary-dark": "#1e40af", "--accent-soft": "#dbeafe", "--bg": "#f8fafc" } },
    { name: "Sage Wellness & Ivory", swatches: ["#2f6f5e", "#dcfce7"], vars: { "--primary": "#2f6f5e", "--primary-dark": "#235347", "--accent-soft": "#dcfce7", "--bg": "#fafaf7" } },
    { name: "Warm Slate & Amber", swatches: ["#0f172a", "#ffedd5"], vars: { "--primary": "#0f172a", "--primary-dark": "#334155", "--accent-soft": "#ffedd5", "--bg": "#f8fafc" } },
    { name: "Calm Indigo & Pearl", swatches: ["#4338ca", "#e0e7ff"], vars: { "--primary": "#4338ca", "--primary-dark": "#3730a3", "--accent-soft": "#e0e7ff", "--bg": "#f8fafc" } }
  ];

  const FONTS = [
    { name: "Modern Clean Sans", heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: "Editorial Serif + Clean Sans", heading: 'Georgia, "Times New Roman", serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: "Classic Executive Serif", heading: 'Georgia, Cambria, "Times New Roman", Times, serif', body: 'Georgia, Cambria, "Times New Roman", Times, serif' }
  ];

  const STYLE_KEY = "demo_style_dental";
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
  const MODAL_KEY = "demo_modal_seen_dental";
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
  const COOKIE_KEY = "demo_cookie_consent_dental";
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
