
/**
 * Tax bracket utility functions
 */
import { FilingStatusType, LegacyFilingStatusType, convertLegacyFilingStatus } from '@/types/tax/filingTypes';
import { BracketType, convertFilingStatusToLegacy } from './taxBracketTypes';

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

/**
 * Get the tax bracket for a given income and filing status
 */
export function getTaxBracket(income: number, filingStatus: FilingStatusType | LegacyFilingStatusType = 'single'): any {
  const normalizedFilingStatus = typeof filingStatus === 'string' && 
    (filingStatus === 'married' || filingStatus === 'single' || 
     filingStatus === 'married_separate' || filingStatus === 'head_of_household')
    ? convertLegacyFilingStatus(filingStatus as LegacyFilingStatusType)
    : filingStatus;
    
  const brackets = getBrackets(new Date().getFullYear(), normalizedFilingStatus);
  
  // Find the bracket for this income
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income >= brackets[i].bracket_min) {
      return brackets[i];
    }
  }
  
  return brackets[0];
}

/**
 * Get the capital gains bracket for a given income and filing status
 */
export function getCapitalGainsBracket(income: number, filingStatus: FilingStatusType | LegacyFilingStatusType = 'single'): any {
  const normalizedFilingStatus = typeof filingStatus === 'string' && 
    (filingStatus === 'married' || filingStatus === 'single' || 
     filingStatus === 'married_separate' || filingStatus === 'head_of_household')
    ? convertLegacyFilingStatus(filingStatus as LegacyFilingStatusType)
    : filingStatus;
    
  const brackets = getBrackets(new Date().getFullYear(), normalizedFilingStatus, "ltcg");
  
  // Find the bracket for this income
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income >= brackets[i].bracket_min) {
      return brackets[i];
    }
  }
  
  return brackets[0];
}
