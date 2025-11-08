const sharedConfig = require("@repo/tailwind-config/tailwind.config.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedConfig],
  content: [
    // Scan only its own files
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};
