
import React from 'react';

const TaxTrapHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2 bg-[#1a202c] p-6 rounded-lg mb-6">
      <h1 className="text-3xl font-bold text-white">Tax Trap Checker</h1>
      <p className="text-[#e2e8f0]">
        Identify potential tax traps and threshold issues in your financial situation
      </p>
    </div>
  );
};

export default TaxTrapHeader;
