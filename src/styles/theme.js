
/**
 * Project Neptune Theme Configuration - Dark Theme with Enhanced Readability
 * This file contains the theme settings for the entire application
 */

export const colors = {
  // Base backgrounds
  background: {
    primary: '#0f172a',      // Deep navy background
    secondary: '#1e293b',    // Slightly lighter navy for cards
    tertiary: '#273549',     // Even lighter navy for accents 
    sidebar: '#0f172a',      // Sidebar background
  },
  
  // Main colors
  accent: {
    primary: '#0284c7',      // Bright blue
    secondary: '#00C47C',    // Green for success and positive indicators
    gold: '#fbbf24',         // Gold for premium features/highlights
  },
  text: {
    primary: '#f8fafc',      // Very light gray, almost white for main text
    secondary: '#e2e8f0',    // Light gray for secondary text
    muted: '#94a3b8',        // Medium gray for less important text
    nav: '#94a3b8',          // Navigation text
  },
  
  // Status colors
  status: {
    success: '#4ade80',      // Green for success messages
    warning: '#fbbf24',      // Amber for warnings
    error: '#f87171',        // Red for errors
  },
  
  // Button variants
  button: {
    primary: {
      background: '#0284c7', 
      text: '#FFFFFF',
      hover: '#0369a1',
    },
    secondary: {
      background: 'transparent',
      text: '#0284c7',
      border: '#0284c7',
      hover: '#1e293b',
    },
    green: {
      background: '#10b981',
      text: '#FFFFFF',
      hover: '#059669',
    },
    danger: {
      background: '#f87171',
      text: '#FFFFFF',
      hover: '#ef4444',
    },
  },
  
  // Card and container styling
  card: {
    background: '#1e293b',   
    border: '#334155',
    hover: '#273549',
  },
  
  // Form elements
  form: {
    input: {
      background: '#0f172a',
      border: '#334155',
      text: '#f8fafc',
      placeholder: '#94a3b8',
      focus: '#0284c7',
    },
  },
};

export const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    h1: {
      fontSize: '2.25rem',    // 36px
      fontWeight: 600,
      color: colors.text.primary,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',    // 28px
      fontWeight: 600,
      color: colors.text.primary,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',     // 24px
      fontWeight: 600,
      color: colors.text.primary,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',    // 20px
      fontWeight: 600,
      color: colors.text.primary,
      lineHeight: 1.4,
    },
  },
  body: {
    regular: {
      fontSize: '1rem',       // 16px
      fontWeight: 400,
      color: colors.text.secondary,
      lineHeight: 1.6,
    },
    small: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 400,
      color: colors.text.muted,
      lineHeight: 1.5,
    },
  },
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  xxl: '3rem',      // 48px
};

export const borders = {
  radius: {
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '1rem',       // 16px
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
    
    /* Line Heights */
    --lh-headings: 1.3;
    --lh-body: 1.6;
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
