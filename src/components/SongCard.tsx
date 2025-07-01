import React from 'react';
import { Play, Plus, MoreVertical } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  isCurrentSong?: boolean;
  isPlaying?: boolean;
}

export default function SongCard({ 
  song, 
  onPlay, 
  onAddToPlaylist, 
  isCurrentSong = false,
  isPlaying = false 
}: SongCardProps) {
  return (
    <div className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 ${
      isCurrentSong ? 'ring-2 ring-purple-500' : ''
    }`}>
      <div className="relative">
        <img 
          src={song.thumbnail} 
          alt={song.title}
          className="w-full aspect-square object-cover rounded-xl mb-4"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
          <button
            onClick={() => onPlay(song)}
            className="p-3 bg-white/90 text-black rounded-full hover:scale-110 transition-transform"
          >
            <Play className="w-6 h-6 ml-0.5" />
          </button>
        </div>
        {isCurrentSong && isPlaying && (
          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white font-semibold line-clamp-2 leading-tight">
          {song.title}
        </h3>
        <p className="text-gray-400 text-sm">{song.artist}</p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-gray-500 text-xs">{song.duration}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAddToPlaylist(song)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}