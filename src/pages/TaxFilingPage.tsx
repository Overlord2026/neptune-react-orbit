
import React from 'react';
import SimpleReturnFilingPage from './SimpleReturnFilingPage';

/**
 * This is a wrapper component that redirects to the SimpleReturnFilingPage
 * It allows for easy linking to /file-my-taxes which is more user-friendly
 */
const TaxFilingPage = () => {
  return <SimpleReturnFilingPage />;
};

export default TaxFilingPage;
