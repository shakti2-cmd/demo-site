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
})();
