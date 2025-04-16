
// Temporary placeholder for tax data 2025
export const taxData2025 = {
  year: 2025,
  standardDeduction: {
    single: 14250,
    married_joint: 28500,
    married_separate: 14250,
    head_of_household: 21400
  },
  brackets: {
    ordinary: {
      single: [
        { min: 0, max: 11350, rate: 0.10 },
        { min: 11350, max: 46050, rate: 0.12 },
        { min: 46050, max: 98200, rate: 0.22 },
        { min: 98200, max: 187500, rate: 0.24 },
        { min: 187500, max: 238150, rate: 0.32 },
        { min: 238150, max: 595450, rate: 0.35 },
        { min: 595450, max: Infinity, rate: 0.37 }
      ],
      married_joint: [
        { min: 0, max: 22700, rate: 0.10 },
        { min: 22700, max: 92100, rate: 0.12 },
        { min: 92100, max: 196400, rate: 0.22 },
        { min: 196400, max: 375000, rate: 0.24 },
        { min: 375000, max: 476300, rate: 0.32 },
        { min: 476300, max: 714900, rate: 0.35 },
        { min: 714900, max: Infinity, rate: 0.37 }
      ]
    }
  }
};
