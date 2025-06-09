import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Guitar, 
  Mic, 
  Headphones, 
  Piano, 
  Drum,
  Radio,
  Heart,
  Zap,
  Star,
  Volume2,
  Disc,
  Waves,
  Sparkles,
  Crown,
  Grid3X3,
  List,
  ArrowLeft
} from 'lucide-react';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';

const GENRES = [
  { 
    id: '132', 
    name: 'Pop', 
    icon: Star, 
    color: 'from-pink-500 to-rose-500', 
    description: 'Catchy melodies and mainstream hits',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'
  },
  { 
    id: '152', 
    name: 'Rock', 
    icon: Guitar, 
    color: 'from-red-500 to-orange-500', 
    description: 'Electric guitars and powerful vocals',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'
  },
  { 
    id: '116', 
    name: 'Rap/Hip Hop', 
    icon: Mic, 
    color: 'from-purple-500 to-indigo-500', 
    description: 'Rhythmic beats and rap vocals',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'
  },
  { 
    id: '113', 
    name: 'Dance', 
    icon: Zap, 
    color: 'from-cyan-500 to-blue-500', 
    description: 'Electronic beats and dance rhythms',
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'
  },
  { 
    id: '98', 
    name: 'Alternative', 
    icon: Sparkles, 
    color: 'from-violet-500 to-purple-500', 
    description: 'Independent and alternative sounds',
    image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg'
  },
  { 
    id: '165', 
    name: 'R&B', 
    icon: Heart, 
    color: 'from-rose-500 to-pink-500', 
    description: 'Soulful vocals and smooth grooves',
    image: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg'
  },
  { 
    id: '106', 
    name: 'Electro', 
    icon: Radio, 
    color: 'from-blue-500 to-cyan-500', 
    description: 'Electronic music and synthesizers',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'
  },
  { 
    id: '144', 
    name: 'Reggae', 
    icon: Waves, 
    color: 'from-green-500 to-lime-500', 
    description: 'Laid-back Caribbean vibes',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg'
  },
  { 
    id: '129', 
    name: 'Jazz', 
    icon: Piano, 
    color: 'from-amber-500 to-yellow-500', 
    description: 'Improvisation and smooth rhythms',
    image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg'
  },
  { 
    id: '464', 
    name: 'Metal', 
    icon: Volume2, 
    color: 'from-gray-500 to-slate-500', 
    description: 'Heavy guitars and intense energy',
    image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg'
  },
  { 
    id: '2', 
    name: 'Country', 
    icon: Crown, 
    color: 'from-orange-500 to-red-500', 
    description: 'Storytelling and acoustic guitars',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg'
  },
  { 
    id: '85', 
    name: 'Blues', 
    icon: Disc, 
    color: 'from-blue-500 to-indigo-500', 
    description: 'Emotional expression and guitar solos',
    image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg'
  },
];

export const GenresPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<typeof GENRES[0] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { useSearchSongs, deezerService } = useDeezer();
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();

  // Search for top tracks in selected genre
  const genreQuery = selectedGenre ? `genre:"${selectedGenre.name}"` : '';
  const { data: genreTracks, isLoading } = useSearchSongs(genreQuery, 15);

  const handlePlayTrack = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      setCurrentTrack(track);
      setIsPlaying(true);
      showToast(`Now playing: ${track.title}`, 'success');
    } catch (error) {
      showToast('Error playing track', 'error');
    }
  };

  const handleAddToQueue = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      addToQueue(track);
      showToast(`Added "${track.title}" to queue`, 'success');
    } catch (error) {
      showToast('Error adding to queue', 'error');
    }
  };

  if (selectedGenre) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
        <div className="container mx-auto px-6">
          {/* Genre Header */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenre(null)}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Genres
              </NeonButton>
            </div>

            <GlassCard className={`p-8 bg-gradient-to-r ${selectedGenre.color} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20">
                <img
                  src={selectedGenre.image}
                  alt={selectedGenre.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                      <selectedGenre.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-space font-bold text-white">
                        {selectedGenre.name}
                      </h1>
                      <p className="text-xl text-white/80">
                        {selectedGenre.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.section>

          {/* Genre Tracks */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-space font-bold text-white">
                Top {selectedGenre.name} Tracks
              </h2>
              <span className="text-gray-400">
                {genreTracks?.data?.length || 0} tracks
              </span>
            </div>

            {isLoading ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6' 
                : 'space-y-2'
              }>
                <LoadingSkeleton 
                  variant={viewMode === 'grid' ? 'song' : 'list-song'} 
                  count={viewMode === 'grid' ? 10 : 15} 
                />
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6' 
                : 'space-y-2'
              }>
                {genreTracks?.data?.map((track, index) => (
                  <SongCard
                    key={track.id}
                    song={{
                      id: track.id,
                      title: track.title,
                      artist: track.artist.name,
                      album: track.album?.title,
                      duration: track.duration,
                      cover_url: track.album?.cover_xl,
                      audio_url: track.preview,
                      plays_count: track.rank,
                    }}
                    variant={viewMode === 'grid' ? 'default' : 'list'}
                    index={index}
                    showIndex={viewMode === 'list'}
                    onPlay={() => handlePlayTrack(track)}
                    onAddToQueue={() => handleAddToQueue(track)}
                  />
                ))}
              </div>
            )}

            {!isLoading && (!genreTracks?.data || genreTracks.data.length === 0) && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No tracks found
                </h3>
                <p className="text-gray-400">
                  Try exploring other genres or check back later
                </p>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 bg-neon-gradient">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-space font-bold text-white mb-4">
                  Explore Genres
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  Discover music across different genres and styles
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <Music className="w-5 h-5" />
                    <span className="font-inter">{GENRES.length} Genres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-5 h-5" />
                    <span className="font-inter">High Quality</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-inter">Curated</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Genres Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {GENRES.map((genre, index) => {
              const Icon = genre.icon;
              
              return (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlassCard
                    className="p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group"
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <img
                        src={genre.image}
                        alt={genre.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-r ${genre.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-space font-bold text-white mb-2 text-center">
                        {genre.name}
                      </h3>
                      
                      <p className="text-white/80 text-sm text-center leading-relaxed">
                        {genre.description}
                      </p>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
};