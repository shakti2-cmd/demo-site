(function () {
  const proposalBar = document.getElementById("proposalPreviewBar");
  const dismissBtn = document.getElementById("dismissProposalBar");
  const STORAGE_KEY = "rh_proposal_bar_dismissed";

  if (proposalBar && sessionStorage.getItem(STORAGE_KEY) === "1") {
    proposalBar.hidden = true;
  }

  if (dismissBtn && proposalBar) {
    dismissBtn.addEventListener("click", () => {
      proposalBar.hidden = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
    });
  }

  const upgradesBtn = document.getElementById("proposalUpgradesBtn");
  const upgradesCard = document.getElementById("proposalUpgradesCard");
  if (upgradesBtn && upgradesCard) {
    function closeUpgrades() {
      upgradesCard.hidden = true;
      upgradesBtn.setAttribute("aria-expanded", "false");
    }
    upgradesBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = upgradesCard.hidden;
      upgradesCard.hidden = !open;
      upgradesBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!upgradesCard.hidden && !upgradesCard.contains(e.target) && !upgradesBtn.contains(e.target)) {
        closeUpgrades();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !upgradesCard.hidden) {
        closeUpgrades();
        upgradesBtn.focus();
      }
    });
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

  const inquiryForm = document.getElementById("heroInquiryForm");
  if (inquiryForm) {
    const status = inquiryForm.querySelector(".form-status");
    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!inquiryForm.reportValidity()) return;
      const firstInput = inquiryForm.querySelector('input[name="firstName"]');
      const name = firstInput ? firstInput.value.trim() : "there";
      if (status) {
        status.textContent = `Thank you, ${name}. Royal House LLC will follow up shortly — or call (770) 895-5843 anytime 9 AM–8 PM.`;
      }
      inquiryForm.reset();
    });
  }

  const cards = Array.from(document.querySelectorAll(".showcase-card"));
  const dots = Array.from(document.querySelectorAll(".carousel-dots .dot"));
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  let activeSlide = 0;

  function updateCarousel(index) {
    if (!cards.length) return;
    activeSlide = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle("is-mobile-active", i === activeSlide);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === activeSlide);
    });
  }

  updateCarousel(0);
  if (prevBtn) prevBtn.addEventListener("click", () => updateCarousel(activeSlide - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateCarousel(activeSlide + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.dataset.slide || 0);
      updateCarousel(idx);
    });
  });

  const captionText = document.getElementById("serviceCaptionText");
  const captionDots = Array.from(document.querySelectorAll(".cap-dot"));
  captionDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      captionDots.forEach((d) => d.classList.remove("is-active"));
      dot.classList.add("is-active");
      if (captionText && dot.dataset.caption) {
        captionText.textContent = dot.dataset.caption;
      }
    });
  });

  const SOLUTIONS = {
    buyers: {
      title: "Buyer Representation Track",
      summary: "Dedicated advocacy from financing alignment through closing table keys.",
      steps: ["Discovery & Pre-Approval", "Targeted Tours & Offer", "Inspection & Closing"],
      inclusions: [
        "Lender introduction & pre-approval readiness",
        "Real-time MLS & Gwinnett pocket alerts",
        "Comparable sales & offer-strength review",
        "Inspection contingency & repair negotiation",
        "Closing attorney & title coordination",
        "Daily 9 AM – 8 PM direct agent access"
      ]
    },
    sellers: {
      title: "Strategic Listing & Valuation Track",
      summary: "Position your property to command top market value across Gwinnett County.",
      steps: ["CMA Valuation & Prep", "Launch & Buyer Screening", "Contract to Closing"],
      inclusions: [
        "Hyper-local Lawrenceville comparative pricing",
        "Pre-listing staging & curb appeal checklist",
        "High-visibility syndication & social reach",
        "Qualified buyer & proof-of-funds vetting",
        "Appraisal & repair credit negotiation",
        "Smooth closing timeline management"
      ]
    },
    investors: {
      title: "Investors & Relocation Track",
      summary: "Data-backed guidance for rental portfolios, commercial sites, and Georgia moves.",
      steps: ["Criteria & Yield Goals", "Corridor & Asset Review", "Acquisition & Transition"],
      inclusions: [
        "Gwinnett & Metro Atlanta rental yield comps",
        "Commercial & land zoning diligence support",
        "Remote video walkthroughs for relocations",
        "School, commute & neighborhood matching",
        "Local vendor & contractor introductions",
        "Long-term portfolio expansion advisory"
      ]
    }
  };

  const tabBtns = Array.from(document.querySelectorAll(".tab-pill"));
  const solTitle = document.getElementById("solutionTitle");
  const solSummary = document.getElementById("solutionSummary");
  const solList = document.getElementById("solutionInclusions");
  const step1 = document.getElementById("step1Label");
  const step2 = document.getElementById("step2Label");
  const step3 = document.getElementById("step3Label");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.tab;
      const data = SOLUTIONS[key];
      if (!data) return;

      tabBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });

      if (solTitle) solTitle.textContent = data.title;
      if (solSummary) solSummary.textContent = data.summary;
      if (step1) step1.textContent = data.steps[0];
      if (step2) step2.textContent = data.steps[1];
      if (step3) step3.textContent = data.steps[2];
      if (solList) {
        solList.innerHTML = data.inclusions.map((item) => `<li>${item}</li>`).join("");
      }
    });
  });

  // Floating Brand-Color & Font Previewer
  const PALETTES = [
    {
      name: "Royal Plum & Gold",
      swatches: ["#261a24", "#e0bf73"],
      vars: {
        "--seed-plum": "#261a24",
        "--seed-plum-mid": "#382635",
        "--seed-gold": "#c59d4f",
        "--seed-gold-bright": "#e0bf73",
        "--seed-champagne": "#ead9a5",
        "--seed-forest": "#12261c"
      }
    },
    {
      name: "Midnight Navy & Champagne",
      swatches: ["#0f2137", "#e3c37b"],
      vars: {
        "--seed-plum": "#0f2137",
        "--seed-plum-mid": "#1c3554",
        "--seed-gold": "#c8a256",
        "--seed-gold-bright": "#e3c37b",
        "--seed-champagne": "#efe3be",
        "--seed-forest": "#0c1a2b"
      }
    },
    {
      name: "Forest Emerald & Ivory",
      swatches: ["#143326", "#e0bf73"],
      vars: {
        "--seed-plum": "#143326",
        "--seed-plum-mid": "#214b39",
        "--seed-gold": "#c59d4f",
        "--seed-gold-bright": "#e0bf73",
        "--seed-champagne": "#e7dec2",
        "--seed-forest": "#0d2119"
      }
    },
    {
      name: "Charcoal Slate & Terracotta",
      swatches: ["#1e242b", "#e28d68"],
      vars: {
        "--seed-plum": "#1e242b",
        "--seed-plum-mid": "#2f3842",
        "--seed-gold": "#c96f4a",
        "--seed-gold-bright": "#e28d68",
        "--seed-champagne": "#f0dccb",
        "--seed-forest": "#15191e"
      }
    },
    {
      name: "Crisp Ivory & Espresso",
      swatches: ["#2c211c", "#d4a259"],
      vars: {
        "--seed-plum": "#2c211c",
        "--seed-plum-mid": "#42332c",
        "--seed-gold": "#b3823d",
        "--seed-gold-bright": "#d4a259",
        "--seed-champagne": "#efe6d8",
        "--seed-forest": "#1e1613"
      }
    }
  ];

  const FONTS = [
    {
      name: "Editorial Serif + Clean Sans",
      heading: 'Georgia, "Times New Roman", serif',
      body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    {
      name: "Modern Geometric Sans",
      heading: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif',
      body: '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif'
    },
    {
      name: "Classic Executive Serif",
      heading: 'Georgia, Cambria, "Times New Roman", Times, serif',
      body: 'Georgia, Cambria, "Times New Roman", Times, serif'
    }
  ];

  const STYLE_KEY = "demo_style_royal_house";
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
    if (paletteList) {
      paletteList.querySelectorAll(".swatch-btn").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.palette === pal.name);
      });
    }
    if (fontList) {
      fontList.querySelectorAll(".font-btn").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.font === fnt.name);
      });
    }
    try {
      sessionStorage.setItem(STYLE_KEY, JSON.stringify({ palette: pal.name, font: fnt.name }));
    } catch (err) {}
  }

  if (paletteList) {
    PALETTES.forEach((pal) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch-btn";
      btn.dataset.palette = pal.name;
      btn.innerHTML = `<span class="swatch-dots"><span class="swatch-dot" style="background:${pal.swatches[0]}"></span><span class="swatch-dot" style="background:${pal.swatches[1]}"></span></span><span>${pal.name}</span>`;
      btn.addEventListener("click", () => {
        state.palette = pal.name;
        applyStyleState();
      });
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
      btn.addEventListener("click", () => {
        state.font = fnt.name;
        applyStyleState();
      });
      fontList.appendChild(btn);
    });
  }

  applyStyleState();

  function setDrawerOpen(open) {
    if (!panel || !toggleBtn) return;
    panel.hidden = !open;
    toggleBtn.setAttribute("aria-expanded", String(open));
  }

  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", () => setDrawerOpen(panel.hidden));
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", () => setDrawerOpen(false));
  }
  if (resetStyleBtn) {
    resetStyleBtn.addEventListener("click", () => {
      state = { palette: PALETTES[0].name, font: FONTS[0].name };
      applyStyleState();
    });
  }

  // Client-Mode Demo Disclaimer Modal
  const demoModal = document.getElementById("demoDisclaimerModal");
  const exploreDemoBtn = document.getElementById("exploreDemoBtn");
  const closeDemoModalX = document.getElementById("closeDemoModalX");
  const MODAL_KEY = "demo_modal_seen_royal_house";

  function dismissDemoModal() {
    if (!demoModal) return;
    if (demoModal.open) demoModal.close();
    try {
      sessionStorage.setItem(MODAL_KEY, "1");
    } catch (err) {}
  }

  if (demoModal && document.body.dataset.previewMode === "client") {
    let seen = false;
    try {
      seen = sessionStorage.getItem(MODAL_KEY) === "1";
    } catch (err) {}
    if (!seen && typeof demoModal.showModal === "function") {
      demoModal.showModal();
    }
    if (exploreDemoBtn) exploreDemoBtn.addEventListener("click", dismissDemoModal);
    if (closeDemoModalX) closeDemoModalX.addEventListener("click", dismissDemoModal);
    demoModal.addEventListener("cancel", () => {
      try {
        sessionStorage.setItem(MODAL_KEY, "1");
      } catch (err) {}
    });
    demoModal.addEventListener("click", (event) => {
      if (event.target === demoModal) dismissDemoModal();
    });
  }

  // Cookie & Local Cache Banner
  const cookieBanner = document.getElementById("cookieConsentBanner");
  const cookieAcceptBtn = document.getElementById("cookieAcceptBtn");
  const cookieEssentialBtn = document.getElementById("cookieEssentialBtn");
  const COOKIE_KEY = "demo_cookie_consent_royal_house";

  if (cookieBanner) {
    let storedChoice = null;
    try {
      storedChoice = localStorage.getItem(COOKIE_KEY);
    } catch (err) {}
    if (!storedChoice) cookieBanner.hidden = false;

    function saveCookieChoice(choice) {
      try {
        localStorage.setItem(COOKIE_KEY, choice);
      } catch (err) {}
      cookieBanner.hidden = true;
    }

    if (cookieAcceptBtn) cookieAcceptBtn.addEventListener("click", () => saveCookieChoice("all"));
    if (cookieEssentialBtn) cookieEssentialBtn.addEventListener("click", () => saveCookieChoice("essential"));
    document.querySelectorAll(".js-open-cookie-prefs").forEach((btn) => {
      btn.addEventListener("click", () => {
        cookieBanner.hidden = false;
      });
    });
  }
})();
