
import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentContextProps {
  documentCount: number;
  selectedYear: string;
}

const DocumentContext: React.FC<DocumentContextProps> = ({ documentCount, selectedYear }) => {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>Assistant has access to {documentCount} documents from {selectedYear}</span>
      </div>
    </div>
  );
};

export default DocumentContext;
