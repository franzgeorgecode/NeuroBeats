import { useEffect, useState } from 'react';
import { ProfileService } from '../services/profile';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import type { Profile, UserPreferences } from '../types/supabase';

export const useUser = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData();
    } else {
      setProfile(null);
      setPreferences(null);
    }
  }, [isAuthenticated, user?.id]);

  const loadUserData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Load profile and preferences in parallel
      const [profileResult, preferencesResult] = await Promise.all([
        ProfileService.getProfile(user.id),
        ProfileService.getUserPreferences(user.id),
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
      }

      if (preferencesResult.data) {
        setPreferences(preferencesResult.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return { success: false };

    setIsLoading(true);
    const { data, error } = await ProfileService.updateProfile(user.id, updates);

    if (error) {
      showToast(error.message, 'error');
      setIsLoading(false);
      return { success: false, error };
    }

    if (data) {
      setProfile(data);
      showToast('Profile updated successfully', 'success');
    }

    setIsLoading(false);
    return { success: true, data };
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user?.id) return { success: false };

    setIsLoading(true);
    const { data, error } = await ProfileService.updateUserPreferences(user.id, updates);

    if (error) {
      showToast(error.message, 'error');
      setIsLoading(false);
      return { success: false, error };
    }

    if (data) {
      setPreferences(data);
      showToast('Preferences updated successfully', 'success');
    }

    setIsLoading(false);
    return { success: true, data };
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username) return { isAvailable: false };

    const { isAvailable, error } = await ProfileService.checkUsernameAvailability(
      username,
      user?.id
    );

    if (error) {
      showToast(error.message, 'error');
      return { isAvailable: false };
    }

    return { isAvailable };
  };

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return { success: false };

    setIsLoading(true);
    const { data, error } = await ProfileService.uploadAvatar(user.id, file);

    if (error) {
      showToast(error.message, 'error');
      setIsLoading(false);
      return { success: false, error };
    }

    // Reload profile to get updated avatar URL
    await loadUserData();
    showToast('Avatar updated successfully', 'success');
    setIsLoading(false);
    return { success: true, data };
  };

  const addToListeningHistory = async (trackId: string, playDuration = 0, completed = false) => {
    if (!user?.id) return;

    await ProfileService.addToListeningHistory(user.id, trackId, playDuration, completed);
  };

  return {
    profile,
    preferences,
    isLoading,
    updateProfile,
    updatePreferences,
    checkUsernameAvailability,
    uploadAvatar,
    addToListeningHistory,
    refreshUserData: loadUserData,
  };
};