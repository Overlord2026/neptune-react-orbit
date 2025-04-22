
import React from 'react';
import { FilingStatusType } from '@/types/tax/filingTypes';

// Ensuring filing status is one of the allowed types
const normalizeFilingStatus = (status: string): FilingStatusType => {
  switch(status) {
    case 'married_joint':
      return 'married';
    case 'qualifying_widow':
      return 'single';
    default:
      return status as FilingStatusType;
  }
};

const SingleYearRothConversion: React.FC = () => {
  // Initial filing status value
  const initialFilingStatus = 'married';
  
  // Use normalizeFilingStatus when setting filing status
  const filingStatus = normalizeFilingStatus(initialFilingStatus);
  
  return (
    <div>
      <h2>Single Year Roth Conversion</h2>
      <p>Filing status: {filingStatus}</p>
      {/* Add your component content here */}
    </div>
  );
};

export default SingleYearRothConversion;
