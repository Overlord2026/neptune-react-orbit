
import React from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PageHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4 px-4 sm:px-6 pt-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Tax Vault</h1>
        <p className="text-gray-300 text-base">Securely store and organize your tax documents</p>
      </div>
      <Link 
        to="/tax-planning" 
        className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-md 
                   text-white bg-blue-600 hover:bg-blue-700 transition-colors 
                   border border-blue-500 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tax Planning
      </Link>
    </div>
  );
};

export default PageHeader;
