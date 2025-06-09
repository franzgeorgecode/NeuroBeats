import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import DeezerService from '../services/deezer';

export const useDeezer = () => {
  const queryClient = useQueryClient();
  const deezerService = new DeezerService(queryClient);

  const useSearchSongs = (query: string, limit: number = 25) => {
    return useQuery({
      queryKey: ['deezer', 'search', query, limit],
      queryFn: () => deezerService.searchSongs(query, limit),
      enabled: !!query && query.length > 2,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useTopTracks = (limit: number = 50) => {
    return useQuery({
      queryKey: ['deezer', 'top-tracks', limit],
      queryFn: () => deezerService.getTopTracks(limit),
      staleTime: 30 * 60 * 1000,
    });
  };

  const useGenres = () => {
    return useQuery({
      queryKey: ['deezer', 'genres'],
      queryFn: () => deezerService.getGenres(),
      staleTime: 24 * 60 * 60 * 1000,
    });
  };

  const useTrendingPlaylists = (limit: number = 25) => {
    return useQuery({
      queryKey: ['deezer', 'trending-playlists', limit],
      queryFn: () => deezerService.getTrendingPlaylists(limit),
      staleTime: 30 * 60 * 1000,
    });
  };

  const useSongDetails = (songId: string) => {
    return useQuery({
      queryKey: ['deezer', 'track', songId],
      queryFn: () => deezerService.getSongDetails(songId),
      enabled: !!songId,
      staleTime: 60 * 60 * 1000,
    });
  };

  const usePlaylistTracks = (playlistId: string) => {
    return useQuery({
      queryKey: ['deezer', 'playlist-tracks', playlistId],
      queryFn: () => deezerService.getPlaylistTracks(playlistId),
      enabled: !!playlistId,
      staleTime: 15 * 60 * 1000,
    });
  };

  return {
    deezerService,
    useSearchSongs,
    useTopTracks,
    useGenres,
    useTrendingPlaylists,
    useSongDetails,
    usePlaylistTracks,
  };
};