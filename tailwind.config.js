import Paragraph from "antd/es/skeleton/Paragraph";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007BA5",
        secondary: "#7CC84E",
        base: "#4E4E4E",
        dashboard: "#023f86",
        smart: "#04BF61",
        paragraph: "#7E7E7E",
      },
    },
  },
  plugins: [],
};
