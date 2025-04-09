
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaxTrapResourceLinkProps {
  title: string;
  url: string;
}

const TaxTrapResourceLink: React.FC<TaxTrapResourceLinkProps> = ({ title, url }) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
      asChild
    >
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 text-sm"
      >
        <span>{title}</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </Button>
  );
};

export default TaxTrapResourceLink;
