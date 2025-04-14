
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Share, FileCheck, File, Mail, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
}

interface ShareScenarioCardProps {
  scenarioId: string;
  scenarioType: 'roth' | 'estate' | 'charitable' | 'business' | 'deferred';
  scenarioName: string;
  onGeneratePdf?: () => void;
  documents?: Document[];
}

export const ShareScenarioCard: React.FC<ShareScenarioCardProps> = ({
  scenarioId,
  scenarioType,
  scenarioName,
  onGeneratePdf,
  documents = []
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [includeScenario, setIncludeScenario] = useState(true);
  const [advisorEmail, setAdvisorEmail] = useState('');
  const { toast } = useToast();
  
  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };
  
  const handleShare = () => {
    // In a real implementation, we'd send this data to an API
    const shareData = {
      scenarioId,
      scenarioType,
      includeScenario,
      documentIds: selectedDocuments,
      recipientEmail: advisorEmail,
      timestamp: new Date().toISOString()
    };
    
    console.log('Sharing data:', shareData);
    
    // Show success toast
    toast({
      title: "Shared successfully",
      description: `Your ${scenarioType} scenario has been shared with ${advisorEmail}`,
    });
  };
  
  const generatePdfSummary = () => {
    if (onGeneratePdf) {
      onGeneratePdf();
    }
    
    // Mock PDF generation
    toast({
      title: "PDF Generated",
      description: "Your scenario summary has been saved to the Tax Vault",
    });
  };
  
  return (
    <Card className="border-[#353e52] bg-[#1A1F2C] mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg text-white">Share with Advisor</CardTitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Share Scenario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-[#242A38] border-[#353e52] text-white">
              <DialogHeader>
                <DialogTitle>Share with CPA or Advisor</DialogTitle>
                <DialogDescription>
                  Share this {scenarioType} scenario and related tax documents with your advisor.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="advisor-email">Advisor Email</Label>
                  <Input 
                    id="advisor-email" 
                    placeholder="advisor@example.com" 
                    value={advisorEmail}
                    onChange={e => setAdvisorEmail(e.target.value)}
                    className="bg-[#1A1F2C] border-[#353e52]"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">Share Options</div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-scenario" 
                      checked={includeScenario} 
                      onCheckedChange={() => setIncludeScenario(!includeScenario)} 
                    />
                    <Label htmlFor="include-scenario">
                      Include {scenarioName} scenario details
                    </Label>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={generatePdfSummary}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF Summary
                  </Button>
                </div>
                
                {documents.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-medium">Include Tax Documents</div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {documents.map(doc => (
                        <div key={doc.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`doc-${doc.id}`}
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={() => handleDocumentToggle(doc.id)}
                          />
                          <Label htmlFor={`doc-${doc.id}`} className="flex items-center gap-2">
                            {doc.type === 'pdf' ? (
                              <FileCheck className="h-4 w-4 text-red-400" />
                            ) : (
                              <File className="h-4 w-4 text-blue-400" />
                            )}
                            {doc.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Link to="/tax-planning/collaboration" className="text-sm text-primary hover:underline inline-flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Go to Collaboration Center
                </Link>
                <Button onClick={handleShare}>Share Now</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Share your tax planning scenario with your CPA, financial advisor, or other professional.
          You can include a PDF summary and select relevant tax documents from your Tax Vault.
        </p>
      </CardContent>
      <CardFooter className="border-t border-[#353e52] pt-4">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <File className="h-4 w-4" />
          <span>{documents.length} document{documents.length !== 1 ? 's' : ''} available from Tax Vault</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShareScenarioCard;
