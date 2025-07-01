// YouTube API configuration
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

// Search YouTube videos
export async function searchYouTubeVideos(query: string): Promise<Song[]> {
  if (!API_KEY) {
    // Return mock data for demo purposes
    return getMockSongs(query);
  }

  try {
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=12&key=${API_KEY}`
    );
    
    if (!searchResponse.ok) {
      throw new Error('Failed to search videos');
    }
    
    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: YouTubeVideo) => item.id.videoId).join(',');
    
    // Get video durations
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error('Failed to get video details');
    }
    
    const detailsData = await detailsResponse.json();
    
    return searchData.items.map((item: YouTubeVideo, index: number) => {
      const duration = detailsData.items[index]?.contentDetails?.duration || 'PT3M30S';
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: formatDuration(duration),
        videoId: item.id.videoId,
      };
    });
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return getMockSongs(query);
  }
}

// Format ISO 8601 duration to MM:SS
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '3:30';
  
  const hours = parseInt(match[1]?.replace('H', '') || '0');
  const minutes = parseInt(match[2]?.replace('M', '') || '0');
  const seconds = parseInt(match[3]?.replace('S', '') || '0');
  
  const totalMinutes = hours * 60 + minutes;
  return `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
}

// Mock data for demo purposes when API key is not available
function getMockSongs(query: string): Song[] {
  const mockSongs: Song[] = [
    {
      id: 'mock-1',
      title: `${query} - Popular Song`,
      artist: 'Featured Artist',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '3:45',
      videoId: 'dQw4w9WgXcQ',
    },
    {
      id: 'mock-2',
      title: `Best of ${query}`,
      artist: 'Various Artists',
      thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '4:12',
      videoId: 'dQw4w9WgXcQ',
    },
    {
      id: 'mock-3',
      title: `${query} Live Performance`,
      artist: 'Live Sessions',
      thumbnail: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '5:28',
      videoId: 'dQw4w9WgXcQ',
    },
    {
      id: 'mock-4',
      title: `${query} Acoustic Version`,
      artist: 'Acoustic Covers',
      thumbnail: 'https://images.pexels.com/photos/1134393/pexels-photo-1134393.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '3:52',
      videoId: 'dQw4w9WgXcQ',
    },
    {
      id: 'mock-5',
      title: `${query} Remix`,
      artist: 'DJ Remix',
      thumbnail: 'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '4:33',
      videoId: 'dQw4w9WgXcQ',
    },
    {
      id: 'mock-6',
      title: `${query} Piano Cover`,
      artist: 'Piano Covers',
      thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '3:18',
      videoId: 'dQw4w9WgXcQ',
    },
  ];

  return mockSongs;
}