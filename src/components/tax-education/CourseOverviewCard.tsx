
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ExternalEnrollmentButton from "@/components/tax-education/ExternalEnrollmentButton";

interface CourseOverviewCardProps {
  isEnrolled: boolean;
  onEnrollClick: () => void;
  coursePrice: number;
  partnerCourses: {
    id: string;
    partnerName: string;
    partnerUrl: string;
    description: string;
  }[];
}

const CourseOverviewCard: React.FC<CourseOverviewCardProps> = ({
  isEnrolled,
  onEnrollClick,
  coursePrice,
  partnerCourses
}) => {
  return (
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
              <p className="text-2xl font-bold text-white">${coursePrice.toFixed(2)}</p>
              <p className="text-sm text-[#9b87f5]">One-time payment, lifetime access</p>
            </div>
            <div className="space-x-2">
              {isEnrolled ? (
                <Button className="bg-green-600 hover:bg-green-700">
                  Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    className="bg-[#9b87f5] hover:bg-[#8a76e4]"
                    onClick={onEnrollClick}
                  >
                    Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {partnerCourses.map(course => (
                    <ExternalEnrollmentButton 
                      key={course.id}
                      partnerName={course.partnerName}
                      partnerUrl={course.partnerUrl}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseOverviewCard;
