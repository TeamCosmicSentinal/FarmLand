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
          DEFAULT: '#1E5631', // rich forest green (header/nav background)
          dark: '#0F3B20',    // deeper green for footer or overlays
          light: '#2D7A45',   // lighter shade for hover states
        },
        accent: {
          DEFAULT: '#6AB04C', // vibrant green for buttons/accents
          bright: '#8BC34A',  // bright green (button, highlights)
          hover: '#5C9C40',   // darker shade for hover states
        },
        yellow: {
          DEFAULT: '#F9A826', // warm yellow accent (icons, borders)
          light: '#FBC02D',   // lighter yellow for hover states
        },
        card: {
          DEFAULT: '#FFFFFF', // white for cards/backgrounds
          alt: '#F9FBF7',     // very subtle green tint for alternate cards
        },
        text: {
          DEFAULT: '#1F2A17', // dark green-black for text
          light: '#FFFFFF',   // white text for dark backgrounds
          muted: '#4B5563',   // muted text for secondary information
        },
        clay: {
          DEFAULT: '#C17E61', // earthy clay tone (secondary accent)
          light: '#D4A28C',   // lighter clay for hover states
        },
        background: {
          DEFAULT: '#F6F9F3', // very light greenish/white background
          alt: '#EDF5E9',     // alternate background color
        },
        hemlock: {
          DEFAULT: '#2C3E50', // deep blue-green for header/footer
          light: '#34495E',   // lighter shade for hover states
        },
        offwhite: {
          DEFAULT: '#F8FAFC', // high-contrast text/icons
          dark: '#EEF2F7',    // slightly darker off-white for borders
        },
        sky: {
          DEFAULT: '#E3F2FD', // soft blue-tinted background
          light: '#BBDEFB',   // lighter sky blue for hover states
        },
        olive: {
          DEFAULT: '#212713', // deep olive for headings
          light: '#3E4A23',   // lighter olive for hover states
        },
        leaf: {
          DEFAULT: '#2E7D32', // rich leaf green for subheadings
          light: '#43A047',   // lighter leaf green for hover states
        },
        gold: {
          DEFAULT: '#F9A826', // warm gold for feature boxes
          light: '#FBC02D',   // lighter gold for hover states
        },
        softgreen: {
          DEFAULT: '#81C784', // soft mint green for feature boxes
          light: '#A5D6A7',   // lighter mint green for hover states
        },
        black: {
          DEFAULT: '#000000', // pure black for links
        },
        error: {
          DEFAULT: '#D32F2F', // error red
          light: '#FFCDD2',   // light red background for error messages
        },
        success: {
          DEFAULT: '#388E3C', // success green
          light: '#C8E6C9',   // light green background for success messages
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
