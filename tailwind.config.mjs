/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addVariant, e }) {
      addVariant('not', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not${separator}${className}`)}:not(.${className})`
        })
      })
    }
  ],

}
