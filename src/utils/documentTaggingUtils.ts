
/**
 * Document Tagging Utilities
 * 
 * Functions for managing document tags and categories
 */

export type DocumentTag = 
  | 'Roth' 
  | 'Estate' 
  | 'Charitable' 
  | 'Business' 
  | 'Deferred Comp'
  | 'Tax Return' 
  | 'W-2' 
  | 'K-1' 
  | 'General';

export interface DocumentWithTags {
  id: string;
  name: string;
  source?: string;
  uploadDate: string;
  type: string;
  archived?: boolean;
  tags?: DocumentTag[];
  taxYear?: string;
}

/**
 * Add a tag to a document
 */
export const addTagToDocument = (document: DocumentWithTags, tag: DocumentTag): DocumentWithTags => {
  const existingTags = document.tags || [];
  if (existingTags.includes(tag)) {
    return document;
  }
  
  return {
    ...document,
    tags: [...existingTags, tag]
  };
};

/**
 * Remove a tag from a document
 */
export const removeTagFromDocument = (document: DocumentWithTags, tag: DocumentTag): DocumentWithTags => {
  const existingTags = document.tags || [];
  return {
    ...document,
    tags: existingTags.filter(t => t !== tag)
  };
};

/**
 * Get all documents with a specific tag
 */
export const getDocumentsByTag = (documents: DocumentWithTags[], tag: DocumentTag): DocumentWithTags[] => {
  return documents.filter(doc => doc.tags?.includes(tag));
};

/**
 * Get all available tags across all documents
 */
export const getAllTagsFromDocuments = (documents: DocumentWithTags[]): DocumentTag[] => {
  const tagsSet = new Set<DocumentTag>();
  
  documents.forEach(doc => {
    doc.tags?.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet);
};

/**
 * Get a list of all predefined document tags
 */
export const getAvailableTags = (): DocumentTag[] => {
  return [
    'Roth',
    'Estate',
    'Charitable',
    'Business',
    'Deferred Comp',
    'Tax Return',
    'W-2',
    'K-1',
    'General'
  ];
};

/**
 * Save a scenario as a PDF to the Tax Vault
 * @param scenarioId - ID of the scenario to save
 * @param scenarioName - Name of the scenario
 * @param scenarioType - Type of scenario (Roth, Estate, etc.)
 * @param scenarioYear - Tax year of the scenario
 * @returns Document ID of the saved PDF
 */
export const saveScenarioToPdf = async (
  scenarioId: string, 
  scenarioName: string, 
  scenarioType: DocumentTag,
  scenarioYear: string
): Promise<string> => {
  // In a real implementation, this would generate a PDF
  // and store it in the Tax Vault with the appropriate tags
  console.log(`Saving scenario ${scenarioId} as PDF...`);
  
  // Return a mock document ID
  return `doc-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Export PDF utility for scenario summaries
 */
export const exportScenarioToPdf = async (
  scenarioData: any,
  scenarioType: DocumentTag,
  scenarioYear: string
): Promise<boolean> => {
  try {
    console.log(`Exporting ${scenarioType} scenario to PDF...`, scenarioData);
    
    // In a real implementation, this would generate and download a PDF
    // For now, we simulate the export process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error("Error exporting scenario to PDF:", error);
    return false;
  }
};

/**
 * Import data from tax return document
 */
export const importDataFromTaxReturn = async (
  documentId: string,
  taxYear: string
): Promise<{ [key: string]: any } | null> => {
  // In a real implementation, this would use OCR to extract data from a tax return
  console.log(`Importing data from tax return ${documentId} for year ${taxYear}...`);
  
  // Simulate a delay for "processing"
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock extracted data
  if (taxYear === "2022") {
    return {
      adjustedGrossIncome: 85000,
      totalIncome: 92000,
      totalTax: 14500,
      filingStatus: "single",
      qualified_dividends: 2500,
      ira_distributions: 0,
      taxable_interest: 1200,
      ordinary_dividends: 3000,
      business_income: 0,
      capital_gains: 5000,
      ira_contributions: 6000
    };
  } else if (taxYear === "2023") {
    return {
      adjustedGrossIncome: 88000,
      totalIncome: 95000,
      totalTax: 15000,
      filingStatus: "single",
      qualified_dividends: 2800,
      ira_distributions: 0,
      taxable_interest: 1300,
      ordinary_dividends: 3200,
      business_income: 0,
      capital_gains: 5500,
      ira_contributions: 6500
    };
  }
  
  // If document doesn't exist or can't be processed
  return null;
};
