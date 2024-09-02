// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: { 
//       fontFamily: {
//         poppins: ['Poppins', 'sans-serif'],
//       },
//       colors: {
//         'custom-gray-color': '#F5F7FA', // Replace with your desired color code
//         'custom-button-green-color': '#AFF911', // Add more colors as needed
//       },
//     },
//   },
//   plugins: [],
// }


// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'custom-gray-color': '#F5F7FA',
        'custom-button-green-color': '#AFF911',
      },
      animation: {
        spin: 'spin 1s linear infinite', // Adjust the duration if needed
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
