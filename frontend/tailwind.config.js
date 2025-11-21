import daisyui from 'daisyui';

 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{html,jsx,css}"],
   theme: {
     extend: {},
   },
   plugins: [daisyui],
    daisyui: {
      themes: ["forest", "synthwave", "cyberpunk"],
    },
 }