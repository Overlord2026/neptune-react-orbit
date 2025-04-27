
import React from 'react';

// Mock TaxData context and provider
export interface TaxData {
  incomeTaxBrackets: {
    single: Array<{ threshold: number; rate: number }>;
    married: Array<{ threshold: number; rate: number }>;
  };
  standardDeduction: {
    single: number;
    married: number;
  };
}

interface TaxDataContextType {
  taxData: TaxData | null;
  loading: boolean;
  error: string | null;
}

export const useTaxData = (): TaxDataContextType => ({
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
});

export const TaxDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);
