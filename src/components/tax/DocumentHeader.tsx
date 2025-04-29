
import React from 'react';
import { Upload, FileText } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/ui/header';

const DocumentHeader: React.FC = () => {
  return (
    <Header
      title="Tax Document Aggregator"
      description="Scan, Upload, Archive, and Organize Your Tax Documents by Year"
      icon={<FileText className="h-7 w-7 text-[#f6ad55]" />}
      actions={
        <>
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
        </>
      }
      backLink={{
        to: "/tax-planning",
        label: "Back to Tax Planning Hub"
      }}
    />
  );
};

export default DocumentHeader;
