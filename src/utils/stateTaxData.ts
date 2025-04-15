/**
 * State Tax Data
 * 
 * This file contains tax bracket information for various US states.
 * Data is approximated based on publicly available information and may not reflect
 * all local nuances, exemptions, or special circumstances.
 */

export interface StateTaxBracket {
  min: number;
  max: number;
  rate: number; // Percentage (e.g., 5.0 means 5%)
}

export interface StateTaxData {
  name: string;
  type: 'graduated' | 'flat' | 'none';
  brackets?: StateTaxBracket[];
  flatRate?: number;
  specialNotes?: string;
}

export type StateCode = 
  | 'AL' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'GA' | 'HI' | 'ID' 
  | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA' | 'MI' 
  | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' 
  | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'UT' | 'VT' | 'VA' | 'WV' 
  | 'WI' | 'DC' | 'NONE' | 'OTHER';

// States with no income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota,
// Tennessee, Texas, Washington, and Wyoming are not included

export const stateTaxData: Record<StateCode, StateTaxData> = {
  // California - Progressive tax system
  CA: {
    name: "California",
    type: "graduated",
    brackets: [
      { min: 0, max: 10099, rate: 1.0 },
      { min: 10100, max: 23942, rate: 2.0 },
      { min: 23943, max: 37788, rate: 4.0 },
      { min: 37789, max: 52455, rate: 6.0 },
      { min: 52456, max: 66295, rate: 8.0 },
      { min: 66296, max: 338639, rate: 9.3 },
      { min: 338640, max: 406364, rate: 10.3 },
      { min: 406365, max: 677275, rate: 11.3 },
      { min: 677276, max: Infinity, rate: 12.3 }
    ],
    specialNotes: "California has an additional 1% mental health services tax on income over $1 million."
  },
  
  // New York - Progressive tax system
  NY: {
    name: "New York",
    type: "graduated",
    brackets: [
      { min: 0, max: 8500, rate: 4.0 },
      { min: 8501, max: 11700, rate: 4.5 },
      { min: 11701, max: 13900, rate: 5.25 },
      { min: 13901, max: 80650, rate: 5.9 },
      { min: 80651, max: 215400, rate: 6.33 },
      { min: 215401, max: 1077550, rate: 6.85 },
      { min: 1077551, max: 5000000, rate: 9.65 },
      { min: 5000001, max: 25000000, rate: 10.3 },
      { min: 25000001, max: Infinity, rate: 10.9 }
    ],
    specialNotes: "New York City residents pay additional local income tax."
  },
  
  // New Jersey - Progressive tax system
  NJ: {
    name: "New Jersey",
    type: "graduated",
    brackets: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20001, max: 35000, rate: 1.75 },
      { min: 35001, max: 40000, rate: 3.5 },
      { min: 40001, max: 75000, rate: 5.525 },
      { min: 75001, max: 500000, rate: 6.37 },
      { min: 500001, max: 1000000, rate: 8.97 },
      { min: 1000001, max: Infinity, rate: 10.75 }
    ]
  },
  
  // Illinois - Flat tax
  IL: {
    name: "Illinois",
    type: "flat",
    flatRate: 4.95
  },
  
  // Massachusetts - Flat tax
  MA: {
    name: "Massachusetts",
    type: "flat",
    flatRate: 5.0,
    specialNotes: "Massachusetts has a separate tax rate for short-term capital gains."
  },
  
  // Colorado - Flat tax
  CO: {
    name: "Colorado",
    type: "flat",
    flatRate: 4.55
  },
  
  // Pennsylvania - Flat tax
  PA: {
    name: "Pennsylvania",
    type: "flat",
    flatRate: 3.07,
    specialNotes: "Some municipalities in Pennsylvania levy additional local income taxes."
  },
  
  // Minnesota - Progressive tax system
  MN: {
    name: "Minnesota",
    type: "graduated",
    brackets: [
      { min: 0, max: 28080, rate: 5.35 },
      { min: 28081, max: 92230, rate: 6.8 },
      { min: 92231, max: 171220, rate: 7.85 },
      { min: 171221, max: Infinity, rate: 9.85 }
    ]
  },
  
  // Oregon - Progressive tax system
  OR: {
    name: "Oregon",
    type: "graduated",
    brackets: [
      { min: 0, max: 3600, rate: 4.75 },
      { min: 3601, max: 9050, rate: 6.75 },
      { min: 9051, max: 125000, rate: 8.75 },
      { min: 125001, max: Infinity, rate: 9.9 }
    ]
  },
  
  // Hawaii - Progressive tax system
  HI: {
    name: "Hawaii",
    type: "graduated",
    brackets: [
      { min: 0, max: 2400, rate: 1.4 },
      { min: 2401, max: 4800, rate: 3.2 },
      { min: 4801, max: 9600, rate: 5.5 },
      { min: 9601, max: 14400, rate: 6.4 },
      { min: 14401, max: 19200, rate: 6.8 },
      { min: 19201, max: 24000, rate: 7.2 },
      { min: 24001, max: 36000, rate: 7.6 },
      { min: 36001, max: 48000, rate: 7.9 },
      { min: 48001, max: 150000, rate: 8.25 },
      { min: 150001, max: 175000, rate: 9.0 },
      { min: 175001, max: 200000, rate: 10.0 },
      { min: 200001, max: Infinity, rate: 11.0 }
    ]
  },
  
  // Michigan - Flat tax
  MI: {
    name: "Michigan",
    type: "flat",
    flatRate: 4.25
  },
  
  // Maryland - Progressive tax system
  MD: {
    name: "Maryland",
    type: "graduated",
    brackets: [
      { min: 0, max: 1000, rate: 2.0 },
      { min: 1001, max: 2000, rate: 3.0 },
      { min: 2001, max: 3000, rate: 4.0 },
      { min: 3001, max: 100000, rate: 4.75 },
      { min: 100001, max: 125000, rate: 5.0 },
      { min: 125001, max: 150000, rate: 5.25 },
      { min: 150001, max: 250000, rate: 5.5 },
      { min: 250001, max: Infinity, rate: 5.75 }
    ],
    specialNotes: "Maryland counties and Baltimore City impose additional local income taxes."
  },
  
  // Other commonly used states with simpler structures
  
  // Arizona - Progressive tax system
  AZ: {
    name: "Arizona",
    type: "graduated",
    brackets: [
      { min: 0, max: 27272, rate: 2.59 },
      { min: 27273, max: 54544, rate: 3.34 },
      { min: 54545, max: 163632, rate: 4.17 },
      { min: 163633, max: Infinity, rate: 4.5 }
    ]
  },

  // North Carolina - Flat tax
  NC: {
    name: "North Carolina",
    type: "flat",
    flatRate: 4.99
  },
  
  // Ohio - Progressive tax system
  OH: {
    name: "Ohio",
    type: "graduated",
    brackets: [
      { min: 0, max: 25000, rate: 0.0 },
      { min: 25001, max: 44250, rate: 2.765 },
      { min: 44251, max: 88450, rate: 3.226 },
      { min: 88451, max: 110650, rate: 3.688 },
      { min: 110651, max: Infinity, rate: 3.99 }
    ]
  },
  
  // Virginia - Progressive tax system
  VA: {
    name: "Virginia",
    type: "graduated",
    brackets: [
      { min: 0, max: 3000, rate: 2.0 },
      { min: 3001, max: 5000, rate: 3.0 },
      { min: 5001, max: 17000, rate: 5.0 },
      { min: 17001, max: Infinity, rate: 5.75 }
    ]
  },
  
  // Wisconsin - Progressive tax system
  WI: {
    name: "Wisconsin",
    type: "graduated",
    brackets: [
      { min: 0, max: 12760, rate: 3.54 },
      { min: 12761, max: 25520, rate: 4.65 },
      { min: 25521, max: 280950, rate: 5.3 },
      { min: 280951, max: Infinity, rate: 7.65 }
    ]
  },
  
  // More states with various structures
  
  // Connecticut - Progressive tax system
  CT: {
    name: "Connecticut",
    type: "graduated",
    brackets: [
      { min: 0, max: 10000, rate: 3.0 },
      { min: 10001, max: 50000, rate: 5.0 },
      { min: 50001, max: 100000, rate: 5.5 },
      { min: 100001, max: 200000, rate: 6.0 },
      { min: 200001, max: 250000, rate: 6.5 },
      { min: 250001, max: 500000, rate: 6.9 },
      { min: 500001, max: Infinity, rate: 6.99 }
    ]
  },
  
  // Iowa - Progressive tax system
  IA: {
    name: "Iowa",
    type: "graduated",
    brackets: [
      { min: 0, max: 1676, rate: 0.33 },
      { min: 1677, max: 3352, rate: 0.67 },
      { min: 3353, max: 6704, rate: 2.25 },
      { min: 6705, max: 15084, rate: 4.14 },
      { min: 15085, max: 25140, rate: 5.63 },
      { min: 25141, max: 33520, rate: 5.96 },
      { min: 33521, max: 50280, rate: 6.25 },
      { min: 50281, max: 75420, rate: 7.44 },
      { min: 75421, max: Infinity, rate: 8.53 }
    ],
    specialNotes: "Iowa is gradually moving to a flat tax system by 2026."
  },
  
  // Kentucky - Flat tax
  KY: {
    name: "Kentucky",
    type: "flat",
    flatRate: 5.0
  },
  
  // Other states with various structures
  
  // Alabama
  AL: {
    name: "Alabama",
    type: "graduated",
    brackets: [
      { min: 0, max: 500, rate: 2.0 },
      { min: 501, max: 3000, rate: 4.0 },
      { min: 3001, max: Infinity, rate: 5.0 }
    ]
  },
  
  // Arkansas
  AR: {
    name: "Arkansas",
    type: "graduated",
    brackets: [
      { min: 0, max: 4300, rate: 2.0 },
      { min: 4301, max: 8500, rate: 4.0 },
      { min: 8501, max: Infinity, rate: 5.9 }
    ]
  },
  
  // Delaware
  DE: {
    name: "Delaware",
    type: "graduated",
    brackets: [
      { min: 0, max: 5000, rate: 0.0 },
      { min: 5001, max: 10000, rate: 2.2 },
      { min: 10001, max: 20000, rate: 3.9 },
      { min: 20001, max: 25000, rate: 4.8 },
      { min: 25001, max: 60000, rate: 5.2 },
      { min: 60001, max: Infinity, rate: 6.6 }
    ]
  },
  
  // Georgia
  GA: {
    name: "Georgia",
    type: "graduated",
    brackets: [
      { min: 0, max: 750, rate: 1.0 },
      { min: 751, max: 2250, rate: 2.0 },
      { min: 2251, max: 3750, rate: 3.0 },
      { min: 3751, max: 5250, rate: 4.0 },
      { min: 5251, max: 7000, rate: 5.0 },
      { min: 7001, max: Infinity, rate: 5.75 }
    ]
  },
  
  // Idaho
  ID: {
    name: "Idaho",
    type: "graduated",
    brackets: [
      { min: 0, max: 1568, rate: 1.125 },
      { min: 1569, max: 3136, rate: 3.125 },
      { min: 3137, max: 4704, rate: 3.625 },
      { min: 4705, max: 6272, rate: 4.625 },
      { min: 6273, max: 7840, rate: 5.625 },
      { min: 7841, max: Infinity, rate: 6.5 }
    ]
  },
  
  // Indiana
  IN: {
    name: "Indiana",
    type: "flat",
    flatRate: 3.15,
    specialNotes: "Counties in Indiana impose additional local income taxes."
  },
  
  // Kansas
  KS: {
    name: "Kansas",
    type: "graduated",
    brackets: [
      { min: 0, max: 15000, rate: 3.1 },
      { min: 15001, max: 30000, rate: 5.25 },
      { min: 30001, max: Infinity, rate: 5.7 }
    ]
  },
  
  // Louisiana
  LA: {
    name: "Louisiana",
    type: "graduated",
    brackets: [
      { min: 0, max: 12500, rate: 1.85 },
      { min: 12501, max: 50000, rate: 3.5 },
      { min: 50001, max: Infinity, rate: 4.25 }
    ]
  },
  
  // Maine
  ME: {
    name: "Maine",
    type: "graduated",
    brackets: [
      { min: 0, max: 23000, rate: 5.8 },
      { min: 23001, max: 54450, rate: 6.75 },
      { min: 54451, max: Infinity, rate: 7.15 }
    ]
  },
  
  // Mississippi
  MS: {
    name: "Mississippi",
    type: "flat",
    flatRate: 5.0
  },
  
  // Missouri
  MO: {
    name: "Missouri",
    type: "graduated",
    brackets: [
      { min: 0, max: 1121, rate: 0.0 },
      { min: 1122, max: 2242, rate: 1.5 },
      { min: 2243, max: 3363, rate: 2.0 },
      { min: 3364, max: 4484, rate: 2.5 },
      { min: 4485, max: 5605, rate: 3.0 },
      { min: 5606, max: 6726, rate: 3.5 },
      { min: 6727, max: 7847, rate: 4.0 },
      { min: 7848, max: 8968, rate: 4.5 },
      { min: 8969, max: 10089, rate: 5.0 },
      { min: 10090, max: Infinity, rate: 5.4 }
    ]
  },
  
  // Montana
  MT: {
    name: "Montana",
    type: "graduated",
    brackets: [
      { min: 0, max: 3100, rate: 1.0 },
      { min: 3101, max: 5500, rate: 2.0 },
      { min: 5501, max: 8400, rate: 3.0 },
      { min: 8401, max: 11400, rate: 4.0 },
      { min: 11401, max: 14600, rate: 5.0 },
      { min: 14601, max: 18800, rate: 6.0 },
      { min: 18801, max: Infinity, rate: 6.9 }
    ]
  },
  
  // Nebraska
  NE: {
    name: "Nebraska",
    type: "graduated",
    brackets: [
      { min: 0, max: 3340, rate: 2.46 },
      { min: 3341, max: 20060, rate: 3.51 },
      { min: 20061, max: 32210, rate: 5.01 },
      { min: 32211, max: Infinity, rate: 6.84 }
    ]
  },
  
  // New Mexico
  NM: {
    name: "New Mexico",
    type: "graduated",
    brackets: [
      { min: 0, max: 5500, rate: 1.7 },
      { min: 5501, max: 11000, rate: 3.2 },
      { min: 11001, max: 16000, rate: 4.7 },
      { min: 16001, max: 210000, rate: 4.9 },
      { min: 210001, max: Infinity, rate: 5.9 }
    ]
  },
  
  // North Dakota
  ND: {
    name: "North Dakota",
    type: "graduated",
    brackets: [
      { min: 0, max: 40525, rate: 1.1 },
      { min: 40526, max: 98100, rate: 2.04 },
      { min: 98101, max: 204675, rate: 2.27 },
      { min: 204676, max: 445000, rate: 2.64 },
      { min: 445001, max: Infinity, rate: 2.9 }
    ]
  },
  
  // Oklahoma
  OK: {
    name: "Oklahoma",
    type: "graduated",
    brackets: [
      { min: 0, max: 1000, rate: 0.25 },
      { min: 1001, max: 2500, rate: 0.75 },
      { min: 2501, max: 3750, rate: 1.75 },
      { min: 3751, max: 4900, rate: 2.75 },
      { min: 4901, max: 7200, rate: 3.75 },
      { min: 7201, max: Infinity, rate: 4.75 }
    ]
  },
  
  // Rhode Island
  RI: {
    name: "Rhode Island",
    type: "graduated",
    brackets: [
      { min: 0, max: 68200, rate: 3.75 },
      { min: 68201, max: 155050, rate: 4.75 },
      { min: 155051, max: Infinity, rate: 5.99 }
    ]
  },
  
  // South Carolina
  SC: {
    name: "South Carolina",
    type: "graduated",
    brackets: [
      { min: 0, max: 3200, rate: 0.0 },
      { min: 3201, max: 6410, rate: 3.0 },
      { min: 6411, max: 9620, rate: 4.0 },
      { min: 9621, max: 12820, rate: 5.0 },
      { min: 12821, max: 16040, rate: 6.0 },
      { min: 16041, max: Infinity, rate: 7.0 }
    ]
  },
  
  // Utah
  UT: {
    name: "Utah",
    type: "flat",
    flatRate: 4.85
  },
  
  // Vermont
  VT: {
    name: "Vermont",
    type: "graduated",
    brackets: [
      { min: 0, max: 42150, rate: 3.35 },
      { min: 42151, max: 102200, rate: 6.6 },
      { min: 102201, max: 213150, rate: 7.6 },
      { min: 213151, max: Infinity, rate: 8.75 }
    ]
  },
  
  // West Virginia
  WV: {
    name: "West Virginia",
    type: "graduated",
    brackets: [
      { min: 0, max: 10000, rate: 3.0 },
      { min: 10001, max: 25000, rate: 4.0 },
      { min: 25001, max: 40000, rate: 4.5 },
      { min: 40001, max: 60000, rate: 6.0 },
      { min: 60001, max: Infinity, rate: 6.5 }
    ]
  },
  
  // District of Columbia
  DC: {
    name: "District of Columbia",
    type: "graduated",
    brackets: [
      { min: 0, max: 10000, rate: 4.0 },
      { min: 10001, max: 40000, rate: 6.0 },
      { min: 40001, max: 60000, rate: 6.5 },
      { min: 60001, max: 350000, rate: 8.5 },
      { min: 350001, max: 1000000, rate: 9.25 },
      { min: 1000001, max: Infinity, rate: 10.75 }
    ]
  },
  
  // No state income tax or federal only option
  NONE: {
    name: "No State Income Tax",
    type: "none",
    specialNotes: "States with no income tax include Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming."
  },
  
  // Other/Federal Only
  OTHER: {
    name: "Other State/Federal Only",
    type: "none",
    specialNotes: "This option calculates only federal taxes and does not include state-specific calculations."
  }
};

export const STATE_TAX_RATES: Record<StateCode, number> = Object.fromEntries(
  Object.entries(stateTaxData).map(([state, data]) => {
    if (data.type === 'flat') {
      return [state, (data.flatRate || 0) / 100];
    } else if (data.type === 'graduated' && data.brackets) {
      // Use the highest marginal rate for graduated tax systems
      const highestRate = Math.max(...data.brackets.map(bracket => bracket.rate));
      return [state, highestRate / 100];
    }
    return [state, 0];
  })
) as Record<StateCode, number>;

/**
 * Get the appropriate tax disclaimer for a given state
 * @param stateCode The state code to get the disclaimer for
 * @returns A disclaimer string appropriate for the state
 */
export const getStateTaxDisclaimer = (stateCode: StateCode): string => {
  const state = stateTaxData[stateCode];
  
  if (!state) {
    return "Tax calculations are approximate and may not reflect all state-specific rules.";
  }
  
  if (stateCode === 'NONE') {
    return "No state income tax applied to calculations.";
  }
  
  if (stateCode === 'OTHER') {
    return "Only federal tax calculations are being applied. State taxes are not included in these calculations.";
  }
  
  let baseDisclaimer = `We provide approximate calculations for ${state.name} based on current bracket rates. Actual results may vary by local rules`;
  
  if (state.specialNotes) {
    baseDisclaimer += ` — ${state.specialNotes}`;
  }
  
  return baseDisclaimer + '.';
};

/**
 * Calculate estimated state tax based on income and state
 * @param income Taxable income amount
 * @param stateCode The state code to calculate taxes for
 * @returns Estimated state tax amount
 */
export const calculateStateTax = (income: number, stateCode: StateCode): number => {
  const state = stateTaxData[stateCode];
  
  if (!state || state.type === 'none') {
    return 0;
  }
  
  if (state.type === 'flat') {
    return income * (state.flatRate! / 100);
  }
  
  // For graduated brackets
  let totalTax = 0;
  const brackets = state.brackets || [];
  
  for (let i = 0; i < brackets.length; i++) {
    const { min, max, rate } = brackets[i];
    
    if (income > min) {
      const taxableInThisBracket = Math.min(income, max) - min;
      totalTax += (taxableInThisBracket * rate) / 100;
    }
    
    if (income <= max) {
      break;
    }
  }
  
  return totalTax;
};

/**
 * Get state tax summary for display
 * @param stateCode The state code to get a summary for
 * @returns A string describing the state's tax structure
 */
export const getStateTaxSummary = (stateCode: StateCode): string => {
  const state = stateTaxData[stateCode];
  
  if (!state) {
    return "Tax information not available.";
  }
  
  if (stateCode === 'NONE') {
    return "No state income tax.";
  }
  
  if (stateCode === 'OTHER') {
    return "Federal tax calculations only.";
  }
  
  if (state.type === 'flat') {
    return `Flat tax rate of ${state.flatRate}%.`;
  }
  
  if (state.type === 'graduated' && state.brackets) {
    const lowestRate = state.brackets[0].rate;
    const highestRate = state.brackets[state.brackets.length - 1].rate;
    return `Progressive tax with rates from ${lowestRate}% to ${highestRate}%.`;
  }
  
  return "Tax information not available.";
};
