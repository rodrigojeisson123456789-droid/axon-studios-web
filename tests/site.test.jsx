import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import App from "../src/App.jsx";
import { estimateProject, initialProject } from "../src/data.js";
import { setMedia } from "./setup.js";
const contact = () => document.querySelector("#contact-form");
async function fillForm(user) {
  await user.type(
    screen.getByLabelText(/Tu correo electrónico/),
    "prueba@example.com",
  );
  await user.type(
    screen.getByLabelText(/Cuéntanos tu idea/),
    "Necesito una página para mi negocio.",
  );
}
const selectTab = async (user, id) =>
  user.click(screen.getByRole("tab", { name: new RegExp(id, "i") }));

describe("Estructura y navegación", () => {
  it("conserva la portada elegida, enlaces, etiquetas e identificadores únicos", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Creamos loque sigue.",
    );
    expect(document.querySelector(".hero-mark")).toHaveAttribute(
      "src",
      "./img/5 (1).png",
    );
    const ids = [...document.querySelectorAll("[id]")].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const link of document.querySelectorAll('a[href^="#"]'))
      expect(
        document.getElementById(link.getAttribute("href").slice(1)),
      ).toBeTruthy();
    for (const field of document.querySelectorAll(
      "input:not([type=hidden]),select,textarea",
    ))
      expect(
        field.closest("label") ||
          document.querySelector(`label[for="${field.id}"]`),
      ).toBeTruthy();
  });
  it("el menú abre, Escape cierra y devuelve el foco", async () => {
    const user = userEvent.setup();
    render(<App />);
    const menu = screen.getByRole("button", { name: /Menú/ });
    await user.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveFocus();
    await user.click(menu);
    await user.click(
      within(document.querySelector("#nav-links")).getByRole("link", {
        name: "Servicios",
      }),
    );
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
  it("las pestañas funcionan con flechas, Home y End y exponen un solo panel", async () => {
    const user = userEvent.setup();
    render(<App />);
    screen.getAllByRole("tab")[0].focus();
    await user.keyboard("{End}");
    expect(screen.getAllByRole("tab")[2]).toHaveFocus();
    expect(screen.getAllByRole("tab")[2]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    await user.keyboard("{ArrowRight}");
    expect(screen.getAllByRole("tab")[0]).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getAllByRole("tab")[0]).toHaveFocus();
  });
  it("la demo web alterna entre escritorio y celular", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Celular" }));
    expect(screen.getByRole("button", { name: "Celular" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(document.querySelector(".demo-web-frame")).toHaveClass("is-mobile");
    await user.click(screen.getByRole("button", { name: "Escritorio" }));
    expect(document.querySelector(".demo-web-frame")).not.toHaveClass(
      "is-mobile",
    );
  });
  it("la demo Android filtra pedidos y actualiza la cantidad", async () => {
    const user = userEvent.setup();
    render(<App />);
    await selectTab(user, "Android");
    await user.click(screen.getByRole("button", { name: "En proceso" }));
    await waitFor(() =>
      expect(document.querySelectorAll(".order")).toHaveLength(1),
    );
    expect(screen.getByText("1 pedido de ejemplo")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Entregado" }));
    await waitFor(() =>
      expect(document.querySelectorAll(".order")).toHaveLength(2),
    );
  });
  it("la demo de datos relaciona los pedidos con el cliente seleccionado", async () => {
    const user = userEvent.setup();
    render(<App />);
    await selectTab(user, "Información conectada");
    expect(screen.getByText("2 pedidos relacionados")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Ver pedidos de"), "luis");
    expect(screen.getByText("1 pedido relacionado")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      2,
    );
    expect(
      within(screen.getByRole("table")).getByText("B-02"),
    ).toBeInTheDocument();
  });
});
describe("Movimiento", () => {
  it("restaura la pausa manual y guarda los cambios", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.documentElement).toHaveAttribute("data-motion", "off");
    await user.click(
      screen.getByRole("button", { name: "Activar animaciones" }),
    );
    expect(document.documentElement).toHaveAttribute("data-motion", "on");
    expect(localStorage.getItem("axon-motion")).toBe("active");
    await user.click(
      screen.getByRole("button", { name: "Pausar animaciones" }),
    );
    expect(document.documentElement).toHaveAttribute("data-motion", "off");
  });
  it("respeta movimiento reducido al cargar y cuando cambia el sistema", async () => {
    localStorage.removeItem("axon-motion");
    setMedia("(prefers-reduced-motion: reduce)", true);
    render(<App />);
    expect(document.documentElement).toHaveAttribute("data-motion", "off");
    expect(
      screen.queryByRole("button", { name: /animaciones/ }),
    ).not.toBeInTheDocument();
    act(() => setMedia("(prefers-reduced-motion: reduce)", false));
    expect(document.documentElement).toHaveAttribute("data-motion", "on");
    act(() => setMedia("(prefers-reduced-motion: reduce)", true));
    expect(document.documentElement).toHaveAttribute("data-motion", "off");
  });
  it("sin observadores ni almacenamiento la página mantiene contenido y control de movimiento", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    delete window.IntersectionObserver;
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    const user = userEvent.setup();
    render(<App />);
    expect(document.querySelectorAll(".reveal-pending")).toHaveLength(0);
    await user.click(
      screen.getByRole("button", { name: "Pausar animaciones" }),
    );
    expect(document.documentElement).toHaveAttribute("data-motion", "off");
  });
});
describe("Configurador", () => {
  it("calcula la referencia inicial sin duplicar datos ni sumar soporte", () => {
    expect(estimateProject(initialProject).range).toBe("3 a 5 semanas");
    expect(estimateProject({ ...initialProject, extras: ["care"] }).range).toBe(
      "3 a 5 semanas",
    );
    expect(
      estimateProject({ type: "android", scope: "completo", extras: [] }).range,
    ).toBe("12 a 18 semanas");
    expect(
      estimateProject({ type: "datos", scope: "mvp", extras: ["db"] }).range,
    ).toBe(estimateProject({ type: "datos", scope: "mvp", extras: [] }).range);
  });
  it("las opciones actualizan el diagrama y Android selecciona el servicio correcto", async () => {
    const user = userEvent.setup();
    render(<App />);
    const config = within(document.querySelector("#cfg"));
    await user.click(config.getByLabelText("App Android"));
    await user.click(config.getByLabelText("Integraciones y APIs"));
    expect(document.querySelector("[data-module=api]")).toHaveClass("on");
    await user.click(
      screen.getByRole("button", { name: "Enviar esta configuración" }),
    );
    expect(screen.getByLabelText("¿Qué necesitas?")).toHaveValue("android");
    expect(document.querySelector(".config-review")).toHaveTextContent(
      "Apps Android",
    );
    expect(screen.getByLabelText(/Tu correo electrónico/)).toHaveFocus();
  });
  it("preserva el mensaje, permite quitar y limpia la selección al cambiar de servicio", async () => {
    const user = userEvent.setup();
    render(<App />);
    await fillForm(user);
    const original = screen.getByLabelText(/Cuéntanos tu idea/).value;
    await user.click(
      screen.getByRole("button", { name: "Enviar esta configuración" }),
    );
    expect(screen.getByLabelText(/Cuéntanos tu idea/)).toHaveValue(original);
    expect(new FormData(contact()).get("configuracion")).toMatch(/Páginas web/);
    await user.click(
      screen.getByRole("button", { name: "Quitar configuración" }),
    );
    expect(document.querySelector(".config-review")).toBeNull();
    await user.click(
      screen.getByRole("button", { name: "Enviar esta configuración" }),
    );
    await user.selectOptions(screen.getByLabelText("¿Qué necesitas?"), "datos");
    expect(new FormData(contact()).get("configuracion")).toBe("");
  });
});
describe("Formulario", () => {
  it("rechaza correo inválido, mensaje en blanco y archivos no permitidos o excesivos", async () => {
    const user = userEvent.setup();
    render(<App />);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await user.type(screen.getByLabelText(/Tu correo/), "correo");
    fireEvent.submit(contact());
    expect(fetchMock).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText(/Tu correo/));
    await user.type(screen.getByLabelText(/Tu correo/), "prueba@example.com");
    await user.type(screen.getByLabelText(/Cuéntanos tu idea/), "   ");
    fireEvent.submit(contact());
    expect(fetchMock).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText(/Cuéntanos tu idea/));
    await user.type(
      screen.getByLabelText(/Cuéntanos tu idea/),
      "Consulta válida",
    );
    const input = screen.getByLabelText(/¿Tienes una referencia/);
    const invalid = new File(["code"], "archivo.exe", {
      type: "application/octet-stream",
    });
    fireEvent.change(input, { target: { files: [invalid] } });
    fireEvent.submit(contact());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    const huge = new File(["a"], "referencia.pdf", { type: "application/pdf" });
    Object.defineProperty(huge, "size", { value: 11 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [huge] } });
    expect(within(contact()).getByRole("status")).toHaveTextContent(
      "supera los 10 MB",
    );
  });
  it("bloquea duplicados y solo confirma después de una respuesta positiva; limpia la configuración", async () => {
    const user = userEvent.setup();
    render(<App />);
    await fillForm(user);
    await user.click(
      screen.getByRole("button", { name: "Enviar esta configuración" }),
    );
    let resolve;
    const fetchMock = vi.fn(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    fireEvent.submit(contact());
    fireEvent.submit(contact());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/formsubmit.co\/ajax\//);
    expect(options.body.get("configuracion")).toMatch(/Páginas web/);
    await act(async () =>
      resolve({ ok: true, json: async () => ({ success: "true" }) }),
    );
    expect(within(contact()).getByRole("status")).toHaveTextContent(
      "Tu consulta fue enviada",
    );
    expect(screen.getByLabelText(/Cuéntanos tu idea/)).toHaveValue("");
    expect(document.querySelector(".config-review")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Enviar mi consulta" }),
    ).not.toBeDisabled();
  });
  it.each(["http", "provider", "network", "timeout"])(
    "un error %s conserva el mensaje y permite reintentar",
    async (kind) => {
      const user = userEvent.setup();
      render(<App />);
      await fillForm(user);
      const original = screen.getByLabelText(/Cuéntanos tu idea/).value;
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => {
          if (kind === "network") throw new Error("Offline");
          if (kind === "timeout")
            throw new DOMException("Timeout", "AbortError");
          return {
            ok: kind !== "http",
            json: async () => ({ success: false }),
          };
        }),
      );
      fireEvent.submit(contact());
      await waitFor(() =>
        expect(within(contact()).getByRole("status")).toHaveAttribute(
          "data-state",
          "error",
        ),
      );
      expect(screen.getByLabelText(/Cuéntanos tu idea/)).toHaveValue(original);
      expect(
        screen.getByRole("button", { name: "Enviar mi consulta" }),
      ).not.toBeDisabled();
    },
  );
});

describe("Entrega e hidratación", () => {
  it("prerenderiza contenido y formulario y React lo hidrata sin reemplazarlo", async () => {
    const html = renderToString(<App />);
    expect(html).toContain("Creamos lo");
    expect(html).toContain('method="POST"');
    expect(html).toContain("formsubmit.co/");
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const originalHeading = container.querySelector("h1");
    const recover = vi.fn();
    let root;
    await act(async () => {
      root = hydrateRoot(container, <App />, { onRecoverableError: recover });
    });
    expect(container.querySelector("h1")).toBe(originalHeading);
    expect(recover).not.toHaveBeenCalled();
    expect(
      within(container).getByRole("button", {
        name: "Enviar esta configuración",
      }),
    ).not.toBeDisabled();
    await act(async () => root.unmount());
    container.remove();
  });
  it("un adjunto válido se incluye en FormData tras corregir uno rechazado", async () => {
    const user = userEvent.setup();
    render(<App />);
    await fillForm(user);
    const input = screen.getByLabelText(/¿Tienes una referencia/);
    fireEvent.change(input, {
      target: { files: [new File(["x"], "archivo.exe")] },
    });
    const file = new File(["referencia"], "referencia.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [file] } });
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ success: true }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    fireEvent.submit(contact());
    await waitFor(() =>
      expect(within(contact()).getByRole("status")).toHaveAttribute(
        "data-state",
        "success",
      ),
    );
    expect(fetchMock.mock.calls[0][1].body.get("attachment").name).toBe(
      "referencia.pdf",
    );
  });
  it("aborta una petición que supera los 25 segundos y permite reintentar", async () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      fireEvent.change(screen.getByLabelText(/Tu correo/), {
        target: { value: "prueba@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Cuéntanos tu idea/), {
        target: { value: "Mi proyecto" },
      });
      let signal;
      vi.stubGlobal(
        "fetch",
        vi.fn((url, options) => {
          signal = options.signal;
          return new Promise((resolve, reject) =>
            signal.addEventListener("abort", () =>
              reject(new DOMException("Timeout", "AbortError")),
            ),
          );
        }),
      );
      fireEvent.submit(contact());
      await act(async () => {
        vi.advanceTimersByTime(25000);
      });
      expect(signal.aborted).toBe(true);
      expect(within(contact()).getByRole("status")).toHaveTextContent(
        "a tiempo",
      );
      expect(screen.getByLabelText(/Cuéntanos tu idea/)).toHaveValue(
        "Mi proyecto",
      );
      expect(
        screen.getByRole("button", { name: "Enviar mi consulta" }),
      ).not.toBeDisabled();
    } finally {
      vi.useRealTimers();
    }
  });
});
