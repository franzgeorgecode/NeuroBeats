import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { useAuth } from './useAuth';

export const useOnboarding = () => {
  const { preferences, isLoading: preferencesLoading } = useUser();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    if (authLoading || preferencesLoading) return;

    if (isAuthenticated) {
      // Show onboarding if user is authenticated but hasn't completed onboarding
      const hasCompletedOnboarding = preferences?.onboarding_completed ?? false;
      setShouldShowOnboarding(!hasCompletedOnboarding);
    } else {
      setShouldShowOnboarding(false);
    }
  }, [isAuthenticated, preferences, authLoading, preferencesLoading]);

  return {
    shouldShowOnboarding,
    isLoading: authLoading || preferencesLoading,
  };
};