
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if the user has chosen to permanently skip the onboarding
    const permanentSkip = localStorage.getItem('permanentOnboardingSkip') === 'true';
    
    // Check if the user has seen the onboarding modal before
    const hasSeenOnboarding = localStorage.getItem('seenOnboarding') === 'true';
    
    // Only show onboarding if it hasn't been permanently skipped and hasn't been seen yet
    if (!permanentSkip && !hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem('seenOnboarding', 'true');
    setShowOnboarding(false);
  };
  
  const resetOnboarding = () => {
    localStorage.removeItem('seenOnboarding');
    localStorage.removeItem('permanentOnboardingSkip');
    setShowOnboarding(true);
  };
  
  return {
    showOnboarding,
    completeOnboarding,
    resetOnboarding
  };
};
