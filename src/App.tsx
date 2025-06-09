import React, { useState } from 'react';
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
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { GenresPage } from './pages/GenresPage';
import { TrendingPage } from './pages/TrendingPage';
import { LibraryPage } from './pages/LibraryPage';
import { AuthPage } from './pages/AuthPage';
import { UserProfile } from './components/auth/UserProfile';
import { useAppStore } from './stores/appStore';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';

const queryClient = new QueryClient();

function AppContent() {
  const { sidebarCollapsed, currentPage, setCurrentPage } = useAppStore();
  const { isAuthenticated } = useAuth();
  const { shouldShowOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' as 'signin' | 'signup' });

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
    <div className="min-h-screen bg-dark-600 text-white font-inter overflow-x-hidden">
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

      <ToastContainer />
    </div>
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