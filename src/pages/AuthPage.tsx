import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Waves, Zap, AlertTriangle } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';
import { ParticleBackground } from '../components/ui/ParticleBackground';
import { AuthService } from '../services/auth';
import { GlassCard } from '../components/ui/GlassCard';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    // Check Supabase configuration on page load
    const config = AuthService.checkConfiguration();
    if (!config.isValid) {
      setConfigError(config.errors.join(', '));
    }
  }, []);

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-dark-600 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink relative"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-8 mx-auto backdrop-blur-sm">
                <Music className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-5xl font-space font-bold mb-6">
                NeuroBeats
              </h1>
              
              <p className="text-xl font-inter mb-12 max-w-md">
                Experience the future of music with AI-powered recommendations and immersive audio visualization
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Waves, text: 'Immersive Audio Experience' },
                  { icon: Zap, text: 'AI-Powered Recommendations' },
                  { icon: Music, text: 'Unlimited Music Library' },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-inter">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Animated Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-float" />
          <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/15 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            {/* Configuration Error Warning */}
            {configError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <GlassCard className="p-4 bg-red-500/20 border-red-500/30">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-red-400 font-semibold mb-1">
                        Configuration Error
                      </h3>
                      <p className="text-red-300 text-sm">
                        {configError}
                      </p>
                      <p className="text-red-300 text-xs mt-2">
                        Please check your environment variables and ensure Supabase is properly configured.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <AuthForm mode={mode} onToggleMode={toggleMode} />
            </div>

            {/* Development Help */}
            {import.meta.env.MODE === 'development' && configError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <GlassCard className="p-4 bg-blue-500/20 border-blue-500/30">
                  <h3 className="text-blue-400 font-semibold mb-2">
                    Development Setup Help
                  </h3>
                  <div className="text-blue-300 text-sm space-y-2">
                    <p>1. Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></p>
                    <p>2. Copy your project URL and anon key from Settings → API</p>
                    <p>3. Update your .env file with the correct values</p>
                    <p>4. Configure OAuth providers in Supabase Dashboard → Authentication → Providers</p>
                    <p>5. Add your domain to the allowed redirect URLs</p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};