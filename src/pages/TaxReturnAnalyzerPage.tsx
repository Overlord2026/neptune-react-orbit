
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TaxReturnAnalyzerPage = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight neptune-gold">Tax Return Analyzer</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary">Coming Soon</Badge>
          </div>
          <p className="text-muted-foreground">Upload and analyze your tax returns to identify optimization opportunities.</p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>
      
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl neptune-gold flex items-center gap-3">
            <Scan className="h-6 w-6" />
            OCR-Powered Tax Return Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our upcoming Tax Return Analyzer will utilize advanced OCR (Optical Character Recognition) technology
            to automatically extract data from your uploaded tax returns. The system will then:
          </p>
          
          <ul className="list-disc list-outside ml-6 space-y-2 text-muted-foreground">
            <li>Identify potential missed deductions and credits</li>
            <li>Compare your return against similar financial profiles</li>
            <li>Highlight areas where tax optimization is possible</li>
            <li>Generate actionable recommendations for future tax planning</li>
            <li>Track year-over-year changes in your tax situation</li>
          </ul>
          
          <div className="rounded-md border border-dashed border-primary/30 p-8 flex flex-col items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 neptune-gold" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg neptune-gold">Upload Your Tax Return</h3>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, JPG, PNG (Max 25MB)
              </p>
            </div>
            <Button disabled className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Return
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col bg-muted/50 rounded-b-lg">
          <p className="text-sm text-muted-foreground py-2">
            <strong>Note:</strong> This feature is currently under development. When launched, all uploads will be processed securely with bank-level encryption and data protection.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaxReturnAnalyzerPage;
