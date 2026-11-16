import { readFile, writeFile, rm } from "node:fs/promises";
import { render } from "../.prerender/entry-server.js";
const template = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
if (!template.includes("<!--app-html-->"))
  throw new Error("Missing prerender placeholder");
const html = template.replace("<!--app-html-->", render());
await writeFile(new URL("../dist/index.html", import.meta.url), html);
await rm(new URL("../.prerender", import.meta.url), {
  recursive: true,
  force: true,
});
console.log(
  "HTML prerenderizado: contenido, servicios y formulario disponibles antes de cargar React.",
);
