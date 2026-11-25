(function () {
  'use strict';

  var root = document.documentElement;
  var defaultTheme = root.getAttribute('data-default-theme') || 'light';
  var storageKey = 'na_theme_' + (root.getAttribute('data-site-id') || 'site');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      var label = toggleBtn.querySelector('.theme-label');
      if (label) {
        label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
      toggleBtn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    }
  }

  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch (e) {}
  applyTheme(savedTheme || defaultTheme);

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(root.getAttribute('data-theme') || defaultTheme);

    var toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
          localStorage.setItem(storageKey, next);
        } catch (e) {}
      });
    }

    // Mobile nav toggle
    var menuBtn = document.getElementById('mobile-menu-btn');
    var navMenu = document.getElementById('nav-menu');
    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', function () {
        var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', String(!expanded));
        navMenu.classList.toggle('is-open');
      });
      navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menuBtn.setAttribute('aria-expanded', 'false');
          navMenu.classList.remove('is-open');
        });
      });
    }

    // Category filter tabs (if present)
    var filterBtns = document.querySelectorAll('[data-filter-btn]');
    var filterItems = document.querySelectorAll('[data-filter-item]');
    if (filterBtns.length > 0 && filterItems.length > 0) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var category = btn.getAttribute('data-filter-btn');
          filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          filterItems.forEach(function (item) {
            var cats = (item.getAttribute('data-filter-item') || '').split(' ');
            if (category === 'all' || cats.indexOf(category) !== -1) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }

    // Lightbox modal for Canva portfolio visuals
    var lightbox = document.getElementById('portfolio-lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxTitle = document.getElementById('lightbox-title');
    var lightboxDesc = document.getElementById('lightbox-desc');
    var lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, title, desc) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = title || 'Portfolio visual preview';
      if (lightboxTitle) lightboxTitle.textContent = title || '';
      if (lightboxDesc) lightboxDesc.textContent = desc || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-lightbox-src]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(
          el.getAttribute('data-lightbox-src'),
          el.getAttribute('data-lightbox-title'),
          el.getAttribute('data-lightbox-desc')
        );
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    // FormSubmit AJAX handler
    var contactForm = document.getElementById('contact-form');
    var formStatus = document.getElementById('form-status');
    var submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending Inquiry...';
        }
        if (formStatus) {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }

        var formData = new FormData(contactForm);
        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
          .then(function (response) {
            if (response.ok) {
              contactForm.reset();
              if (formStatus) {
                formStatus.textContent = 'Thank you! Your message has been sent directly to Noel Ayala (noeljedayala@gmail.com).';
                formStatus.className = 'form-status is-success';
              }
            } else {
              throw new Error('Submission failed');
            }
          })
          .catch(function () {
            if (formStatus) {
              formStatus.textContent = 'Could not send via form right now. Please email noeljedayala@gmail.com directly or book a call above.';
              formStatus.className = 'form-status is-error';
            }
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Send Direct Inquiry';
            }
          });
      });
    }
  });
})();
