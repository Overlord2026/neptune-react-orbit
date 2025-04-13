
import { EstateGiftingData } from '../types/EstateGiftingTypes';

const CURRENT_YEAR = new Date().getFullYear();

export const calculateEstateValues = (wizardData: EstateGiftingData) => {
  // Calculate estate values based on current inputs
  const yearsUntilPassing = wizardData.yearOfPassing - CURRENT_YEAR;
  
  // Calculate future estate value with no gifting
  const futureEstateNoGifting = wizardData.netWorth * Math.pow(1 + wizardData.growthRate, yearsUntilPassing);
  
  // Calculate value of gifting
  let totalGiftValue = 0;
  
  if (wizardData.giftingStrategy === 'annual') {
    const annualGiftTotal = wizardData.useAnnualGifts ? 
      17000 * wizardData.numberOfDonees : 0;
      
    // Compound value of annual gifts over years
    for (let year = 0; year < yearsUntilPassing; year++) {
      totalGiftValue += annualGiftTotal * Math.pow(1 + wizardData.growthRate, yearsUntilPassing - year);
    }
  } else {
    // Lump sum gifting grows until passing
    totalGiftValue = wizardData.lumpSumAmount * Math.pow(1 + wizardData.growthRate, yearsUntilPassing);
  }
  
  // Future estate value with gifting
  const futureEstateWithGifting = Math.max(0, futureEstateNoGifting - totalGiftValue);
  
  // Calculate potential estate taxes (simplified calculation)
  // Assuming 40% tax rate on amounts exceeding exemption
  const TAX_RATE = 0.40;
  
  // Adjust exemption for inflation (simplified)
  const estimatedFutureExemption = wizardData.estateExemption * Math.pow(1.025, yearsUntilPassing);
  
  // Apply trust reduction factor if applicable
  const trustReductionAmount = wizardData.useTrustApproach ? 
    (futureEstateWithGifting * wizardData.trustReductionFactor) : 0;
    
  const adjustedFutureEstateWithGifting = Math.max(0, futureEstateWithGifting - trustReductionAmount);
  
  const taxableEstateNoGifting = Math.max(0, futureEstateNoGifting - estimatedFutureExemption - wizardData.lifetimeGiftsUsed);
  const taxableEstateWithGifting = Math.max(0, adjustedFutureEstateWithGifting - estimatedFutureExemption - wizardData.lifetimeGiftsUsed);
  
  const noGiftingTax = taxableEstateNoGifting * TAX_RATE;
  const giftingTax = taxableEstateWithGifting * TAX_RATE;
  const taxSavings = noGiftingTax - giftingTax;
  
  // Calculate benefit to heirs - this includes both tax savings and the value of gifts
  const heirsBenefit = wizardData.aboveThreshold ? 
    taxSavings + totalGiftValue + trustReductionAmount : 
    totalGiftValue / 2; // Reduced benefit if below threshold as tax savings less significant
  
  return {
    noGiftingTax,
    giftingTax,
    taxSavings,
    heirsBenefit,
    futureEstateNoGifting,
    futureEstateWithGifting,
    adjustedFutureEstateWithGifting,
    trustReductionAmount
  };
};
