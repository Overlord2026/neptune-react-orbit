
import React from 'react';
import { FileCheck } from 'lucide-react';

interface ResultHeaderProps {
  title: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <FileCheck className="text-[#FFD700]" size={24} />
      <h3 className="font-semibold text-xl text-white">{title}</h3>
    </div>
  );
};

export default ResultHeader;
