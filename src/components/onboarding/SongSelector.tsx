import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Check, Music } from 'lucide-react';
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
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Canciones populares predefinidas para evitar dependencia de API externa
  const popularSongs: SelectedSong[] = [
    {
      id: 'song-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 200,
    },
    {
      id: 'song-2',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 174,
    },
    {
      id: 'song-3',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 178,
    },
    {
      id: 'song-4',
      title: 'Levitating',
      artist: 'Dua Lipa',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 203,
    },
    {
      id: 'song-5',
      title: 'Stay',
      artist: 'The Kid LAROI & Justin Bieber',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 141,
    },
    {
      id: 'song-6',
      title: 'Heat Waves',
      artist: 'Glass Animals',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 238,
    },
    {
      id: 'song-7',
      title: 'As It Was',
      artist: 'Harry Styles',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 167,
    },
    {
      id: 'song-8',
      title: 'Anti-Hero',
      artist: 'Taylor Swift',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 200,
    },
    {
      id: 'song-9',
      title: 'Flowers',
      artist: 'Miley Cyrus',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 200,
    },
    {
      id: 'song-10',
      title: 'Unholy',
      artist: 'Sam Smith ft. Kim Petras',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 156,
    },
    {
      id: 'song-11',
      title: 'Bad Habit',
      artist: 'Steve Lacy',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 221,
    },
    {
      id: 'song-12',
      title: 'About Damn Time',
      artist: 'Lizzo',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 193,
    },
    {
      id: 'song-13',
      title: 'Running Up That Hill',
      artist: 'Kate Bush',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 300,
    },
    {
      id: 'song-14',
      title: 'Shivers',
      artist: 'Ed Sheeran',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 207,
    },
    {
      id: 'song-15',
      title: 'Industry Baby',
      artist: 'Lil Nas X & Jack Harlow',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 212,
    },
    {
      id: 'song-16',
      title: 'Ghost',
      artist: 'Justice',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 189,
    },
    {
      id: 'song-17',
      title: 'Peaches',
      artist: 'Justin Bieber ft. Daniel Caesar & Giveon',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 198,
    },
    {
      id: 'song-18',
      title: 'Deja Vu',
      artist: 'Olivia Rodrigo',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 215,
    },
    {
      id: 'song-19',
      title: 'Montero (Call Me By Your Name)',
      artist: 'Lil Nas X',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 137,
    },
    {
      id: 'song-20',
      title: 'Positions',
      artist: 'Ariana Grande',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 172,
    },
    {
      id: 'song-21',
      title: 'Drivers License',
      artist: 'Olivia Rodrigo',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 242,
    },
    {
      id: 'song-22',
      title: 'Mood',
      artist: '24kGoldn ft. iann dior',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 140,
    },
    {
      id: 'song-23',
      title: 'Dynamite',
      artist: 'BTS',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 199,
    },
    {
      id: 'song-24',
      title: 'Savage',
      artist: 'Megan Thee Stallion',
      preview_url: '',
      cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 184,
    }
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
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
          Click on songs to add them to your profile
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {popularSongs.map((song, index) => {
          const isSelected = selectedSongs.some(s => s.id === song.id);
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
                  {/* Album Art */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl overflow-hidden">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>';
                        }}
                      />
                    </div>
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
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>';
                        }}
                      />
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