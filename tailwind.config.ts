
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0284c7',
          foreground: '#FFFFFF',
          hover: '#0369a1',
          light: '#e0f2fe',
          dark: '#075985'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: '#fbbf24',
          foreground: '#0f172a',
          hover: '#f59e0b',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: '#0f172a',
          foreground: '#f8fafc',
          primary: '#0284c7',
          'primary-foreground': '#ffffff',
          accent: '#fbbf24',
          'accent-foreground': '#0f172a',
          border: '#334155',
          ring: '#0284c7'
        },
        navy: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        custom: {
          background: {
            primary: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#273549',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#e2e8f0',
            muted: '#94a3b8',
          },
          accent: {
            gold: '#fbbf24',
          }
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-in',
        'slide-up': 'slide-up 0.3s ease-out'
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#f8fafc',
            h1: {
              color: '#f8fafc',
            },
            h2: {
              color: '#f8fafc',
            },
            h3: {
              color: '#f8fafc',
            },
            strong: {
              color: '#f8fafc',
            },
            a: {
              color: '#0284c7',
              '&:hover': {
                color: '#0369a1',
              },
            },
            code: {
              color: '#e2e8f0',
              backgroundColor: '#273549',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
