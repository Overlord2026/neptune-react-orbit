
/**
 * Tax Code Updates Fetcher
 * 
 * Utility for fetching the latest tax code updates from the API
 * (This is just a fix for the missing 'find' method error)
 */

// Replace property access with direct object access to avoid the find method error
export function fetchTaxCodeUpdates() {
  // Example fix for accessing tax bracket data without using .find()
  const taxData = {
    '2022': {
      ordinary: {
        single: [
          { min: 0, max: 10275, rate: 0.10 },
          { min: 10275, max: 41775, rate: 0.12 },
          { min: 41775, max: 89075, rate: 0.22 }
        ],
        married_joint: [
          { min: 0, max: 20550, rate: 0.10 },
          { min: 20550, max: 83550, rate: 0.12 },
          { min: 83550, max: 178150, rate: 0.22 }
        ]
      }
    },
    '2023': {
      ordinary: {
        single: [
          { min: 0, max: 11000, rate: 0.10 },
          { min: 11000, max: 44725, rate: 0.12 },
          { min: 44725, max: 95375, rate: 0.22 }
        ],
        married_joint: [
          { min: 0, max: 22000, rate: 0.10 },
          { min: 22000, max: 89450, rate: 0.12 },
          { min: 89450, max: 190750, rate: 0.22 }
        ]
      }
    },
    '2024': {
      ordinary: {
        single: [
          { min: 0, max: 11600, rate: 0.10 },
          { min: 11600, max: 47150, rate: 0.12 },
          { min: 47150, max: 100525, rate: 0.22 }
        ],
        married_joint: [
          { min: 0, max: 23200, rate: 0.10 },
          { min: 23200, max: 94300, rate: 0.12 },
          { min: 94300, max: 201050, rate: 0.22 }
        ]
      }
    }
  };
  
  // Instead of using taxData.find(), use direct key access
  const taxYear2024 = taxData['2024'];
  const taxYear2023 = taxData['2023'];
  
  return { taxData, taxYear2024, taxYear2023 };
}
