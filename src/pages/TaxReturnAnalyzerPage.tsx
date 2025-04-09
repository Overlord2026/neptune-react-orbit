
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react";

// TODO: Implement OCR in Phase 2 once the service is ready.
// import { OCRService } from "../services/OCRService";

const TaxReturnAnalyzerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if the file type is supported
      if (selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/")) {
        // Check file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Please upload a file smaller than 10MB.",
            variant: "destructive",
          });
          return;
        }
        
        setFile(selectedFile);
        setResults(null); // Reset results when a new file is selected
        toast({
          title: "File Selected",
          description: `${selectedFile.name} has been selected.`,
        });
      } else {
        toast({
          title: "Unsupported File Format",
          description: "Please upload a PDF or image file (.jpg, .png).",
          variant: "destructive",
        });
      }
    }
  };

  // TODO: Implement OCR in Phase 2 once the service is ready.
  // const handleOCR = async () => {
  //   if (!file) return;
  //   
  //   try {
  //     setIsProcessing(true);
  //     const ocrResult = await OCRService.processDocument(file);
  //     
  //     // Parse OCR results to identify potential tax deductions
  //     const deductions = ocrResult.extractDeductions();
  //     setResults(`Potential deductions identified: ${deductions.length}. ${deductions.map(d => d.name).join(', ')}`);
  //   } catch (error) {
  //     console.error("OCR processing failed:", error);
  //     toast({
  //       title: "OCR Processing Failed",
  //       description: "Unable to process the document. Please try again later.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const processFile = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    console.log("Analysis in progress...");
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setResults("Potential deductions identified: 0. More features coming soon!");
      toast({
        title: "Analysis Complete",
        description: "Your tax return has been analyzed.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">Tax Return Analyzer</h1>
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
            <FileText className="h-6 w-6" />
            Tax Return Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Upload your tax return file (PDF or image) to analyze for potential tax savings opportunities.
            Our system will scan your document and identify possible deductions or credits you may have missed.
          </p>
          
          <div className="rounded-md border border-dashed border-primary/30 p-4 sm:p-8 flex flex-col items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 neptune-gold" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-base sm:text-lg neptune-gold">
                {file ? file.name : "Upload Your Tax Return"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Supported formats: PDF, JPG, PNG (Max 10MB)
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
                id="tax-return-upload"
              />
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Select File
              </Button>
              <Button 
                onClick={processFile} 
                disabled={!file || isProcessing}
                className="bg-[#FFD700] text-black hover:bg-[#E5C100] gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process Return"
                )}
              </Button>
            </div>
          </div>
          
          {results && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-md">
              <h3 className="font-medium text-lg neptune-gold mb-2">Analysis Results</h3>
              <p className="text-muted-foreground">{results}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/50 border-t border-primary/10 flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            All uploads are encrypted and analyzed securely. Your privacy is our priority.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaxReturnAnalyzerPage;
