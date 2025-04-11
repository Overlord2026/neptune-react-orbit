
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnrollmentSuccess: () => void;
  coursePrice: number;
  courseTitle: string;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  open,
  onOpenChange,
  onEnrollmentSuccess,
  coursePrice,
  courseTitle
}) => {
  const [paymentStep, setPaymentStep] = useState<'confirmation' | 'processing' | 'success' | 'error'>('confirmation');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  
  // Mock function to simulate payment processing
  const processPayment = () => {
    setPaymentStep('processing');
    
    // Simulate payment processing with a timeout
    setTimeout(() => {
      // Randomly succeed or fail for demonstration purposes
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        setPaymentStep('success');
        // Create record in purchases table (would be done via API in a real app)
        console.log("Creating purchase record:", {
          user_id: 'current-user',
          course_id: 'advanced-tax-strategies',
          amount_paid: coursePrice,
          purchase_date: new Date().toISOString()
        });
        
        // Show success message
        toast.success("Payment successful! You're now enrolled in the course.");
        
        // Trigger enrollment success callback after a brief delay
        setTimeout(() => {
          onEnrollmentSuccess();
        }, 2000);
      } else {
        setPaymentStep('error');
        setErrorDialogOpen(true);
      }
    }, 3000);
  };
  
  const resetPaymentFlow = () => {
    setPaymentStep('confirmation');
    setErrorDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{
              paymentStep === 'confirmation' ? 'Enroll in Course' :
              paymentStep === 'processing' ? 'Processing Payment' :
              paymentStep === 'success' ? 'Enrollment Successful!' :
              'Payment Error'
            }</DialogTitle>
            <DialogDescription>
              {paymentStep === 'confirmation' && `Complete your enrollment in ${courseTitle}.`}
            </DialogDescription>
          </DialogHeader>
          
          {paymentStep === 'confirmation' && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5 p-4 border rounded-md bg-[#14171F]">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Course Fee</span>
                  <span>${coursePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${coursePrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                By proceeding, you agree to our terms of service and acknowledge that this is a one-time payment for lifetime access.
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button 
                  onClick={processPayment}
                  className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${coursePrice.toFixed(2)}
                </Button>
              </div>
            </div>
          )}
          
          {paymentStep === 'processing' && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Progress value={75} className="w-full" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Processing your payment. Please don't close this window...
                </p>
              </div>
            </div>
          )}
          
          {paymentStep === 'success' && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">Payment Successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    You now have lifetime access to the Advanced Tax Strategies & Planning Course.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Payment Failed
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your payment could not be processed. This could be due to insufficient funds, network issues, or other reasons. Please try again or contact support.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetPaymentFlow} className="bg-[#9b87f5] hover:bg-[#8a76e4]">
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EnrollmentDialog;
