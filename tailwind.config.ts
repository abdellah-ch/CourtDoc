import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // VERY important for Next.js App Router
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Noto Naskh Arabic"', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
