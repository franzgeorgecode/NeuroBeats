import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-space font-bold text-white mb-2">
          {mode === 'signin' ? 'Welcome Back' : 'Join NeuroBeats'}
        </h1>
        <p className="text-gray-400 font-inter">
          {mode === 'signin' 
            ? 'Sign in to continue your musical journey' 
            : 'Create your account and discover amazing music'
          }
        </p>
      </motion.div>

      <div className="flex justify-center">
        {mode === 'signin' ? (
          <SignIn 
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#8B5CF6',
                colorBackground: 'rgba(255, 255, 255, 0.05)',
                colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                colorInputText: '#ffffff',
                colorText: '#ffffff',
                colorTextSecondary: '#9CA3AF',
                borderRadius: '12px',
              },
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-transparent shadow-none border-none',
                headerTitle: 'text-white font-space',
                headerSubtitle: 'text-gray-400',
                socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                formButtonPrimary: 'bg-neon-gradient hover:opacity-90 text-white font-medium',
                formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-gray-400',
                footerActionLink: 'text-neon-purple hover:text-neon-blue',
                identityPreviewText: 'text-white',
                formFieldLabel: 'text-gray-300',
              },
            }}
            redirectUrl="/"
            signUpUrl="/auth?mode=signup"
          />
        ) : (
          <SignUp 
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#8B5CF6',
                colorBackground: 'rgba(255, 255, 255, 0.05)',
                colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                colorInputText: '#ffffff',
                colorText: '#ffffff',
                colorTextSecondary: '#9CA3AF',
                borderRadius: '12px',
              },
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-transparent shadow-none border-none',
                headerTitle: 'text-white font-space',
                headerSubtitle: 'text-gray-400',
                socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                formButtonPrimary: 'bg-neon-gradient hover:opacity-90 text-white font-medium',
                formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-gray-400',
                footerActionLink: 'text-neon-purple hover:text-neon-blue',
                identityPreviewText: 'text-white',
                formFieldLabel: 'text-gray-300',
              },
            }}
            redirectUrl="/"
            signInUrl="/auth?mode=signin"
          />
        )}
      </div>

      {/* Toggle Mode */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 font-inter">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <button
          onClick={onToggleMode}
          className="text-neon-purple hover:text-neon-blue transition-colors font-medium font-inter mt-1"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
};