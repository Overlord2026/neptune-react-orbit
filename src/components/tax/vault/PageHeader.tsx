
import React from 'react';
import { Link } from "react-router-dom";
import Header from '@/components/ui/header';

const PageHeader: React.FC = () => {
  return (
    <Header
      title="Tax Vault"
      description="Securely store and organize your tax documents"
      backLink={{
        to: "/tax-planning",
        label: "Back to Tax Planning"
      }}
      className="px-4 sm:px-6 pt-4 pb-4 rounded-none"
    />
  );
};

export default PageHeader;
