import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Em Tailwind v4 com a linha @variant no CSS, essa linha abaixo não é mais necessária, 
  // mas se mantiver o arquivo, use a sintaxe export default
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;