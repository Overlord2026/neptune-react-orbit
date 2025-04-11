
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import GlossaryTerm from '@/components/GlossaryTerm';
import EnrollmentDialog from "@/components/tax-education/EnrollmentDialog";

// Newly created components
import CourseHeader from '@/components/tax-education/CourseHeader';
import YearSelectorBar from '@/components/tax-education/YearSelectorBar';
import CourseOverviewCard from '@/components/tax-education/CourseOverviewCard';
import PartnerCoursesCard from '@/components/tax-education/PartnerCoursesCard';
import CourseModulesSection from '@/components/tax-education/CourseModulesSection';
import TaxLimitsCard from '@/components/tax-education/TaxLimitsCard';
import AdditionalResourcesSection from '@/components/tax-education/AdditionalResourcesSection';
import DisclaimerSection from '@/components/tax-education/DisclaimerSection';

const AdvancedTaxEducationPage = () => {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const availableYears = [2023, 2024, 2025];
  
  const courseTitle = "Advanced Tax Strategies & Planning Course";
  const coursePrice = 299.00;

  const partnerCourses = [
    {
      id: "tax-masters-advanced",
      partnerName: "Tax Masters Academy",
      partnerUrl: "https://taxmastersacademy.com/courses/advanced-tax-planning",
      description: "Comprehensive advanced tax planning course with emphasis on business structures"
    }
  ];

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

  const courseDescription = (
    <>
      Dive deeper into comprehensive tax optimization techniques, including multi-year <GlossaryTerm termId="roth_conversion">Roth planning</GlossaryTerm>, 
      advanced estate strategies, and intricate business tax concepts.
    </>
  );

  return (
    <div className="container content-padding section-margin">
      <CourseHeader 
        title={courseTitle}
        description={courseDescription}
      />
      
      <YearSelectorBar 
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
      />

      <div className="grid gap-6 py-6">
        <CourseOverviewCard 
          isEnrolled={isEnrolled}
          onEnrollClick={() => setEnrollmentDialogOpen(true)}
          coursePrice={coursePrice}
          partnerCourses={partnerCourses}
        />

        <PartnerCoursesCard partnerCourses={partnerCourses} />

        <CourseModulesSection modules={moduleData} />

        <TaxLimitsCard selectedYear={selectedYear} />

        <AdditionalResourcesSection resources={additionalResources} />

        <DisclaimerSection />

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
      
      <EnrollmentDialog 
        open={enrollmentDialogOpen} 
        onOpenChange={setEnrollmentDialogOpen}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        coursePrice={coursePrice}
        courseTitle={courseTitle}
      />
    </div>
  );
};

export default AdvancedTaxEducationPage;
