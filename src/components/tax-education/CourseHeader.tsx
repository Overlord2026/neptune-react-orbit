
import React from 'react';
import { BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/ui/header';

interface CourseHeaderProps {
  title: string;
  description: React.ReactNode;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, description }) => {
  return (
    <Header
      title={title}
      description={description}
      icon={<BookText className="mr-2 h-6 w-6 text-[#f6ad55]" />}
      actions={
        <Button 
          variant="gold" 
          size="sm" 
          asChild
        >
          <Link to="/tax-education">
            Browse All Courses
          </Link>
        </Button>
      }
    />
  );
};

export default CourseHeader;
