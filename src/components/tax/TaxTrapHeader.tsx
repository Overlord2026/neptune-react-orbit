
import React from 'react';

const TaxTrapHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold">Tax Trap Checker</h1>
      <p className="text-muted-foreground">
        Identify potential tax traps and threshold issues in your financial situation
      </p>
    </div>
  );
};

export default TaxTrapHeader;
