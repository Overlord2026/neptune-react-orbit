
/**
 * Tests for tax calculation utilities
 */
import { calculateTax, calculateEffectiveRate, getDistanceToNextBracket } from '../taxCalculationUtils';
import { getBrackets } from '../bracketUtils';

jest.mock('../bracketUtils', () => ({
  getBrackets: jest.fn(),
}));

describe('Tax Calculation Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateTax', () => {
    it('should calculate tax correctly for a given income and filing status', () => {
      // Mock the brackets
      const mockBrackets = [
        { bracket_min: 0, bracket_max: 10000, rate: 0.1 },
        { bracket_min: 10000, bracket_max: 50000, rate: 0.12 },
        { bracket_min: 50000, bracket_max: 100000, rate: 0.22 },
      ];
      
      (getBrackets as jest.Mock).mockReturnValue(mockBrackets);
      
      // Test with income in the second bracket
      const tax = calculateTax(30000, 2023, 'single');
      
      // Expected calculation:
      // 10000 * 0.1 = 1000 (first bracket)
      // (30000 - 10000) * 0.12 = 2400 (second bracket)
      // Total expected: 3400
      expect(tax).toEqual(3400);
      
      // Verify getBrackets was called correctly
      expect(getBrackets).toHaveBeenCalledWith(2023, 'single');
    });
  });

  describe('calculateEffectiveRate', () => {
    it('should calculate the effective tax rate', () => {
      const rate = calculateEffectiveRate(10000, 50000);
      expect(rate).toEqual(0.2); // 10000 / 50000 = 0.2 or 20%
    });
    
    it('should return 0 if income is 0', () => {
      const rate = calculateEffectiveRate(5000, 0);
      expect(rate).toEqual(0);
    });
  });

  describe('getDistanceToNextBracket', () => {
    it('should determine distance to next tax bracket', () => {
      const mockBrackets = [
        { bracket_min: 0, bracket_max: 10000, rate: 0.1 },
        { bracket_min: 10000, bracket_max: 50000, rate: 0.12 },
        { bracket_min: 50000, bracket_max: Infinity, rate: 0.22 },
      ];
      
      (getBrackets as jest.Mock).mockReturnValue(mockBrackets);
      
      const result = getDistanceToNextBracket(40000, 'single');
      
      expect(result).toEqual({
        nextThreshold: 50000,
        distance: 10000
      });
    });
    
    it('should handle income in highest bracket', () => {
      const mockBrackets = [
        { bracket_min: 0, bracket_max: 10000, rate: 0.1 },
        { bracket_min: 10000, bracket_max: 50000, rate: 0.12 },
        { bracket_min: 50000, bracket_max: Infinity, rate: 0.22 },
      ];
      
      (getBrackets as jest.Mock).mockReturnValue(mockBrackets);
      
      const result = getDistanceToNextBracket(60000, 'single');
      
      expect(result).toEqual({
        nextThreshold: Infinity,
        distance: Infinity
      });
    });
    
    it('should convert legacy filing status correctly', () => {
      const mockBrackets = [
        { bracket_min: 0, bracket_max: 10000, rate: 0.1 },
      ];
      
      (getBrackets as jest.Mock).mockReturnValue(mockBrackets);
      
      getDistanceToNextBracket(5000, 'married');
      
      // Verify getBrackets was called with the converted filing status
      expect(getBrackets).toHaveBeenCalledWith(expect.any(Number), 'married_joint');
    });
  });
});
