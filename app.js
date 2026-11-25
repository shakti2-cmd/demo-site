(function () {
  // Theme persistence (default: crisp light paper)
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const THEME_KEY = "demo_showcase_theme";

  function applyTheme(theme) {
    const resolved = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", resolved);
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(resolved === "dark"));
      themeBtn.textContent = resolved === "dark" ? "Light Mode" : "Dark Mode";
    }
    try {
      localStorage.setItem(THEME_KEY, resolved);
    } catch (err) {}
  }

  let initialTheme = "light";
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") initialTheme = saved;
  } catch (err) {}
  applyTheme(initialTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Mobile menu drawer
  const menuBtn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("primaryNav");
  if (menuBtn && nav) {
    function closeMenu() {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  // FormSubmit AJAX contact form
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      formStatus.textContent = "";
      formStatus.classList.remove("is-error", "is-success");

      try {
        const res = await fetch(contactForm.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contactForm)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        formStatus.classList.add("is-success");
        formStatus.textContent = "Inquiry sent! Noel will reply to your email within 4 hours.";
        contactForm.reset();
      } catch (err) {
        formStatus.classList.add("is-error");
        formStatus.innerHTML = 'Could not submit via web form right now. Please email <a href="mailto:noeljedayala@gmail.com">noeljedayala@gmail.com</a> directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
})();
