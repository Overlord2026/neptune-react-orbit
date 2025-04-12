
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <Link to={link} className="block transition-all duration-200 hover:scale-[1.02]">
      <Card className="h-full border-[#2A2F3C] bg-[#1A1F2C] hover:border-[#00C47C] transition-colors">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-[#B0B0B0]">
            {description}
            {comingSoon && <span className="ml-1 text-xs text-yellow-500">(Coming Soon)</span>}
          </p>
          
          <Button 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            Start Tool <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TaxToolCard;
