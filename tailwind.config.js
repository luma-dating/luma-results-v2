/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Open Sans"', 'sans-serif'],
      },
      colors: {
        luma: {
          lime: "#A4DE02",         // Lime Green Flag
          evergreen: "#3E6B2F",    // Evergreen Accent
          gradientStart: "#F3F8F2",// Background Gradient Start
          gradientEnd: "#E0F3DB",  // Background Gradient End
          textPrimary: "#2F2F2F",  // Primary Text
          textAccent: "#6E7F63",   // Soft Accent Text
          redFlag: "#D72638",      // Hellboy Red
          yellowFlag: "#FFE066",   // Soft Yellow Flag
          skyBlue: "#89CFF0",      // Sky Blue Flag
        },
      },
    },
  },
  plugins: [],
};
