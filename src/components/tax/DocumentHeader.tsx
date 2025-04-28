
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { Button } from '@/components/ui/button';

const DocumentHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#0f172a] p-6 rounded-lg mb-6 border border-[#2d3748] gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <FileText className="h-7 w-7 text-[#f6ad55]" />
          Tax Document Aggregator
        </h1>
        <p className="text-[#e2e8f0]">Scan, Upload, Archive, and Organize Your Tax Documents by Year</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="gold" 
          asChild
          size="sm"
          className="order-2 md:order-1"
        >
          <Link to="/tax-planning/upload-document">
            <Upload className="h-4 w-4 mr-1" />
            Upload Documents
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="order-1 md:order-2 border-[#4299e1]"
        >
          <Link to="/tax-planning" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Planning Hub
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DocumentHeader;
