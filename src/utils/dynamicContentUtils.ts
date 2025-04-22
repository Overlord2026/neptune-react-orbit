import { getTaxBracketLastUpdateTime, getFormattedUpdateDate } from '@/utils/dataFeedUtils';
import { formatCurrency, STANDARD_DEDUCTION_BY_YEAR } from '@/utils/taxBracketData';

// Types for dynamic content placeholders
export interface DynamicContentPlaceholder {
  id: string;
  name: string;
  description: string;
  category: 'deduction' | 'contribution' | 'date' | 'rate' | 'other';
  getValue: (options?: DynamicContentOptions) => string;
}

export interface DynamicContentOptions {
  year?: number;
  filingStatus?: 'single' | 'married' | 'head_of_household';
  format?: 'currency' | 'number' | 'percentage' | 'date' | 'text';
}

// Default formatting functions
const formatValue = (value: number | string, format?: string): string => {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (typeof value === 'number') {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value}%`;
      default:
        return value.toString();
    }
  }
  return String(value);
};

// Registry of available placeholders
export const dynamicContentPlaceholders: DynamicContentPlaceholder[] = [
  {
    id: 'current_standard_deduction',
    name: 'Current Standard Deduction',
    description: 'The standard deduction amount for the selected filing status and year',
    category: 'deduction',
    getValue: (options?: DynamicContentOptions) => {
      const year = options?.year || new Date().getFullYear();
      const filingStatus = options?.filingStatus || 'single';
      const format = options?.format || 'currency';
      
      try {
        const yearData = STANDARD_DEDUCTION_BY_YEAR[year] || 
                          STANDARD_DEDUCTION_BY_YEAR[Object.keys(STANDARD_DEDUCTION_BY_YEAR).sort().pop() as unknown as number];
        const deductionAmount = yearData?.[filingStatus] || 0;
        return formatValue(deductionAmount, format);
      } catch (error) {
        console.error("Error getting standard deduction:", error);
        return formatValue(0, format);
      }
    }
  },
  {
    id: 'IRA_limit',
    name: 'IRA Contribution Limit',
    description: 'The maximum annual contribution limit for Individual Retirement Accounts',
    category: 'contribution',
    getValue: (options?: DynamicContentOptions) => {
      const year = options?.year || new Date().getFullYear();
      const format = options?.format || 'currency';
      
      // Example values (in a real app, this would come from the database)
      const limits: Record<number, number> = {
        2023: 6500,
        2024: 7000,
        2025: 7000
      };
      
      const limit = limits[year] || 7000;
      return formatValue(limit, format);
    }
  },
  {
    id: 'tax_data_last_update',
    name: 'Tax Data Last Update Date',
    description: 'When the tax data was last updated from official sources',
    category: 'date',
    getValue: () => {
      try {
        const lastUpdateTime = getTaxBracketLastUpdateTime();
        return getFormattedUpdateDate(lastUpdateTime || new Date().toISOString());
      } catch (error) {
        console.error("Error getting tax data update date:", error);
        return "Recently updated";
      }
    }
  },
  {
    id: '401k_limit',
    name: '401(k) Contribution Limit',
    description: 'The maximum annual contribution limit for 401(k) retirement accounts',
    category: 'contribution',
    getValue: (options?: DynamicContentOptions) => {
      const year = options?.year || new Date().getFullYear();
      const format = options?.format || 'currency';
      
      // Example values (in a real app, this would come from the database)
      const limits: Record<number, number> = {
        2023: 22500,
        2024: 23000,
        2025: 23000
      };
      
      const limit = limits[year] || 23000;
      return formatValue(limit, format);
    }
  },
  {
    id: 'capital_gains_0_rate_max',
    name: 'Capital Gains 0% Rate Maximum',
    description: 'The maximum income threshold for the 0% capital gains tax rate',
    category: 'rate',
    getValue: (options?: DynamicContentOptions) => {
      const year = options?.year || new Date().getFullYear();
      const filingStatus = options?.filingStatus || 'single';
      const format = options?.format || 'currency';
      
      // Example values (in a real app, this would come from the database)
      const thresholds: Record<number, Record<string, number>> = {
        2023: {
          'single': 44625,
          'married': 89250,
          'head_of_household': 59750
        },
        2024: {
          'single': 47025,
          'married': 94050,
          'head_of_household': 63000
        },
        2025: {
          'single': 48150,
          'married': 96300,
          'head_of_household': 64400
        }
      };
      
      try {
        const yearData = thresholds[year] || thresholds[Object.keys(thresholds).sort().pop() as unknown as number];
        const threshold = yearData?.[filingStatus] || 0;
        return formatValue(threshold, format);
      } catch (error) {
        console.error("Error getting capital gains threshold:", error);
        return formatValue(0, format);
      }
    }
  }
];

// Find a placeholder by ID
export const getPlaceholderById = (id: string): DynamicContentPlaceholder | undefined => {
  if (!id) return undefined;
  return dynamicContentPlaceholders.find(placeholder => placeholder.id === id);
};

// Replace placeholders in a text string
export const replacePlaceholders = (
  text: string,
  options?: DynamicContentOptions
): string => {
  if (!text) return '';
  
  try {
    // Handle both {{placeholder}} format and direct placeholder strings
    const placeholderRegex = /{{([^}]+)}}/g;
    
    // First check if the text itself is a placeholder (without brackets)
    const directPlaceholder = getPlaceholderById(text.trim());
    if (directPlaceholder) {
      return directPlaceholder.getValue(options) || '';
    }
    
    // Otherwise process the text for embedded placeholders
    return text.replace(placeholderRegex, (match, placeholderId) => {
      if (!placeholderId || !placeholderId.trim()) return match;
      
      const placeholder = getPlaceholderById(placeholderId.trim());
      if (placeholder) {
        return placeholder.getValue(options) || '';
      }
      return match; // Keep the original placeholder if not found
    });
  } catch (error) {
    console.error("Error replacing placeholders:", error);
    return text; // Return the original text if there's an error
  }
};

// Process dynamic content
export const processDynamicContent = (content: string, options?: DynamicContentOptions): string => {
  if (!content) return '';
  
  try {
    return replacePlaceholders(content, options);
  } catch (error) {
    console.error("Error processing dynamic content:", error);
    return content;
  }
};
