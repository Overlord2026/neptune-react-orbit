// Import the standardized FilingStatusType
import { FilingStatusType } from '../types/tax/filingTypes';

export { FilingStatusType };

// Define the tax bracket data
export interface TaxBracket {
  rate: number;
  singleThreshold: number;
  marriedThreshold: number;
  headOfHouseholdThreshold: number;
  marriedSeparateThreshold: number;
  label: string;
}

// Helper function for formatting percentages
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// Helper function to convert between legacy and new filing status types
export function convertFilingStatusToNew(status: string): FilingStatusType {
  if (status === 'married') return 'married_joint';
  return status as FilingStatusType;
}

export function convertFilingStatusToLegacy(status: FilingStatusType): string {
  if (status === 'married_joint') return 'married';
  return status;
}

// Tax bracket data for different years
export const taxBracketData: { [year: number]: TaxBracket[] } = {
  2022: [
    { rate: 0.10, singleThreshold: 0, marriedThreshold: 0, headOfHouseholdThreshold: 0, marriedSeparateThreshold: 0, label: "10%" },
    { rate: 0.12, singleThreshold: 10275, marriedThreshold: 20550, headOfHouseholdThreshold: 14600, marriedSeparateThreshold: 10275, label: "12%" },
    { rate: 0.22, singleThreshold: 41775, marriedThreshold: 83550, headOfHouseholdThreshold: 55925, marriedSeparateThreshold: 41775, label: "22%" },
    { rate: 0.24, singleThreshold: 89075, marriedThreshold: 178150, headOfHouseholdThreshold: 118850, marriedSeparateThreshold: 89075, label: "24%" },
    { rate: 0.32, singleThreshold: 170050, marriedThreshold: 340100, headOfHouseholdThreshold: 215950, marriedSeparateThreshold: 170050, label: "32%" },
    { rate: 0.35, singleThreshold: 215950, marriedThreshold: 431900, headOfHouseholdThreshold: 539900, marriedSeparateThreshold: 215950, label: "35%" },
    { rate: 0.37, singleThreshold: 539900, marriedThreshold: 647850, headOfHouseholdThreshold: 647850, marriedSeparateThreshold: 539900, label: "37%" }
  ],
  2023: [
    { rate: 0.10, singleThreshold: 0, marriedThreshold: 0, headOfHouseholdThreshold: 0, marriedSeparateThreshold: 0, label: "10%" },
    { rate: 0.12, singleThreshold: 11000, marriedThreshold: 22000, headOfHouseholdThreshold: 16500, marriedSeparateThreshold: 11000, label: "12%" },
    { rate: 0.22, singleThreshold: 44725, marriedThreshold: 89450, headOfHouseholdThreshold: 59850, marriedSeparateThreshold: 44725, label: "22%" },
    { rate: 0.24, singleThreshold: 95375, marriedThreshold: 190750, headOfHouseholdThreshold: 127750, marriedSeparateThreshold: 95375, label: "24%" },
    { rate: 0.32, singleThreshold: 182100, marriedThreshold: 364200, headOfHouseholdThreshold: 231250, marriedSeparateThreshold: 182100, label: "32%" },
    { rate: 0.35, singleThreshold: 231250, marriedThreshold: 462500, headOfHouseholdThreshold: 578125, marriedSeparateThreshold: 231250, label: "35%" },
    { rate: 0.37, singleThreshold: 578125, marriedThreshold: 693750, headOfHouseholdThreshold: 693750, marriedSeparateThreshold: 578125, label: "37%" }
  ],
  2024: [
    { rate: 0.10, singleThreshold: 0, marriedThreshold: 0, headOfHouseholdThreshold: 0, marriedSeparateThreshold: 0, label: "10%" },
    { rate: 0.12, singleThreshold: 11600, marriedThreshold: 23200, headOfHouseholdThreshold: 17400, marriedSeparateThreshold: 11600, label: "12%" },
    { rate: 0.22, singleThreshold: 47150, marriedThreshold: 94300, headOfHouseholdThreshold: 63100, marriedSeparateThreshold: 47150, label: "22%" },
    { rate: 0.24, singleThreshold: 100525, marriedThreshold: 201050, headOfHouseholdThreshold: 134850, marriedSeparateThreshold: 100525, label: "24%" },
    { rate: 0.32, singleThreshold: 191950, marriedThreshold: 383900, headOfHouseholdThreshold: 243700, marriedSeparateThreshold: 191950, label: "32%" },
    { rate: 0.35, singleThreshold: 243700, marriedThreshold: 487400, headOfHouseholdThreshold: 609350, marriedSeparateThreshold: 243700, label: "35%" },
    { rate: 0.37, singleThreshold: 609350, marriedThreshold: 731200, headOfHouseholdThreshold: 731200, marriedSeparateThreshold: 609350, label: "37%" }
  ],
};

// Function to get the tax bracket for a given year, filing status, and income
export const getTaxBracket = (
  year: number,
  filingStatus: FilingStatusType,
  income: number
): TaxBracket => {
  const brackets = taxBracketData[year];
  if (!brackets) {
    console.warn(`No tax bracket data found for year ${year}. Using 2023 data.`);
    return getTaxBracket(2023, filingStatus, income);
  }

  let thresholdKey: keyof TaxBracket;
  switch (filingStatus) {
    case "single":
      thresholdKey = "singleThreshold";
      break;
    case "married_joint":
      thresholdKey = "marriedThreshold";
      break;
    case "head_of_household":
      thresholdKey = "headOfHouseholdThreshold";
      break;
    case "married_separate":
      thresholdKey = "marriedSeparateThreshold";
      break;
    case "qualifying_widow":
      thresholdKey = "marriedThreshold"; // Same as married jointly
      break;
    default:
      console.error(`Unknown filing status: ${filingStatus}`);
      return brackets[0];
  }

  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income > brackets[i][thresholdKey]) {
      return brackets[i];
    }
  }

  return brackets[0];
};

// Function to get the tax bracket rate for a given income
export const getTaxBracketRate = (income: number, year: number = 2023, filingStatus: FilingStatusType = "single"): string => {
  const bracket = getTaxBracket(year, filingStatus, income);
  return bracket.label;
};
