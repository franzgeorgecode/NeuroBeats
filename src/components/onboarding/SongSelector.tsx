import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Check, Loader2, Music } from 'lucide-react';
import { useDeezer } from '../../hooks/useDeezer';
import { GlassCard } from '../ui/GlassCard';
import type { SelectedSong } from './OnboardingFlow';

interface SongSelectorProps {
  selectedGenres: string[];
  selectedSongs: SelectedSong[];
  onSongToggle: (song: SelectedSong) => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({
  selectedGenres,
  selectedSongs,
  onSongToggle,
}) => {
  const { useTopTracks, deezerService } = useDeezer();
  const { data: topTracksData, isLoading } = useTopTracks(30);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePreviewPlay = (song: SelectedSong) => {
    if (!audioRef.current) return;

    if (playingPreview === song.id) {
      audioRef.current.pause();
      setPlayingPreview(null);
    } else {
      audioRef.current.src = song.preview_url;
      audioRef.current.play().catch(console.error);
      setPlayingPreview(song.id);
    }
  };

  const handleAudioEnded = () => {
    setPlayingPreview(null);
  };

  const convertDeezerToSelectedSong = (deezerTrack: any): SelectedSong => {
    return {
      id: deezerTrack.id,
      title: deezerTrack.title,
      artist: deezerTrack.artist.name,
      preview_url: deezerTrack.preview,
      cover_url: deezerTrack.album.cover_medium,
      duration: deezerTrack.duration,
    };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-space font-bold text-white mb-4">
            Loading Your Personalized Songs
          </h2>
          <p className="text-xl text-gray-300">
            Finding the perfect tracks based on your genre preferences...
          </p>
        </motion.div>

        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => setPlayingPreview(null)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-space font-bold text-white mb-4">
          Choose Your Favorite Songs
        </h2>
        <p className="text-xl text-gray-300 mb-2">
          Select exactly 5 songs to complete your music profile
        </p>
        <p className="text-lg text-neon-purple font-medium">
          {selectedSongs.length}/5 songs selected
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Hover over a song to preview it for 30 seconds
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {topTracksData?.data?.slice(0, 24).map((track, index) => {
          const song = convertDeezerToSelectedSong(track);
          const isSelected = selectedSongs.some(s => s.id === song.id);
          const isPlaying = playingPreview === song.id;
          const canSelect = selectedSongs.length < 5 || isSelected;
          
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: canSelect ? 1.02 : 1 }}
              whileTap={{ scale: canSelect ? 0.98 : 1 }}
            >
              <GlassCard
                className={`
                  p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group
                  ${isSelected 
                    ? 'ring-2 ring-neon-purple shadow-neon bg-neon-gradient' 
                    : canSelect 
                      ? 'hover:ring-1 hover:ring-white/30' 
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
                onClick={() => canSelect && onSongToggle(song)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center z-10"
                  >
                    <Check className="w-4 h-4 text-neon-purple" />
                  </motion.div>
                )}

                <div className="flex items-center space-x-4">
                  {/* Album Art with Play Button */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl overflow-hidden">
                      {song.cover_url ? (
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Preview Play Button */}
                    <motion.button
                      className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewPlay(song);
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </motion.button>

                    {/* Playing indicator */}
                    {isPlaying && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-white font-inter font-semibold truncate text-sm">
                      {song.title}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                      {song.artist}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatDuration(song.duration)}
                    </p>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Songs Preview */}
      <AnimatePresence>
        {selectedSongs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-8"
          >
            <GlassCard className="p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-space font-bold text-white mb-4">
                Your Selected Songs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                      {song.cover_url ? (
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {song.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {song.artist}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedSongs.length === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="flex items-center justify-center space-x-2 text-neon-green">
            <Check className="w-5 h-5" />
            <span className="font-inter font-medium">Perfect! You're ready to complete your setup</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};