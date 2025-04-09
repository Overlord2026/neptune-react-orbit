
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MissingDocument, useMissingDocsChecker, markDocumentAsNotApplicable } from "@/utils/missingDocsChecker";
import { AlertTriangle, FileText, Upload, Download, File, FilePlus } from "lucide-react";

interface MissingDocumentsReportProps {
  taxYear: string;
  onRequestUpload: (docType: string) => void;
}

const MissingDocumentsReport = ({ taxYear, onRequestUpload }: MissingDocumentsReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [missingDocs, setMissingDocs] = useState<MissingDocument[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { generateMissingDocsReport } = useMissingDocsChecker();

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const docs = await generateMissingDocsReport(taxYear);
      setMissingDocs(docs);
      setHasGenerated(true);
    } catch (error) {
      console.error("Failed to generate missing docs report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkNotApplicable = async (docId: string) => {
    await markDocumentAsNotApplicable(docId);
    setMissingDocs(docs => 
      docs.map(doc => 
        doc.id === docId 
          ? { ...doc, status: 'not_applicable' } 
          : doc
      )
    );
  };

  return (
    <div className="space-y-4">
      {!hasGenerated ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary">Missing Documents Report</CardTitle>
            <CardDescription>
              Check if you're missing any important tax documents based on your financial profile
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-muted-foreground mb-4">
              This tool analyzes your income sources and existing documents to identify 
              any tax forms you might need to complete your records for {taxYear}.
            </p>
            <Button 
              onClick={handleGenerateReport} 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? "Analyzing..." : "Generate Missing Documents Report"}
            </Button>
          </CardContent>
        </Card>
      ) : missingDocs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Missing Documents for {taxYear}
            </CardTitle>
            <CardDescription>
              The following documents appear to be missing from your records:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missingDocs.map(doc => (
                <div 
                  key={doc.id} 
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border ${
                    doc.status === 'not_applicable' ? 'bg-muted/30' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex gap-3 mb-3 md:mb-0">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium flex flex-wrap gap-2 items-center">
                        {doc.documentType}
                        {doc.status === 'not_applicable' && (
                          <Badge variant="outline" className="text-muted-foreground">Not Applicable</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                      {doc.source && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Source:</span> {doc.source}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {doc.status !== 'not_applicable' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => onRequestUpload(doc.documentType)}
                          className="flex-grow md:flex-grow-0"
                        >
                          <Upload className="h-4 w-4 mr-1" /> Upload Document
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkNotApplicable(doc.id)}
                          className="flex-grow md:flex-grow-0"
                        >
                          Mark Not Applicable
                        </Button>
                      </>
                    )}
                    {doc.status === 'not_applicable' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setMissingDocs(docs => 
                          docs.map(d => d.id === doc.id ? { ...d, status: 'missing' } : d)
                        )}
                      >
                        Undo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start border-t pt-4">
            <Alert>
              <AlertTitle>Why do we suggest these documents?</AlertTitle>
              <AlertDescription>
                Based on your financial profile, these documents are typically required for a complete 
                tax filing. Mark as "Not Applicable" if a document isn't relevant for your situation.
              </AlertDescription>
            </Alert>
            <div className="w-full flex justify-between mt-4">
              <Button variant="outline" onClick={() => {
                setHasGenerated(false);
                setMissingDocs([]);
              }}>
                Reset
              </Button>
              <Button onClick={handleGenerateReport} disabled={isLoading}>
                Refresh Report
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary">Missing Documents Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center flex-col py-6">
              <File className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-medium">All Documents Accounted For!</h3>
              <p className="text-center text-muted-foreground mt-2 max-w-md">
                Great job! Based on your financial profile, it appears you have all the necessary tax documents for {taxYear}.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setHasGenerated(false)}>
              Back
            </Button>
            <Button onClick={handleGenerateReport}>
              Refresh Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default MissingDocumentsReport;
