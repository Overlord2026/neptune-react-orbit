
/**
 * Central theme configuration for the application
 * Based on the Dark Navy Dashboard theme
 */
import { colors } from '../tokens/colors';

// Theme variables - single source of truth for all theme values
export const themeConfig = {
  // Colors
  colors: {
    ...colors,
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    background: colors.background.primary,
  },
  
  // Typography
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
  },
  
  // Borders
  borders: {
    radius: {
      sm: '0.25rem',    // 4px
      md: '0.375rem',   // 6px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
      full: '9999px',   // Fully rounded
    },
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Z-index
  zIndex: {
    hidden: -1,
    base: 0,
    raised: 1,
    dropdown: 10,
    sticky: 100,
    overlay: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
    max: 9999,
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },
};

export default themeConfig;
