import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Clock, Mic, X, Brain, AlertTriangle, Upload, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Report, User } from '../App';
import { translations } from './translations';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { analyzeImage, AIAnalysisResult } from '../utils/aiClassification';
import { VoiceRecorder } from './VoiceRecorder';
import { toast } from 'sonner';

interface ReportScreenProps {
  user: User;
  onSubmit: (report: Omit<Report, 'id' | 'timestamp' | 'upvotes' | 'comments' | 'distance' | 'hasUserUpvoted'>) => void;
  onCancel: () => void;
}

const issueTypes = [
  { value: 'road', aiTag: 'Road Issue' },
  { value: 'garbage', aiTag: 'Garbage' },
  { value: 'water', aiTag: 'Water Issue' },
  { value: 'streetlight', aiTag: 'Streetlight' },
  { value: 'drainage', aiTag: 'Drainage' },
  { value: 'other', aiTag: 'Other' }
];

const sampleCivicPhotos = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', type: 'road' },
  { label: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1609771405106-23d93a049d8b?w=500', type: 'garbage' },
  { label: 'Streetlight', url: 'https://i.pinimg.com/1200x/f4/c0/5c/f4c05c75472d231f783af9b203cc2ec0.jpg?w=500', type: 'streetlight' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500', type: 'water' },
];

export function ReportScreen({ user, onSubmit, onCancel }: ReportScreenProps) {
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [issueType, setIssueType] = useState<string>('');
  const [severity, setSeverity] = useState<number[]>([5]);
  const [description, setDescription] = useState<string>('');
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | undefined>(undefined);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = translations[user.language];

  // Trigger AI analysis when photo and description are available
  useEffect(() => {
    if (capturedPhoto && description.length > 2) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const analysis = analyzeImage(capturedPhoto, description, {
          district: user.district,
          ward: 'Zone 1 - Laxmi Nagar (Ward 36)',
          coordinates: user.coordinates
        });
        setAiAnalysis(analysis);
        setIssueType(analysis.primaryIssue.toLowerCase());
        setSeverity([analysis.severity]);
        setIsAnalyzing(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [capturedPhoto, description, user]);

  // Handle Real Device Photo Upload / Camera Capture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          setCapturedPhoto(base64Url);
          toast.success('Photo loaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleSelectSample = (sampleUrl: string, sampleType: string) => {
    setCapturedPhoto(sampleUrl);
    setIssueType(sampleType);
    toast.info('Sample image loaded for demo testing');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!capturedPhoto || !issueType) {
      toast.error('Please capture a photo and select an issue type.');
      return;
    }

    const selectedIssueType = issueTypes.find(type => type.value === issueType);
    
    const newReport: Omit<Report, 'id' | 'timestamp' | 'upvotes' | 'comments' | 'distance' | 'hasUserUpvoted'> = {
      title: aiAnalysis?.primaryIssue 
        ? `${aiAnalysis.primaryIssue} issue detected` 
        : `${selectedIssueType?.aiTag || 'Civic Issue'} reported`,
      description: description || `${selectedIssueType?.aiTag || 'Civic'} issue reported via Awaaz-AI`,
      imageUrl: capturedPhoto,
      district: user.district,
      ward: 'Zone 1 - Laxmi Nagar (Ward 36)',
      street: 'Wardha Road Corridor',
      coordinates: {
        lat: user.coordinates.lat + (Math.random() - 0.5) * 0.005,
        lng: user.coordinates.lng + (Math.random() - 0.5) * 0.005
      },
      aiTag: aiAnalysis?.primaryIssue || selectedIssueType?.aiTag || 'Civic Issue',
      aiConfidence: aiAnalysis?.confidence || 92,
      status: 'pending' as const,
      severity: aiAnalysis?.severity || severity[0],
      type: issueType,
      userId: 'current-user',
      priority: (aiAnalysis?.priority === 'critical' ? 'high' : aiAnalysis?.priority) || (severity[0] >= 8 ? 'high' : severity[0] >= 5 ? 'medium' : 'low'),
      suggestedDepartment: aiAnalysis?.suggestedDepartment,
      audioUrl: recordedAudioUrl,
      voiceDurationSeconds: hasVoiceNote ? 6 : undefined
    };

    onSubmit(newReport);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN')
    };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden File Input for Real Camera & Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            {t.cancel}
          </Button>
          <h1 className="text-lg font-bold text-primary">{t.report}</h1>
          <div className="w-8"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        {/* Camera / Image Upload Section */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-800">
            {t.capturePhoto} *
          </label>
          <div className="relative">
            {!capturedPhoto ? (
              <div className="space-y-2.5">
                <motion.div
                  className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/80 transition-colors p-4"
                  onClick={handleCameraTrigger}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">{t.capturePhoto}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tap to open camera or browse files from your device
                  </p>
                </motion.div>

                {/* Quick Sample Selector */}
                <div>
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    Or select a sample civic image:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sampleCivicPhotos.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => handleSelectSample(s.url, s.type)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] text-slate-700 font-medium truncate text-center shadow-2xs"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm">
                <ImageWithFallback
                  src={capturedPhoto}
                  alt="Captured photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 px-2.5 bg-white/90 hover:bg-white text-slate-800 text-xs shadow-sm"
                    onClick={handleCameraTrigger}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCapturedPhoto('')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis Section */}
        {(aiAnalysis || isAnalyzing) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2.5">
              <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
              <h3 className="font-semibold text-blue-900 text-sm">Awaaz-AI Vision Engine</h3>
              {isAnalyzing && (
                <span className="text-xs font-medium text-blue-600 ml-auto">Analyzing image...</span>
              )}
            </div>
            
            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-blue-200/70 h-3.5 rounded w-3/4"></div>
                <div className="animate-pulse bg-blue-200/70 h-3 rounded w-1/2"></div>
              </div>
            ) : aiAnalysis && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <Badge 
                    className={
                      aiAnalysis.priority === 'critical' ? 'bg-red-600' :
                      aiAnalysis.priority === 'high' ? 'bg-orange-600' : 'bg-blue-600'
                    }
                  >
                    {aiAnalysis.priority.toUpperCase()} PRIORITY ({aiAnalysis.confidence}% conf)
                  </Badge>
                  <span className="text-slate-600">
                    Est. {aiAnalysis.estimatedResolutionTime}
                  </span>
                </div>
                
                <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100 space-y-1">
                  <p><strong className="text-slate-800">Detected:</strong> {aiAnalysis.primaryIssue}</p>
                  <p><strong className="text-slate-800">Target Dept:</strong> {aiAnalysis.suggestedDepartment}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auto-filled Location & Time */}
        <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 border text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span><strong>Location:</strong> {user.district} ({user.coordinates.lat.toFixed(4)}, {user.coordinates.lng.toFixed(4)})</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span><strong>Timestamp:</strong> {date} {time}</span>
          </div>
        </div>

        {/* Issue Type */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-800">
            {t.issueType} *
          </label>
          <Select value={issueType} onValueChange={setIssueType}>
            <SelectTrigger>
              <SelectValue placeholder={`${t.issueType}...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="road">{t.pothole} / {t.road}</SelectItem>
              <SelectItem value="garbage">{t.garbagePile} / {t.garbage}</SelectItem>
              <SelectItem value="water">{t.waterLogging} / {t.water}</SelectItem>
              <SelectItem value="streetlight">{t.brokenStreetlight} / {t.streetlight}</SelectItem>
              <SelectItem value="drainage">{t.drainageIssue}</SelectItem>
              <SelectItem value="other">{t.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Severity Slider */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-800">
            {t.severity}: <span className="text-primary font-bold">{severity[0]} / 10</span>
          </label>
          <Slider
            value={severity}
            onValueChange={setSeverity}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Minor (1-4)</span>
            <span>Moderate (5-7)</span>
            <span>Critical (8-10)</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-800">
            {t.description}
          </label>
          <Textarea
            placeholder={`${t.description}...`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Voice Note (Real System Mic Recording) */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-800">
            {t.recordVoiceNote} ({t.optional})
          </label>
          <VoiceRecorder 
            onRecordingComplete={(hasRec, audioBlobUrl, voiceTranscript) => {
              setHasVoiceNote(hasRec);
              setRecordedAudioUrl(hasRec ? audioBlobUrl : undefined);
              if (voiceTranscript && voiceTranscript.trim()) {
                setDescription((prev) =>
                  prev ? `${prev} (Voice note: ${voiceTranscript})` : voiceTranscript
                );
              }
            }}
            language={user.language}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full font-bold shadow-md h-11 text-base"
          disabled={!capturedPhoto || !issueType}
        >
          {user.isOnline ? t.submit : `${t.submit} (${t.savedOffline})`}
        </Button>
      </form>
    </div>
  );
}