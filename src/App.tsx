import { useState, useCallback } from 'react';
import { Music, List, Search as SearchIcon } from 'lucide-react';
import MusicPlayer from './components/MusicPlayer';
import SearchBar from './components/SearchBar';
import SongCard from './components/SongCard';
import Playlist from './components/Playlist';
import { searchYouTubeVideos, Song } from './utils/youtube';

type Tab = 'search' | 'playlist';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('search');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Search for songs
  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const results = await searchYouTubeVideos(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Play a song
  const handlePlaySong = useCallback((song: Song, fromPlaylist = false, index?: number) => {
    setCurrentSong(song);
    setIsPlaying(true);
    
    if (fromPlaylist && index !== undefined) {
      setCurrentIndex(index);
    } else {
      // Add to playlist if not already there
      const existingIndex = playlist.findIndex((s: Song) => s.id === song.id);
      if (existingIndex === -1) {
        setPlaylist((prev: Song[]) => [...prev, song]);
        setCurrentIndex(playlist.length);
      } else {
        setCurrentIndex(existingIndex);
      }
    }
  }, [playlist]);

  // Add song to playlist
  const handleAddToPlaylist = useCallback((song: Song) => {
    const exists = playlist.some((s: Song) => s.id === song.id);
    if (!exists) {
      setPlaylist((prev: Song[]) => [...prev, song]);
    }
  }, [playlist]);

  // Remove song from playlist
  const handleRemoveFromPlaylist = useCallback((index: number) => {
    setPlaylist((prev: Song[]) => {
      const newPlaylist = prev.filter((_: Song, i: number) => i !== index);
      
      // Adjust current index if needed
      if (index === currentIndex) {
        setCurrentSong(null);
        setCurrentIndex(-1);
        setIsPlaying(false);
      } else if (index < currentIndex) {
        setCurrentIndex((prev: number) => prev - 1);
      }
      
      return newPlaylist;
    });
  }, [currentIndex]);

  // Play/pause toggle
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev: boolean) => !prev);
  }, []);

  // Next song
  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    
    setCurrentSong(nextSong);
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  }, [playlist, currentIndex]);

  // Previous song
  const handlePrevious = useCallback(() => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];
    
    setCurrentSong(prevSong);
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  }, [playlist, currentIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 pb-32">
        {/* Header */}
        <header className="p-6 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center flex-wrap justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">TuneFlow</h1>
                  <p className="text-gray-400 text-sm">Music Player</p>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1">
                <button
                  onClick={() => setCurrentTab('search')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    currentTab === 'search' 
                      ? 'bg-white text-black' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <SearchIcon className="w-4 h-4" />
                  <span>Search</span>
                </button>
                <button
                  onClick={() => setCurrentTab('playlist')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    currentTab === 'playlist' 
                      ? 'bg-white text-black' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Currently PLaying({playlist.length})</span>
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            {currentTab === 'search' && (
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          {currentTab === 'search' ? (
            <div>
              {searchResults.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Search Results</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onPlay={(song) => handlePlaySong(song)}
                        onAddToPlaylist={handleAddToPlaylist}
                        isCurrentSong={currentSong?.id === song.id}
                        isPlaying={isPlaying}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SearchIcon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Discover Music</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Search for your favorite songs, artists, or albums to start building your perfect playlist
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <Playlist
                playlist={playlist}
                currentSong={currentSong}
                currentIndex={currentIndex}
                onPlaySong={(song, index) => handlePlaySong(song, true, index)}
                onRemoveFromPlaylist={handleRemoveFromPlaylist}
                isPlaying={isPlaying}
              />
            </div>
          )}
        </main>
      </div>

      {/* Music Player */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        playlist={playlist}
        currentIndex={currentIndex}
      />
    </div>
  );
}

export default App;