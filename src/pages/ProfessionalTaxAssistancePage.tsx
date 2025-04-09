import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { CheckCircle2, UserPlus, ExternalLink, ArrowLeft, FileUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TaxDisclaimerWithCheckbox from '@/components/tax/TaxDisclaimerWithCheckbox';

const ProfessionalTaxAssistancePage = () => {
  const { toast } = useToast();
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [isIrsSupport, setIsIrsSupport] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [contactPreference, setContactPreference] = useState("email");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [unfiledYears, setUnfiledYears] = useState<string[]>([]);
  const [hasIrsNotice, setHasIrsNotice] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);

  const complexScenarios = [
    { id: "business", label: "Business or self-employment income" },
    { id: "rental", label: "Rental property income" },
    { id: "multi-state", label: "Multiple state filing requirements" },
    { id: "irs-notices", label: "IRS notices or ongoing audit" },
    { id: "credits", label: "Advanced tax credits or deductions" },
    { id: "foreign", label: "Foreign income or assets" },
    { id: "estate", label: "Estate or trust tax matters" },
    { id: "other", label: "Other complex tax situation" },
  ];

  const yearOptions = [
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2019", label: "2019" },
    { value: "older", label: "Older than 2019" },
  ];

  const irsFormSchema = z.object({
    years: z.array(z.string()).min(1, "Please select at least one year"),
    hasNotice: z.boolean().optional(),
  });

  const irsForm = useForm({
    resolver: zodResolver(irsFormSchema),
    defaultValues: {
      years: [],
      hasNotice: false,
    }
  });

  const handleScenarioChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedScenarios([...selectedScenarios, id]);
    } else {
      setSelectedScenarios(selectedScenarios.filter(scenario => scenario !== id));
    }
  };

  const handleSelfAssessmentComplete = () => {
    if (selectedScenarios.length === 0) {
      toast({
        title: "Please select at least one scenario",
        description: "We need to understand your tax situation to better assist you.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedScenarios.includes("irs-notices")) {
      setIsIrsSupport(true);
    } else {
      setIsAssessmentComplete(true);
    }
  };

  const handleYearChange = (year: string, checked: boolean) => {
    if (checked) {
      setUnfiledYears([...unfiledYears, year]);
    } else {
      setUnfiledYears(unfiledYears.filter(y => y !== year));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles([...uploadedFiles, ...files]);
      toast({
        title: `${files.length} file(s) uploaded`,
        description: "Your documents have been attached to your request.",
      });
    }
  };

  const handleIrsFormSubmit = (data: z.infer<typeof irsFormSchema>) => {
    console.log("IRS form submitted:", {
      unfiledYears: data.years,
      hasIrsNotice: data.hasNotice,
      uploadedFiles
    });
    
    setIsAssessmentComplete(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!disclaimerAcknowledged) {
      toast({
        title: "Please acknowledge the disclaimer",
        description: "You must acknowledge the disclaimer before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Professional assistance request:", {
      scenarios: selectedScenarios,
      contactPreference,
      additionalInfo,
      preferredTime,
      contactInfo: contactPreference === "email" ? email : phone,
      unfiledYears,
      hasIrsNotice,
      uploadedFiles,
      disclaimerAcknowledged
    });
    
    toast({
      title: "Request submitted successfully",
      description: "We'll match you with a professional shortly.",
    });
    
    setIsSheetOpen(true);
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  return (
    <div className="container content-padding section-margin">
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold">Professional Tax Assistance</h2>
          <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5]" asChild>
            <Link to="/tax-planning/filing-options">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Filing Options
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <p className="text-lg text-[#E5DEFF]">
            Complex returns or IRS challenges? Our network of professionals can assist you with personalized tax expertise tailored to your unique situation.
          </p>
        </div>

        {!isAssessmentComplete && !isIrsSupport ? (
          <Card className="neptune-card">
            <CardHeader>
              <CardTitle>Self-Assessment</CardTitle>
              <CardDescription>
                Select any complex scenarios that apply to your situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complexScenarios.map(scenario => (
                  <div key={scenario.id} className="flex items-start space-x-3">
                    <Checkbox 
                      id={scenario.id}
                      checked={selectedScenarios.includes(scenario.id)}
                      onCheckedChange={(checked) => handleScenarioChange(scenario.id, checked === true)}
                    />
                    <Label htmlFor={scenario.id} className="text-[#E5DEFF] cursor-pointer">
                      {scenario.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 bg-[#FFD700] hover:bg-[#E6C200] text-black" 
                onClick={handleSelfAssessmentComplete}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        ) : isIrsSupport ? (
          <Card className="neptune-card">
            <CardHeader>
              <CardTitle>Past Returns & IRS Support</CardTitle>
              <CardDescription>
                If you have unfiled returns from prior years or received notices from the IRS, let us help you fix it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...irsForm}>
                <form onSubmit={irsForm.handleSubmit(handleIrsFormSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium mb-3 block">Which years are unfiled?</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {yearOptions.map(year => (
                          <div key={year.value} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`year-${year.value}`} 
                              checked={unfiledYears.includes(year.value)}
                              onCheckedChange={(checked) => handleYearChange(year.value, checked === true)}
                            />
                            <Label 
                              htmlFor={`year-${year.value}`} 
                              className="text-[#E5DEFF] cursor-pointer"
                            >
                              {year.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {unfiledYears.length > 0 && (
                        <div className="mt-4 p-3 bg-[#1A1F2C] rounded-md">
                          <p className="text-sm font-medium text-[#FFD700] mb-2">Progress Checklist:</p>
                          <div className="space-y-1">
                            {unfiledYears.map(year => (
                              <div key={year} className="flex items-center text-sm text-[#E5DEFF]">
                                <span className="inline-block w-4 h-4 rounded-full border border-[#555] mr-2"></span>
                                <span>{year === 'older' ? 'Pre-2019' : year} Return Not Filed</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="has-notice" 
                          checked={hasIrsNotice}
                          onCheckedChange={(checked) => setHasIrsNotice(checked === true)}
                        />
                        <Label htmlFor="has-notice" className="text-base font-medium cursor-pointer">
                          I've received a notice from the IRS
                        </Label>
                      </div>
                    </div>

                    {hasIrsNotice && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label htmlFor="document-upload" className="text-base font-medium">
                            Upload IRS notices or relevant documents
                          </Label>
                          <div className="mt-2 flex flex-col space-y-2">
                            <div className="border-2 border-dashed border-[#444] rounded-md p-4 text-center cursor-pointer hover:border-[#9b87f5]">
                              <Label htmlFor="document-upload" className="cursor-pointer">
                                <FileUp className="mx-auto h-10 w-10 text-[#9b87f5] mb-2" />
                                <span className="text-[#9b87f5] font-medium">Click to upload</span>
                                <p className="text-xs text-[#8E9196] mt-1">PDF, JPG, or PNG (max 10MB)</p>
                              </Label>
                              <Input 
                                id="document-upload" 
                                type="file" 
                                className="hidden" 
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                              />
                            </div>

                            {uploadedFiles.length > 0 && (
                              <div className="mt-4">
                                <Label className="text-sm font-medium mb-2 block">Uploaded Files:</Label>
                                <div className="space-y-2">
                                  {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-[#1A1F2C] rounded-md">
                                      <span className="text-sm text-[#E5DEFF] truncate">{file.name}</span>
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 border border-[#444] rounded-md bg-[#222] mt-4">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-[#FFD700] mr-2 flex-shrink-0" />
                            <p className="text-sm text-[#E5DEFF]">
                              All documents will be tagged with 'IRS_issue' or 'unfiled_return' and securely stored in your document aggregator.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-[#C8C8C9] mb-2">
                      A specialist will review your situation and help you resolve the issue. Final resolution depends on the IRS's timelines, which may take several weeks or months.
                    </p>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#FFD700] hover:bg-[#E6C200] text-black"
                    >
                      Continue to Contact Details
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[#9b87f5] text-[#9b87f5]"
                      onClick={() => setIsIrsSupport(false)}
                    >
                      Go Back
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="neptune-card">
            <CardHeader>
              <CardTitle>Connect with a Professional</CardTitle>
              <CardDescription>
                Please provide your contact details so we can match you with a suitable tax professional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact-preference">Preferred Contact Method</Label>
                    <RadioGroup 
                      defaultValue="email" 
                      value={contactPreference}
                      onValueChange={setContactPreference}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="contact-email" />
                        <Label htmlFor="contact-email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="contact-phone" />
                        <Label htmlFor="contact-phone">Phone</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {contactPreference === "email" ? (
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1" 
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="mt-1" 
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="preferred-time">Preferred Contact Time</Label>
                    <Input 
                      id="preferred-time" 
                      placeholder="e.g., Weekdays after 5pm ET" 
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="mt-1" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional-info">Additional Information</Label>
                    <Textarea 
                      id="additional-info" 
                      placeholder="Brief description of your tax situation and needs..." 
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={4}
                      className="mt-1" 
                    />
                  </div>
                </div>

                {isIrsSupport && unfiledYears.length > 0 && (
                  <div className="p-3 bg-[#1A1F2C] border border-[#333] rounded-md">
                    <h4 className="font-medium text-[#FFD700] mb-2">IRS & Past Return Support</h4>
                    <p className="text-sm text-[#E5DEFF] mb-2">
                      You will be connected with a specialist who has experience with:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-[#E5DEFF]">
                      {unfiledYears.length > 0 && <li>Past unfiled returns ({unfiledYears.join(", ")})</li>}
                      {hasIrsNotice && <li>IRS notice resolution</li>}
                    </ul>
                  </div>
                )}

                <TaxDisclaimerWithCheckbox 
                  acknowledged={disclaimerAcknowledged}
                  onAcknowledgeChange={setDisclaimerAcknowledged}
                  className="mt-6"
                />

                <div className="pt-2">
                  <p className="text-sm text-[#C8C8C9] mb-4">
                    By submitting this form, you agree to be contacted by a tax professional. You'll arrange payment or engagement directly with the professional after your initial consultation.
                  </p>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#FFD700] hover:bg-[#E6C200] text-black"
                    disabled={!disclaimerAcknowledged}
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-[#1A1F2C] border border-[#333] mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-[#222] border border-[#444] flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-[#8E9196]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#FFD700] mb-2">Family Office Marketplace</h3>
                <p className="text-[#E5DEFF]">
                  Soon you'll be able to browse our curated professionals in the Family Office Marketplace. 
                  We carefully vet all tax professionals for expertise, credentials, and client satisfaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Request Submitted
              </SheetTitle>
              <SheetDescription>
                We've received your request for professional tax assistance.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <p className="text-[#E5DEFF]">
                Based on your needs, we'll match you with a qualified tax professional who will reach out to you within 2 business days using your preferred contact method.
              </p>
              
              <div className="bg-[#1A1F2C] border border-[#333] rounded-md p-4 mt-4">
                <h4 className="font-medium text-[#FFD700] mb-2">What to expect next:</h4>
                <ol className="list-decimal list-inside space-y-2 text-[#E5DEFF]">
                  <li>You'll receive a confirmation email with your request details.</li>
                  <li>A matched professional will contact you to discuss your tax needs.</li>
                  <li>After the initial consultation, you can decide whether to proceed with their services.</li>
                </ol>
              </div>
              
              <div className="pt-4 mt-2">
                <Button 
                  variant="outline" 
                  className="w-full border-[#FFD700] text-[#FFD700]" 
                  onClick={() => setIsSheetOpen(false)}
                  asChild
                >
                  <Link to="/tax-planning">
                    Return to Tax Planning Hub
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ProfessionalTaxAssistancePage;
