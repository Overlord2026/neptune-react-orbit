
import { TaxTrapWarning } from './types';

// Capital Gains Thresholds
interface CapitalGainsThreshold {
  year: number;
  filing_status: string;
  bracket_rate: number;
  bracket_min: number;
  bracket_max: number;
}

const CAPITAL_GAINS_THRESHOLDS: CapitalGainsThreshold[] = [
  // 2023 Single
  { year: 2023, filing_status: 'single', bracket_rate: 0, bracket_min: 0, bracket_max: 44625 },
  { year: 2023, filing_status: 'single', bracket_rate: 15, bracket_min: 44625, bracket_max: 492300 },
  { year: 2023, filing_status: 'single', bracket_rate: 20, bracket_min: 492300, bracket_max: Infinity },
  
  // 2023 Married
  { year: 2023, filing_status: 'married', bracket_rate: 0, bracket_min: 0, bracket_max: 89250 },
  { year: 2023, filing_status: 'married', bracket_rate: 15, bracket_min: 89250, bracket_max: 553850 },
  { year: 2023, filing_status: 'married', bracket_rate: 20, bracket_min: 553850, bracket_max: Infinity },
  
  // 2023 Head of Household
  { year: 2023, filing_status: 'head_of_household', bracket_rate: 0, bracket_min: 0, bracket_max: 59750 },
  { year: 2023, filing_status: 'head_of_household', bracket_rate: 15, bracket_min: 59750, bracket_max: 523050 },
  { year: 2023, filing_status: 'head_of_household', bracket_rate: 20, bracket_min: 523050, bracket_max: Infinity },
];

/**
 * Check for capital gains rate changes
 */
export function checkCapitalGainsRate(
  year: number,
  filingStatus: string,
  taxableIncome: number
): { current_rate: number; threshold_to_next_bracket: number | null } {
  // Find applicable thresholds for the year and filing status
  const thresholds = CAPITAL_GAINS_THRESHOLDS.filter(
    t => t.year === year && t.filing_status === filingStatus
  );
  
  if (thresholds.length === 0) {
    // Default to 15% if no data found
    return { current_rate: 15, threshold_to_next_bracket: null };
  }
  
  // Find the current bracket
  const currentBracket = thresholds.find(
    t => taxableIncome >= t.bracket_min && taxableIncome < t.bracket_max
  );
  
  if (!currentBracket) {
    // Default to highest bracket if income exceeds all brackets
    const highestBracket = thresholds.reduce(
      (prev, current) => (current.bracket_max > prev.bracket_max ? current : prev), 
      thresholds[0]
    );
    return { current_rate: highestBracket.bracket_rate, threshold_to_next_bracket: null };
  }
  
  // Find the next bracket threshold
  const nextBracket = thresholds.find(t => t.bracket_min > currentBracket.bracket_max);
  const threshold_to_next_bracket = nextBracket ? nextBracket.bracket_min : null;
  
  return {
    current_rate: currentBracket.bracket_rate,
    threshold_to_next_bracket
  };
}

export function generateCapitalGainsWarning(
  cgResult: { current_rate: number; threshold_to_next_bracket: number | null },
  taxableIncome: number,
  capitalGainsLong: number
): TaxTrapWarning | null {
  // Calculate what happens if additional income pushes them into higher bracket
  if (cgResult.threshold_to_next_bracket) {
    const distance_to_next_bracket = cgResult.threshold_to_next_bracket - taxableIncome;
    
    if (distance_to_next_bracket < 25000) {
      // If within $25k of next bracket, warn about potential impact
      const next_rate = cgResult.current_rate === 0 ? 15 : 20;
      const rate_increase = next_rate - cgResult.current_rate;
      const tax_increase = (capitalGainsLong * rate_increase) / 100;
      
      return {
        type: 'capital_gains',
        message: `You are $${distance_to_next_bracket.toFixed(0)} away from moving from ${cgResult.current_rate}% to ${next_rate}% long-term capital gains rate.`,
        severity: 'medium',
        trapType: 'capital_gains',
        title: 'Capital Gains Tax Bracket Change',
        description: `You are $${distance_to_next_bracket.toFixed(0)} away from moving from ${cgResult.current_rate}% to ${next_rate}% long-term capital gains rate.`,
        financial_impact: tax_increase,
        icon: 'alertTriangle'
      };
    }
  }
  
  return null;
}
