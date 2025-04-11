/**
 * Project Neptune Theme Configuration - Dark Theme
 * This file contains the theme settings for the entire application
 */

export const colors = {
  // Base
  background: {
    primary: '#101521',
    secondary: '#1A1F2C',
    tertiary: '#242A38',
    sidebar: '#101521',
  },
  
  // Main colors
  accent: {
    primary: '#007BFF',
    secondary: '#00C47C',
    gold: '#FFD700',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E5E5',
    muted: '#B0B0B0',
    nav: '#9AA0AC',
  },
  
  // Status colors
  status: {
    success: '#4CAF50',
    warning: '#FFA500',
    error: '#FF4D4D',
  },
  
  // Button variants
  button: {
    primary: {
      background: '#007BFF',
      text: '#FFFFFF',
      hover: '#0069d9',
    },
    secondary: {
      background: 'transparent',
      text: '#007BFF',
      border: '#007BFF',
      hover: '#1A1F2C',
    },
    green: {
      background: '#00C47C',
      text: '#FFFFFF',
      hover: '#00a067',
    },
    danger: {
      background: '#FF4D4D',
      text: '#FFFFFF',
      hover: '#E04444',
    },
  },
  
  // Card and container styling
  card: {
    background: '#1A1F2C',
    border: '#2a3142',
    hover: '#242A38',
  },
  
  // Form elements
  form: {
    input: {
      background: '#242A38',
      border: '#353e52',
      text: '#FFFFFF',
      placeholder: '#9AA0AC',
      focus: '#007BFF',
    },
  },
};

export const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '1.6rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
  },
  body: {
    regular: {
      fontSize: '1rem',
      fontWeight: 400,
      color: colors.text.secondary,
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: colors.text.muted,
    },
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
};

export const borders = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '999px',
  },
  width: {
    thin: '1px',
    regular: '2px',
    thick: '4px',
  },
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 6px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
};

export const transitions = {
  fast: 'all 0.15s ease',
  medium: 'all 0.3s ease',
  slow: 'all 0.5s ease',
};

// CSS variables for direct use in styled components or CSS
export const cssVariables = `
  :root {
    /* Background Colors */
    --bg-primary: ${colors.background.primary};
    --bg-secondary: ${colors.background.secondary};
    --bg-tertiary: ${colors.background.tertiary};
    --bg-sidebar: ${colors.background.sidebar};
    
    /* Text Colors */
    --text-primary: ${colors.text.primary};
    --text-secondary: ${colors.text.secondary};
    --text-muted: ${colors.text.muted};
    --text-nav: ${colors.text.nav};
    
    /* Accent Colors */
    --accent-primary: ${colors.accent.primary};
    --accent-secondary: ${colors.accent.secondary};
    --accent-gold: ${colors.accent.gold};
    
    /* Status Colors */
    --success: ${colors.status.success};
    --warning: ${colors.status.warning};
    --error: ${colors.status.error};
    
    /* Card/Container */
    --card-bg: ${colors.card.background};
    --card-border: ${colors.card.border};
    --card-hover: ${colors.card.hover};
    
    /* Border Radius */
    --radius-sm: ${borders.radius.sm};
    --radius-md: ${borders.radius.md};
    --radius-lg: ${borders.radius.lg};
    --radius-xl: ${borders.radius.xl};
    
    /* Spacing */
    --space-xs: ${spacing.xs};
    --space-sm: ${spacing.sm};
    --space-md: ${spacing.md};
    --space-lg: ${spacing.lg};
    --space-xl: ${spacing.xl};
    --space-xxl: ${spacing.xxl};
    
    /* Typography */
    --font-family: ${typography.fontFamily};
    
    /* Font Sizes */
    --h1: ${typography.headings.h1.fontSize};
    --h2: ${typography.headings.h2.fontSize};
    --h3: ${typography.headings.h3.fontSize};
    --h4: ${typography.headings.h4.fontSize};
    --text-regular: ${typography.body.regular.fontSize};
    --text-small: ${typography.body.small.fontSize};
  }
`;

// Export all theme elements as a single default object
const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
  cssVariables,
};

export default theme;
