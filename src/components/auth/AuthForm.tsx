import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../services/auth';
import { SocialAuthButtons } from './SocialAuthButtons';
import { NeonButton } from '../ui/NeonButton';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  fullName?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const { signIn, signUp, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!AuthService.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup') {
      const passwordValidation = AuthService.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    // Confirm password validation (signup only)
    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Username validation
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else {
        const usernameValidation = AuthService.validateUsername(formData.username);
        if (!usernameValidation.isValid) {
          newErrors.username = usernameValidation.errors[0];
        }
      }

      // Full name validation
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (mode === 'signin') {
      await signIn({
        email: formData.email,
        password: formData.password,
      });
    } else {
      await signUp({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        fullName: formData.fullName,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Full Name */}
              <motion.div variants={inputVariants} className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-12 pr-4 py-3 bg-dark-300/50 backdrop-blur-sm
                    border rounded-xl text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 transition-all duration-200
                    ${errors.fullName 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-white/10 focus:border-neon-purple focus:ring-neon-purple/50'
                    }
                  `}
                  required
                />
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 ml-1"
                  >
                    {errors.fullName}
                  </motion.p>
                )}
              </motion.div>

              {/* Username */}
              <motion.div variants={inputVariants} className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-12 pr-4 py-3 bg-dark-300/50 backdrop-blur-sm
                    border rounded-xl text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 transition-all duration-200
                    ${errors.username 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-white/10 focus:border-neon-purple focus:ring-neon-purple/50'
                    }
                  `}
                  required
                />
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 ml-1"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <motion.div variants={inputVariants} className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className={`
              w-full pl-12 pr-4 py-3 bg-dark-300/50 backdrop-blur-sm
              border rounded-xl text-white placeholder-gray-400
              focus:outline-none focus:ring-2 transition-all duration-200
              ${errors.email 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-white/10 focus:border-neon-purple focus:ring-neon-purple/50'
              }
            `}
            required
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 ml-1"
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div variants={inputVariants} className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className={`
              w-full pl-12 pr-12 py-3 bg-dark-300/50 backdrop-blur-sm
              border rounded-xl text-white placeholder-gray-400
              focus:outline-none focus:ring-2 transition-all duration-200
              ${errors.password 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-white/10 focus:border-neon-purple focus:ring-neon-purple/50'
              }
            `}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1 ml-1"
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password (signup only) */}
        <AnimatePresence>
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              variants={inputVariants}
              className="relative"
            >
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`
                  w-full pl-12 pr-12 py-3 bg-dark-300/50 backdrop-blur-sm
                  border rounded-xl text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-neon-purple focus:ring-neon-purple/50'
                  }
                `}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1 ml-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <NeonButton
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
            </div>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </NeonButton>
      </form>

      {/* Social Auth */}
      <div className="mt-6">
        <SocialAuthButtons isLoading={isLoading} />
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