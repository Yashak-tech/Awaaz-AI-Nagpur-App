// Real Mobile & Desktop Voice Recorder Component for Awaaz-AI
// Converts recordings directly to permanent Base64 Data URLs so recordings NEVER get revoked on unmount

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Trash2, Volume2, Sparkles, Check, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onRecordingComplete: (hasRecording: boolean, audioBase64Url?: string, transcript?: string) => void;
  language: string;
}

// Safely get supported audio MIME type across iOS Safari, Android Chrome, and Desktop
function getSupportedAudioMimeType(): string {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg'
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

export function VoiceRecorder({ onRecordingComplete, language }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(15));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentMimeTypeRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start Real Microphone Recording
  const handleStartRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    setTranscript('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Microphone access is not supported or restricted by your browser. Please ensure you are using the HTTPS link.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Live waveform visualizer
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevels = () => {
            analyser.getByteFrequencyData(dataArray);
            const levels = Array.from(dataArray.slice(0, 20)).map((v) =>
              Math.max(15, (v / 255) * 100)
            );
            setAudioLevels(levels);
            animationFrameRef.current = requestAnimationFrame(updateLevels);
          };
          updateLevels();
        } catch (_) {}
      }

      // Initialize MediaRecorder
      const mimeType = getSupportedAudioMimeType();
      currentMimeTypeRef.current = mimeType;
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const detectedType = currentMimeTypeRef.current || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: detectedType });

        // Convert Blob to permanent Base64 Data URL so it survives component unmounting!
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioUrl(base64Audio);
          setHasRecording(true);
          setIsRecording(false);
          onRecordingComplete(true, base64Audio, transcript);
          toast.success('Voice note saved! It will be attached to your report.');
        };
        reader.readAsDataURL(audioBlob);

        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            setTranscript(current);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (_) {}
      }

    } catch (err: any) {
      console.error('[Awaaz-AI] Microphone error:', err);
      const msg = err.name === 'NotAllowedError'
        ? 'Microphone permission denied. Please allow microphone access in your browser.'
        : 'Could not access microphone on this device.';
      setErrorMessage(msg);
      toast.error(msg);
      setIsRecording(false);
    }
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Delete Voice Note
  const handleDeleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setAudioUrl(null);
    setHasRecording(false);
    setIsPlaying(false);
    setTranscript('');
    setRecordingSeconds(0);
    onRecordingComplete(false, undefined, undefined);
    toast.info('Voice note removed');
  };

  // Toggle Playback
  const handleTogglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Audio play error:', e);
          setIsPlaying(false);
        });
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-xl p-4 border border-emerald-200/80 shadow-xs space-y-3">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <MicOff className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Recording State */}
      {isRecording && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Recording Voice Note...
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {formatSeconds(recordingSeconds)}
            </span>
          </div>

          {/* Dynamic Waveform Visualizer */}
          <div className="flex items-center justify-center gap-1 h-12 bg-white/90 rounded-lg p-2 border border-red-200 shadow-inner">
            {audioLevels.map((lvl, idx) => (
              <motion.div
                key={idx}
                className="w-1.5 bg-gradient-to-t from-red-500 to-rose-400 rounded-full"
                animate={{ height: `${lvl}%` }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>

          {transcript && (
            <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200 text-xs text-slate-700 italic">
              "{transcript}"
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            onClick={handleStopRecording}
            className="w-full flex items-center justify-center gap-2 font-bold shadow-md cursor-pointer"
          >
            <MicOff className="w-4 h-4" />
            Stop & Save Voice Note
          </Button>
        </div>
      )}

      {/* Saved Recording State */}
      {!isRecording && hasRecording && audioUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-emerald-900">
                Voice Note Recorded ({formatSeconds(recordingSeconds || 6)})
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Ready to Submit</span>
          </div>

          {/* Quick Audio Preview Bar */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleTogglePlay}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Recording</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Listen to Recording</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeleteRecording}
              className="text-red-600 hover:bg-red-50 border-red-200 cursor-pointer"
              title="Delete Voice Note"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {transcript && (
            <div className="p-2.5 bg-white/90 rounded-lg border border-emerald-200 text-xs text-slate-700">
              <span className="font-semibold text-emerald-800 block mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Live Transcription:
              </span>
              "{transcript}"
            </div>
          )}
        </div>
      )}

      {/* Idle / Unrecorded State */}
      {!isRecording && !hasRecording && (
        <div className="text-center space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleStartRecording}
            className="w-full border-2 border-dashed border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold py-5 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Mic className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>Record Voice Note (Tap to Speak)</span>
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Describe the civic problem in Hindi, Marathi, or English
          </p>
        </div>
      )}
    </div>
  );
}