
import { TaxTrapResult } from '@/utils/taxTraps';

/**
 * Calculate potential additional charitable contribution to avoid a tax trap
 */
export const calculateCharitableOpportunity = (
  trapResults: TaxTrapResult,
  filingStatus: string,
  currentAge: number,
  currentAGI: number,
  year: number
): { 
  amount: number;
  useQcd: boolean;
  description: string;
  trapType: string;
  severity: 'low' | 'medium' | 'high';
} | null => {
  // Only check for opportunities if we have traps
  if (!trapResults.warnings || trapResults.warnings.length === 0) {
    return null;
  }
  
  // Check for IRMAA opportunity
  if (trapResults.irmaa_data) {
    // Find the next lower IRMAA threshold
    const relevantWarning = trapResults.warnings.find(w => w.type === 'irmaa');
    if (!relevantWarning) return null;
    
    // Calculate how much AGI reduction is needed to avoid this IRMAA tier
    // This is a simplified example - in reality, we'd need to check against actual IRMAA thresholds
    const irmaaTiers = {
      'single': [97000, 123000, 153000, 183000, 500000],
      'married': [194000, 246000, 306000, 366000, 750000]
    };
    
    // Find the next lowest tier
    const tiers = irmaaTiers[filingStatus as keyof typeof irmaaTiers] || irmaaTiers.single;
    const currentTier = tiers.findIndex(tier => currentAGI > tier);
    
    if (currentTier > 0) {
      const targetThreshold = tiers[currentTier - 1];
      const neededReduction = currentAGI - targetThreshold;
      
      if (neededReduction > 0 && neededReduction < 20000) { // Only suggest if it's reasonably achievable
        // Determine if QCD is an option based on age
        const canUseQCD = currentAge >= 70.5;
        
        return {
          amount: neededReduction + 100, // Add a small buffer
          useQcd: canUseQCD,
          description: canUseQCD
            ? `An additional QCD of $${(neededReduction + 100).toLocaleString()} would reduce your MAGI below $${targetThreshold.toLocaleString()}, potentially avoiding an IRMAA tier.`
            : `An additional charitable contribution of $${(neededReduction + 100).toLocaleString()} could help reduce your MAGI below $${targetThreshold.toLocaleString()}, potentially avoiding an IRMAA tier.`,
          trapType: 'charitable_opportunity',
          severity: 'medium'
        };
      }
    }
  }
  
  return null;
};
