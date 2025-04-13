
// Define wizard steps
export const WIZARD_STEPS = [
  { id: 'basic-giving', label: 'Basic Giving Profile' },
  { id: 'daf-bunching', label: 'Donor-Advised Funds & Bunching' },
  { id: 'crt', label: 'Charitable Remainder Trust' },
  { id: 'qcd', label: 'QCD from IRA' },
  { id: 'multi-year', label: 'Multi-Year Integration' },
  { id: 'results', label: 'Results' },
] as const;

export type WizardStep = typeof WIZARD_STEPS[number]['id'];

// Helper function to get mutable steps array for components
export const getMutableSteps = () => {
  return WIZARD_STEPS.map(step => ({
    id: step.id,
    label: step.label
  }));
};

// Check if QCD step should be skipped based on age
export const shouldSkipQcdStep = (age: number): boolean => {
  return age < 70.5;
};
