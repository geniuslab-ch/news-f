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
                // Fitbuddy brand colors from logo
                primary: {
                    50: '#fffbea',
                    100: '#fff3c4',
                    200: '#ffe785',
                    300: '#ffd646',
                    400: '#ffc107', // Main yellow
                    500: '#f9a825', // Yellow-orange transition
                    600: '#f57c00', // Orange
                    700: '#e65100',
                    800: '#bf360c',
                    900: '#8d2a00',
                },
                accent: {
                    DEFAULT: '#ffc107', // Bright yellow
                    dark: '#f57c00', // Orange
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            backgroundImage: {
                'gradient-fitbuddy': 'linear-gradient(135deg, #ffc107 0%, #f9a825 50%, #f57c00 100%)',
                'gradient-fitbuddy-soft': 'linear-gradient(135deg, #fff3c4 0%, #ffe785 50%, #ffd646 100%)',
            },
        },
    },
    plugins: [],
};

export default config;
