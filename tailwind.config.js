module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/**/*.js'
  ],
  darkMode: 'media', // or false or 'class'
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  variants: {
    extend: {
      fontWeight: ['hover', 'focus'],
      translate: ['group-hover'],
      rotate: ['group-hover']
    }
  },
  plugins: []
}
