
import React from 'react';
import { CURRENT_YEAR } from '../utils/constants';

interface EstateDisclaimerContentProps {
  showTrustInfo: boolean;
}

const EstateDisclaimerContent: React.FC<EstateDisclaimerContentProps> = ({ showTrustInfo }) => {
  return (
    <>
      <p>
        This analysis is based on current tax laws as of {CURRENT_YEAR} and the assumptions you provided. 
        Actual results may differ due to changes in tax laws, investment performance, or other factors.
      </p>
      <p className="mt-2 text-amber-400">
        <strong>Estate Tax Sunset Provision:</strong> The federal estate tax exemption is scheduled to decrease by approximately 50% after 2025 
        unless extended by Congress. This may significantly impact your estate planning needs.
      </p>
      {showTrustInfo && (
        <p className="mt-2 text-blue-400">
          <strong>Trust Implementation:</strong> Trust strategies require careful legal structuring and ongoing maintenance. 
          The effectiveness of various trust approaches varies based on individual circumstances, changing tax laws, and proper implementation.
        </p>
      )}
      <p className="mt-2 text-amber-400">
        <strong>State Estate Taxes:</strong> This analysis focuses on federal estate taxes only. Some states impose 
        their own estate or inheritance taxes, often with lower exemption amounts.
      </p>
      <p className="mt-2 text-yellow-400">
        We strongly recommend consulting with a qualified estate planning attorney and tax advisor to implement 
        and maintain your estate plan based on your specific circumstances.
      </p>
    </>
  );
};

export default EstateDisclaimerContent;
