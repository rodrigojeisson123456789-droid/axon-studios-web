"use strict";

// Motion is an enhancement: no animation loop, canvas, or hidden core content.
(() => {
  const root = document.documentElement;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector("#motion-toggle");
  let userPaused = false;
  try {
    userPaused = localStorage.getItem("axon-motion") === "paused";
  } catch {
    /* Storage can be unavailable. */
  }
  let enabled = false;
  let revealObserver;
  let visibilityObserver;
  const targets = [
    ...document.querySelectorAll(
      ".section-heading, .service-card, .process-grid li, .principle, .faq-section > div, .contact-copy, .contact-form",
    ),
  ];

  function reveal(element, animate = true) {
    element.classList.remove("reveal-pending");
    if (animate) element.classList.add("is-revealed");
    revealObserver?.unobserve(element);
  }

  function update() {
    enabled = !preference.matches && !userPaused;
    root.dataset.motion = enabled ? "on" : "off";
    if (toggle) {
      toggle.hidden = preference.matches;
      toggle.querySelector(".motion-label").textContent = enabled
        ? "Pausar animaciones"
        : "Activar animaciones";
      toggle.querySelector(".motion-icon").textContent = enabled ? "Ⅱ" : "▷";
    }
    if (!enabled) {
      revealObserver?.disconnect();
      visibilityObserver?.disconnect();
      targets.forEach((element) => {
        element.classList.remove("reveal-pending", "is-revealed");
      });
      return;
    }
    // No support means fully visible, static sections rather than missing content.
    if ("IntersectionObserver" in window) {
      revealObserver?.disconnect();
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      targets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // Only stage sections below the viewport. Never hide initial content.
        if (rect.top >= window.innerHeight) {
          element.classList.add("reveal-pending");
          revealObserver.observe(element);
        }
      });
      const art = document.querySelector(".hero-art");
      visibilityObserver?.disconnect();
      visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.active = String(entry.isIntersecting);
        });
      });
      if (art) visibilityObserver.observe(art);
      const hero = document.querySelector(".hero-original");
      if (hero) visibilityObserver.observe(hero);
    }
  }

  document
    .querySelectorAll(".services-grid, .process-grid")
    .forEach((group) => {
      [...group.children].forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${index * 80}ms`);
      });
    });
  document.addEventListener("focusin", (event) => {
    const target = event.target.closest(".reveal-pending");
    if (target) reveal(target, false);
  });
  document.addEventListener("visibilitychange", () => {
    root.dataset.pageVisible = String(!document.hidden);
  });
  if (toggle)
    toggle.addEventListener("click", () => {
      userPaused = !userPaused;
      try {
        localStorage.setItem("axon-motion", userPaused ? "paused" : "active");
      } catch {
        /* In-memory preference still works. */
      }
      update();
    });
  preference.addEventListener("change", update);
  update();
})();
