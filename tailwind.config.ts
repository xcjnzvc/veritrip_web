// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'sans'를 프리텐다드로 대체하여 전역 기본 폰트로 설정
        sans: ["var(--font-pretendard)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
