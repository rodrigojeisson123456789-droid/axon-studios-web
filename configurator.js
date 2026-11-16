"use strict";

(() => {
  const clock = document.querySelector("#lima-clock");
  if (clock) {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
  }
  const config = document.querySelector("#cfg");
  if (!config) return;
  const contact = document.querySelector("#contact-form");
  const service = document.querySelector("#service");
  const selection = document.querySelector("#config-selection");
  const review = document.querySelector("#config-review");
  const send = document.querySelector("#cfg-send");
  const labels = {
    web: "Página o app web",
    android: "App Android",
    datos: "Base de datos",
    mvp: "primera versión",
    completo: "producto completo",
    escalar: "mejorar una solución existente",
  };
  const extraLabels = {
    design: "diseño UX/UI",
    api: "integraciones y APIs",
    admin: "panel de administración",
    db: "base de datos integrada",
    care: "soporte posterior",
  };
  const moduleLabels = {
    ui: "interfaz",
    design: "diseño",
    api: "APIs",
    admin: "panel",
    db: "datos",
    care: "soporte",
  };
  let summary = "";
  let selectedType = "";
  function clearSelection() {
    selection.value = "";
    review.hidden = true;
    document.querySelector("#config-review-text").textContent = "";
    selectedType = "";
  }
  function update() {
    const type = config.querySelector("[name=tipo]:checked").value;
    const scope = config.querySelector("[name=alcance]:checked").value;
    const database = config.querySelector("[value=db]");
    database.disabled = type === "datos";
    if (database.disabled) database.checked = false;
    const extras = [...config.querySelectorAll("[name=extra]:checked")].map(
      (item) => item.value,
    );
    const modules = new Set(extras);
    modules.add(type === "datos" ? "db" : "ui");
    document
      .querySelectorAll(".cfg-node")
      .forEach((node) =>
        node.classList.toggle("on", modules.has(node.dataset.module)),
      );
    document
      .querySelector("#cfg-diagram")
      .setAttribute(
        "aria-label",
        `Módulos seleccionados: ${[...modules].map((key) => moduleLabels[key]).join(", ")}`,
      );
    // Initial planning heuristic only. This range is explicitly not a quote.
    const base = { web: 4, android: 8, datos: 3 }[type];
    const multiplier = { mvp: 1, completo: 1.8, escalar: 1.3 }[scope];
    const additions = extras.reduce(
      (total, key) =>
        total + { design: 1.5, api: 2, admin: 2, db: 2, care: 0 }[key],
      0,
    );
    const weeks = base * multiplier + additions;
    const range = `${Math.max(2, Math.round(weeks * 0.85))} a ${Math.max(3, Math.round(weeks * 1.25))} semanas`;
    summary = `${labels[type]}, ${labels[scope]}${extras.length ? "; " + extras.map((key) => extraLabels[key]).join(", ") : ""}. Referencia inicial: ${range}, sujeta a revisión del alcance.`;
    document.querySelector("#cfg-est").textContent = range;
    document.querySelector("#cfg-summary").textContent =
      `${labels[type]}, ${labels[scope]}${extras.length ? ", con " + extras.map((key) => extraLabels[key]).join(", ") : ""}.`;
  }
  config.addEventListener("change", update);
  config.addEventListener("submit", (event) => event.preventDefault());
  send.disabled = false;
  send.addEventListener("click", () => {
    update();
    selectedType = config.querySelector("[name=tipo]:checked").value;
    service.value = selectedType;
    selection.value = summary;
    document.querySelector("#config-review-text").textContent = summary;
    review.hidden = false;
    document
      .querySelector("#contacto")
      .scrollIntoView?.({
        behavior:
          document.documentElement.dataset.motion === "off" ? "auto" : "smooth",
      });
    document.querySelector("#email").focus({ preventScroll: true });
  });
  document
    .querySelector("#cfg-clear")
    .addEventListener("click", clearSelection);
  service.addEventListener("change", () => {
    if (selectedType && service.value !== selectedType) clearSelection();
  });
  document.querySelectorAll("[data-service]").forEach((link) =>
    link.addEventListener("click", () => {
      if (selectedType && link.dataset.service !== selectedType)
        clearSelection();
    }),
  );
  contact.addEventListener("reset", clearSelection);
  update();
})();
