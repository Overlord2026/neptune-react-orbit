import React, { useState } from 'react';
import PageHeader from '@/components/tax/vault/PageHeader';
import FilterSection from '@/components/tax/vault/FilterSection';
import UploadSection from '@/components/tax/vault/UploadSection';
import SecurityNotice from '@/components/tax/vault/SecurityNotice';
import DocumentList from '@/components/tax/vault/DocumentList';
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  type: string;
  size: string;
  taxYear?: string;
}

const TaxVaultPage = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: '1', 
      name: 'W-2_2024.pdf', 
      uploadDate: new Date('2024-02-15'), 
      type: 'PDF', 
      size: '1.2 MB',
      taxYear: '2024'
    },
    { 
      id: '2', 
      name: 'Schedule_C_2023.pdf', 
      uploadDate: new Date('2023-04-10'), 
      type: 'PDF', 
      size: '890 KB',
      taxYear: '2023'
    },
    { 
      id: '3', 
      name: '1099-MISC.jpg', 
      uploadDate: new Date('2024-01-25'), 
      type: 'Image', 
      size: '750 KB',
      taxYear: '2023'
    }
  ]);
  
  const [selectedTaxYear, setSelectedTaxYear] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document removed",
      description: "The document has been removed from your vault",
    });
  };

  const handleFilesUploaded = (newDocs: Document[]) => {
    setDocuments([...newDocs, ...documents]);
  };

  return (
    <div className="space-y-6 pb-8 bg-[#111827] min-h-screen text-white">
      <PageHeader />
      <FilterSection 
        selectedTaxYear={selectedTaxYear}
        setSelectedTaxYear={setSelectedTaxYear}
      />
      <UploadSection onFilesUploaded={handleFilesUploaded} />
      <SecurityNotice />
      <DocumentList 
        documents={documents}
        selectedTaxYear={selectedTaxYear}
        onDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};

export default TaxVaultPage;
