
import React from 'react';
import TaxTrapHeader from '@/components/tax/TaxTrapHeader';
import TaxTrapContainer from '@/components/tax/TaxTrapContainer';

const TaxTrapCheckerPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <TaxTrapHeader />
      <TaxTrapContainer />
    </div>
  );
};

export default TaxTrapCheckerPage;
