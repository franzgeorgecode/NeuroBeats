import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useToast } from './useToast';
import { ProfileService } from '../services/profile';

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerkAuth();
  const { showToast } = useToast();
  const {
    user: storeUser,
    isAuthenticated,
    isLoading,
    setUser,
    setAuthenticated,
    setLoading,
    logout: logoutStore,
  } = useAuthStore();

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
      
      if (isSignedIn && user) {
        // Convert Clerk user to our user format
        const appUser = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          username: user.username || user.firstName || 'user',
          avatar_url: user.imageUrl,
          created_at: user.createdAt?.toISOString() || new Date().toISOString(),
          updated_at: user.updatedAt?.toISOString() || new Date().toISOString(),
        };
        
        setUser(appUser);
        setAuthenticated(true);
        
        // Sync with Supabase profile
        syncUserProfile(appUser);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } else {
      setLoading(true);
    }
  }, [isLoaded, isSignedIn, user, setUser, setAuthenticated, setLoading]);

  const syncUserProfile = async (appUser: any) => {
    try {
      // Check if profile exists in Supabase
      const { data: existingProfile } = await ProfileService.getProfile(appUser.id);
      
      if (!existingProfile) {
        // Create profile in Supabase
        await ProfileService.createProfile({
          id: appUser.id,
          email: appUser.email,
          username: appUser.username,
          full_name: user?.fullName || '',
          avatar_url: appUser.avatar_url,
          bio: '',
        });
        
        // Create default preferences
        await ProfileService.createUserPreferences({
          user_id: appUser.id,
          favorite_genres: [],
          selected_songs: [],
          theme_preference: 'dark',
          notification_settings: {
            push: true,
            email: true,
            marketing: false,
          },
          onboarding_completed: false,
        });
      } else {
        // Update existing profile with latest Clerk data
        await ProfileService.updateProfile(appUser.id, {
          email: appUser.email,
          username: appUser.username,
          avatar_url: appUser.avatar_url,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      logoutStore();
      showToast('Signed out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Error signing out', 'error');
    }
  };

  return {
    user: storeUser,
    isAuthenticated,
    isLoading: isLoading || !isLoaded,
    logout,
    // Clerk provides built-in auth methods, so we don't need custom ones
    clerkUser: user,
    isClerkLoaded: isLoaded,
  };
};