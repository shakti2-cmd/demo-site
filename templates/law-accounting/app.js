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
        status.textContent = `Thank you, ${contactName}. A senior partner's office will reach out within one business day.`;
      }
      form.reset();
    });
  }
})();
