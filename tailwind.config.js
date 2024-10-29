/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // './src/**/*.{js,jsx,ts,tsx}' // use this instead for if you want css to show on any jsx page loacted anywhere
  ],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "custom-background":
          "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
      }),

      colors: {
        blackBg: {
          500: "#04152d",
        },
        grey: {
          500: "#f3f4f6",
          600: "#6b7280",
        },
        disable: "#f3f4f6",
        black1: {
          100: "#374151",
        },
        customBlack: "#111827",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.88, -0.35, 0.565, 1.35)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
    fontFamily: {
      body: [
        "Roboto",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Roboto",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
  },
  plugins: [require("@tailwindcss/forms")],
});
