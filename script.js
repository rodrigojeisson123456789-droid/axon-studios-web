"use strict";

// Core content and the contact form remain usable without JavaScript.
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#nav-links");
if (menuButton && navigation) {
  menuButton.hidden = false;
  navigation.dataset.collapsible = "true";
  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
    menuButton.querySelector("span").textContent = open ? "−" : "＋";
  };
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menuButton.focus();
    }
  });
  matchMedia("(max-width: 640px)").addEventListener("change", () =>
    setMenu(false),
  );
}

// Tabs use the WAI-ARIA keyboard pattern: arrows, Home and End.
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      activateTab(tabs[next], true);
    }
  });
});

const service = document.querySelector("#service");
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (service) service.value = link.dataset.service;
  });
});

const form = document.querySelector("#contact-form");
if (form) {
  const attachment = form.querySelector("#attachment");
  const status = form.querySelector("#form-status");
  const submit = form.querySelector('[type="submit"]');
  const allowedExtensions = /\.(docx?|pdf|pptx?|jpe?g|png|webp)$/i;
  let sending = false;
  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
  };
  const validateAttachment = () => {
    const file = attachment.files[0];
    let error = "";
    if (file && !allowedExtensions.test(file.name))
      error = "Elige un archivo PDF, Word, PowerPoint, JPG, PNG o WebP.";
    if (file && file.size > 10 * 1024 * 1024)
      error = "El archivo supera los 10 MB. Elige uno más pequeño.";
    attachment.setCustomValidity(error);
    attachment.setAttribute("aria-invalid", String(Boolean(error)));
    return error;
  };
  attachment.addEventListener("change", () => {
    const error = validateAttachment();
    setStatus(error, error ? "error" : "");
    if (error) attachment.reportValidity();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    const error = validateAttachment();
    if (error || !form.reportValidity()) {
      if (error) attachment.reportValidity();
      return;
    }
    const message = form.querySelector("#message");
    if (!message.value.trim()) {
      setStatus(
        "Cuéntanos brevemente qué necesitas para poder ayudarte.",
        "error",
      );
      message.focus();
      return;
    }
    sending = true;
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    setStatus("Enviando tu consulta…", "pending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(
        form.action.replace(
          "https://formsubmit.co/",
          "https://formsubmit.co/ajax/",
        ),
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
          signal: controller.signal,
        },
      );
      if (!response.ok) throw new Error("Delivery failed");
      const result = await response.json();
      if (result.success !== true && result.success !== "true")
        throw new Error("Delivery not confirmed");
      form.reset();
      attachment.setCustomValidity("");
      attachment.removeAttribute("aria-invalid");
      setStatus(
        "Tu consulta fue enviada. Gracias por contarnos tu idea; te responderemos al correo que indicaste.",
        "success",
      );
    } catch (error) {
      setStatus(
        error.name === "AbortError"
          ? "No pudimos confirmar el envío a tiempo. Conservamos tu mensaje. Espera unos minutos y, si no recibes confirmación, vuelve a intentarlo."
          : "No pudimos confirmar el envío. Conservamos tu mensaje para que puedas volver a intentarlo. Revisa tu conexión y prueba de nuevo en unos minutos.",
        "error",
      );
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
}
