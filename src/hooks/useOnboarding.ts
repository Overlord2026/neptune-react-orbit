
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if the user has seen the onboarding modal before
    const hasSeenOnboarding = localStorage.getItem('seenOnboarding') === 'true';
    
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem('seenOnboarding', 'true');
    setShowOnboarding(false);
  };
  
  const resetOnboarding = () => {
    localStorage.removeItem('seenOnboarding');
    setShowOnboarding(true);
  };
  
  return {
    showOnboarding,
    completeOnboarding,
    resetOnboarding
  };
};
