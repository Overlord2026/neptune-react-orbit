
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

const DocumentHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-[#1a202c] p-6 rounded-lg mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Tax Document Aggregator</h1>
        <p className="text-[#e2e8f0]">Scan, Upload, Archive, and Organize Your Tax Documents by Year</p>
      </div>
      <Link to="/tax-planning" className="bg-[#0b1120] border border-[#4299e1] hover:bg-[#4299e1]/10 px-4 py-2 rounded-md text-[#4299e1] transition-colors flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Tax Planning Hub
      </Link>
    </div>
  );
};

export default DocumentHeader;
