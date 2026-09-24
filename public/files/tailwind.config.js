/**
 * Espresso design tokens, ported from the Stitch export (DESIGN.md +
 * the tailwind.config blocks embedded in each screen's code.html).
 *
 * Two vocabularies are kept side by side on purpose:
 *  - the M3-style tokens (surface, on-surface, primary-container, ...)
 *    are exactly what the Stitch-exported markup uses, so any markup
 *    copied in verbatim keeps working without renaming classes.
 *  - the brand-named tokens (roast, cream, caramel, sage, terracotta...)
 *    are the human-readable names from DESIGN.md's prose sections and
 *    are what new components should reach for.
 *
 * Merge this into your existing tailwind.config.{js,ts} `theme.extend`
 * rather than replacing your config wholesale.
 */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- M3-style tokens (kept for 1:1 Stitch markup compatibility) ---
        'on-error-container': '#93000a',
        'outline-variant': '#d1c4be',
        'inverse-on-surface': '#ffeee2',
        'on-tertiary-fixed': '#2f1500',
        'primary-fixed-dim': '#d5c3ba',
        'primary-fixed': '#f2dfd6',
        'on-primary-container': '#908179',
        error: '#ba1a1a',
        'on-primary-fixed-variant': '#51443e',
        surface: '#fff8f5',
        'tertiary-container': '#2f1500',
        'surface-container': '#fdebde',
        'surface-bright': '#fff8f5',
        'on-primary-fixed': '#231a14',
        'on-tertiary-fixed-variant': '#6e3900',
        'secondary-fixed': '#e4e2df',
        'inverse-surface': '#392e26',
        'surface-variant': '#f1dfd2',
        'surface-container-low': '#fff1e8',
        tertiary: '#000000',
        background: '#fff8f5',
        'on-tertiary-container': '#ba7334',
        'surface-container-lowest': '#ffffff',
        'surface-dim': '#e9d7ca',
        'error-container': '#ffdad6',
        'on-background': '#231a12',
        'inverse-primary': '#d5c3ba',
        'on-secondary-fixed': '#1b1c1a',
        'surface-tint': '#695c55',
        'tertiary-fixed': '#ffdcc3',
        'tertiary-fixed-dim': '#ffb77d',
        'on-error': '#ffffff',
        'surface-container-highest': '#f1dfd2',
        'surface-container-high': '#f7e5d8',
        'primary-container': '#231a14',
        'secondary-container': '#e1dfdc',
        'on-surface-variant': '#4e4540',
        'on-secondary-container': '#636361',
        'secondary-fixed-dim': '#c8c6c4',
        primary: '#000000',
        'on-surface': '#231a12',
        'on-tertiary': '#ffffff',
        'on-secondary-fixed-variant': '#474745',
        outline: '#807570',
        'on-secondary': '#ffffff',
        'on-primary': '#ffffff',
        secondary: '#5e5e5c',

        // --- Brand-named tokens (from DESIGN.md "Colors" section) ---
        roast: {
          DEFAULT: '#1C130E', // Primary Roast — buttons, headings, footers
          dark: '#2B1D16', // hover state for primary buttons
        },
        cream: {
          DEFAULT: '#FAF8F5', // main storefront canvas
          alt: '#F5F0EA',
          parchment: '#EBE3D7',
        },
        caramel: {
          DEFAULT: '#C27A3A', // accent: links, focus rings, warning chip text
          deep: '#9B5C28', // secondary-button hover border
        },
        'dusty-gold': '#D4A373',
        card: {
          border: '#E8DFD5', // default 1px hairline border
          hover: '#D4A373', // border on hover/active product tiles
        },
        success: { text: '#4A6B53', bg: '#EEF3EF' },
        warning: { text: '#C27A3A', bg: '#FAF2EA' },
        danger: { text: '#A84236', bg: '#F8ECEB' },
        'admin-canvas': '#F9F8F6',
      },
      borderRadius: {
        DEFAULT: '0.5rem', // 8px — product cards, inputs, panels
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem', // hero banners, modals, subscription modules
        xl: '1.5rem', // checkout summary groupings, full-bleed images
        full: '9999px', // badges, chips, quantity steppers
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-mobile': '1rem',
        margin: '3rem',
        'margin-mobile': '1.25rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        sidebar: '260px', // fixed admin sidebar width
      },
      maxWidth: {
        canvas: '1360px', // storefront 12-col grid cap
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-hero': ['56px', { lineHeight: '64px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-hero-mobile': ['38px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['36px', { lineHeight: '44px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['26px', { lineHeight: '32px', fontWeight: '500' }],
        'headline-sm': ['20px', { lineHeight: '26px', fontWeight: '600' }],
        'title-product': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '700' }],
        'label-ui': ['13px', { lineHeight: '16px', fontWeight: '600' }],
        'data-mono': ['13px', { lineHeight: '18px', fontWeight: '500' }],
      },
      boxShadow: {
        // Level 2 — hover / active product tiles
        'roast-sm': '0 10px 25px -5px rgba(28, 19, 14, 0.05), 0 4px 6px -2px rgba(28, 19, 14, 0.02)',
        // Level 3 — cart drawers, popovers, dropdowns
        'roast-md': '0 20px 30px -10px rgba(28, 19, 14, 0.12)',
        // Level 4 — modals & toast alerts (pair with bg-roast/50 backdrop-blur-sm)
        'roast-lg': '0 25px 50px -12px rgba(28, 19, 14, 0.25)',
      },
      backdropBlur: {
        scrim: '4px',
      },
    },
  },
  plugins: [],
};
