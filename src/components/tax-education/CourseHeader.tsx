
import React from 'react';
import { BookText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GlossaryTerm from '@/components/GlossaryTerm';

interface CourseHeaderProps {
  title: string;
  description: React.ReactNode;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col space-y-4 bg-[#0f172a] p-6 rounded-lg mb-6 border border-[#2d3748]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <BookText className="mr-2 h-6 w-6 text-[#f6ad55]" />
            {title}
          </h2>
          <p className="text-[#e2e8f0] max-w-3xl">
            {description}
          </p>
        </div>
        <div>
          <Button 
            variant="gold" 
            size="sm" 
            asChild
          >
            <Link to="/tax-education">
              Browse All Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
