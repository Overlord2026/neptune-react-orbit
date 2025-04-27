
export interface StockOptionInputs {
  optionType: 'nso' | 'iso';
  numberOfShares: number;
  grantPrice: number;
  currentMarketPrice: number;
  annualIncome: number;
  filingStatus: 'single' | 'married';
  stateOfResidence: keyof typeof STATE_TAX_RATES;
  exerciseAndHold: boolean;
  holdingPeriod: number;
}

export interface StockOptionResults {
  optionValue: number;
  ordinaryIncome: number;
  federalTaxDue: number;
  stateTaxDue: number;
  ficaTaxDue: number;
  amtImpact: number;
  totalTaxDue: number;
  netProceeds: number;
  effectiveTaxRate: number;
}

export const STATE_TAX_RATES = {
  'CA': 0.13,
  'NY': 0.107,
  'TX': 0,
  'FL': 0,
  'IL': 0.0495,
  'WA': 0,
} as const;

export const TAX_RATES = {
  2025: {
    brackets: {
      single: [
        { threshold: 0, rate: 0.10 },
        { threshold: 11000, rate: 0.12 },
        { threshold: 44725, rate: 0.22 },
        { threshold: 95375, rate: 0.24 },
        { threshold: 182100, rate: 0.32 },
        { threshold: 231250, rate: 0.35 },
        { threshold: 578125, rate: 0.37 }
      ],
      married: [
        { threshold: 0, rate: 0.10 },
        { threshold: 22000, rate: 0.12 },
        { threshold: 89450, rate: 0.22 },
        { threshold: 190750, rate: 0.24 },
        { threshold: 364200, rate: 0.32 },
        { threshold: 462500, rate: 0.35 },
        { threshold: 693750, rate: 0.37 }
      ]
    },
    standardDeduction: {
      single: 14600,
      married: 29200
    }
  }
} as const;

