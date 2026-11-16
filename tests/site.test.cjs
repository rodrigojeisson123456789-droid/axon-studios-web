const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");

function setup() {
  const dom = new JSDOM(html, {
    url: "https://axon.example/",
    runScripts: "outside-only",
  });
  const window = dom.window;
  window.matchMedia = () => ({ matches: false, addEventListener() {} });
  window.eval(script);
  return { dom, window, document: window.document };
}

function validForm(document) {
  document.querySelector("#email").value = "prueba@example.com";
  document.querySelector("#message").value =
    "Necesito una página para mi negocio.";
  return document.querySelector("#contact-form");
}

function submit(window, form) {
  form.dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true }),
  );
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("HTML: IDs únicos, enlaces internos, archivos y etiquetas de campos válidos", () => {
  const { dom, document } = setup();
  try {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(document.querySelectorAll("h1").length, 1);
    for (const link of document.querySelectorAll('a[href^="#"]')) {
      assert.ok(document.getElementById(link.getAttribute("href").slice(1)));
    }
    for (const item of document.querySelectorAll(
      'img[src], script[src], link[href="styles.css"]',
    )) {
      const file = item.getAttribute("src") || item.getAttribute("href");
      assert.ok(fs.existsSync(path.join(root, file)), file);
    }
    for (const field of document.querySelectorAll(
      'input:not([type="hidden"]), textarea, select',
    )) {
      assert.ok(document.querySelector(`label[for="${field.id}"]`), field.id);
    }
    for (const image of document.querySelectorAll("img"))
      assert.ok(image.hasAttribute("alt"));
  } finally {
    dom.window.close();
  }
});

test("Menú: abre, Escape cierra y devuelve el foco; un enlace cierra el menú", () => {
  const { dom, window, document } = setup();
  try {
    const button = document.querySelector(".menu-toggle");
    button.click();
    assert.equal(button.getAttribute("aria-expanded"), "true");
    document.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    assert.equal(button.getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement, button);
    button.click();
    document.querySelector("#nav-links a").click();
    assert.equal(button.getAttribute("aria-expanded"), "false");
  } finally {
    dom.window.close();
  }
});

test("Ejemplos: clic y teclado cambian el panel, la selección y el foco", () => {
  const { dom, window, document } = setup();
  try {
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    tabs[1].click();
    assert.equal(document.querySelector("#panel-android").hidden, false);
    assert.equal(document.querySelector("#panel-web").hidden, true);
    tabs[1].dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "End", bubbles: true }),
    );
    assert.equal(document.activeElement, tabs[2]);
    assert.equal(document.querySelector("#panel-datos").hidden, false);
    tabs[2].dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    assert.equal(document.activeElement, tabs[0]);
    assert.equal(tabs.filter((tab) => tab.tabIndex === 0).length, 1);
    assert.equal(
      document.querySelectorAll('[role="tabpanel"]:not([hidden])').length,
      1,
    );
  } finally {
    dom.window.close();
  }
});

test("Cada llamada de servicio preselecciona la consulta correcta", () => {
  const { dom, document } = setup();
  try {
    for (const link of document.querySelectorAll("[data-service]")) {
      link.click();
      assert.equal(
        document.querySelector("#service").value,
        link.dataset.service,
      );
    }
  } finally {
    dom.window.close();
  }
});

test("Formulario: campos inválidos y mensajes en blanco no se envían", async () => {
  const { dom, window, document } = setup();
  try {
    let calls = 0;
    window.fetch = async () => {
      calls++;
    };
    const form = document.querySelector("#contact-form");
    submit(window, form);
    validForm(document);
    document.querySelector("#email").value = "correo-invalido";
    submit(window, form);
    validForm(document);
    document.querySelector("#message").value = "   ";
    submit(window, form);
    await settle();
    assert.equal(calls, 0);
    assert.equal(document.activeElement.id, "message");
  } finally {
    dom.window.close();
  }
});

test("Adjuntos: rechaza archivos excesivos o no permitidos; permite corregirlos", async () => {
  const { dom, window, document } = setup();
  try {
    let calls = 0;
    window.fetch = async () => {
      calls++;
      return { ok: true, json: async () => ({ success: true }) };
    };
    const form = validForm(document);
    const input = document.querySelector("#attachment");
    const select = (name, size) => {
      Object.defineProperty(input, "files", {
        configurable: true,
        value: [{ name, size }],
      });
      input.dispatchEvent(new window.Event("change"));
    };
    select("archivo.exe", 12);
    submit(window, form);
    assert.equal(calls, 0);
    select("referencia.pdf", 11 * 1024 * 1024);
    submit(window, form);
    assert.equal(calls, 0);
    select("referencia.pdf", 1024);
    submit(window, form);
    await settle();
    assert.equal(calls, 1);
    assert.equal(
      document.querySelector("#form-status").dataset.state,
      "success",
    );
  } finally {
    dom.window.close();
  }
});

test("Envío: evita duplicados y solo confirma éxito cuando el proveedor lo confirma", async () => {
  const { dom, window, document } = setup();
  try {
    let finish;
    let calls = 0;
    window.fetch = (url, options) => {
      calls++;
      assert.match(url, /formsubmit\.co\/ajax\//);
      assert.equal(options.method, "POST");
      assert.ok(options.body instanceof window.FormData);
      return new Promise((resolve) => {
        finish = resolve;
      });
    };
    const form = validForm(document);
    submit(window, form);
    submit(window, form);
    assert.equal(calls, 1);
    assert.equal(form.querySelector("button").disabled, true);
    finish({ ok: true, json: async () => ({ success: "true" }) });
    await settle();
    assert.equal(
      document.querySelector("#form-status").dataset.state,
      "success",
    );
    assert.equal(document.querySelector("#message").value, "");
    assert.equal(form.querySelector("button").disabled, false);
  } finally {
    dom.window.close();
  }
});

test("Envío: errores HTTP, del proveedor, de red y timeout conservan el mensaje y permiten reintentar", async () => {
  const { dom, window, document } = setup();
  try {
    for (const response of ["http", "provider", "network", "timeout"]) {
      const form = validForm(document);
      const original = document.querySelector("#message").value;
      window.fetch = async () => {
        if (response === "network") throw new Error("Network");
        if (response === "timeout")
          throw new window.DOMException("Timeout", "AbortError");
        return {
          ok: response !== "http",
          json: async () => ({ success: false }),
        };
      };
      submit(window, form);
      await settle();
      assert.equal(
        document.querySelector("#form-status").dataset.state,
        "error",
        response,
      );
      assert.equal(
        document.querySelector("#message").value,
        original,
        response,
      );
      assert.equal(form.querySelector("button").disabled, false, response);
      assert.equal(form.hasAttribute("aria-busy"), false, response);
    }
  } finally {
    dom.window.close();
  }
});
