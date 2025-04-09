
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link2, FileText, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const TaxDocumentAggregatorPage = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight neptune-gold">Tax Document Aggregator</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary">Coming Soon</Badge>
          </div>
          <p className="text-muted-foreground">Automatically gather and organize all your tax documents in one secure place.</p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>
      
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl neptune-gold flex items-center gap-3">
            <Database className="h-6 w-6" />
            Automated Document Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our upcoming Tax Document Aggregator will automatically connect to financial institutions 
            and government systems to retrieve your tax documents, including:
          </p>
          
          <ul className="list-disc list-outside ml-6 space-y-2 text-muted-foreground">
            <li>W-2 forms from employers</li>
            <li>1099 forms (various types)</li>
            <li>Investment statements</li>
            <li>Bank statements</li>
            <li>Property tax records</li>
            <li>Previous tax returns</li>
          </ul>
          
          <div className="rounded-md border border-dashed border-primary/30 p-8 flex flex-col items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Link2 className="h-8 w-8 neptune-gold" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg neptune-gold">Connect Your Financial Institutions</h3>
              <p className="text-sm text-muted-foreground">
                Securely link your accounts to automatically import documents
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button disabled className="gap-2">
                      <FileText className="h-4 w-4" />
                      Connect Institutions
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This feature is in development</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col bg-muted/50 rounded-b-lg">
          <p className="text-sm text-muted-foreground py-2">
            <strong>Note:</strong> When launched, all connections will be secured with end-to-end encryption and bank-level security protocols.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaxDocumentAggregatorPage;
