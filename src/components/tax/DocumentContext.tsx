
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define document interfaces
export interface Document {
  id: string;
  name: string;
  source?: string;
  uploadDate: string;
  type: string;
  archived?: boolean;
  tags?: DocumentTag[];
  taxYear?: string;
}

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

// Sample document data - updated to include 2024, 2025 and archive status
const documentsByYear = {
  "2025": [
    { id: "8", name: "W-2", source: "Employer Inc.", uploadDate: "2025-01-05", type: "Income" }
  ],
  "2024": [
    { id: "6", name: "W-2", source: "Employer Inc.", uploadDate: "2024-01-10", type: "Income" },
    { id: "7", name: "1099-DIV", source: "Vanguard", uploadDate: "2024-01-25", type: "Dividend" }
  ],
  "2023": [
    { id: "1", name: "W-2", source: "Employer Inc.", uploadDate: "2024-01-15", type: "Income" },
    { id: "2", name: "1099-INT", source: "Bank of America", uploadDate: "2024-01-20", type: "Interest" },
    { id: "3", name: "Mortgage Interest Statement", source: "Wells Fargo", uploadDate: "2024-02-01", type: "Deduction" }
  ],
  "2022": [
    { id: "4", name: "W-2", source: "Employer Inc.", uploadDate: "2023-01-18", type: "Income", archived: true },
    { id: "5", name: "1098-T", source: "State University", uploadDate: "2023-02-05", type: "Education" }
  ],
  "2021": [
    { id: "10", name: "W-2", source: "Previous Employer", uploadDate: "2022-01-20", type: "Income", archived: true },
    { id: "11", name: "1099-MISC", source: "Freelance Client", uploadDate: "2022-01-25", type: "Income", archived: true }
  ]
};

// Missing documents suggestion
export const missingDocuments = [
  { year: "2024", documentType: "W-2", description: "Wage and Tax Statement" },
  { year: "2025", documentType: "1099-DIV", description: "Dividends and Distributions" },
  { year: "2023", documentType: "1098-E", description: "Student Loan Interest" },
  { year: "2022", documentType: "1099-DIV", description: "Dividends and Distributions" },
  { year: "2023", documentType: "Property Tax Statement", description: "Real Estate Taxes" }
];

interface DocumentContextType {
  documents: Record<string, Document[]>;
  years: string[];
  archivedDocCounts: Record<string, number>;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDocuments: Document[];
  handleArchiveStatusChange: () => void;
  refreshCounter: number;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Record<string, Document[]>>(documentsByYear);
  const [selectedYear, setSelectedYear] = useState<string>(Object.keys(documentsByYear).sort().reverse()[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const years = Object.keys(documents).sort().reverse();
  
  // Count archived documents for each year
  const archivedDocCounts = years.reduce((counts, year) => {
    counts[year] = documents[year].filter(doc => doc.archived).length;
    return counts;
  }, {} as Record<string, number>);
  
  // Filter documents based on search query and archive status
  const filteredDocuments = selectedYear
    ? documents[selectedYear].filter(doc => 
        !doc.archived && (
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (doc.type && doc.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (doc.source && doc.source.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    : [];

  const handleArchiveStatusChange = () => {
    // In a real app, this would refresh the data from the server
    setRefreshCounter(prev => prev + 1);
  };

  const value = {
    documents,
    years,
    archivedDocCounts,
    selectedYear,
    setSelectedYear,
    searchQuery,
    setSearchQuery,
    filteredDocuments,
    handleArchiveStatusChange,
    refreshCounter
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
