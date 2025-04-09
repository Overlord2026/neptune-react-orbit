
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NavigationButtons: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 pt-4">
      <Button asChild>
        <Link to="/tax-planning">
          Return to Tax Planning
        </Link>
      </Button>
      <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]" asChild>
        <Link to="/tax-planning/advanced-tax-education">
          Proceed to Advanced Tax Education
        </Link>
      </Button>
      <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#1A1F2C]/50" asChild>
        <Link to="/tax-planning/glossary">
          View Tax Glossary
        </Link>
      </Button>
    </div>
  );
};

export default NavigationButtons;
