
import React from 'react';
import { BookText } from 'lucide-react';
import GlossaryTerm from '@/components/GlossaryTerm';

interface CourseHeaderProps {
  title: string;
  description: React.ReactNode;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-start justify-between space-y-2 bg-[#1a202c] p-6 rounded-lg mb-6">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <BookText className="mr-2 h-6 w-6 text-[#f6ad55]" />
          {title}
        </h2>
        <p className="text-[#e2e8f0] max-w-3xl">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CourseHeader;
