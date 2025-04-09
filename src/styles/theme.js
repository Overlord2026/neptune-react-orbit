
/**
 * Project Neptune Theme Configuration
 * This file contains the theme settings for the entire application
 */

export const colors = {
  // Base
  background: {
    primary: '#111111',
    secondary: '#1E1E1E',
    tertiary: '#222222',
    sidebar: '#0F0F0F',
  },
  
  // Main colors
  accent: '#FFD700', // Gold
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0', // Muted text
    accent: '#FFD700',
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
      background: '#FFD700',
      text: '#000000',
      hover: '#E5C100',
    },
    secondary: {
      background: 'transparent',
      text: '#FFD700',
      border: '#FFD700',
      hover: '#333333',
    },
    danger: {
      background: '#FF4D4D',
      text: '#FFFFFF',
      hover: '#E04444',
    },
  },
  
  // Card and container styling
  card: {
    background: '#1E1E1E',
    border: '#333333',
    hover: '#2A2A2A',
  },
  
  // Form elements
  form: {
    input: {
      background: '#2A2A2A',
      border: '#444444',
      text: '#FFFFFF',
      placeholder: '#A0A0A0',
      focus: '#FFD700',
    },
  },
};

export const typography = {
  fontFamily: 'Inter, Arial, sans-serif',
  headings: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '1.6rem',
      fontWeight: 700,
      color: colors.accent,
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 600,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: colors.accent,
    },
  },
  body: {
    regular: {
      fontSize: '1rem',
      fontWeight: 400,
      color: colors.text.primary,
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: colors.text.secondary,
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
    --text-accent: ${colors.accent};
    
    /* Accent Color */
    --accent: ${colors.accent};
    
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
