
/**
 * Missing Tax Documents Checker
 * 
 * This utility helps identify which tax documents a user might be missing
 * based on their financial profile and tax scenarios.
 */

import { useToast } from "@/hooks/use-toast";
import { getTaxYears } from "./taxYearUtils";

export interface MissingDocument {
  id: string;
  taxYear: string;
  documentType: string;
  description: string;
  source?: string;
  isRequired: boolean;
  status: 'missing' | 'not_applicable' | 'uploaded';
}

export interface UserIncomeSource {
  type: string;
  source?: string;
  amount: number;
  taxYear: string;
}

// Mock user income sources - in production this would come from a database
const mockUserIncomeSources: Record<string, UserIncomeSource[]> = {
  "2025": [
    { type: "wages", source: "Employer Inc.", amount: 92000, taxYear: "2025" },
    { type: "interest", source: "Bank of America", amount: 450, taxYear: "2025" },
    { type: "dividends", source: "Vanguard", amount: 1500, taxYear: "2025" }
  ],
  "2024": [
    { type: "wages", source: "Employer Inc.", amount: 88000, taxYear: "2024" },
    { type: "interest", source: "Bank of America", amount: 400, taxYear: "2024" },
    { type: "dividends", source: "Vanguard", amount: 1300, taxYear: "2024" }
  ],
  "2023": [
    { type: "wages", source: "Employer Inc.", amount: 85000, taxYear: "2023" },
    { type: "interest", source: "Bank of America", amount: 350, taxYear: "2023" },
    { type: "dividends", source: "Vanguard", amount: 1200, taxYear: "2023" },
    { type: "ira_distribution", source: "Fidelity", amount: 5000, taxYear: "2023" }
  ],
  "2022": [
    { type: "wages", source: "Employer Inc.", amount: 80000, taxYear: "2022" },
    { type: "interest", source: "Chase Bank", amount: 275, taxYear: "2022" },
    { type: "dividends", source: "Vanguard", amount: 950, taxYear: "2022" }
  ],
  "2021": [
    { type: "wages", source: "Previous Employer", amount: 75000, taxYear: "2021" },
    { type: "interest", source: "Wells Fargo", amount: 180, taxYear: "2021" },
    { type: "self_employment", source: "Freelance Work", amount: 12000, taxYear: "2021" }
  ]
};

// Mock document database - in production this would be queried from a database
const mockUserDocuments: Record<string, { type: string; source?: string }[]> = {
  "2025": [],
  "2024": [],
  "2023": [
    { type: "W-2", source: "Employer Inc." },
    { type: "1099-DIV", source: "Vanguard" }
  ],
  "2022": [
    { type: "W-2", source: "Employer Inc." }
  ],
  "2021": [
    { type: "W-2", source: "Previous Employer" },
    { type: "1099-MISC", source: "Freelance Client" }
  ]
};

/**
 * Maps income types to expected document types
 */
const incomeToDocumentMap: Record<string, { docType: string, description: string }> = {
  "wages": { docType: "W-2", description: "Wage and Tax Statement" },
  "interest": { docType: "1099-INT", description: "Interest Income" },
  "dividends": { docType: "1099-DIV", description: "Dividends and Distributions" },
  "retirement": { docType: "1099-R", description: "Distributions From Pensions, Annuities, Retirement" },
  "ira_distribution": { docType: "1099-R", description: "IRA Distribution" },
  "self_employment": { docType: "1099-MISC", description: "Miscellaneous Income" },
  "mortgage_interest": { docType: "1098", description: "Mortgage Interest Statement" },
  "student_loan": { docType: "1098-E", description: "Student Loan Interest" },
  "education": { docType: "1098-T", description: "Tuition Statement" }
};

/**
 * Check if a document exists for a specific income source and year
 */
const documentExistsForIncome = (
  incomeSource: UserIncomeSource,
  documents: { type: string; source?: string }[]
): boolean => {
  const expectedDocType = incomeToDocumentMap[incomeSource.type]?.docType;
  if (!expectedDocType) return true; // No document expected for this income type

  return documents.some(doc => 
    doc.type === expectedDocType && 
    (!incomeSource.source || !doc.source || doc.source === incomeSource.source)
  );
};

/**
 * Generate a list of potentially missing documents based on income sources
 */
export const checkMissingDocuments = (taxYear: string): MissingDocument[] => {
  // Get income sources and documents for the specified year
  const incomeSources = mockUserIncomeSources[taxYear] || [];
  const documents = mockUserDocuments[taxYear] || [];
  const missingDocs: MissingDocument[] = [];

  // Check for each income source if there's a corresponding document
  incomeSources.forEach(source => {
    const docInfo = incomeToDocumentMap[source.type];
    if (!docInfo) return;

    const exists = documentExistsForIncome(source, documents);
    if (!exists) {
      missingDocs.push({
        id: `${taxYear}-${docInfo.docType}-${source.source || 'unknown'}`,
        taxYear,
        documentType: docInfo.docType,
        description: docInfo.description,
        source: source.source,
        isRequired: source.amount > 0,
        status: 'missing'
      });
    }
  });

  return missingDocs;
};

/**
 * Hook for checking and managing missing documents
 */
export const useMissingDocsChecker = () => {
  const { toast } = useToast();

  const generateMissingDocsReport = (taxYear: string): Promise<MissingDocument[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const missingDocs = checkMissingDocuments(taxYear);
        
        // Show notification
        if (missingDocs.length > 0) {
          toast({
            title: `Missing Documents for ${taxYear}`,
            description: `Found ${missingDocs.length} documents that may need to be uploaded.`,
          });
        } else {
          toast({
            title: "Document check complete",
            description: "No missing documents detected for the selected tax year.",
          });
        }
        
        resolve(missingDocs);
      }, 1000);
    });
  };

  return {
    generateMissingDocsReport
  };
};

/**
 * Mark a document as not applicable
 * In production, this would update a database record
 */
export const markDocumentAsNotApplicable = async (docId: string): Promise<void> => {
  console.log(`Document ${docId} marked as not applicable`);
  // In production, this would update the document status in the database
  return Promise.resolve();
};

