
import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { spacing, borders, shadows, transitions } from './tokens/spacing';
import { cssVariables } from './tokens/cssVariables';

const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
  cssVariables,
};

export type Theme = typeof theme;
export default theme;
