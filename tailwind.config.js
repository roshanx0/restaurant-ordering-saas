/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        "bg-subtle": "#FAFAFA",
        text: "#0A0A0A",
        "text-secondary": "#6B6B6B",
        accent: "#000000",
        "accent-secondary": "#6366F1",
        border: "#E5E5E5",
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        sm: ["14px", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        base: ["15px", { lineHeight: "1.6", letterSpacing: "-0.01em" }],
        lg: ["18px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        xl: ["24px", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "2xl": ["32px", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        DEFAULT: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        200: "200ms",
      },
    },
  },
  plugins: [],
};
