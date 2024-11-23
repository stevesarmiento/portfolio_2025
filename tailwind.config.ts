import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'package-texture': "url('/img/package-texture.png')",
        'grid': "url('/img/grid.svg')",
        "bkg-ios-bkg": "url('/img/ios-bkg.png')",
      },
      fontFamily: {
        "nuvo": ["ff-nuvo-mono-web-pro", "sans-serif"],
        "ivypresto": ["ivypresto-headline", "sans-serif"],
        "rafaella": ["rafaella", "sans-serif"],
      },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      gridTemplateRows: {
        '7': 'repeat(7, minmax(0, 1fr))',
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
        "shine": {
          "from": {
            "backgroundPosition": "0 0",
          },
          "to": {
            "backgroundPosition": "-200% 0",
          },
        },
        "wiggle": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, 0, 0) rotate(0deg)",
          },
          "10%, 90%": {
            opacity: "1",
            transform: "translate3d(-1px, 0, 0) rotate(-0.4deg)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0) rotate(0.4deg)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-3px, 0, 0) rotate(-0.4deg)",
          },
          "40%, 60%": {
            transform: "translate3d(3px, 0, 0) rotate(0.4deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0) rotate(0deg)",
          },
        },
        "scaleInCheck": {
          from: {
            transform: "scale(0)",
          },
          to: {
            transform: "scale(1)",
          },
        },
        "scaleInCheckFamily": {
          from: {
            transform: "scale(0) translateX(50px)",
            opacity: "0",
          },
          to: {
            transform: "scale(1) translateX(0)",
            opacity: "1",
          },
        },
        "scaleInSpin": {
          from: { transform: "scale(0) rotate(0deg)" },
          to: { transform: "scale(1) rotate(90deg)" },
        },
        "scaleOutSpin": {
          from: { transform: "scale(0) rotate(0deg)" },
          to: { transform: "scale(1) rotate(-360deg)" },
        },
        'custom-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shine": "shine 2s linear infinite",
        "wiggle": "wiggle 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        "scale-in-check": "scaleInCheck 0.2s forwards",
        "scale-in-check-family": "scaleInCheckFamily 0.15s forwards",
        "scale-in-spin": "scaleInSpin 0.2s forwards",
        "scale-out-spin": "scaleOutSpin 0.2s forwards",
        'spin-slow': 'custom-spin 3s linear infinite',
        blink: 'blink 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
