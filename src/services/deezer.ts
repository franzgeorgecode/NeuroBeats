import { QueryClient } from '@tanstack/react-query';

export interface DeezerTrack {
  id: string;
  title: string;
  title_short: string;
  title_version?: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: {
    id: string;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  album: {
    id: string;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    tracklist: string;
    type: string;
  };
  type: string;
}

export interface DeezerPlaylist {
  id: string;
  title: string;
  description: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  md5_image: string;
  picture_type: string;
  user: {
    id: string;
    name: string;
    tracklist: string;
    type: string;
  };
  type: string;
}

export interface DeezerGenre {
  id: string;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
}

export interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

export interface DeezerPlaylistResponse {
  data: DeezerPlaylist[];
  total: number;
}

export interface DeezerGenreResponse {
  data: DeezerGenre[];
}

class DeezerService {
  private baseURL = 'https://deezerdevs-deezer.p.rapidapi.com';
  private apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchSongs(query: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'search', query, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>('/search', {
        q: query,
        limit: limit.toString(),
      }),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  }

  async getTopSongsByGenre(genreId: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'genre', genreId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>(`/genre/${genreId}/artists`, {
        limit: limit.toString(),
      }),
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });
  }

  async getTrendingPlaylists(limit: number = 25): Promise<DeezerPlaylistResponse> {
    const cacheKey = ['deezer', 'trending-playlists', limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerPlaylistResponse>('/chart/0/playlists', {
        limit: limit.toString(),
      }),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    });
  }

  async getSongDetails(songId: string): Promise<DeezerTrack> {
    const cacheKey = ['deezer', 'track', songId];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerTrack>(`/track/${songId}`),
      staleTime: 60 * 60 * 1000, // 1 hour
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  async getGenres(): Promise<DeezerGenreResponse> {
    const cacheKey = ['deezer', 'genres'];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerGenreResponse>('/genre'),
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async getTopTracks(limit: number = 50): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'top-tracks', limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>('/chart/0/tracks', {
        limit: limit.toString(),
      }),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    });
  }

  async getPlaylistTracks(playlistId: string): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'playlist-tracks', playlistId];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>(`/playlist/${playlistId}/tracks`),
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });
  }

  // Convert Deezer track to our internal Track type
  convertToTrack(deezerTrack: DeezerTrack): import('../types').Track {
    return {
      id: deezerTrack.id,
      title: deezerTrack.title,
      artist: deezerTrack.artist.name,
      album: deezerTrack.album.title,
      duration: deezerTrack.duration,
      cover_url: deezerTrack.album.cover_xl || deezerTrack.album.cover_big,
      audio_url: deezerTrack.preview,
      genre: '',
      release_date: '',
      plays_count: deezerTrack.rank,
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
  }
}

export default DeezerService;