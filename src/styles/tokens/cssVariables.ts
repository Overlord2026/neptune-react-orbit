
import { colors } from './colors';
import { borders, spacing } from './spacing';
import { typography } from './typography';

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
