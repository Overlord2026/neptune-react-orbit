
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Banknote, 
  Gift, 
  HandCoins, 
  BarChart, 
  Briefcase, 
  Lock 
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleToolSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  const tools = [
    {
      id: "roth-conversion",
      title: "Roth Conversion & Multi-Year",
      icon: <Banknote className="w-5 h-5 text-[#FFD700]" />,
      path: "/tax-planning/roth",
      description: "Plan Roth conversions and RMDs over multiple years"
    },
    {
      id: "estate-gifting",
      title: "Estate & Gifting",
      icon: <Gift className="w-5 h-5 text-[#FFD700]" />,
      path: "/tax-planning/estate-gifting",
      description: "Analyze estate tax implications and gifting strategies"
    },
    {
      id: "charitable-planning",
      title: "Charitable Planning",
      icon: <HandCoins className="w-5 h-5 text-[#FFD700]" />,
      path: "/tax-planning/charitable-planning",
      description: "Optimize tax benefits from charitable contributions"
    },
    {
      id: "deferred-comp",
      title: "Deferred Compensation & Equity",
      icon: <BarChart className="w-5 h-5 text-[#FFD700]" />,
      path: "/tax-planning/deferred-comp",
      description: "Plan stock options and deferred compensation"
    },
    {
      id: "small-business",
      title: "Small Business / Side-Hustle",
      icon: <Briefcase className="w-5 h-5 text-[#FFD700]" />,
      path: "/tax-planning/small-business",
      description: "Optimize taxes for business and self-employment"
    },
    {
      id: "tax-vault",
      title: "Tax Vault & Document Sharing",
      icon: <Lock className="w-5 h-5 text-[#FFD700]" />,
      path: "/tax-planning/aggregator",
      description: "Securely store and share tax documents"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-[#1A1F2C] border-[#353e52] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-[#FFD700]">
            Welcome to Your Tax Planning Suite
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            Choose a focus area to get started, or explore all available tools.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              className="flex justify-start items-center gap-3 p-4 h-auto border-[#353e52] hover:border-[#FFD700] hover:bg-[#242A38] transition-all group"
              onClick={() => handleToolSelect(tool.path)}
            >
              <div className="p-2 rounded-full bg-[#242A38] group-hover:bg-[#FFD700]/10">
                {tool.icon}
              </div>
              <div className="text-left">
                <div className="font-medium text-white">{tool.title}</div>
                <div className="text-xs text-gray-400">{tool.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <DialogFooter className="flex-col sm:justify-center sm:flex-row gap-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            Skip / Explore All Tools
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
