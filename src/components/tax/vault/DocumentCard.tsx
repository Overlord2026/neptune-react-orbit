
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, AlertCircle } from "lucide-react";

interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  type: string;
  size: string;
  taxYear?: string;
}

interface DocumentCardProps {
  document: Document;
  onDeleteDocument: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDeleteDocument }) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card key={document.id} className="bg-[#1f2937] border-[#3b82f6]/10 transition-colors">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-[#3b82f6]" />
          <div>
            <p className="font-medium text-white">{document.name}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span>Uploaded: {formatDate(document.uploadDate)}</span>
              <span>Type: {document.type}</span>
              <span>Size: {document.size}</span>
              {document.taxYear && <span className="font-medium text-[#3b82f6]">Tax Year: {document.taxYear}</span>}
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
            onClick={() => onDeleteDocument(document.id)}
          >
            <AlertCircle className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;
