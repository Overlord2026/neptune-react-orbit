
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileText, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTaxYears } from "@/utils/taxYearUtils";

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
  
  const availableTaxYears = getTaxYears().map(year => year.toString());
  const [selectedTaxYear, setSelectedTaxYear] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: Document[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      uploadDate: new Date(),
      type: file.type.split('/')[1].toUpperCase(),
      size: formatFileSize(file.size),
      taxYear: file.name.split('_')[1].split('.')[0]
    }));

    setDocuments([...newDocs, ...documents]);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    toast({
      title: "Files uploaded successfully",
      description: `${files.length} document${files.length > 1 ? 's' : ''} added to your vault`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document removed",
      description: "The document has been removed from your vault",
    });
  };

  const filteredDocuments = selectedTaxYear 
    ? documents.filter(doc => doc.taxYear === selectedTaxYear)
    : documents;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Tax Vault</h1>
          <p className="text-gray-300">Securely store and organize your tax documents</p>
        </div>
        <Link to="/tax-planning" className="border-2 border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning
        </Link>
      </div>

      <Card className="bg-[#1f2937] border-[#374151]">
        <CardHeader>
          <CardTitle className="text-lg text-white">Filter by Tax Year</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button 
            variant={selectedTaxYear === null ? "filterActive" : "filter"} 
            onClick={() => setSelectedTaxYear(null)}
          >
            All Years
          </Button>
          {availableTaxYears.map(year => (
            <Button 
              key={year} 
              variant={selectedTaxYear === year ? "filterActive" : "filter"}
              onClick={() => setSelectedTaxYear(year)}
            >
              {year}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-[#1f2937] border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload className="h-5 w-5 text-[#3b82f6]" />
            Upload Documents
          </CardTitle>
          <CardDescription className="text-gray-300">
            Add tax forms, receipts, or other important documents to your vault.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-[#374151] rounded-lg p-6 flex flex-col items-center justify-center gap-4">
            <Upload className="h-10 w-10 text-[#3b82f6]" />
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-2">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports PDFs, images, and common document formats
              </p>
            </div>
            <div>
              <Label htmlFor="file-upload" className="sr-only">Upload documents</Label>
              <Input 
                ref={fileInputRef}
                id="file-upload" 
                type="file" 
                className="cursor-pointer bg-[#1A1F2C] text-white border-[#374151]" 
                multiple 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-[#1f2937]/50 border border-[#3b82f6]/10 rounded-lg p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium mb-1 text-[#3b82f6]">Security & Privacy</p>
          <p className="text-gray-300">
            Your documents are stored securely. Phase 2 will add robust encryption and permission logs.
            We recommend not uploading sensitive personal information until enhanced security features are released.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-white">
          {selectedTaxYear ? `${selectedTaxYear} Documents (${filteredDocuments.length})` : `Your Documents (${filteredDocuments.length})`}
        </h2>
        
        {filteredDocuments.length > 0 ? (
          <div className="grid gap-4">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="bg-[#1f2937] border-[#3b82f6]/10 transition-colors">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-[#3b82f6]" />
                    <div>
                      <p className="font-medium text-white">{doc.name}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Uploaded: {formatDate(doc.uploadDate)}</span>
                        <span>Type: {doc.type}</span>
                        <span>Size: {doc.size}</span>
                        {doc.taxYear && <span className="font-medium text-[#3b82f6]">Tax Year: {doc.taxYear}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
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
    </div>
  );
};

export default TaxVaultPage;
