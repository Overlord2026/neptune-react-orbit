
import React from 'react';
import { EstateGiftingData } from '../types/EstateGiftingTypes';
import { formatCurrency, getTrustTypeLabel } from '../utils/formatUtils';
import { CURRENT_YEAR } from '../utils/constants';

interface StrategyBenefitCardProps {
  data: EstateGiftingData;
}

const StrategyBenefitCard: React.FC<StrategyBenefitCardProps> = ({ data }) => {
  const showTrustInfo = data.useTrustApproach && data.trustType && data.trustType !== 'none';

  return (
    <div className="bg-gradient-to-r from-[#242A38] to-[#1A1F2C] p-6 rounded-lg border border-green-800/30">
      <h4 className="text-white font-medium text-lg mb-4">Your Gifting Strategy Benefit</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-[#B0B0B0] mb-1">Tax Savings from Gifting:</p>
          <p className="text-green-400 text-2xl font-bold">{formatCurrency(data.taxSavings)}</p>
        </div>
        <div>
          <p className="text-[#B0B0B0] mb-1">Additional Amount to Heirs:</p>
          <p className="text-green-400 text-2xl font-bold">{formatCurrency(data.heirsBenefit)}</p>
        </div>
      </div>
      
      <div className="bg-[#1A1F2C] p-4 rounded-lg text-sm">
        <p className="text-white">
          By implementing your gifting strategy, your heirs could potentially receive an additional <strong className="text-green-400">{formatCurrency(data.heirsBenefit)}</strong> compared 
          to taking no action, based on your current assumptions and tax laws as of {CURRENT_YEAR}.
        </p>
        
        {showTrustInfo && (
          <p className="text-blue-300 mt-2">
            Your selected {getTrustTypeLabel(data.trustType)} may provide additional benefits beyond 
            direct tax savings, such as asset protection, avoiding probate, or maintaining privacy.
          </p>
        )}
        
        {data.aboveThreshold && (
          <p className="text-[#B0B0B0] mt-2">
            Since your estate may exceed the federal exemption threshold, this gifting strategy could significantly reduce your potential estate tax liability.
          </p>
        )}
        {!data.aboveThreshold && (
          <p className="text-[#B0B0B0] mt-2">
            Even though your estate is currently below the federal exemption threshold, this gifting strategy provides benefits due to removing future asset growth from your taxable estate and 
            potential protection against future reductions in the estate tax exemption.
          </p>
        )}
      </div>
    </div>
  );
};

export default StrategyBenefitCard;
