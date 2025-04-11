
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('course') || 'Advanced Tax Strategies & Planning Course';
  const courseUrl = searchParams.get('url') || '/tax-planning/advanced-tax-education';

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="bg-[#1A1F2C] border border-[#8E9196] overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-green-900/20 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-white">Enrollment Confirmed</h1>
          <p className="text-[#E5DEFF] mb-6">
            Thank you for enrolling in {courseName}! You now have lifetime access to all course materials.
          </p>
          
          <Separator className="my-6 w-full" />
          
          <p className="text-sm text-[#8E9196] mb-6">
            You can access your course through My Courses section or by clicking the button below.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <Button asChild className="w-full bg-[#9b87f5] hover:bg-[#8a76e4]">
              <Link to={courseUrl}>
                Go to Course <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/my-courses">
                View My Courses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
