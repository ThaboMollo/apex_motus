const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0a1028",
        ink: "#0f1738",
        royal: "#1c2ca3",
        plum: "#3b1c5a",
        cyan: "#22d3ee",
        gold: "#d4af37",
        slate: "#94a3b8",
        silver: "#c5c6ca"
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
});
