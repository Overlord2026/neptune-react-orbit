
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ScenarioComparisonHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  backLinkText?: string;
}

const ScenarioComparisonHeader: React.FC<ScenarioComparisonHeaderProps> = ({ 
  title, 
  description,
  backLink = "/tax-planning/roth-analysis", 
  backLinkText = "Back to Roth Analysis" 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neptune-gold">
          {title}
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {backLink && (
        <Link to={backLink} className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {backLinkText}
        </Link>
      )}
    </div>
  );
};

export default ScenarioComparisonHeader;
