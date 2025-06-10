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

export interface DeezerArtist {
  id: string;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: 'artist';
}

// Interface for album lists (e.g., artist's albums)
// Based on the 'album' object within DeezerTrack, but as a root object
export interface DeezerAlbumPreview {
  id: string;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id?: number; // Optional, may not always be present
  fans?: number; // Optional
  release_date?: string; // Optional
  record_type?: string; // e.g., 'album', 'single'
  tracklist: string;
  explicit_lyrics?: boolean; // Optional
  type: 'album';
}

// Response type for lists of albums
export interface DeezerArtistAlbumsResponse {
  data: DeezerAlbumPreview[];
  total: number;
  next?: string;
}

// For album details, we can reuse DeezerAlbumPreview if it's comprehensive enough,
// or define a new DeezerAlbumDetail if more fields are returned by /album/{id} endpoint.
// For now, let's assume /album/{id} returns DeezerAlbumPreview.
// The tracks for an album are expected to be DeezerTrack objects.
export interface DeezerAlbumTracksResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

export interface DeezerArtistListResponse {
  data: DeezerArtist[];
  total?: number; // Optional total, as not all artist list endpoints provide it
  next?: string; // Optional next, for pagination if available
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

  /**
   * Fetches a list of artists for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit The maximum number of artists to fetch (default is 25).
   * @returns A promise that resolves to a list of artists in the specified genre.
   */
  async getArtistsByGenre(genreId: string, limit: number = 25): Promise<DeezerArtistListResponse> {
    const cacheKey = ['deezer', 'genre-artists', genreId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerArtistListResponse>(`/genre/${genreId}/artists`, {
        limit: limit.toString(),
      }),
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });
  }

  /**
   * Fetches the top tracks for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit The maximum number of tracks to fetch (default is 25).
   * @returns A promise that resolves to a list of top tracks in the specified genre.
   */
  async getTopTracksByGenre(genreId: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'genre-top-tracks', genreId, limit];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>(`/genre/${genreId}/tracks`, { limit: limit.toString() }),
      staleTime: 30 * 60 * 1000, // 30 mins
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Fetches a list of radio tracks for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit The maximum number of radio tracks to fetch (default is 25).
   * @returns A promise that resolves to a list of radio tracks for the specified genre.
   */
  async getRadioForGenre(genreId: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'genre-radio', genreId, limit];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>(`/genre/${genreId}/radio`, { limit: limit.toString() }),
      staleTime: 15 * 60 * 1000, // 15 mins
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Fetches a list of radio tracks for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit The maximum number of radio tracks to fetch (default is 25).
   * @returns A promise that resolves to a list of radio tracks for the specified artist.
   */
  async getRadioForArtist(artistId: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'artist-radio', artistId, limit];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>(`/artist/${artistId}/radio`, { limit: limit.toString() }),
      staleTime: 15 * 60 * 1000, // 15 mins
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
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
      artistId: deezerTrack.artist.id,
      album: deezerTrack.album.title,
      albumId: deezerTrack.album.id,
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

  /**
   * Fetches details for a specific artist.
   * @param artistId The ID of the artist.
   * @returns A promise that resolves to the artist's details.
   */
  async getArtistDetails(artistId: string): Promise<DeezerArtist> {
    const cacheKey = ['deezer', 'artist', artistId];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerArtist>(`/artist/${artistId}`),
      staleTime: 60 * 60 * 1000, // 1 hour
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Fetches the top tracks for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit The maximum number of top tracks to fetch (default is 10).
   * @returns A promise that resolves to a list of the artist's top tracks.
   */
  async getArtistTopTracks(artistId: string, limit: number = 10): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'artist-top-tracks', artistId, limit];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>(`/artist/${artistId}/top`, { limit: limit.toString() }),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Fetches albums for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit The maximum number of albums to fetch (default is 20).
   * @returns A promise that resolves to a list of the artist's albums.
   */
  async getArtistAlbums(artistId: string, limit: number = 20): Promise<DeezerArtistAlbumsResponse> {
    const cacheKey = ['deezer', 'artist-albums', artistId, limit];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerArtistAlbumsResponse>(`/artist/${artistId}/albums`, { limit: limit.toString() }),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Fetches tracks for a specific album.
   * @param albumId The ID of the album.
   * @param limit The maximum number of tracks to fetch (default is 50).
   * @returns A promise that resolves to a list of the album's tracks.
   */
  async getAlbumTracks(albumId: string, limit: number = 50): Promise<DeezerAlbumTracksResponse> {
    const cacheKey = ['deezer', 'album-tracks', albumId, limit];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerAlbumTracksResponse>(`/album/${albumId}/tracks`, { limit: limit.toString() }),
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
}

export default DeezerService;