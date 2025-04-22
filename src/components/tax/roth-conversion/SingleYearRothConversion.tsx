
// Ensuring filing status is one of the allowed types
const normalizeFilingStatus = (status: string): 'single' | 'married' | 'married_separate' | 'head_of_household' => {
  switch(status) {
    case 'married':
      return 'married_joint';
    case 'qualifying_widow':
      return 'single';
    default:
      return status as 'single' | 'married' | 'married_separate' | 'head_of_household';
  }
};

// Use normalizeFilingStatus when setting filing status
const filingStatus = normalizeFilingStatus(scenarioData.filingStatus);
