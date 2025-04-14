
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentContext } from './DocumentContext';

interface DocumentYearSelectorProps {
  onShareAllForYear: (year: string) => void;
}

const DocumentYearSelector: React.FC<DocumentYearSelectorProps> = ({ onShareAllForYear }) => {
  const { years, selectedYear, setSelectedYear, archivedDocCounts, documents } = useDocumentContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-primary">Tax Years</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {years.map(year => (
          <div key={year} className="flex items-center justify-between">
            <Button 
              variant={year === selectedYear ? "default" : "ghost"} 
              className="justify-start flex-grow"
              onClick={() => setSelectedYear(year)}
            >
              {year}
              <Badge variant="outline" className="ml-2">
                {documents[year].filter(doc => !doc.archived).length}
              </Badge>
              {archivedDocCounts[year] > 0 && (
                <Badge variant="outline" className="ml-1 text-amber-500 border-amber-500">
                  {archivedDocCounts[year]} archived
                </Badge>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2"
              onClick={() => onShareAllForYear(year)}
              title={`Share all ${year} documents`}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DocumentYearSelector;
