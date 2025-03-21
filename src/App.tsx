import React, { useState, useEffect, useRef } from 'react';
import { Github, Mail, Facebook, Twitter, ExternalLink, Moon, X, Minus, Maximize2, Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import Draggable from 'react-draggable';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const nodeRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  const playlist = [ 
    {
      title: "you broke my heart again",
      artist: "teqkoi",
      duration: "1:43",
      cover: "https://avatar-ex-swe.nixcdn.com/song/2023/03/23/3/e/3/6/1679557519521_640.jpg",
      src: "https://files.catbox.moe/wt0xw7.mp3"
    },
    {
      title: "系ぎて",
      artist: "rintaro soma",
      duration: "2:54",
      cover: "https://silentblue.remywiki.com/images/thumb/f/ff/Tsunagite.png/300px-Tsunagite.png",
      src: "https://files.catbox.moe/om018o.mp3"
    },
    {
      title: "Flower Dance",
      artist: "DJ OKAWARI",
      duration: "4:23",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e3/e2/37/e3e23706-5276-c4ae-b3fc-46a0c708c577/4538182139936_cov.jpg/316x316bb.webp",
      src: "https://files.catbox.moe/fa939p.mp3"
    }
  ];

  useEffect(() => {
    setLoaded(true);
    
    // Create audio element
    audioRef.current = new Audio(playlist[currentTrack].src);
    audioRef.current.volume = volume;
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      nextTrack();
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      }
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update time tracking
    if (isPlaying) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      progressInterval.current = window.setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    // Handle track changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = playlist[currentTrack].src;
      audioRef.current.load();
      setCurrentTime(0);
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    // Handle volume changes
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8 font-sans text-white">
      {/* Music Player Toggle Button */}
      <button 
        onClick={() => setShowMusicPlayer(!showMusicPlayer)}
        className="fixed top-4 right-4 z-50 bg-indigo-600/70 hover:bg-indigo-500/90 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Toggle music player"
      >
        <Music className="w-5 h-5" />
      </button>

      {/* Music Player Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-72 bg-gray-900/80 backdrop-blur-md shadow-2xl z-40 transition-all duration-500 ease-in-out ${
          showMusicPlayer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">my fav song!! all song ctto!</h3>
            <button 
              onClick={() => setShowMusicPlayer(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Track */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
              <img 
                src={playlist[currentTrack].cover} 
                alt={playlist[currentTrack].title} 
                className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`}
              />
            </div>
            <h4 className="text-lg font-semibold text-white">{playlist[currentTrack].title}</h4>
            <p className="text-gray-400">{playlist[currentTrack].artist}</p>
            
            {/* Progress Bar */}
            <div className="mt-3 mb-2">
              <div 
                className="h-2 w-full bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ 
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    transition: isPlaying ? 'none' : 'width 0.2s ease'
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={prevTrack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button 
              onClick={nextTrack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="mb-6">
            <div className="flex items-center">
              <Volume2 className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Playlist */}
          <div className="flex-1 overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Playlist</h4>
            <div className="space-y-2">
              {playlist.map((track, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentTrack(index)}
                  className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                    currentTrack === index ? 'bg-indigo-600/30' : 'hover:bg-gray-800/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-white truncate">{track.title}</h5>
                    <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{formatTime(duration)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Draggable 
        handle=".handle" 
        nodeRef={nodeRef}
        bounds="parent"
        defaultPosition={{x: 0, y: 0}}
        positionOffset={{x: 0, y: 0}}
        scale={1}
      >
        <div 
          ref={nodeRef}
          className={`max-w-4xl w-full bg-gray-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Chrome-like tab - draggable handle */}
          <div className="handle bg-gray-800/70 p-2 flex items-center border-b border-gray-700/50 cursor-grab active:cursor-grabbing shadow-inner">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer">
                <X className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer">
                <Minus className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer">
                <Maximize2 className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-gray-700/50 rounded-full px-4 py-1 text-xs text-gray-300 flex items-center max-w-md w-full shadow-inner">
                <span className="truncate">https://nekos.work</span>
                <Moon className="w-3 h-3 ml-2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left sidebar - Profile */}
              <div 
                className={`bg-gray-800/60 rounded-lg p-5 shadow-lg transition-all duration-500 delay-100 hover:bg-gray-700/70 hover:shadow-indigo-900/30 hover:scale-[1.02] hover:-translate-y-1 ${
                  loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-indigo-600 overflow-hidden border-4 border-indigo-500/30 shadow-lg mb-4 hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images-ext-1.discordapp.net/external/vNu5cw0QK-9dSYp9iyVXcmoFVD6isbXJog7zYtAdZ5U/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/532728033459830813/8d6fa9e4d5208ead8e4c1af5a5ddce2b.png?format=webp&quality=lossless" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Zenith</h2>
                  <div className="px-3 py-1 bg-indigo-600/30 rounded-full text-xs font-medium text-indigo-300 mb-3">
                    Bruh.
                  </div>
                  <p className="text-gray-300 text-sm text-center mb-4">
                    owo what dis.
                  </p>
                  <div className="w-full border-t border-gray-700/50 pt-4 mt-2">
                    <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Status</h3>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <span className="text-green-400 text-sm">Able to work.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle - Bio and Projects */}
              <div 
                className={`md:col-span-2 transition-all duration-700 delay-200 ${
                  loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Bio */}
                <div className="bg-gray-800/60 rounded-lg p-5 shadow-lg mb-6 hover:bg-gray-700/70 hover:shadow-indigo-900/30 hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    about me.
                  </h3>
                  <p className="text-gray-300 mb-3">
                    - Welcome to my website, this is my introduce, 17 y/o. I'm currently working as a freelancer coder.
                  </p>
                  <p className="text-gray-300 mb-3">
                    - Project for group project of group 1 include of after this it will be my about page.
                  </p>
                  <p className="text-gray-300">
                    - The group consist of
                    03. Nguyễn Nhật Minh Ánh
                      04. Đỗ Thị Trúc Đào
                      06. Trần Nguyễn Hương Giang 
                      07. Đặng Diệu Hà
                      08. Trần Khánh Hà 
                      10. Lê Trung Hiếu
                      14. Trần Tuấn Khanh
                      15. Lê Thanh Lan
                      18. Nguyễn Phương Linh
                      32. Nguyễn Thị Thùy Trang
                      39. Phạm Khánh Vân
                  </p>
                </div>

                {/* Current Projects */}
                <div className="bg-gray-800/60 rounded-lg p-5 shadow-lg hover:bg-gray-700/70 hover:shadow-indigo-900/30 hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-bold text-white mb-3">Current Projects</h3>
                  
                  <div className="space-y-4">
                    {/* Project 1 */}
                    <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-600/60 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-indigo-300">Zenith727/UmaLauncher</h4>
                        <a href="https://github.com/Zenith727/UmaLauncher" className="text-gray-400 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Some tools for the Uma Musume game
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-blue-900/30 rounded-full text-xs text-blue-300">Python</span>
                        <span className="px-2 py-1 bg-purple-900/30 rounded-full text-xs text-purple-300">JavaScript</span>
                      </div>
                    </div>

                    {/* Project 2 */}
                    <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-600/60 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-indigo-300">nekos.work</h4>
                        <a href="https://nekos.work" className="text-gray-400 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        This page here
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-blue-900/30 rounded-full text-xs text-blue-300">HTML</span>
                        <span className="px-2 py-1 bg-green-900/30 rounded-full text-xs text-green-300">CSS</span>
                        <span className="px-2 py-1 bg-purple-900/30 rounded-full text-xs text-purple-300">JavaScript</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact section */}
            <div 
              className={`mt-6 bg-gray-800/60 rounded-lg p-5 shadow-lg transition-all duration-500 delay-300 hover:bg-gray-700/70 hover:shadow-indigo-900/30 hover:scale-[1.01] hover:-translate-y-1 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h3 className="text-lg font-bold text-white mb-4">contact if you need!!</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <a 
                  href="https://github.com/Zenith727" 
                  className="flex items-center justify-center gap-2 bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/60 hover:scale-105 transition-all duration-300 group"
                >
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">GitHub</span>
                </a>
                <a 
                  href="https://www.facebook.com/zenith.xanh" 
                  className="flex items-center justify-center gap-2 bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/60 hover:scale-105 transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Facebook</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center gap-2 bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/60 hover:scale-105 transition-all duration-300 group"
                >
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Twitter</span>
                </a>
                <a 
                  href="zenith@nekos.work" 
                  className="flex items-center justify-center gap-2 bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/60 hover:scale-105 transition-all duration-300 group"
                >
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Email</span>
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-xs">
              © {new Date().getFullYear()} Zenith • Built with React & Tailwind CSS. Source by @Kyoukaii_
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default App;