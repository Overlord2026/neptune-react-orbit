
export type GlossaryTerm = {
  term: string;
  definition: string;
  category: 'basic' | 'advanced';
  link?: string;
};

export const taxGlossary: Record<string, GlossaryTerm> = {
  "tax_bracket": {
    term: "Tax Bracket",
    definition: "A range of incomes taxed at a specific rate. The U.S. uses a progressive system where higher income portions are taxed at higher rates.",
    category: "basic",
    link: "/tax-planning/basic-education#tax-brackets"
  },
  "marginal_tax_rate": {
    term: "Marginal Tax Rate",
    definition: "The tax rate applied to the last dollar of income earned, representing your highest tax bracket rate.",
    category: "basic"
  },
  "effective_tax_rate": {
    term: "Effective Tax Rate",
    definition: "The actual percentage of your income paid in taxes, calculated as total tax divided by total income.",
    category: "basic"
  },
  "tax_deduction": {
    term: "Tax Deduction",
    definition: "An expense that reduces your taxable income before tax rates are applied, lowering your overall tax liability.",
    category: "basic"
  },
  "tax_credit": {
    term: "Tax Credit",
    definition: "A dollar-for-dollar reduction in your tax liability, applied after taxes are calculated.",
    category: "basic"
  },
  "roth_conversion": {
    term: "Roth Conversion",
    definition: "The process of transferring retirement funds from a Traditional IRA or 401(k) to a Roth IRA, paying income taxes now for tax-free growth later.",
    category: "basic"
  },
  "traditional_ira": {
    term: "Traditional IRA",
    definition: "An Individual Retirement Account that allows tax-deductible contributions with tax-deferred growth. Withdrawals in retirement are taxed as ordinary income.",
    category: "basic"
  },
  "roth_ira": {
    term: "Roth IRA",
    definition: "An Individual Retirement Account funded with after-tax dollars. Qualified withdrawals in retirement are completely tax-free, including earnings.",
    category: "basic"
  },
  "capital_gain": {
    term: "Capital Gain",
    definition: "The profit from selling an asset (like stocks or property) for more than its purchase price.",
    category: "basic"
  },
  "long_term_capital_gain": {
    term: "Long-Term Capital Gain",
    definition: "Profit from selling an asset held for more than one year, typically taxed at lower rates than ordinary income.",
    category: "basic"
  },
  "short_term_capital_gain": {
    term: "Short-Term Capital Gain",
    definition: "Profit from selling an asset held for one year or less, taxed at ordinary income rates.",
    category: "basic"
  },
  "tax_loss_harvesting": {
    term: "Tax-Loss Harvesting",
    definition: "The strategy of selling investments at a loss to offset capital gains, potentially reducing your tax liability.",
    category: "advanced",
    link: "/tax-planning/advanced-tax-education"
  },
  "backdoor_roth": {
    term: "Backdoor Roth IRA",
    definition: "A strategy allowing high-income earners to fund Roth IRAs by first contributing to a Traditional IRA and then converting those funds to a Roth IRA.",
    category: "advanced",
    link: "/tax-planning/advanced-tax-education"
  },
  "mega_backdoor_roth": {
    term: "Mega Backdoor Roth",
    definition: "An advanced retirement strategy allowing employees to contribute up to $38,500 (2023) of after-tax money to a 401(k) and then convert it to a Roth account.",
    category: "advanced",
    link: "/tax-planning/advanced-tax-education"
  },
  "agi": {
    term: "Adjusted Gross Income (AGI)",
    definition: "Your total gross income minus specific deductions, used to determine eligibility for certain tax benefits.",
    category: "basic"
  },
  "magi": {
    term: "Modified Adjusted Gross Income (MAGI)",
    definition: "Your AGI with certain deductions added back, used to determine eligibility for specific tax benefits like IRA contributions and premium tax credits.",
    category: "advanced"
  },
  "rmds": {
    term: "Required Minimum Distributions (RMDs)",
    definition: "Mandatory withdrawals from retirement accounts (except Roth IRAs) starting at age 73 (as of 2023), based on account balance and life expectancy.",
    category: "basic"
  },
  "ltcg": {
    term: "Long-Term Capital Gains Tax",
    definition: "Taxes on profits from selling assets held longer than one year, with rates of 0%, 15%, or 20% depending on income level.",
    category: "basic"
  },
  "qcd": {
    term: "Qualified Charitable Distribution (QCD)",
    definition: "A direct transfer from an IRA to a qualified charity, allowing individuals 70½ or older to exclude up to $100,000 annually from gross income.",
    category: "advanced",
    link: "/tax-planning/advanced-tax-education"
  }
};

export const getGlossaryTerm = (termId: string): GlossaryTerm | undefined => {
  return taxGlossary[termId];
};

export const getAllGlossaryTerms = (): GlossaryTerm[] => {
  return Object.values(taxGlossary);
};
