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
})();
