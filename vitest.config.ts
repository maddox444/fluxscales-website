import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    include: ["src/components/*.test.tsx"],
    env: { VITE_TURNSTILE_SITE_KEY: "test-site-key" },
    clearMocks: true,
  },
});
