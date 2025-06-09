import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { GlassCard } from '../ui/GlassCard';

export const Player: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    setIsPlaying,
    setVolume,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <GlassCard className="p-4">
          {/* Progress Bar */}
          <div className="w-full mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neon-gradient"
                style={{ width: `${(progress / duration) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl flex items-center justify-center overflow-hidden">
                {currentTrack.cover_url ? (
                  <img 
                    src={currentTrack.cover_url} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-2xl">♪</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-inter font-semibold truncate">
                  {currentTrack.title}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <motion.button
                className="p-2 text-gray-400 hover:text-neon-pink transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-6 px-8">
              <motion.button
                className={`p-2 transition-colors ${
                  shuffle ? 'text-neon-green' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleShuffle}
              >
                <Shuffle className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="p-2 text-white hover:text-neon-blue transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={previousTrack}
              >
                <SkipBack className="w-6 h-6" />
              </motion.button>

              <motion.button
                className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon hover:shadow-neon-strong transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </motion.button>

              <motion.button
                className="p-2 text-white hover:text-neon-blue transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTrack}
              >
                <SkipForward className="w-6 h-6" />
              </motion.button>

              <motion.button
                className={`p-2 transition-colors ${
                  repeat !== 'none' ? 'text-neon-green' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleRepeat}
              >
                <Repeat className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <div className="w-24 h-1 bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-neon-gradient"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
              <motion.button
                className="p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontal className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};