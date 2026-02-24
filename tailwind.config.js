/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                'xs': '480px',
            },
            fontFamily: {
                fredoka: ['Fredoka', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-30px) rotate(5deg)' },
                },
                'bounce-mouth': {
                    '0%, 100%': { transform: 'scaleY(1)' },
                    '50%': { transform: 'scaleY(0.6)' },
                },
                'chef-wave': {
                    '0%, 100%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255,140,90,0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(255,140,90,0.5)' },
                }
            },
            animation: {
                float: 'float 5s ease-in-out infinite',
                'bounce-mouth': 'bounce-mouth 0.3s ease-in-out infinite',
                'chef-wave': 'chef-wave 2s ease-in-out infinite',
                slideUp: 'slideUp 0.4s ease-out forwards',
                'pulse-glow': 'pulse-glow 2s infinite',
            }
        },
    },
    plugins: [],
}
