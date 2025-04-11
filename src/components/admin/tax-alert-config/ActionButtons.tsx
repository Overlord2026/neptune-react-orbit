
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onReset }) => {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t">
      <Button variant="outline" onClick={onReset}>
        Reset to Defaults
      </Button>
      <Button onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        Save Configuration
      </Button>
    </div>
  );
};

export default ActionButtons;
