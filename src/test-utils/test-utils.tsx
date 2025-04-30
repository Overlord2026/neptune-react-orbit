
/**
 * Test utilities for the application
 * This file provides utility functions and components for testing
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Define a wrapper provider for tests
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock utility for tax calculation functions
export const mockTaxCalculator = {
  calculateTax: jest.fn(),
  calculateEffectiveRate: jest.fn(),
  getDistanceToNextBracket: jest.fn(),
};

// Formatted currency assertion helpers
export const expectFormattedCurrency = (value: string, expectedNumericValue: number) => {
  const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  expect(numericValue).toBeCloseTo(expectedNumericValue);
};

// Test data generators
export const generateTestTaxReturnData = () => {
  return {
    firstName: 'Test',
    lastName: 'User',
    ssn: '123-45-6789',
    filingStatus: 'single' as const,
    email: 'test@example.com',
    phone: '555-123-4567',
    address: {
      street: '123 Main St',
      city: 'Testville',
      state: 'TX',
      zipCode: '12345'
    },
    dependents: [],
    w2Forms: [{
      employerName: 'Test Corp',
      employerEIN: '12-3456789',
      wages: 75000,
      federalWithholding: 15000,
      stateWithholding: 5000
    }],
    interestIncome: 1000,
    dividendIncome: 2000,
    investmentIncome: 3000,
    socialSecurityBenefits: 0,
    isOver65: false,
    hasHealthInsurance: true,
    useStandardDeduction: true,
    itemizedDeductions: {
      medicalExpenses: 0,
      stateTaxes: 0,
      propertyTaxes: 0,
      mortgageInterest: 0,
      charitableContributions: 0,
      otherDeductions: 0
    },
    childTaxCredit: false,
    educationCredit: false,
    calculatedRefund: 0,
    calculatedOwed: 0,
    stateTax: 0,
    hasOnlyW2Income: true,
    hasDependents: false,
    hasSelfEmploymentIncome: false
  };
};
