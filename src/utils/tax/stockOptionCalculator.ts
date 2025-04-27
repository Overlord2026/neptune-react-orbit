
import { StockOptionInputs, StockOptionResults, TAX_RATES, STATE_TAX_RATES } from "@/types/tax/stockOptionTypes";

const calculateFederalTax = (income: number, filingStatus: 'single' | 'married') => {
  const taxBrackets = TAX_RATES[2025].brackets[filingStatus];
  const standardDeduction = TAX_RATES[2025].standardDeduction[filingStatus];
  
  const taxableIncome = Math.max(0, income - standardDeduction);
  
  let tax = 0;
  for (let i = 0; i < taxBrackets.length; i++) {
    const bracket = taxBrackets[i];
    const nextBracketThreshold = taxBrackets[i + 1]?.threshold || Infinity;
    
    if (taxableIncome > bracket.threshold) {
      const incomeInBracket = Math.min(taxableIncome, nextBracketThreshold) - bracket.threshold;
      tax += incomeInBracket * bracket.rate;
    }
  }
  
  return tax;
};

export const calculateStockOptions = (inputs: StockOptionInputs): StockOptionResults => {
  const spread = inputs.currentMarketPrice - inputs.grantPrice;
  const optionValue = spread * inputs.numberOfShares;

  let ordinaryIncome = 0;
  let federalTaxDue = 0;
  let stateTaxDue = 0;
  let ficaTaxDue = 0;
  let amtImpact = 0;

  if (inputs.optionType === 'nso') {
    ordinaryIncome = optionValue;
    federalTaxDue = calculateFederalTax(inputs.annualIncome + ordinaryIncome, inputs.filingStatus) -
                    calculateFederalTax(inputs.annualIncome, inputs.filingStatus);
    
    const stateRate = STATE_TAX_RATES[inputs.stateOfResidence] || 0;
    stateTaxDue = ordinaryIncome * stateRate;
    
    ficaTaxDue = ordinaryIncome * 0.0145;
    
    if ((inputs.filingStatus === 'married' && inputs.annualIncome + ordinaryIncome > 250000) ||
        (inputs.filingStatus === 'single' && inputs.annualIncome + ordinaryIncome > 200000)) {
      ficaTaxDue += ordinaryIncome * 0.009;
    }
  } else {
    if (inputs.exerciseAndHold && inputs.holdingPeriod >= 1) {
      const amtExemption = inputs.filingStatus === 'married' ? 126500 : 81300;
      const amtRate = 0.26;
      const amtIncome = inputs.annualIncome + optionValue;
      
      let adjustedExemption = amtExemption;
      if (inputs.filingStatus === 'married' && amtIncome > 1156300) {
        adjustedExemption = Math.max(0, amtExemption - 0.25 * (amtIncome - 1156300));
      } else if (inputs.filingStatus === 'single' && amtIncome > 578150) {
        adjustedExemption = Math.max(0, amtExemption - 0.25 * (amtIncome - 578150));
      }
      
      const amtTaxableIncome = Math.max(0, amtIncome - adjustedExemption);
      const amtTax = amtTaxableIncome * amtRate;
      const regularTax = calculateFederalTax(inputs.annualIncome, inputs.filingStatus);
      amtImpact = Math.max(0, amtTax - regularTax);
      
      federalTaxDue = 0;
      ficaTaxDue = 0;
      
      const stateRate = STATE_TAX_RATES[inputs.stateOfResidence] || 0;
      stateTaxDue = inputs.exerciseAndHold ? optionValue * stateRate * 0.5 : 0;
    } else {
      // Disqualifying disposition
      ordinaryIncome = optionValue;
      federalTaxDue = calculateFederalTax(inputs.annualIncome + ordinaryIncome, inputs.filingStatus) -
                      calculateFederalTax(inputs.annualIncome, inputs.filingStatus);
      
      const stateRate = STATE_TAX_RATES[inputs.stateOfResidence] || 0;
      stateTaxDue = ordinaryIncome * stateRate;
      
      ficaTaxDue = ordinaryIncome * 0.0145;
      
      if ((inputs.filingStatus === 'married' && inputs.annualIncome + ordinaryIncome > 250000) ||
          (inputs.filingStatus === 'single' && inputs.annualIncome + ordinaryIncome > 200000)) {
        ficaTaxDue += ordinaryIncome * 0.009;
      }
    }
  }

  const totalTaxDue = federalTaxDue + stateTaxDue + ficaTaxDue + amtImpact;
  const netProceeds = optionValue - totalTaxDue;
  const effectiveTaxRate = optionValue > 0 ? (totalTaxDue / optionValue) * 100 : 0;

  return {
    optionValue,
    ordinaryIncome,
    federalTaxDue,
    stateTaxDue,
    ficaTaxDue,
    amtImpact,
    totalTaxDue,
    netProceeds,
    effectiveTaxRate
  };
};
