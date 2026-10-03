export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kb: {
          black: "#0a0508",
          soft: "#14090f",
          card: "#1a0d13",
          line: "#2a141c",
          rose: "#e94b8a",
          roseSoft: "#f7a8c4",
          white: "#ffffff",
          gray: "#b8a9b0",
          graySoft: "#6b5a62"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Bebas Neue", "Oswald", "Impact", "sans-serif"],
        script: ["Great Vibes", "Dancing Script", "cursive"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(233, 75, 138, 0.25)",
        soft: "0 10px 40px rgba(0, 0, 0, 0.5)"
      },
      backgroundImage: {
        "kb-radial": "radial-gradient(1200px 600px at 50% -10%, rgba(233,75,138,0.18), transparent 60%)",
        "kb-fade": "linear-gradient(180deg, rgba(10,5,8,0) 0%, rgba(10,5,8,0.85) 70%, #0a0508 100%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.8s ease-out both"
      }
    }
  },
  plugins: []
};
