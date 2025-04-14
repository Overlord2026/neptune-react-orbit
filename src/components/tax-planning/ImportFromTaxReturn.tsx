
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, AlertCircle, Check, FileSearch } from "lucide-react";
import { importDataFromTaxReturn } from "@/utils/documentTaggingUtils";
import { useToast } from "@/hooks/use-toast";

// Sample tax return documents
const taxReturnDocuments = [
  { id: '101', name: '1040_2023.pdf', year: '2023', uploadDate: '2024-02-15' },
  { id: '102', name: '1040_2022.pdf', year: '2022', uploadDate: '2023-03-10' },
  { id: '103', name: '1040_2021.pdf', year: '2021', uploadDate: '2022-02-28' },
];

interface ImportFromTaxReturnProps {
  onDataImported: (data: any) => void;
}

const ImportFromTaxReturn: React.FC<ImportFromTaxReturnProps> = ({ onDataImported }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const { toast } = useToast();
  
  const handleImport = async (docId: string, year: string) => {
    setProcessing(docId);
    setExtractedData(null);
    
    try {
      const data = await importDataFromTaxReturn(docId, year);
      
      if (data) {
        setExtractedData(data);
        toast({
          title: "Data extracted successfully",
          description: `We extracted key information from your ${year} tax return.`,
        });
      } else {
        toast({
          title: "Data extraction failed",
          description: "We couldn't extract data from this document. Please enter data manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error extracting data",
        description: "An error occurred while processing your document.",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };
  
  const handleUseData = () => {
    if (extractedData) {
      onDataImported(extractedData);
      setIsOpen(false);
      toast({
        title: "Data imported",
        description: "Tax return data has been applied to your scenario.",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="w-full justify-start text-left"
        >
          <FileSearch className="mr-2 h-4 w-4" />
          Import from last year's tax return
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import from Tax Return</DialogTitle>
          <DialogDescription>
            We can extract key information from your previous tax returns stored in the Tax Vault 
            to help build your scenario.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {taxReturnDocuments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                  <h3 className="mt-2 text-lg font-medium">No tax returns found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your tax returns to the Tax Vault first to use this feature.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Go to Tax Vault
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {taxReturnDocuments.map((doc) => (
                <Card key={doc.id} className={extractedData && extractedData.filingStatus && doc.id === processing ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {doc.name}
                    </CardTitle>
                    <CardDescription>
                      Tax Year: {doc.year} • Uploaded: {doc.uploadDate}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <div className="w-full flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open("/tax-vault", "_blank")}
                      >
                        View Document
                      </Button>
                      
                      {extractedData && processing === doc.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setExtractedData(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleUseData}>
                            <Check className="mr-1 h-4 w-4" />
                            Use This Data
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          disabled={!!processing}
                          onClick={() => handleImport(doc.id, doc.year)}
                        >
                          {processing === doc.id ? (
                            <>
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                              Extracting...
                            </>
                          ) : (
                            "Extract Data"
                          )}
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                  
                  {extractedData && processing === doc.id && (
                    <CardContent className="pt-0 border-t mt-3">
                      <div className="text-sm">
                        <h4 className="font-medium mb-2">Extracted Data</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex justify-between pr-4">
                            <span className="text-muted-foreground">Filing Status:</span>
                            <span className="font-medium capitalize">{extractedData.filingStatus}</span>
                          </div>
                          <div className="flex justify-between pr-4">
                            <span className="text-muted-foreground">Adjusted Gross Income:</span>
                            <span className="font-medium">${extractedData.adjustedGrossIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pr-4">
                            <span className="text-muted-foreground">Total Income:</span>
                            <span className="font-medium">${extractedData.totalIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pr-4">
                            <span className="text-muted-foreground">Total Tax:</span>
                            <span className="font-medium">${extractedData.totalTax.toLocaleString()}</span>
                          </div>
                          {extractedData.capital_gains > 0 && (
                            <div className="flex justify-between pr-4">
                              <span className="text-muted-foreground">Capital Gains:</span>
                              <span className="font-medium">${extractedData.capital_gains.toLocaleString()}</span>
                            </div>
                          )}
                          {extractedData.ira_contributions > 0 && (
                            <div className="flex justify-between pr-4">
                              <span className="text-muted-foreground">IRA Contributions:</span>
                              <span className="font-medium">${extractedData.ira_contributions.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromTaxReturn;
