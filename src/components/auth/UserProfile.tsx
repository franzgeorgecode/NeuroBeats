import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Camera, 
  Save, 
  X,
  Settings,
  Heart,
  Music,
  Clock
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { profile, preferences, updateProfile, uploadAvatar, isLoading } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
  });

  const handleSave = async () => {
    const result = await updateProfile(editData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-neon-gradient rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-white font-inter">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-neon-gradient p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-dark-300 flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <motion.label
                  className="absolute bottom-0 right-0 w-10 h-10 bg-neon-gradient rounded-full flex items-center justify-center cursor-pointer shadow-neon"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </motion.label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none"
                        placeholder="Username"
                      />
                      <input
                        type="text"
                        value={editData.full_name}
                        onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-4 py-2 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none"
                        placeholder="Full Name"
                      />
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full px-4 py-2 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none resize-none"
                        placeholder="Bio"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <NeonButton variant="primary" size="sm" onClick={handleSave} disabled={isLoading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </NeonButton>
                        <NeonButton variant="ghost" size="sm" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </NeonButton>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                        <h1 className="text-3xl font-space font-bold text-white">
                          {profile.full_name || profile.username}
                        </h1>
                        <motion.button
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit3 className="w-5 h-5" />
                        </motion.button>
                      </div>
                      
                      <p className="text-neon-purple font-inter font-medium mb-2">
                        @{profile.username}
                      </p>
                      
                      {profile.bio && (
                        <p className="text-gray-300 font-inter mb-4">
                          {profile.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {formatDate(profile.created_at)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <NeonButton variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </NeonButton>
                <NeonButton variant="secondary" size="sm" onClick={logout}>
                  Sign Out
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: Music, label: 'Tracks Played', value: '1,234', color: 'from-neon-purple to-neon-blue' },
            { icon: Heart, label: 'Liked Songs', value: '89', color: 'from-neon-pink to-neon-purple' },
            { icon: Clock, label: 'Hours Listened', value: '156', color: 'from-neon-blue to-neon-cyan' },
          ].map((stat, index) => (
            <GlassCard key={stat.label} className="p-6 text-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-space font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 font-inter text-sm">
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Preferences */}
        {preferences && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-space font-bold text-white mb-6">
                Music Preferences
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-inter font-semibold text-white mb-3">
                    Favorite Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.favorite_genres.length > 0 ? (
                      preferences.favorite_genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-neon-gradient rounded-full text-white text-sm font-inter"
                        >
                          {genre}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 font-inter">No favorite genres selected</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-inter font-semibold text-white mb-3">
                    Theme Preference
                  </h3>
                  <span className="px-3 py-1 bg-dark-300 border border-white/10 rounded-full text-white text-sm font-inter">
                    {preferences.theme_preference}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};