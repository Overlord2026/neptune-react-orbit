
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ExternalEnrollmentButtonProps {
  partnerName: string;
  partnerUrl: string;
  className?: string;
}

const ExternalEnrollmentButton: React.FC<ExternalEnrollmentButtonProps> = ({
  partnerName,
  partnerUrl,
  className
}) => {
  const handleExternalEnrollment = () => {
    // Construct URL with any user parameters if needed
    // This would typically come from auth context in a real application
    const currentUser = {
      name: "Demo User",
      email: "demo@example.com"
    };
    
    const enrollmentUrl = new URL(partnerUrl);
    enrollmentUrl.searchParams.append("user_name", currentUser.name);
    enrollmentUrl.searchParams.append("user_email", currentUser.email);
    
    // Log the enrollment attempt (could be used for analytics)
    console.log(`External enrollment attempt to ${partnerName} for user ${currentUser.email}`);
    
    // Show a toast notification
    toast.info(`Redirecting you to ${partnerName}'s platform...`);
    
    // Redirect to external site
    window.open(enrollmentUrl.toString(), '_blank', 'noopener,noreferrer');
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={handleExternalEnrollment}
            variant="outline" 
            className={`border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 ${className}`}
          >
            Enroll via {partnerName} <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-[#14171F] border border-[#444] text-white">
          <p>You are leaving our site and enrolling through a partner platform. Different pricing or terms may apply.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExternalEnrollmentButton;
