/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,tsx,ts,jsx}"],
  theme: {
    screens: {
      xs: [{ min: "0px" }, { max: "575px" }],
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1400px",
    },
    extend: {},
  },
  plugins: [],
};
