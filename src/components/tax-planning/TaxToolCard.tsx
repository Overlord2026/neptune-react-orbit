
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
          <Link to={link} className="neptune-card interactive">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                  {icon}
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  {description}
                  {comingSoon && <span className="ml-1 text-xs text-yellow-500">(Coming Soon)</span>}
                </p>
              </CardContent>
            </Card>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          {comingSoon ? `Feature "${title}" is coming soon!` : `Go to ${title}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TaxToolCard;
