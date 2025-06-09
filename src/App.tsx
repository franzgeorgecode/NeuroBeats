import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Player } from './components/player/Player';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { UserProfile } from './components/auth/UserProfile';
import { useAppStore } from './stores/appStore';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';

const queryClient = new QueryClient();

function AppContent() {
  const { sidebarCollapsed, currentPage } = useAppStore();
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
      case 'search':
        return <div className="pt-24 pb-32 px-6 text-white">Search Page - Coming Soon</div>;
      case 'library':
        return <div className="pt-24 pb-32 px-6 text-white">Library Page - Coming Soon</div>;
      case 'liked':
        return <div className="pt-24 pb-32 px-6 text-white">Liked Songs - Coming Soon</div>;
      case 'trending':
        return <div className="pt-24 pb-32 px-6 text-white">Trending Page - Coming Soon</div>;
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
          </>
        )}
        
        <main className={`transition-all duration-300 ${
          isAuthenticated ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''
        }`}>
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