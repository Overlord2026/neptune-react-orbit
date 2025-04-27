
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CharitableContributionWizard } from '../index';
import { TaxDataProvider } from '@/services/TaxDataService';
import { CalculatorIntegrationProvider } from '@/components/calculators/integration/CalculatorIntegrationContext';

// Mock Toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock TaxDataService
jest.mock('@/services/TaxDataService', () => ({
  useTaxData: () => ({
    taxData: {
      incomeTaxBrackets: {
        single: [
          { threshold: 0, rate: 0.10 },
          { threshold: 11000, rate: 0.12 },
          { threshold: 44725, rate: 0.22 },
          { threshold: 95375, rate: 0.24 },
          { threshold: 182100, rate: 0.32 },
          { threshold: 231250, rate: 0.35 },
          { threshold: 578125, rate: 0.37 }
        ],
        married: [
          { threshold: 0, rate: 0.10 },
          { threshold: 22000, rate: 0.12 },
          { threshold: 89450, rate: 0.22 },
          { threshold: 190750, rate: 0.24 },
          { threshold: 364200, rate: 0.32 },
          { threshold: 462500, rate: 0.35 },
          { threshold: 693750, rate: 0.37 }
        ]
      },
      standardDeduction: {
        single: 14600,
        married: 29200
      }
    },
    loading: false,
    error: null
  }),
  TaxDataProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('CharitableContributionWizard', () => {
  const renderWizard = () => {
    return render(
      <TaxDataProvider>
        <CalculatorIntegrationProvider>
          <CharitableContributionWizard />
        </CalculatorIntegrationProvider>
      </TaxDataProvider>
    );
  };

  test('renders the basic giving step initially', async () => {
    renderWizard();
    
    await waitFor(() => {
      expect(screen.getByText('Charitable Contribution Planner')).toBeInTheDocument();
    });
  });
});
