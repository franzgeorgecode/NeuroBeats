import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export const useOnboarding = () => {
  const { user, isLoaded } = useUser();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Check if user has completed onboarding
    const hasCompletedOnboarding = user.publicMetadata?.onboardingCompleted ?? false;
    setShouldShowOnboarding(!hasCompletedOnboarding);
  }, [user, isLoaded]);

  return {
    shouldShowOnboarding,
    isLoading: !isLoaded,
  };
};