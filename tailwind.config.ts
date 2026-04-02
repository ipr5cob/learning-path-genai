import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom palette
        "base-major": "hsl(var(--base-major))",
        "base-minor": "hsl(var(--base-minor))",
        "base-pure": "hsl(var(--base-pure))",
        "base-text": "hsl(var(--base-text))",
        "base-muted": "hsl(var(--base-muted))",
        "accent-major": "hsl(var(--accent-major))",
        "accent-hover": "hsl(var(--accent-hover))",
        "accent-minor": "hsl(var(--accent-minor))",
        "accent-pure": "hsl(var(--accent-pure))",
        "plain-black": "hsl(var(--plain-black))",
        "plain-white": "hsl(var(--plain-white))",
        "integrated-deep": "hsl(var(--integrated-deep))",
        "integrated-highlight": "hsl(var(--integrated-highlight))",
        "emphasis-purple": "hsl(var(--emphasis-purple))",
        "emphasis-purple-light": "hsl(var(--emphasis-purple-light))",
        "emphasis-teal": "hsl(var(--emphasis-teal))",
        "emphasis-teal-light": "hsl(var(--emphasis-teal-light))",
        "signal-error": "hsl(var(--signal-error))",
        "signal-error-light": "hsl(var(--signal-error-light))",
        "signal-warning": "hsl(var(--signal-warning))",
        "signal-warning-light": "hsl(var(--signal-warning-light))",
        "signal-success": "hsl(var(--signal-success))",
        "signal-success-light": "hsl(var(--signal-success-light))",
        "signal-info": "hsl(var(--signal-info))",
        "signal-info-light": "hsl(var(--signal-info-light))",
        "signal-neutral": "hsl(var(--signal-neutral))",
        "contrast-bg": "hsl(var(--contrast-bg))",
        "contrast-secondary": "hsl(var(--contrast-secondary))",
        "contrast-text": "hsl(var(--contrast-text))",
        "contrast-muted": "hsl(var(--contrast-muted))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
