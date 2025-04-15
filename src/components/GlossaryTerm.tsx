
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getGlossaryTerm } from '@/data/taxGlossary';

interface GlossaryTermProps {
  termId: string;
  children: React.ReactNode;
}

const GlossaryTerm: React.FC<GlossaryTermProps> = ({ termId, children }: GlossaryTermProps) => {
  const term = getGlossaryTerm(termId);
  
  if (!term) {
    return <>{children}</>;
  }

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <span className="border-b border-dotted border-[#9b87f5] cursor-help">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-[#1A1F2C] border border-[#8E9196] text-white">
        <div className="space-y-2">
          <h4 className="font-medium text-[#FFD700]">{term.term}</h4>
          <p className="text-sm">{term.definition}</p>
          {term.category === 'advanced' && (
            <div className="mt-2 pt-2 border-t border-[#8E9196] flex items-center text-xs text-[#9b87f5]">
              <BookOpen className="h-3 w-3 mr-1" />
              <Link to="/tax-planning/advanced-tax-education" className="hover:underline">
                Learn more in the Advanced Tax Education course
              </Link>
            </div>
          )}
          {term.link && term.category === 'basic' && (
            <Link to={term.link} className="text-xs text-[#9b87f5] hover:underline mt-1 block">
              Read more about {term.term}
            </Link>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default GlossaryTerm;
