
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from 'lucide-react';

interface TaxToolProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  comingSoon: boolean;
  link: string;
}

const TaxToolCard: React.FC<TaxToolProps> = ({ 
  id, 
  title, 
  icon, 
  description, 
  comingSoon, 
  link 
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Link to={link} className="block transition-all duration-200 hover:scale-[1.02]">
            <Card className="border-[#2A2F3C] bg-[#1A1F2C] hover:border-[#00C47C] transition-colors">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                  {icon}
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-[#B0B0B0]">
                  {description}
                  {comingSoon && <span className="ml-1 text-xs text-yellow-500">(Coming Soon)</span>}
                </p>
              </CardContent>
            </Card>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="bg-[#242A38] text-[#E5E5E5] border-[#353e52]">
          {comingSoon ? `Feature "${title}" is coming soon!` : `Go to ${title}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TaxToolCard;
