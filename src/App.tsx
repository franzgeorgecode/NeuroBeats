import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NavigationBar } from './components/layout/NavigationBar';
import { Player } from './components/player/Player';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { SearchBar } from './components/search/SearchBar';
import { SocialShare } from './components/social/SocialShare';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { MobileGestures } from './components/mobile/MobileGestures';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { GenresPage } from './pages/GenresPage';
import { TrendingPage } from './pages/TrendingPage';
import { LibraryPage } from './pages/LibraryPage';
import { AIPlaylistPage } from './pages/AIPlaylistPage';
import { AuthPage } from './pages/AuthPage';
import { UserProfile } from './components/auth/UserProfile';
import { useAppStore } from './stores/appStore';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import { useSettingsStore } from './stores/settingsStore';
import { serviceWorkerManager } from './services/serviceWorker';

const queryClient = new QueryClient();

function AppContent() {
  const { sidebarCollapsed, currentPage, setCurrentPage, theme } = useAppStore();
  const { isAuthenticated } = useAuth();
  const { shouldShowOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { accessibility } = useSettingsStore();
  
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' as 'signin' | 'signup' });
  const [shareModal, setShareModal] = useState({ isOpen: false, track: null, playlist: null });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = accessibility.fontSize === 'small' ? '14px' : 
                         accessibility.fontSize === 'large' ? '18px' : '16px';
    
    // High contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (accessibility.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [accessibility]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
      root.classList.toggle('light', !mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
        root.classList.toggle('light', !e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
    }
  }, [theme]);

  // Initialize service worker
  useEffect(() => {
    serviceWorkerManager.register();
  }, []);

  // Show onboarding if user needs it
  if (isAuthenticated && shouldShowOnboarding && !onboardingLoading) {
    return (
      <div className="min-h-screen bg-dark-600">
        <ParticleBackground />
        <OnboardingFlow />
        <ToastContainer />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'discover':
        return <DiscoverPage />;
      case 'search':
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
            <div className="container mx-auto px-6">
              <div className="mb-8">
                <h1 className="text-4xl font-space font-bold text-white mb-4">
                  Search Music
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Find your favorite songs, artists, and albums
                </p>
                <SearchBar className="max-w-2xl" />
              </div>
            </div>
          </div>
        );
      case 'genres':
        return <GenresPage />;
      case 'trending':
        return <TrendingPage />;
      case 'library':
        return <LibraryPage />;
      case 'ai-playlist':
        return <AIPlaylistPage />;
      case 'liked':
        return <div className="pt-24 pb-32 px-6 text-white">Liked Songs - Coming Soon</div>;
      case 'radio':
        return <div className="pt-24 pb-32 px-6 text-white">Radio Page - Coming Soon</div>;
      case 'profile':
        return <UserProfile />;
      default:
        return <HomePage />;
    }
  };

  return (
    <MobileGestures className="min-h-screen bg-dark-600 text-white font-inter overflow-x-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        {isAuthenticated && (
          <>
            <Sidebar />
            <Header />
            <NavigationBar />
          </>
        )}
        
        <main className={`transition-all duration-300 ${
          isAuthenticated ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''
        } ${isAuthenticated ? 'md:ml-64 md:mr-0' : ''}`}>
          {renderCurrentPage()}
        </main>
        
        {isAuthenticated && <Player />}
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        mode={authModal.mode}
        onToggleMode={() => setAuthModal(prev => ({ 
          ...prev, 
          mode: prev.mode === 'signin' ? 'signup' : 'signin' 
        }))}
      />

      <SocialShare
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, track: null, playlist: null })}
        track={shareModal.track}
        playlist={shareModal.playlist}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <InstallPrompt />
      <ToastContainer />
    </MobileGestures>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/auth" 
            element={
              <ProtectedRoute requireAuth={false}>
                <AuthPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute requireAuth={true}>
                <AppContent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;