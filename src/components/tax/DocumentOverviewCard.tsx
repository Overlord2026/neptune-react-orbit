
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";

interface DocumentOverviewCardProps {
  enableAIClassification: boolean;
  onEnableAIClassificationChange: (enabled: boolean) => void;
}

const DocumentOverviewCard: React.FC<DocumentOverviewCardProps> = ({
  enableAIClassification,
  onEnableAIClassificationChange
}) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Easily store, categorize, archive, and share your tax documents in one place.
          Upload statements from employers, banks, and other institutions to keep them organized for tax preparation.
        </p>
        
        {/* AI Classification Toggle */}
        <div className="flex items-center justify-between mt-4 p-4 bg-secondary/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <Label htmlFor="ai-classification" className="font-medium">AI Document Classification</Label>
              <p className="text-sm text-muted-foreground">
                Automatically identify document types and tax years
              </p>
            </div>
          </div>
          <Switch 
            id="ai-classification" 
            checked={enableAIClassification} 
            onCheckedChange={onEnableAIClassificationChange} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentOverviewCard;
