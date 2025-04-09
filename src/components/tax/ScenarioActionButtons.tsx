
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const ScenarioActionButtons: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center pt-4">
      <Link to="/tax-planning/roth-analysis/2021">
        <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
          <Edit className="h-4 w-4 mr-2" />
          Edit 2021 Scenario
        </Button>
      </Link>
      <Button className="bg-green-600 hover:bg-green-700" size="lg">
        <Edit className="h-4 w-4 mr-2" />
        Edit 2022 Scenario
      </Button>
      <Button className="bg-[#FFD700] hover:bg-[#E5C100] text-black" size="lg">
        <Edit className="h-4 w-4 mr-2" />
        Edit 2023 Scenario
      </Button>
    </div>
  );
};

export default ScenarioActionButtons;
