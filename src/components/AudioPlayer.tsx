// High-Reliability Audio Player Component for Awaaz-AI
// Guaranteed playback across iOS Safari, Android Chrome, and Desktop

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Mic, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

interface AudioPlayerProps {
  audioUrl?: string;
  durationSeconds?: number;
  compact?: boolean;
  className?: string;
}

export function AudioPlayer({ audioUrl, durationSeconds = 6, compact = false, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds || 6);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const audio = audioRef.current;
      const updateMeta = () => {
        if (!isNaN(audio.duration) && audio.duration !== Infinity && audio.duration > 0) {
          setDuration(Math.round(audio.duration));
        }
      };
      audio.addEventListener('loadedmetadata', updateMeta);
      audio.addEventListener('durationchange', updateMeta);
      return () => {
        audio.removeEventListener('loadedmetadata', updateMeta);
        audio.removeEventListener('durationchange', updateMeta);
      };
    }
  }, [audioUrl]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('[Awaaz-AI] Audio play error:', err);
          // Try loading first if blob URL state changed
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!audioUrl) {
    return null;
  }

  // Compact Mode (for feed cards)
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-full text-xs shadow-xs ${className}`}>
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPause={() => setIsPlaying(false)}
          preload="auto"
          className="hidden"
        />
        <button
          type="button"
          onClick={handleTogglePlay}
          className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all flex-shrink-0 shadow-sm"
          aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>
        <span className="font-semibold text-xs flex items-center gap-1.5 text-emerald-900">
          <Mic className="w-3.5 h-3.5 text-emerald-600" />
          Voice Note ({isPlaying ? formatTime(currentTime) : formatTime(duration)})
        </span>
      </div>
    );
  }

  // Full Player Mode (for Detail Modal & Profile Portal)
  return (
    <div className={`bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-300 rounded-xl p-4 space-y-3 shadow-md ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        preload="auto"
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 block tracking-tight">Citizen Voice Note</span>
            <span className="text-[11px] font-medium text-emerald-800">Original Recorded Audio</span>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-950 bg-emerald-200/80 px-2.5 py-1 rounded-md border border-emerald-300">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Progress Slider Bar */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 6}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>

      {/* Primary Action Button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs h-10 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Voice Note</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play Citizen Voice Note</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
            setCurrentTime(0);
          }}
          className="h-10 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg shadow-sm flex items-center justify-center transition-all cursor-pointer"
          title="Replay from start"
        >
          <RotateCcw className="w-4 h-4 text-emerald-700" />
        </button>
      </div>

      {/* Native Browser HTML5 Fallback Controls (always accessible on mobile) */}
      <div className="pt-1 border-t border-emerald-200/60">
        <audio
          controls
          src={audioUrl}
          className="w-full h-8 mt-1"
          style={{ filter: 'hue-rotate(90deg)' }}
        />
      </div>
    </div>
  );
}
