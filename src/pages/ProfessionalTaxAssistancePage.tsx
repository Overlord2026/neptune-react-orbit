
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, UserPlus, ExternalLink, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ProfessionalTaxAssistancePage = () => {
  const { toast } = useToast();
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [contactPreference, setContactPreference] = useState("email");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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
    setIsAssessmentComplete(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would store the data in a database
    console.log("Professional assistance request:", {
      scenarios: selectedScenarios,
      contactPreference,
      additionalInfo,
      preferredTime,
      contactInfo: contactPreference === "email" ? email : phone
    });
    
    // Show success message and open the confirmation sheet
    toast({
      title: "Request submitted successfully",
      description: "We'll match you with a professional shortly.",
    });
    
    setIsSheetOpen(true);
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

        {!isAssessmentComplete ? (
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

                <div className="pt-2">
                  <p className="text-sm text-[#C8C8C9] mb-4">
                    By submitting this form, you agree to be contacted by a tax professional. You'll arrange payment or engagement directly with the professional after your initial consultation.
                  </p>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#FFD700] hover:bg-[#E6C200] text-black"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Family Office Marketplace Card */}
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
        
        {/* Success Sheet */}
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
