import "@testing-library/jest-dom/vitest";
import { beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
const queries = new Map();
export function setMedia(query, matches) {
  const item = window.matchMedia(query);
  item.matches = matches;
  item.listeners.forEach((fn) => fn({ matches, media: query }));
}
window.matchMedia = (query) => {
  if (!queries.has(query))
    queries.set(query, {
      matches: false,
      media: query,
      listeners: new Set(),
      addEventListener(type, fn) {
        this.listeners.add(fn);
      },
      removeEventListener(type, fn) {
        this.listeners.delete(fn);
      },
      addListener(fn) {
        this.listeners.add(fn);
      },
      removeListener(fn) {
        this.listeners.delete(fn);
      },
    });
  return queries.get(query);
};
window.HTMLElement.prototype.scrollIntoView = vi.fn();
globalThis.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
    this.targets = new Set();
  }
  observe(target) {
    this.targets.add(target);
  }
  unobserve(target) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
  }
};
beforeEach(() => {
  queries.clear();
  localStorage.clear();
  localStorage.setItem("axon-motion", "paused");
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
