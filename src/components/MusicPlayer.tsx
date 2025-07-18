import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Repeat, 
  Shuffle,
  Heart,
  Music
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  playlist: Song[];
  currentIndex: number;
}

export default function MusicPlayer({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  playlist,
  currentIndex 
}: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeToggle, setIframeToggle] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Format time in mm:ss format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent) => {
    if (progressRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      setCurrentTime(newTime);
    }
  };

  // Handle volume slider click
  const handleVolumeClick = (e: React.MouseEvent) => {
    if (volumeRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      setVolume(percentage);
    }
  };

  // Simulate time updates (in real app, this would come from audio player)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            if (isRepeat) {
              return 0;
            } else {
              onNext();
              return 0;
            }
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, duration, isRepeat, onNext]);

  // Set duration when song changes
  useEffect(() => {
    if (currentSong) {
      // Parse duration from format like "3:45" to seconds
      const [minutes, seconds] = currentSong.duration.split(':').map(Number);
      setDuration(minutes * 60 + seconds);
      setCurrentTime(0);
    }
  }, [currentSong]);

  // Play/pause YouTube video via postMessage
  useEffect(() => {
    if (!currentSong || !iframeRef.current) return;
    const action = isPlaying ? 'playVideo' : 'pauseVideo';
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: action, args: [] }),
      '*'
    );
  }, [isPlaying, currentSong]);

  // Show/hide iframe based on window width
  useEffect(() => {
    const checkWidth = () => {
      const mobile = window.innerWidth < 800;
      setIsMobile(mobile);
      setShowIframe(mobile ? true : iframeToggle);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [iframeToggle]);

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center space-x-3 text-gray-400">
            <Music className="w-6 h-6" />
            <span>Select a song to start playing</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4"
         style={{ zIndex: 100000 }}>
      {/* Progress Bar */}
      <div 
        ref={progressRef}
        className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-100 group-hover:h-1.5"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img 
            src={currentSong.thumbnail} 
            alt={currentSong.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold truncate">{currentSong.title}</h3>
            <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 mx-8">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-colors ${
              isShuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0 && !isShuffle}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button
            onClick={onPlayPause}
            className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button
            onClick={onNext}
            disabled={currentIndex === playlist.length - 1 && !isShuffle}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <SkipForward className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded-full transition-colors ${
              isRepeat ? 'text-green-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Volume & Time */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="text-gray-400 text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
            
            {showVolumeSlider && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                <div 
                  ref={volumeRef}
                  className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer"
                  onClick={handleVolumeClick}
                >
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Iframe toggle for desktop */}
        {!isMobile && (
          <button
            onClick={() => setIframeToggle(t => !t)}
            className="ml-4 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            {showIframe ? 'Hide Video' : 'Show Video'}
          </button>
        )}
      </div>

      {/* YouTube Iframe for audio playback */}
      {currentSong && showIframe && (
        <iframe
          ref={iframeRef}
          width="320"
          height="180"
          style={{ position: 'fixed', bottom: 100, right: 16, zIndex: 50, border: '2px solid #fff', borderRadius: 12, background: '#000' }}
          src={`https://www.youtube.com/embed/${currentSong.videoId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}`}
          allow="autoplay"
          title="YouTube Audio Player"
        />
      )}
    </div>
  );
}