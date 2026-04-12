const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: "#F4F2EF",
          dark: "#0a1028"
        },
        fg: {
          primary: "#1A1A1A",
          secondary: "#4A4A4A",
          inverse: "#FFFFFF"
        },
        navy: "#0a1028",
        ink: "#0f1738",
        royal: "#1c2ca3",
        plum: "#3b1c5a",
        cyan: "#22d3ee",
        gold: "#d4af37",
        slate: "#4A4A4A",
        silver: "#c5c6ca"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "serif"],
        caption: ["Funnel Sans", "sans-serif"]
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.25em"
      }
    },
  },
});
