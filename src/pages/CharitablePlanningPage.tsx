
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import ShareFeature from '@/components/tax-planning/ShareFeature';
import CharitableWizard from '@/components/charitable-planning/CharitableWizard';

const CharitablePlanningPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFD700]">Charitable Contribution Planning</h1>
          <p className="text-muted-foreground">Optimize your tax savings while maximizing your charitable impact.</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareFeature 
            title="Charitable Contribution Planning" 
            description="Evaluate tax-efficient giving strategies to maximize your philanthropic impact."
            variant="button"
          />
          <Link to="/tax-planning/tax-tools" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Tools
          </Link>
        </div>
      </div>

      <CharitableWizard />
    </div>
  );
};

export default CharitablePlanningPage;
