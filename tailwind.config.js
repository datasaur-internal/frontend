/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'bg-card': 'var(--color-bg-card)',
        'bg-card-opacity': 'var(--color-bg-card-opacity)',
        'bg-sidebar': 'var(--color-bg-sidebar)',
        'bg-sidebar-opacity': 'var(--color-bg-sidebar-opacity)',
        'bg-gradient-start': 'var(--color-bg-gradient-start)',
        'bg-gradient-mid': 'var(--color-bg-gradient-mid)',
        'bg-gradient-end': 'var(--color-bg-gradient-end)',
        'button': 'var(--color-button)',
        'button-hover': 'var(--color-button-hover)',
        'button-opacity': 'var(--color-button-opacity)',
        'border': 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        'loading': 'var(--color-loading)',
        'loading-light': 'var(--color-loading-light)',
        'code-bg': 'var(--color-code-bg)',
        'icon': 'var(--color-icon)',
        'icon-light': 'var(--color-icon-light)',
        'icon-on-button': 'var(--color-icon-on-button)',
        'icon-muted': 'var(--color-icon-muted)',
        'gray-50': 'var(--color-gray-50)',
        'gray-100': 'var(--color-gray-100)',
        'gray-200': 'var(--color-gray-200)',
        'gray-300': 'var(--color-gray-300)',
        'gray-400': 'var(--color-gray-400)',
        'gray-500': 'var(--color-gray-500)',
        'gray-600': 'var(--color-gray-600)',
        'gray-700': 'var(--color-gray-700)',
        'gray-800': 'var(--color-gray-800)',
        'gray-900': 'var(--color-gray-900)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
