import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
const Context = createContext(null);
export const useExperience = () => useContext(Context);
export function ExperienceProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [service, setService] = useState("");
  const [selection, setSelection] = useState(null);
  const enabled = hydrated && !reduced && !paused;
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    try {
      setPaused(localStorage.getItem("axon-motion") === "paused");
    } catch {
      /* Local preference is optional. */
    }
    setHydrated(true);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = enabled ? "on" : "off";
    root.dataset.ready = String(hydrated);
    const visibility = () => {
      root.dataset.pageVisible = String(!document.hidden);
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [enabled, hydrated]);
  useEffect(() => {
    const targets = [...document.querySelectorAll("[data-reveal]")];
    targets.forEach((target) =>
      target.classList.remove("reveal-pending", "is-revealed"),
    );
    if (!enabled || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06, rootMargin: "0px 0px -15px 0px" },
    );
    targets.forEach((target) => {
      if (target.getBoundingClientRect().top >= window.innerHeight) {
        target.classList.add("reveal-pending");
        observer.observe(target);
      }
    });
    const hero = document.querySelector("#inicio");
    const heroObserver = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        entry.target.dataset.active = String(entry.isIntersecting);
      }),
    );
    if (hero) heroObserver.observe(hero);
    const focus = (event) => {
      const target = event.target.closest(".reveal-pending");
      if (target) {
        target.classList.remove("reveal-pending");
        observer.unobserve(target);
      }
    };
    document.addEventListener("focusin", focus);
    return () => {
      observer.disconnect();
      heroObserver.disconnect();
      document.removeEventListener("focusin", focus);
      targets.forEach((target) => target.classList.remove("reveal-pending"));
    };
  }, [enabled]);
  const chooseService = (value) => {
    setService(value);
    setSelection((current) =>
      current && current.type !== value ? null : current,
    );
  };
  const useSelection = (next) => {
    setService(next.type);
    setSelection(next);
    document
      .querySelector("#contacto")
      ?.scrollIntoView?.({ behavior: enabled ? "smooth" : "auto" });
    document.querySelector("#email")?.focus({ preventScroll: true });
  };
  const toggle = () =>
    setPaused((current) => {
      const next = !current;
      try {
        localStorage.setItem("axon-motion", next ? "paused" : "active");
      } catch {
        /* The toggle still works without storage. */
      }
      return next;
    });
  const value = useMemo(
    () => ({
      enabled,
      hydrated,
      reduced,
      paused,
      service,
      selection,
      chooseService,
      useSelection,
      clearSelection: () => setSelection(null),
      resetContact: () => {
        setService("");
        setSelection(null);
      },
      toggle,
    }),
    [enabled, hydrated, reduced, paused, service, selection],
  );
  return (
    <Context.Provider value={value}>
      <MotionConfig
        reducedMotion={enabled ? "user" : "always"}
        transition={{ duration: enabled ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </Context.Provider>
  );
}
