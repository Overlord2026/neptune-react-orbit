
/**
 * Tax Document Classification Utilities
 * 
 * This module simulates OCR-based document classification.
 * In production, replace the simulation with calls to actual OCR services:
 * - AWS Textract
 * - Google Vision API
 * - Azure Form Recognizer
 */

import { useToast } from "@/hooks/use-toast";

// Types for classification results
export interface ClassificationResult {
  documentType: string;
  taxYear: string;
  confidence: {
    documentType: number;
    taxYear: number;
    overall: number;
  };
  status: 'classified' | 'manual_review' | 'error';
  details?: string;
}

export interface DocumentToClassify {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  userId: string;
}

/**
 * Simulates OCR/text extraction from a document
 * In production, replace with actual OCR API calls
 */
const simulateOCRExtraction = async (document: DocumentToClassify): Promise<string> => {
  // This function simulates text extraction
  // In a real implementation, this would call an OCR API
  console.log(`Simulating OCR extraction for file: ${document.fileName}`);
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate simulated text content based on filename
  // In real implementation, this would be the text extracted from the document
  const fileName = document.fileName.toLowerCase();
  
  if (fileName.includes('w-2') || fileName.includes('w2')) {
    return `
      FORM W-2 Wage and Tax Statement 2023
      Employee: John Doe
      Employer: ACME Corporation
      Wages: $75,000.00
      Federal Income Tax Withheld: $15,000.00
    `;
  } else if (fileName.includes('1099')) {
    const year = fileName.match(/20\d{2}/) ? fileName.match(/20\d{2}/)![0] : '2023';
    return `
      FORM 1099-MISC
      For Tax Year: ${year}
      Payer: XYZ Company
      Recipient: John Doe
      Nonemployee Compensation: $24,000.00
    `;
  } else if (fileName.includes('k-1') || fileName.includes('k1')) {
    return `
      Schedule K-1 (Form 1065)
      For calendar year 2022, or tax year
      Partner's Share of Income, Deductions, Credits, etc.
    `;
  } else if (fileName.includes('1040') || fileName.includes('tax return')) {
    return `
      Form 1040 U.S. Individual Income Tax Return 2022
      Filing Status: Single
      Exemptions: 1
      Adjusted Gross Income: $82,000.00
    `;
  } else {
    // Generic text for other document types
    const year = fileName.match(/20\d{2}/) ? fileName.match(/20\d{2}/)![0] : '';
    return `
      Tax related document ${year ? 'for year ' + year : ''}
      Various financial information and tax details.
    `;
  }
};

/**
 * Extracts document type from OCR text
 * Returns type and confidence score
 */
const extractDocumentType = (text: string): { type: string; confidence: number } => {
  const lowerText = text.toLowerCase();
  
  // Check for W-2
  if (lowerText.includes('form w-2') || lowerText.includes('w2') || lowerText.includes('wage and tax statement')) {
    return { type: 'W-2', confidence: 0.9 };
  }
  
  // Check for 1099 variations
  if (lowerText.includes('form 1099')) {
    if (lowerText.includes('1099-misc')) {
      return { type: '1099-MISC', confidence: 0.9 };
    } else if (lowerText.includes('1099-int')) {
      return { type: '1099-INT', confidence: 0.9 };
    } else if (lowerText.includes('1099-div')) {
      return { type: '1099-DIV', confidence: 0.9 };
    } else if (lowerText.includes('1099-r')) {
      return { type: '1099-R', confidence: 0.9 };
    } else if (lowerText.includes('1099-k')) {
      return { type: '1099-K', confidence: 0.9 };
    } else {
      return { type: '1099', confidence: 0.8 };
    }
  }
  
  // Check for K-1
  if (lowerText.includes('k-1') || lowerText.includes('schedule k-1')) {
    return { type: 'K-1', confidence: 0.9 };
  }
  
  // Check for tax returns
  if (lowerText.includes('1040') || lowerText.includes('tax return')) {
    return { type: 'Tax Return', confidence: 0.85 };
  }
  
  // Check for other common tax documents
  if (lowerText.includes('1098') || lowerText.includes('mortgage')) {
    return { type: '1098', confidence: 0.85 };
  }
  
  // Not enough information or unrecognized
  return { type: 'Other', confidence: 0.4 };
};

/**
 * Extracts tax year from OCR text
 * Returns year and confidence score
 */
const extractTaxYear = (text: string): { year: string; confidence: number } => {
  const lowerText = text.toLowerCase();
  
  // Look for explicit tax year mentions
  const taxYearMatch = lowerText.match(/tax year:?\s*(20\d{2})/i) || 
                      lowerText.match(/for (?:calendar|tax) year:?\s*(20\d{2})/i) ||
                      lowerText.match(/tax statement\s*(20\d{2})/i);
  
  if (taxYearMatch && taxYearMatch[1]) {
    return { year: taxYearMatch[1], confidence: 0.9 };
  }
  
  // Look for any four-digit year (less confident)
  const yearMatch = lowerText.match(/20\d{2}/);
  if (yearMatch) {
    return { year: yearMatch[0], confidence: 0.7 };
  }
  
  // Default to current year with low confidence
  const currentYear = new Date().getFullYear().toString();
  return { year: currentYear, confidence: 0.2 };
};

/**
 * Main document classification function
 */
export const classifyTaxDocument = async (
  document: DocumentToClassify
): Promise<ClassificationResult> => {
  try {
    // Step 1: Extract text from document using OCR
    const extractedText = await simulateOCRExtraction(document);
    
    // Step 2: Identify document type
    const { type: documentType, confidence: typeConfidence } = extractDocumentType(extractedText);
    
    // Step 3: Identify tax year
    const { year: taxYear, confidence: yearConfidence } = extractTaxYear(extractedText);
    
    // Step 4: Calculate overall confidence
    const overallConfidence = (typeConfidence + yearConfidence) / 2;
    
    // Step 5: Determine classification status
    const status = overallConfidence >= 0.6 ? 'classified' : 'manual_review';
    
    // Step 6: Return classification results
    return {
      documentType,
      taxYear,
      confidence: {
        documentType: typeConfidence,
        taxYear: yearConfidence,
        overall: overallConfidence
      },
      status,
      details: `OCR extraction ${overallConfidence > 0.8 ? 'successful' : 'partial'}`
    };
  } catch (error) {
    console.error("Error classifying document:", error);
    return {
      documentType: 'Unknown',
      taxYear: '',
      confidence: {
        documentType: 0,
        taxYear: 0,
        overall: 0
      },
      status: 'error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Hook for processing document classification
 * Handles state management and notifications
 */
export const useDocumentClassifier = () => {
  const { toast } = useToast();
  
  const processDocument = async (document: DocumentToClassify): Promise<ClassificationResult> => {
    try {
      // Show processing toast
      toast({
        title: "Processing document",
        description: "Using AI to analyze and classify your document...",
      });
      
      // Run classification
      const result = await classifyTaxDocument(document);
      
      // Show result toast
      if (result.status === 'classified') {
        toast({
          title: "Document classified",
          description: `Identified as ${result.documentType} for tax year ${result.taxYear}`,
        });
      } else if (result.status === 'manual_review') {
        toast({
          title: "Classification needs review",
          description: "Please review and confirm document details",
        });
      } else {
        toast({
          title: "Classification failed",
          description: "Unable to determine document type or year",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      // Show error toast
      toast({
        title: "Classification error",
        description: "Failed to process document",
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  return {
    processDocument
  };
};
