import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A3FF',
          light: '#33B5FF',
          dark: '#0082CC',
        },
        success: {
          DEFAULT: '#A4E24E',
          light: '#B8E874',
          dark: '#8FCC3E',
        },
        gray: {
          text: '#707070',
          light: '#F5F5F5',
          border: '#E0E0E0',
          dark: '#4A4A4A',
        },
        warning: '#FFB020',
        danger: '#FF4D4F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
