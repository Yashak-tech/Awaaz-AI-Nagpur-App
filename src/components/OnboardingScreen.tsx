import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Languages, Loader } from 'lucide-react';
import { translations, Language } from './translations';

interface District {
  name: string;
  coordinates: { lat: number; lng: number };
}

const maharashtraDistricts: District[] = [
  { name: 'Nagpur', coordinates: { lat: 21.1458, lng: 79.0882 } },
  { name: 'Pune', coordinates: { lat: 18.5204, lng: 73.8567 } },
  { name: 'Mumbai', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { name: 'Thane', coordinates: { lat: 19.2183, lng: 72.9781 } },
  { name: 'Chhatrapati Sambhajinagar', coordinates: { lat: 19.8762, lng: 75.3433 } },
  { name: 'Nashik', coordinates: { lat: 19.9975, lng: 73.7898 } }
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिन्दी (Hindi)' },
  { value: 'marathi', label: 'मराठी (Marathi)' },
  { value: 'bengali', label: 'বাংলা (Bengali)' },
  { value: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)' },
  { value: 'nagpuri', label: 'नागपुरी (Nagpuri)' }
];

interface OnboardingScreenProps {
  onComplete: (district: string, coordinates: { lat: number; lng: number }, language: Language) => void;
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function OnboardingScreen({ onComplete, currentLanguage, onLanguageChange }: OnboardingScreenProps) {
  const [step, setStep] = useState<'language' | 'location'>('language');
  const [locationStep, setLocationStep] = useState<'request' | 'detecting' | 'detected' | 'manual'>('request');
  const [detectedDistrict, setDetectedDistrict] = useState<District | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const t = translations[currentLanguage];

  // Simulate GPS detection for Nagpur
  const simulateGPSDetection = () => {
    setLocationStep('detecting');
    
    // Simulate GPS detection delay and detect Nagpur
    setTimeout(() => {
      const nagpur = maharashtraDistricts.find(d => d.name === 'Nagpur')!;
      setDetectedDistrict(nagpur);
      setLocationStep('detected');
    }, 1500);
  };

  const handleLanguageSelect = (language: string) => {
    onLanguageChange(language as Language);
    setStep('location');
  };

  const handleUseDetectedLocation = () => {
    if (detectedDistrict) {
      onComplete(detectedDistrict.name, detectedDistrict.coordinates, currentLanguage);
    }
  };

  const handleManualDistrictSelect = () => {
    const district = maharashtraDistricts.find(d => d.name === selectedDistrict);
    if (district) {
      onComplete(district.name, district.coordinates, currentLanguage);
    }
  };

  if (step === 'language') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            {/* Tricolor border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600 p-1">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Awaaz-AI Logo" 
                  className="w-14 h-14 object-contain rounded-full"
                />
              </div>
            </div>
          </div>
          <h1 className="text-2xl mb-2 text-primary">Awaaz-AI</h1>
          <p className="text-muted-foreground">
            {translations.english.selectLanguage}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {languageOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentLanguage === option.value ? "default" : "outline"}
              className="w-full justify-start h-auto py-3"
              onClick={() => handleLanguageSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <Button 
          className="mt-8 w-full max-w-sm"
          onClick={() => setStep('location')}
        >
          {translations[currentLanguage].continue}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="relative w-20 h-20 mx-auto mb-4">
          {/* Tricolor border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600 p-1">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <img 
                src="/logo.png" 
                alt="Awaaz-AI Logo" 
                className="w-14 h-14 object-contain rounded-full"
              />
            </div>
          </div>
        </div>
        <h1 className="text-2xl mb-2 text-primary">Awaaz-AI</h1>
        <p className="text-sm text-muted-foreground">
          Digital Civic Reporting Platform
        </p>
      </div>

      {locationStep === 'request' && (
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl mb-2">{t.requestLocation}</h2>
            <p className="text-sm text-muted-foreground">
              {t.allowLocation}
            </p>
          </div>
          
          <Button 
            className="w-full"
            onClick={simulateGPSDetection}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {t.requestLocation}
          </Button>
        </div>
      )}

      {locationStep === 'detecting' && (
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p>{t.detectingLocation}</p>
        </div>
      )}

      {locationStep === 'detected' && detectedDistrict && (
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">{t.locationDetected}</p>
              <p className="text-lg">{detectedDistrict.name}</p>
              <p className="text-sm opacity-75">
                {detectedDistrict.coordinates.lat.toFixed(4)}, {detectedDistrict.coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <p className='text-red-500'>For this prototype, we have used a simulated location detection process. In a real-world application, we would implement actual GPS location detection.</p>
          
          <Button 
            className="w-full"
            onClick={handleUseDetectedLocation}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {t.useThisLocation}
          </Button>
        </div>
      )}

      {/* Language toggle at bottom */}
      <div className="absolute bottom-4 left-4">
        <Select value={currentLanguage} onValueChange={(value: string) => onLanguageChange(value as Language)}>
          <SelectTrigger className="w-auto">
            <Languages className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}