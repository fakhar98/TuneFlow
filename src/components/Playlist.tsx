import React from 'react';
import { X, Play } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

interface PlaylistProps {
  playlist: Song[];
  currentSong: Song | null;
  currentIndex: number;
  onPlaySong: (song: Song, index: number) => void;
  onRemoveFromPlaylist: (index: number) => void;
  isPlaying: boolean;
}

export default function Playlist({ 
  playlist, 
  currentSong, 
  currentIndex, 
  onPlaySong, 
  onRemoveFromPlaylist,
  isPlaying 
}: PlaylistProps) {
  if (playlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">Your playlist is empty</div>
        <div className="text-gray-500 text-sm">Search and add songs to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-white mb-4">
        Current Playlist ({playlist.length} songs)
      </h2>
      
      {playlist.map((song, index) => (
        <div
          key={`${song.id}-${index}`}
          className={`group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all ${
            currentIndex === index ? 'bg-white/10 border border-purple-500/30' : ''
          }`}
        >
          <div className="relative">
            <img 
              src={song.thumbnail} 
              alt={song.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <button
              onClick={() => onPlaySong(song, index)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
            >
              <Play className="w-4 h-4 text-white ml-0.5" />
            </button>
            {currentIndex === index && isPlaying && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${
              currentIndex === index ? 'text-purple-400' : 'text-white'
            }`}>
              {song.title}
            </h4>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">{song.duration}</span>
            <button
              onClick={() => onRemoveFromPlaylist(index)}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}