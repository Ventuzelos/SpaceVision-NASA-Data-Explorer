import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  [
    "style-src",
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://cdn.mathpix.com",
  ].join(" "),
  "img-src 'self' data: blob: https:",
  [
    "font-src",
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
    "https://cdn.mathpix.com",
  ].join(" "),
  [
    "connect-src",
    "'self'",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "ws://localhost:*",
    "ws://127.0.0.1:*",
  ].join(" "),
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

const securityHeaders = {
  "Content-Security-Policy-Report-Only":
    cspReportOnly,
};

export default defineConfig({
  plugins: [react()],

  server: {
    headers: securityHeaders,
  },

  preview: {
    headers: securityHeaders,
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: true,
  },
});