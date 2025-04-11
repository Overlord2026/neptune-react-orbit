import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookText, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlossaryTerm from '@/components/GlossaryTerm';
import DynamicContentText from '@/components/DynamicContentText';
import EnrollmentDialog from "@/components/tax-education/EnrollmentDialog";

const AdvancedTaxEducationPage = () => {
  // This would normally be determined by checking if user has purchased the course
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState<boolean>(false);
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // For demonstration purposes
  const availableYears = [2023, 2024, 2025];
  
  const contentOptions = {
    year: selectedYear,
    format: 'currency' as const
  };

  const moduleData = [
    {
      id: 1,
      title: "Roth Conversion Timing & Multi-Year Planning",
      description: "Master the timing and execution of Roth conversions over multiple tax years to minimize tax impact. Learn how to create a comprehensive conversion strategy that accounts for changing tax brackets, retirement plans, and estate considerations.",
      duration: "4 hours",
      topics: ["Multi-year bracket management", "Cross-year conversion strategies", "Strategic withdrawal planning"]
    },
    {
      id: 2,
      title: "Tax-Efficient Asset Location",
      description: "Optimize your investment portfolio's tax efficiency by understanding which assets belong in which account types. Develop frameworks for placing investments in taxable, tax-deferred, or tax-free accounts to maximize after-tax returns.",
      duration: "3.5 hours",
      topics: ["Account type optimization", "Tax drag reduction", "Asset placement hierarchy"]
    },
    {
      id: 3,
      title: "Advanced Estate & Gifting Strategies",
      description: "Navigate complex wealth transfer techniques while minimizing estate and gift taxes. Learn how to implement advanced strategies like Grantor Retained Annuity Trusts (GRATs), Family Limited Partnerships, and dynasty trusts.",
      duration: "5 hours",
      topics: ["Advanced trust structures", "Lifetime gifting strategies", "Business succession planning"]
    },
    {
      id: 4,
      title: "Business Entity Tax Optimization",
      description: "Compare tax implications of different business structures and learn how to minimize overall tax burden through strategic entity selection and planning. Explore advanced topics like S-Corporation reasonable compensation, partnership special allocations, and more.",
      duration: "4.5 hours",
      topics: ["Entity selection optimization", "Owner compensation strategies", "Business deduction maximization"]
    }
  ];

  const additionalResources = [
    {
      title: "Monthly Advanced Tax Planning Webinars",
      description: "Join our live monthly sessions addressing timely tax planning opportunities and legislative updates."
    },
    {
      title: "Advanced Tax Strategy Calculators Suite",
      description: "Gain access to specialized planning tools for complex scenarios not available in the free version."
    },
    {
      title: "Private Tax Strategy Community",
      description: "Connect with other course participants and occasionally interact with course instructors."
    }
  ];

  const handleEnrollmentSuccess = () => {
    setIsEnrolled(true);
    setEnrollmentDialogOpen(false);
  };

  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center">
            <BookText className="mr-2 h-6 w-6" />
            Advanced Tax Strategies & Planning Course
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            Dive deeper into comprehensive tax optimization techniques, including multi-year <GlossaryTerm termId="roth_conversion">Roth planning</GlossaryTerm>, 
            advanced estate strategies, and intricate business tax concepts.
          </p>
        </div>
      </div>
      
      {/* Year Selector */}
      <div className="flex flex-col md:flex-row gap-4 my-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-card">
        <div className="space-y-2">
          <label htmlFor="year-select" className="text-sm font-medium">Reference Tax Year</label>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year-select" className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end ml-auto">
          <p className="text-xs text-muted-foreground">
            Data last updated: <DynamicContentText as="span">tax_data_last_update</DynamicContentText>
          </p>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid gap-6 py-6">
        <Card className="bg-[#1A1F2C] border border-[#8E9196] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl text-[#FFD700]">Course Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This premium course is designed for individuals who want to master advanced tax planning 
              techniques beyond the basics. Through detailed video lessons, case studies, and practical examples, 
              you'll learn how to implement sophisticated strategies that can potentially save thousands in taxes.
            </p>

            <div className="bg-[#14171F] p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-[#E5DEFF]">Course Price</h3>
                  <p className="text-2xl font-bold text-white">$299.00</p>
                  <p className="text-sm text-[#9b87f5]">One-time payment, lifetime access</p>
                </div>
                {isEnrolled ? (
                  <Button className="bg-green-600 hover:bg-green-700">
                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    className="bg-[#9b87f5] hover:bg-[#8a76e4]"
                    onClick={() => setEnrollmentDialogOpen(true)}
                  >
                    Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Modules */}
        <h3 className="text-2xl font-bold mt-6">Course Modules</h3>
        <div className="grid gap-4">
          {moduleData.map((module) => (
            <Card key={module.id} className="border-l-4 border-l-[#9b87f5]">
              <CardHeader>
                <div className="flex items-center">
                  <span className="bg-[#1A1F2C] text-[#9b87f5] mr-3 px-2 py-1 rounded-md font-mono">
                    Module {module.id}
                  </span>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">Duration: {module.duration}</div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {module.id === 1 ? (
                    <>
                      Master the timing and execution of <GlossaryTerm termId="roth_conversion">Roth conversions</GlossaryTerm> over multiple tax years to minimize tax impact. 
                      Learn how to create a comprehensive conversion strategy that accounts for changing <GlossaryTerm termId="tax_bracket">tax brackets</GlossaryTerm>, 
                      retirement plans, and estate considerations.
                    </>
                  ) : module.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-[#1A1F2C] text-[#E5DEFF] text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Tax Limits Section */}
        <Card className="bg-[#1A1F2C] border border-[#8E9196] overflow-hidden mt-6">
          <CardHeader>
            <CardTitle className="text-xl text-[#FFD700]">Current Tax Limits ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">Retirement Accounts</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>IRA Contribution Limit:</span>
                    <DynamicContentText options={contentOptions} className="font-semibold">
                      {`IRA_limit`}
                    </DynamicContentText>
                  </li>
                  <li className="flex justify-between">
                    <span>401(k) Contribution Limit:</span>
                    <DynamicContentText options={contentOptions} className="font-semibold">
                      {`401k_limit`}
                    </DynamicContentText>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Standard Deductions</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Single:</span>
                    <DynamicContentText 
                      options={{...contentOptions, filingStatus: 'single'}} 
                      className="font-semibold"
                    >
                      {`current_standard_deduction`}
                    </DynamicContentText>
                  </li>
                  <li className="flex justify-between">
                    <span>Married Filing Jointly:</span>
                    <DynamicContentText 
                      options={{...contentOptions, filingStatus: 'married'}} 
                      className="font-semibold"
                    >
                      {`current_standard_deduction`}
                    </DynamicContentText>
                  </li>
                  <li className="flex justify-between">
                    <span>Head of Household:</span>
                    <DynamicContentText 
                      options={{...contentOptions, filingStatus: 'head_of_household'}} 
                      className="font-semibold"
                    >
                      {`current_standard_deduction`}
                    </DynamicContentText>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <h3 className="text-2xl font-bold mt-6">Additional Resources (Included)</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {additionalResources.map((resource, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimers */}
        <div className="my-6 p-4 bg-[#1A1F2C] rounded-md border border-[#8E9196]">
          <h4 className="font-medium mb-2">Important Disclaimers</h4>
          <p className="text-sm text-muted-foreground">
            This course offers general education, not personalized tax advice. For specific guidance, 
            consult a licensed professional. Tax laws change frequently and strategies may not be 
            applicable to your specific situation.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Button asChild>
            <Link to="/tax-planning">
              Return to Tax Planning
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#1A1F2C]/50">
            <Link to="/tax-planning/basic-education">
              Review Basic Tax Education
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#1A1F2C]/50">
            <Link to="/tax-planning/glossary">
              View Tax Glossary
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Enrollment Dialog */}
      <EnrollmentDialog 
        open={enrollmentDialogOpen} 
        onOpenChange={setEnrollmentDialogOpen}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        coursePrice={299.00}
        courseTitle="Advanced Tax Strategies & Planning Course"
      />
    </div>
  );
};

export default AdvancedTaxEducationPage;
