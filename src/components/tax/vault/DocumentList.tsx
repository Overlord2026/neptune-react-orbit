
import React from 'react';
import { Card } from "@/components/ui/card";
import DocumentCard from './DocumentCard';

interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  type: string;
  size: string;
  taxYear?: string;
}

interface DocumentListProps {
  documents: Document[];
  selectedTaxYear: string | null;
  onDeleteDocument: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  selectedTaxYear,
  onDeleteDocument 
}) => {
  const filteredDocuments = selectedTaxYear 
    ? documents.filter(doc => doc.taxYear === selectedTaxYear)
    : documents;

  return (
    <div className="mx-4 sm:mx-6">
      <h2 className="text-xl font-bold mb-4 text-white">
        {selectedTaxYear ? `${selectedTaxYear} Documents (${filteredDocuments.length})` : `Your Documents (${filteredDocuments.length})`}
      </h2>
      
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4">
          {filteredDocuments.map(doc => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onDeleteDocument={onDeleteDocument} 
            />
          ))}
        </div>
      ) : (
        <Card className="bg-[#1f2937] border-[#3b82f6]/10 p-8 text-center">
          <p className="text-gray-400">
            {selectedTaxYear ? `No documents uploaded yet for ${selectedTaxYear}.` : 'No documents uploaded yet.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DocumentList;
