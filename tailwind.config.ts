import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./(sections)/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-poppins)", "sans-serif"],
                display: ["var(--font-montserrat)", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: '#f59e0b', // amber-500
                    dark: '#d97706',
                },
                dark: {
                    900: '#0f172a', // slate-950
                }
            }
        },
    },
    plugins: [],
};
export default config;
