
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const SubscriptionBanner = () => {
  const [isInTrial, setIsInTrial] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    checkTrialStatus();
  }, []);
  
  const checkTrialStatus = () => {
    const trialStartDate = localStorage.getItem('trial_start_date');
    const trialEndDate = localStorage.getItem('trial_end_date');
    const isInTrialStorage = localStorage.getItem('is_in_trial');
    
    if (!trialStartDate || !trialEndDate || isInTrialStorage !== 'true') {
      setIsInTrial(false);
      return;
    }
    
    const endDate = new Date(trialEndDate);
    const today = new Date();
    
    if (today > endDate) {
      // Trial has expired
      localStorage.setItem('is_in_trial', 'false');
      setIsInTrial(false);
      
      // Show expired notification if it hasn't been shown before
      if (!localStorage.getItem('trial_expired_notification')) {
        toast.error("Your free trial has expired", {
          description: "Please upgrade to continue enjoying premium features.",
          duration: 0,
          action: {
            label: "Upgrade Now",
            onClick: () => window.location.href = '/pricing'
          }
        });
        localStorage.setItem('trial_expired_notification', 'shown');
      }
      
      return;
    }
    
    // Calculate days left
    const timeDiff = endDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    setDaysLeft(daysRemaining);
    setIsInTrial(true);
    
    // Calculate progress (how much of the 90 days has been used)
    const startDate = new Date(trialStartDate);
    const totalDays = 90;
    const daysUsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const progressPercentage = (daysUsed / totalDays) * 100;
    
    setProgress(progressPercentage);
    
    // Show reminder if less than 7 days left
    if (daysRemaining <= 7 && !localStorage.getItem(`trial_reminder_${daysRemaining}`)) {
      toast.warning(`Only ${daysRemaining} days left in your free trial`, {
        description: "Upgrade now to continue enjoying premium features after your trial ends.",
        duration: 10000,
        action: {
          label: "View Plans",
          onClick: () => window.location.href = '/pricing'
        }
      });
      localStorage.setItem(`trial_reminder_${daysRemaining}`, 'shown');
    }
  };
  
  if (!isInTrial) {
    return null;
  }
  
  return (
    <div className={`mb-6 rounded-lg border p-4 ${daysLeft <= 7 ? 'border-amber-400 bg-amber-500/10' : 'border-[#9b87f5]/30 bg-[#9b87f5]/10'}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {daysLeft <= 7 ? (
            <AlertCircle className="h-5 w-5 text-amber-400" />
          ) : (
            <Calendar className="h-5 w-5 text-[#9b87f5]" />
          )}
          <div>
            <h3 className={`font-medium ${daysLeft <= 7 ? 'text-amber-400' : 'text-[#9b87f5]'}`}>
              Premium Trial: {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Progress value={progress} className="h-2 w-24" />
              <span className="text-xs text-muted-foreground">
                {daysLeft <= 7 ? 'Trial ending soon' : `${Math.floor((90 - daysLeft) / 90 * 100)}% complete`}
              </span>
            </div>
          </div>
        </div>
        <Button 
          variant={daysLeft <= 7 ? "default" : "outline"} 
          size="sm" 
          asChild
          className={daysLeft <= 7 ? "bg-amber-400 hover:bg-amber-500 text-black" : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"}
        >
          <Link to="/pricing">
            {daysLeft <= 7 ? 'Upgrade Now' : 'View Plans'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
