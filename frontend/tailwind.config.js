module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#205B2A', // dark green (header/nav background)
          dark: '#183C1A',   // even darker for footer or overlays
        },
        accent: {
          DEFAULT: '#7EB055', // lighter green for buttons/accents
          bright: '#8CD211',  // bright green (button, highlights)
        },
        yellow: {
          DEFAULT: '#F7D900', // yellow accent (icons, borders)
        },
        card: {
          DEFAULT: '#FFFFFF', // white for cards/backgrounds
        },
        text: {
          DEFAULT: '#222F1F', // dark gray/black for text
          light: '#FFFFFF',   // white text for dark backgrounds
        },
        clay: {
          DEFAULT: '#D1997C', // muted clay (optional secondary accent)
        },
        background: {
          DEFAULT: '#F6F8F3', // very light greenish/white background
        },
        hemlock: {
          DEFAULT: '#585036', // header/footer background
        },
        offwhite: {
          DEFAULT: '#F8FAFC', // high-contrast text/icons
        },
        sky: {
          DEFAULT: '#D4F0F7', // page background
        },
        olive: {
          DEFAULT: '#212713', // headings
        },
        leaf: {
          DEFAULT: '#028A0F', // subheadings
        },
        gold: {
          DEFAULT: '#FDD017', // feature box 1
        },
        softgreen: {
          DEFAULT: '#80EF80', // feature box 2
        },
        black: {
          DEFAULT: '#000000', // links
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Montserrat', 'sans-serif'],
        sans: ['Open Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(93,138,60,0.10)',
        soft: '0 2px 8px 0 rgba(93,138,60,0.08)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '2rem',
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
        'spacing': 'margin, padding',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      spacing: {
        'section': '4rem',
        'section-lg': '6rem',
      },
    },
  },
  plugins: [],
};
