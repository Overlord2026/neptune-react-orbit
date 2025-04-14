
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Download, Save, Loader2 } from "lucide-react";
import { DocumentTag, exportScenarioToPdf, saveScenarioToPdf } from "@/utils/documentTaggingUtils";
import TagSelector from '../tax/TagSelector';

interface ExportScenarioToPDFProps {
  scenarioId: string;
  scenarioName: string;
  scenarioType: DocumentTag;
  scenarioData: any;
  onExportComplete?: () => void;
}

const ExportScenarioToPDF: React.FC<ExportScenarioToPDFProps> = ({
  scenarioId,
  scenarioName,
  scenarioType,
  scenarioData,
  onExportComplete
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileName, setFileName] = useState(`${scenarioType}_${new Date().getFullYear()}_Scenario.pdf`);
  const [isExporting, setIsExporting] = useState(false);
  const [saveToVault, setSaveToVault] = useState(true);
  const [tags, setTags] = useState<DocumentTag[]>([scenarioType]);
  const { toast } = useToast();
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Export to PDF
      const success = await exportScenarioToPdf(
        scenarioData,
        scenarioType,
        new Date().getFullYear().toString()
      );
      
      if (!success) {
        throw new Error("Failed to export scenario");
      }
      
      // If save to vault is enabled
      if (saveToVault) {
        const documentId = await saveScenarioToPdf(
          scenarioId,
          scenarioName,
          scenarioType,
          new Date().getFullYear().toString()
        );
        
        if (!documentId) {
          throw new Error("Failed to save to Tax Vault");
        }
        
        toast({
          title: "Saved to Tax Vault",
          description: "Your scenario has been saved to the Tax Vault for future reference",
        });
      } else {
        toast({
          title: "PDF Generated",
          description: "Your scenario PDF has been downloaded",
        });
      }
      
      if (onExportComplete) {
        onExportComplete();
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred during export",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Scenario to PDF</DialogTitle>
          <DialogDescription>
            Create a PDF summary of your scenario that you can download or save to your Tax Vault.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="filename" className="text-right">
              File name
            </Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="save-vault" className="text-right">
              Save to Tax Vault
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch 
                id="save-vault" 
                checked={saveToVault} 
                onCheckedChange={setSaveToVault} 
              />
              <Label htmlFor="save-vault">
                {saveToVault ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>
          
          {saveToVault && (
            <div className="grid grid-cols-4 items-start gap-2">
              <Label className="text-right pt-2">Tags</Label>
              <div className="col-span-3">
                <TagSelector 
                  selectedTags={tags}
                  onChange={setTags}
                  limit={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add up to 3 tags to help organize your document
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsDialogOpen(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {saveToVault ? 'Saving...' : 'Exporting...'}
              </>
            ) : (
              <>
                {saveToVault ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Vault
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportScenarioToPDF;
