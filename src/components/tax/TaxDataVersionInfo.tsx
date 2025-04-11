
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { AlertTriangle, Calendar, Check, Info, Download } from "lucide-react";
import { getTaxDataVersionsForYear, TaxDataVersion } from '@/utils/taxDataVersioning';

interface TaxDataVersionInfoProps {
  year: number;
  onSelectVersion?: (version: string) => void;
  showControls?: boolean;
}

const TaxDataVersionInfo: React.FC<TaxDataVersionInfoProps> = ({
  year,
  onSelectVersion,
  showControls = false
}) => {
  const versions = getTaxDataVersionsForYear(year);
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>(
    versions.length > 0 ? versions[0].version : undefined
  );
  const { toast: toastFn } = useToast();
  
  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    if (onSelectVersion) {
      onSelectVersion(version);
    }
  };
  
  const handleExportData = () => {
    // In a real app, this would export the data as JSON or CSV
    toastFn({
      title: "Data exported",
      description: `Tax data for ${year} (${selectedVersion}) has been exported.`,
      variant: "default",
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            No Tax Data Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No tax data versions were found for the year {year}. This may indicate that the data
            has not been imported yet or there was an error during the import process.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          Tax Data Versions for {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">
          {versions.length > 1 
            ? `There are ${versions.length} versions of tax data available for ${year}.`
            : `There is 1 version of tax data available for ${year}.`}
          {versions.length > 1 && " Select a version to view its details."}
        </p>
        
        <div className="space-y-4">
          {versions.map((version: TaxDataVersion) => (
            <div 
              key={version.id}
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                selectedVersion === version.version 
                ? 'bg-muted border-primary' 
                : 'hover:bg-muted/50'
              }`}
              onClick={() => handleVersionSelect(version.version)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium flex items-center">
                  {selectedVersion === version.version && (
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                  )}
                  Version {version.version}
                </div>
                <div className="flex gap-2">
                  {version.is_projected && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                      Projected
                    </Badge>
                  )}
                  {version.is_correction && (
                    <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                      Correction
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Effective: </span>
                  <span>{formatDate(version.effective_date)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Published: </span>
                  <span>{formatDate(version.published_date)}</span>
                </div>
              </div>
              
              {version.legislation_reference && (
                <div className="text-sm mt-2">
                  <span className="text-muted-foreground">Reference: </span>
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                    {version.legislation_reference}
                  </span>
                </div>
              )}
              
              {version.description && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Description: </span>
                  <span>{version.description}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {showControls && versions.length > 1 && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center text-sm">
              <Info className="h-4 w-4 mr-2 text-blue-500" />
              <p>
                Using tax data from version{" "}
                <span className="font-semibold">{selectedVersion}</span>
                {" "}for calculations.
              </p>
            </div>
          </>
        )}
      </CardContent>
      
      {showControls && (
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Tax Data (Version {selectedVersion})
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TaxDataVersionInfo;
