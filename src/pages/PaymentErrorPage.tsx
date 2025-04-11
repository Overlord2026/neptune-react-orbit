
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PaymentErrorPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('course') || 'Advanced Tax Strategies & Planning Course';
  const enrollUrl = searchParams.get('enrollUrl') || '/tax-planning/advanced-tax-education';

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="bg-[#1A1F2C] border border-[#8E9196] overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-red-900/20 flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-white">Payment Failed or Canceled</h1>
          <p className="text-[#E5DEFF] mb-6">
            We couldn't complete your payment for {courseName}. Please try again or contact support if you continue to have issues.
          </p>
          
          <Separator className="my-6 w-full" />
          
          <div className="flex flex-col w-full gap-3">
            <Button asChild className="w-full bg-[#9b87f5] hover:bg-[#8a76e4]">
              <Link to={enrollUrl}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Try Again
              </Link>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Need assistance?</h4>
                  <p className="text-sm">
                    Email us at support@taxplanning.com or call (555) 123-4567 during business hours.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please include your email address and the course name in your message.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentErrorPage;
