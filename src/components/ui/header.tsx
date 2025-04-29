
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface HeaderProps {
  /** The title to display in the header */
  title: ReactNode;
  /** Optional description to display below the title */
  description?: ReactNode;
  /** Optional icon to display before the title */
  icon?: ReactNode;
  /** Optional action buttons to display on the right side */
  actions?: ReactNode;
  /** Optional back link properties */
  backLink?: {
    /** The URL to navigate to when the back button is clicked */
    to: string;
    /** The text to display on the back button */
    label: string;
  };
  /** Additional CSS classes to apply to the header */
  className?: string;
  /** Background color class (defaults to bg-[#1F2937]) */
  bgColor?: string;
}

const Header = ({
  title,
  description,
  icon,
  actions,
  backLink,
  className = '',
  bgColor = 'bg-[#1F2937]'
}: HeaderProps) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between p-6 rounded-lg mb-6 border border-[#2d3748] ${bgColor} ${className}`}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          {icon && icon}
          {title}
        </h1>
        {description && (
          <p className="text-white max-w-3xl">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
        {actions}
        {backLink && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-[#4299e1] text-white"
          >
            <Link to={backLink.to} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {backLink.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
