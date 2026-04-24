import "@testing-library/jest-dom";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

if (typeof window.ResizeObserver === "undefined") {
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}

afterEach(() => {
  cleanup();
});
