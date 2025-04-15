
/**
 * Tax bracket data and utilities
 */
import { FilingStatusType, convertLegacyFilingStatus, LegacyFilingStatusType } from '@/types/tax/filingTypes';
import { formatCurrency, formatPercent } from './formatUtils';

// Export formatters for backward compatibility
export { formatCurrency, formatPercent } from './formatUtils';
export { FilingStatusType, LegacyFilingStatusType, convertLegacyFilingStatus } from '@/types/tax/filingTypes';

// Tax bracket types
export type BracketType = "ordinary" | "ltcg";

// Standard deduction values for 2023
export const STANDARD_DEDUCTION = {
  single: 13850,
  marriedFilingJointly: 27700,
  marriedFilingSeparately: 13850,
  headOfHousehold: 20800
};

// Standard deduction by year and filing status
export const STANDARD_DEDUCTION_BY_YEAR = {
  2022: {
    single: 12950,
    married_joint: 25900, 
    married_separate: 12950,
    head_of_household: 19400,
    qualifying_widow: 25900
  },
  2023: {
    single: 13850,
    married_joint: 27700,
    married_separate: 13850,
    head_of_household: 20800,
    qualifying_widow: 27700
  },
  2024: {
    single: 14600,
    married_joint: 29200,
    married_separate: 14600,
    head_of_household: 21900,
    qualifying_widow: 29200
  }
};

// Export tax brackets data for other modules
export const TAX_BRACKETS_DATA = {
  2022: {
    // Tax bracket data here
  },
  2023: {
    // Tax bracket data here
  },
  2024: {
    // Tax bracket data here
  }
};

// Helper function to convert modern filing status to legacy
export const convertFilingStatusToLegacy = (status: FilingStatusType): LegacyFilingStatusType => {
  if (status === 'married_joint') return 'married';
  return status as LegacyFilingStatusType;
};

// Helper function that maps legacy filing status to current filing status for bracket lookups
export function getBrackets(year: number, filingStatus: FilingStatusType | LegacyFilingStatusType, bracketType: BracketType = "ordinary"): {
  bracket_min: number;
  bracket_max: number;
  rate: number;
}[] {
  // Convert legacy filing status if needed
  const normalizedFilingStatus = typeof filingStatus === 'string' && 
    (filingStatus === 'married' || filingStatus === 'single' || 
     filingStatus === 'married_separate' || filingStatus === 'head_of_household')
    ? convertLegacyFilingStatus(filingStatus as LegacyFilingStatusType)
    : filingStatus;

  // Simple hard-coded brackets for demonstration
  // In a real app this would come from a data source or API
  const brackets = {
    ordinary: {
      single: [
        { bracket_min: 0, bracket_max: 10275, rate: 0.1 },
        { bracket_min: 10275, bracket_max: 41775, rate: 0.12 },
        { bracket_min: 41775, bracket_max: 89075, rate: 0.22 },
        { bracket_min: 89075, bracket_max: 170050, rate: 0.24 },
        { bracket_min: 170050, bracket_max: 215950, rate: 0.32 },
        { bracket_min: 215950, bracket_max: 539900, rate: 0.35 },
        { bracket_min: 539900, bracket_max: Infinity, rate: 0.37 }
      ],
      married_joint: [
        { bracket_min: 0, bracket_max: 20550, rate: 0.1 },
        { bracket_min: 20550, bracket_max: 83550, rate: 0.12 },
        { bracket_min: 83550, bracket_max: 178150, rate: 0.22 },
        { bracket_min: 178150, bracket_max: 340100, rate: 0.24 },
        { bracket_min: 340100, bracket_max: 431900, rate: 0.32 },
        { bracket_min: 431900, bracket_max: 647850, rate: 0.35 },
        { bracket_min: 647850, bracket_max: Infinity, rate: 0.37 }
      ],
      married_separate: [
        { bracket_min: 0, bracket_max: 10275, rate: 0.1 },
        { bracket_min: 10275, bracket_max: 41775, rate: 0.12 },
        { bracket_min: 41775, bracket_max: 89075, rate: 0.22 },
        { bracket_min: 89075, bracket_max: 170050, rate: 0.24 },
        { bracket_min: 170050, bracket_max: 215950, rate: 0.32 },
        { bracket_min: 215950, bracket_max: 323925, rate: 0.35 },
        { bracket_min: 323925, bracket_max: Infinity, rate: 0.37 }
      ],
      head_of_household: [
        { bracket_min: 0, bracket_max: 14650, rate: 0.1 },
        { bracket_min: 14650, bracket_max: 55900, rate: 0.12 },
        { bracket_min: 55900, bracket_max: 89050, rate: 0.22 },
        { bracket_min: 89050, bracket_max: 170050, rate: 0.24 },
        { bracket_min: 170050, bracket_max: 215950, rate: 0.32 },
        { bracket_min: 215950, bracket_max: 539900, rate: 0.35 },
        { bracket_min: 539900, bracket_max: Infinity, rate: 0.37 }
      ],
      qualifying_widow: [
        { bracket_min: 0, bracket_max: 20550, rate: 0.1 },
        { bracket_min: 20550, bracket_max: 83550, rate: 0.12 },
        { bracket_min: 83550, bracket_max: 178150, rate: 0.22 },
        { bracket_min: 178150, bracket_max: 340100, rate: 0.24 },
        { bracket_min: 340100, bracket_max: 431900, rate: 0.32 },
        { bracket_min: 431900, bracket_max: 647850, rate: 0.35 },
        { bracket_min: 647850, bracket_max: Infinity, rate: 0.37 }
      ]
    },
    ltcg: {
      // Add long term capital gains brackets here
      single: [
        { bracket_min: 0, bracket_max: 41675, rate: 0 },
        { bracket_min: 41675, bracket_max: 459750, rate: 0.15 },
        { bracket_min: 459750, bracket_max: Infinity, rate: 0.20 }
      ],
      married_joint: [
        { bracket_min: 0, bracket_max: 83350, rate: 0 },
        { bracket_min: 83350, bracket_max: 517200, rate: 0.15 },
        { bracket_min: 517200, bracket_max: Infinity, rate: 0.20 }
      ],
      married_separate: [
        { bracket_min: 0, bracket_max: 41675, rate: 0 },
        { bracket_min: 41675, bracket_max: 258600, rate: 0.15 },
        { bracket_min: 258600, bracket_max: Infinity, rate: 0.20 }
      ],
      head_of_household: [
        { bracket_min: 0, bracket_max: 55800, rate: 0 },
        { bracket_min: 55800, bracket_max: 488500, rate: 0.15 },
        { bracket_min: 488500, bracket_max: Infinity, rate: 0.20 }
      ],
      qualifying_widow: [
        { bracket_min: 0, bracket_max: 83350, rate: 0 },
        { bracket_min: 83350, bracket_max: 517200, rate: 0.15 },
        { bracket_min: 517200, bracket_max: Infinity, rate: 0.20 }
      ]
    }
  };

  // Return the relevant brackets
  return brackets[bracketType][normalizedFilingStatus as keyof typeof brackets[typeof bracketType]] || 
         brackets[bracketType].single;  // Default to single if status not found
}

// Calculate tax for a specific income amount
export function calculateTax(income: number, year: number, filingStatus: FilingStatusType): number {
  const brackets = getBrackets(year, filingStatus);
  let tax = 0;
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const prevBracketMax = i > 0 ? brackets[i-1].bracket_max : 0;
    
    if (income > prevBracketMax) {
      const taxableInThisBracket = Math.min(income - prevBracketMax, bracket.bracket_max - prevBracketMax);
      tax += taxableInThisBracket * bracket.rate;
    }
  }
  
  return tax;
}

// Calculate effective tax rate
export function calculateEffectiveRate(tax: number, income: number): number {
  if (income <= 0) return 0;
  return tax / income;
}

// For backward compatibility with getTaxBracket
export function getTaxBracket(income: number, filingStatus: FilingStatusType | LegacyFilingStatusType = 'single'): string {
  const normalizedFilingStatus = typeof filingStatus === 'string' && 
    (filingStatus === 'married' || filingStatus === 'single' || 
     filingStatus === 'married_separate' || filingStatus === 'head_of_household')
    ? convertLegacyFilingStatus(filingStatus as LegacyFilingStatusType)
    : filingStatus;
    
  const brackets = getBrackets(new Date().getFullYear(), normalizedFilingStatus);
  
  // Find the bracket for this income
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income >= brackets[i].bracket_min) {
      return `${(brackets[i].rate * 100).toFixed(0)}%`;
    }
  }
  
  return "0%";
}

// Export the function to get distance to next bracket
export function getDistanceToNextBracket(income: number, filingStatus: FilingStatusType | LegacyFilingStatusType = 'single'): {
  nextThreshold: number;
  distance: number;
} {
  const normalizedFilingStatus = typeof filingStatus === 'string' && 
    (filingStatus === 'married' || filingStatus === 'single' || 
     filingStatus === 'married_separate' || filingStatus === 'head_of_household')
    ? convertLegacyFilingStatus(filingStatus as LegacyFilingStatusType)
    : filingStatus;

  const brackets = getBrackets(new Date().getFullYear(), normalizedFilingStatus);
  
  // Find the current bracket and calculate distance to next
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (income >= bracket.bracket_min && income < bracket.bracket_max) {
      return {
        nextThreshold: bracket.bracket_max,
        distance: bracket.bracket_max - income
      };
    }
  }
  
  // If we're in the highest bracket
  return {
    nextThreshold: Infinity,
    distance: Infinity
  };
}
