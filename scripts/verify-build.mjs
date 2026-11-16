import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const directory = resolve(import.meta.dirname, "../dist");
const html = await readFile(resolve(directory, "index.html"), "utf8");
const document = new JSDOM(html).window.document;
assert.equal(document.querySelectorAll("h1").length, 1);
assert.match(document.querySelector("h1").textContent, /Creamos lo/);
assert.ok(document.querySelector("#servicios"));
assert.ok(document.querySelector("#configurador"));
assert.equal(
  document.querySelector("#contact-form").getAttribute("method"),
  "POST",
);
assert.ok(document.querySelector("#contact-form input[type=email]"));
assert.ok(document.querySelector("#configurador noscript"));
assert.ok(document.querySelector("#configurador button").disabled);
assert.ok(!html.includes("<!--app-html-->"));
const ids = [...document.querySelectorAll("[id]")].map((item) => item.id);
assert.equal(new Set(ids).size, ids.length);
for (const link of document.querySelectorAll('a[href^="#"]'))
  assert.ok(document.getElementById(link.getAttribute("href").slice(1)));
for (const item of document.querySelectorAll(
  "script[src],img[src],link[rel=stylesheet],link[rel=icon]",
)) {
  const source = item.getAttribute("src") || item.getAttribute("href");
  if (!/^https?:/.test(source))
    assert.ok((await stat(resolve(directory, source))).isFile(), source);
}
console.log(
  "Producción verificada: HTML sin ejecutar JavaScript, formulario nativo, navegación, IDs y assets locales.",
);
