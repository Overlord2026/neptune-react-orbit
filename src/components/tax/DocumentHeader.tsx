
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

const DocumentHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tax Document Aggregator</h1>
        <p className="text-muted-foreground">Scan, Upload, Archive, and Organize Your Tax Documents by Year</p>
      </div>
      <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Tax Planning Hub
      </Link>
    </div>
  );
};

export default DocumentHeader;
