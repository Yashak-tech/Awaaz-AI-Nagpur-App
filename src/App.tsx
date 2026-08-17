import React, { useState, useEffect } from 'react';
import { findDuplicate } from './utils/duplicateDetection';
import { useStreetlightAlerts } from './hooks/useStreetlightAlerts';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { LoadingScreen } from './components/LoadingScreen';
import { PostLocationLoadingScreen } from './components/PostLocationLoadingScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreen } from './components/HomeScreen';
import { ReportScreen } from './components/ReportScreen';
import { LeafletMapScreen } from './components/LeafletMapScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { DigitalTwinScreen } from './components/DigitalTwinScreen';
import { BottomNavigation } from './components/BottomNavigation';
import DesktopMobileNotice from './components/DesktopMobileNotice';
import NMCBackground from './components/NMCBackground';
import { translations, Language } from './components/translations';

export interface Report {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  media?: MediaItem[];
  district: string;
  ward: string;
  street: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  timestamp: Date;
  aiTag: string;
  aiConfidence: number;
  status: 'pending' | 'acknowledged' | 'submitted' | 'repair_scheduled' | 'under_process' | 'resolved';
  upvotes: number;
  comments: Comment[];
  severity: number;
  type: string;
  userId?: string;
  hasUserUpvoted?: boolean;
  isTamperDetected?: boolean;
  priority?: 'high' | 'medium' | 'low';
  isDuplicateMerged?: boolean;
  duplicateCount?: number;
  isProactiveSensorAlert?: boolean;
  suggestedDepartment?: string;
  resolvedAt?: Date;
  satisfactionRating?: number;
  audioUrl?: string;
  voiceDurationSeconds?: number;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: Date;
  author: string;
}

export interface User {
  district: string;
  coordinates: { lat: number; lng: number };
  language: Language;
  isOnline: boolean;
}

export type Screen = 'onboarding' | 'home' | 'report' | 'map' | 'profile' | 'analytics' | 'digital-twin';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPostLocationLoading, setIsPostLocationLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [user, setUser] = useState<User>({
    district: 'Nagpur',
    coordinates: { lat: 21.1458, lng: 79.0882 }, // Nagpur coordinates
    language: 'english',
    isOnline: true
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  // App initialization loading
  useEffect(() => {
    const initializeApp = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000); // 3 second loading screen
    };

    initializeApp();
  }, []);

  // IoT Streetlight Alerts — merge sensor data into reports
  const iotAlerts = useStreetlightAlerts();
  useEffect(() => {
    if (iotAlerts.length === 0) return;
    setReports(prev => {
      // Remove previous IoT-sourced reports, then add fresh ones
      const nonIotReports = prev.filter(r => !r.id.startsWith('iot-'));
      return [...iotAlerts, ...nonIotReports];
    });
  }, [iotAlerts]);

  // Initialize with realistic Nagpur Municipal Corporation reports across 10 administrative zones
  useEffect(() => {
    // Placeholder images from Unsplash for prototype demo purposes. Replace with real citizen-submitted photos once the app captures live reports.
    const initialReports: Report[] = [
      {
        id: '1',
        title: 'Major pothole near Chhatrapati Square',
        description: 'Deep pothole on Wardha Road near Chhatrapati Square causing severe traffic slowdowns and vehicle damage. Water logging during monsoon makes it worse.',
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '1-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: '1-2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 1 - Laxmi Nagar (Ward 36)',
        street: 'Wardha Road',
        coordinates: { lat: 21.1198, lng: 79.0672 },
        distance: 0.3,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        aiTag: 'Road Infrastructure',
        aiConfidence: 94,
        status: 'pending',
        upvotes: 47,
        comments: [
          { id: '1', text: 'This is causing major traffic jams daily during office hours!', timestamp: new Date(), author: 'Rajesh Kumar' },
          { id: '2', text: 'My car tire got damaged here yesterday near Metro station', timestamp: new Date(), author: 'Priya Singh' },
          { id: '3', text: 'NMC team please inspect and fill this pothole', timestamp: new Date(), author: 'Amit Sharma' }
        ],
        severity: 9,
        type: 'road',
        hasUserUpvoted: false,
        priority: 'high',
        isDuplicateMerged: true,
        duplicateCount: 4,
        suggestedDepartment: 'Public Works Department',
        audioUrl: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3',
        voiceDurationSeconds: 8
      },
      {
        id: '2',
        title: 'Deteriorated road section in New Manish Nagar',
        description: 'Rainwater-filled potholes and washed-out asphalt along Manish Nagar stretch creating hazardous commute for two-wheelers.',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '2-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 1 - Laxmi Nagar (Ward 36)',
        street: 'New Manish Nagar Main Road',
        coordinates: { lat: 21.1050, lng: 79.0550 },
        distance: 1.1,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        aiTag: 'Road Infrastructure',
        aiConfidence: 91,
        status: 'acknowledged',
        upvotes: 28,
        comments: [
          { id: '4', text: 'Patchwork needed urgently on this entire section', timestamp: new Date(), author: 'Sanjay Deshmukh' }
        ],
        severity: 6,
        type: 'road',
        hasUserUpvoted: false,
        priority: 'medium',
        suggestedDepartment: 'Public Works Department'
      },
      {
        id: '3',
        title: 'Severe waterlogging on Khamla-Pratap Nagar road',
        description: 'Heavy monsoon downpour causing knee-deep water accumulation on main thoroughfare due to blocked runoff channels.',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '3-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 1 - Laxmi Nagar (Ward 36)',
        street: 'Khamla - Pratap Nagar Main Link',
        coordinates: { lat: 21.1120, lng: 79.0580 },
        distance: 0.8,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        aiTag: 'Water Logging',
        aiConfidence: 93,
        status: 'pending',
        upvotes: 39,
        comments: [
          { id: '5', text: 'Water is entering local shop basements!', timestamp: new Date(), author: 'Vikas Patil' }
        ],
        severity: 8,
        type: 'water',
        hasUserUpvoted: false,
        priority: 'high',
        suggestedDepartment: 'Water Supply Department'
      },
      {
        id: '4',
        title: 'Resurfacing washed away on Mankapur Ring Road',
        description: 'Recent road patch repair gave way after fresh rain, leaving loose gravel and large crater exposing substandard asphalt.',
        imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '4-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 10 - Mangalwari (Ward 2)',
        street: 'Mankapur Ring Road',
        coordinates: { lat: 21.1850, lng: 79.0720 },
        distance: 2.4,
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
        aiTag: 'Road Infrastructure',
        aiConfidence: 89,
        status: 'submitted',
        upvotes: 31,
        comments: [
          { id: '6', text: 'Quality check required on this contractor repair', timestamp: new Date(), author: 'Nitin Gadge' }
        ],
        severity: 8,
        type: 'road',
        hasUserUpvoted: false,
        priority: 'high',
        suggestedDepartment: 'Public Works Department'
      },
      {
        id: '5',
        title: 'Automated IoT Alert: Streetlight Pole #JP-104 Fault',
        description: 'Smart sensor telemetry detected continuous voltage drop and dark cycle on Jaripatka streetlight cluster for over 48 hours.',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '5-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 10 - Mangalwari (Ward 2)',
        street: 'Jaripatka Main Road',
        coordinates: { lat: 21.1890, lng: 79.0910 },
        distance: 2.9,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        aiTag: 'Street Lighting',
        aiConfidence: 98,
        status: 'submitted',
        upvotes: 19,
        comments: [
          { id: '7', text: 'Auto-ticket dispatched to NMC Electrical Division 4', timestamp: new Date(), author: 'Awaaz IoT System' }
        ],
        severity: 7,
        type: 'streetlight',
        hasUserUpvoted: false,
        priority: 'medium',
        isProactiveSensorAlert: true,
        suggestedDepartment: 'Electrical Department'
      },
      {
        id: '6',
        title: 'Non-functional streetlight poles near Mankapur',
        description: 'Three consecutive street light fixtures out of order near Mankapur chowk, leaving intersection in total darkness.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '6-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 10 - Mangalwari (Ward 2)',
        street: 'Mankapur Main Square',
        coordinates: { lat: 21.1780, lng: 79.0650 },
        distance: 2.7,
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
        aiTag: 'Street Lighting',
        aiConfidence: 95,
        status: 'pending',
        upvotes: 14,
        comments: [
          { id: '8', text: 'Very dark stretch, dangerous for pedestrians at night', timestamp: new Date(), author: 'Pooja Raut' }
        ],
        severity: 5,
        type: 'streetlight',
        hasUserUpvoted: false,
        priority: 'low',
        suggestedDepartment: 'Electrical Department'
      },
      {
        id: '7',
        title: 'Water inundation across Sitabuldi Market corridor',
        description: 'Stormwater backflow and Nag river swelling inundating pedestrian market walkways and shops during heavy rainfall.',
        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '7-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 4 - Dhantoli (Ward 17)',
        street: 'Sitabuldi Main Market & Mor Bhawan',
        coordinates: { lat: 21.1466, lng: 79.0788 },
        distance: 1.4,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        aiTag: 'Water Logging',
        aiConfidence: 92,
        status: 'pending',
        upvotes: 52,
        comments: [
          { id: '9', text: 'Customers cannot enter shops due to water buildup', timestamp: new Date(), author: 'Sitabuldi Traders Association' },
          { id: '10', text: 'Pumping machines required near Mor Bhawan', timestamp: new Date(), author: 'Ramesh Chawla' }
        ],
        severity: 8,
        type: 'water',
        hasUserUpvoted: false,
        priority: 'high',
        suggestedDepartment: 'Drainage Department'
      },
      {
        id: '8',
        title: 'Weed choke & silt accumulation in Ambazari drain',
        description: 'Heavy weed growth and untreated sewage blockage near discharge channel restricting flow towards Nag River.',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '8-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 2 - Dharampeth (Ward 15)',
        street: 'Civil Lines / Ambazari Belt',
        coordinates: { lat: 21.1350, lng: 79.0500 },
        distance: 2.0,
        timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
        aiTag: 'Drainage System',
        aiConfidence: 88,
        status: 'acknowledged',
        upvotes: 26,
        comments: [
          { id: '11', text: 'Desilting machine scheduled under flood mitigation project', timestamp: new Date(), author: 'NMC Drainage Team' }
        ],
        severity: 7,
        type: 'drainage',
        hasUserUpvoted: false,
        priority: 'medium',
        suggestedDepartment: 'Drainage Department'
      },
      {
        id: '9',
        title: 'Uncollected waste accumulation at Itwari Market',
        description: 'Missed door-to-door waste collection resulting in massive roadside garbage pile spreading foul smell across Central Avenue.',
        imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '9-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 6 - Gandhibagh (Ward 18)',
        street: 'Itwari Market / Central Avenue',
        coordinates: { lat: 21.1550, lng: 79.1000 },
        distance: 1.8,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        aiTag: 'Waste Management',
        aiConfidence: 95,
        status: 'pending',
        upvotes: 43,
        comments: [
          { id: '12', text: 'Contractor skipped morning rounds for 3 consecutive days', timestamp: new Date(), author: 'Kishore Jaiswal' }
        ],
        severity: 8,
        type: 'garbage',
        hasUserUpvoted: false,
        priority: 'high',
        isDuplicateMerged: true,
        duplicateCount: 6,
        suggestedDepartment: 'Waste Management Department'
      },
      {
        id: '10',
        title: 'Overflowing community bin near Mayo Hospital Circle',
        description: 'Commercial bins overflowing onto pedestrian path near hospital approach road causing serious hygiene concerns.',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '10-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 7 - Sataranjipura (Ward 22)',
        street: 'Mayo Hospital Circle, Maskasath',
        coordinates: { lat: 21.1520, lng: 79.0950 },
        distance: 2.2,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        aiTag: 'Waste Management',
        aiConfidence: 90,
        status: 'submitted',
        upvotes: 22,
        comments: [
          { id: '13', text: 'Hospital visitors complaining about unsanitary conditions', timestamp: new Date(), author: 'Dr. Ansari' }
        ],
        severity: 6,
        type: 'garbage',
        hasUserUpvoted: false,
        priority: 'medium',
        suggestedDepartment: 'Waste Management Department'
      },
      {
        id: '11',
        title: 'Water pipeline leakage near Medical Square GMCH',
        description: 'Underground main distribution line leaking potable water onto roadway, reducing residential colony supply pressure.',
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '11-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 3 - Hanuman Nagar (Ward 31)',
        street: 'Medical College Road near GMCH',
        coordinates: { lat: 21.1305, lng: 79.0975 },
        distance: 3.1,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        aiTag: 'Water Supply',
        aiConfidence: 96,
        status: 'resolved',
        upvotes: 58,
        comments: [
          { id: '14', text: 'NMC valve replacement completed and pipeline pressure restored', timestamp: new Date(), author: 'NMC Official' }
        ],
        severity: 7,
        type: 'water',
        hasUserUpvoted: true,
        priority: 'medium',
        suggestedDepartment: 'Water Supply Department',
        resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        satisfactionRating: 5
      },
      {
        id: '12',
        title: 'Hazardous open stormwater drain near Nandanvan',
        description: 'Concrete slab missing on deep roadside storm drain along Great Nag Road, posing fatal hazard to two-wheelers and pedestrians.',
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '12-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 5 - Nehru Nagar (Ward 28)',
        street: 'Great Nag Road, Nandanvan',
        coordinates: { lat: 21.1380, lng: 79.1180 },
        distance: 3.5,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        aiTag: 'Drainage System',
        aiConfidence: 97,
        status: 'pending',
        upvotes: 61,
        comments: [
          { id: '15', text: 'A two-wheeler almost fell into this open pit yesterday!', timestamp: new Date(), author: 'Mahesh Wankhede' }
        ],
        severity: 9,
        type: 'drainage',
        hasUserUpvoted: false,
        priority: 'high',
        suggestedDepartment: 'Drainage Department'
      },
      {
        id: '13',
        title: 'Vegetable market waste dumped near Kalamna yard',
        description: 'Organic waste and debris left uncleaned on access road blocking trucks and generating foul odor near residential belt.',
        imageUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '13-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 8 - Lakadganj (Ward 24)',
        street: 'Kalamna Market Road, Pardi',
        coordinates: { lat: 21.1580, lng: 79.1350 },
        distance: 4.1,
        timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
        aiTag: 'Waste Management',
        aiConfidence: 91,
        status: 'submitted',
        upvotes: 17,
        comments: [
          { id: '16', text: 'Daily lifting needed for agricultural market waste', timestamp: new Date(), author: 'Shyam Sundar' }
        ],
        severity: 6,
        type: 'garbage',
        hasUserUpvoted: false,
        priority: 'medium',
        suggestedDepartment: 'Waste Management Department'
      },
      {
        id: '14',
        title: 'Continuous dark corridor from Indora to Bezonbagh',
        description: 'Series of non-functional streetlight fixtures leaving busy commercial and transit avenue without lighting after 7 PM.',
        imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80',
        media: [
          {
            id: '14-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 9 - Ashi Nagar (Ward 8)',
        street: 'Indora Chowk, Bezonbagh Belt',
        coordinates: { lat: 21.1720, lng: 79.0920 },
        distance: 3.8,
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
        aiTag: 'Street Lighting',
        aiConfidence: 94,
        status: 'pending',
        upvotes: 25,
        comments: [
          { id: '17', text: 'Please replace faulty choke coils and LED units', timestamp: new Date(), author: 'Rahul Meshram' }
        ],
        severity: 5,
        type: 'streetlight',
        hasUserUpvoted: false,
        priority: 'low',
        suggestedDepartment: 'Electrical Department'
      }
    ];
    setReports(initialReports);

  }, []);

  const handleCompleteOnboarding = (selectedDistrict: string, coords: { lat: number; lng: number }, language: Language) => {
    setUser(prev => ({
      ...prev,
      district: selectedDistrict,
      coordinates: coords,
      language
    }));
    
    // Show post-location loading screen
    setIsPostLocationLoading(true);
    
    // Simulate setup time after location detection
    setTimeout(() => {
      setIsPostLocationLoading(false);
      setHasCompletedOnboarding(true);
      setCurrentScreen('home');
    }, 3000); // 3 second post-location loading
  };

  const handleAddReport = (newReport: Omit<Report, 'id' | 'timestamp' | 'upvotes' | 'comments' | 'distance' | 'hasUserUpvoted'>) => {
    // Check for duplicate reports before creating a new entry
    const duplicate = findDuplicate(
      { coordinates: newReport.coordinates, aiTag: newReport.aiTag },
      reports
    );

    if (duplicate) {
      // Merge into existing report: increment count, mark as merged
      setReports(prev => prev.map(r => {
        if (r.id === duplicate.id) {
          return {
            ...r,
            isDuplicateMerged: true,
            duplicateCount: (r.duplicateCount || 1) + 1
          };
        }
        return r;
      }));
      toast.info(
        `🔄 Duplicate detected — merged with existing report #${duplicate.id.slice(-4)}`,
        {
          description: `Now ${(duplicate.duplicateCount || 1) + 1} reports merged. Higher priority assigned.`,
          duration: 4000,
        }
      );
      setCurrentScreen('home');
      return;
    }

    const report: Report = {
      ...newReport,
      id: Date.now().toString(),
      timestamp: new Date(),
      upvotes: 0,
      comments: [],
      distance: Math.random() * 3, // Simulate distance
      hasUserUpvoted: false
    };

    if (user.isOnline) {
      setReports(prev => [report, ...prev]);
      toast.success(
        `🎉 ${translations[user.language].reportSubmitted} #${report.id.slice(-4)}`,
        {
          description: `Routed to ${getDepartmentName(report.type)} for processing`,
          duration: 4000,
        }
      );
    } else {
      // Simulate offline save
      toast.info(translations[user.language].savedOffline);
      // In a real app, this would be stored in localStorage or IndexedDB
      setTimeout(() => {
        if (user.isOnline) {
          setReports(prev => [report, ...prev]);
          toast.success(translations[user.language].syncComplete);
        }
      }, 3000);
    }

    setCurrentScreen('home');
  };

  const getDepartmentName = (issueType: string) => {
    const departments: Record<string, string> = {
      'road': 'Public Works Department',
      'garbage': 'Waste Management Department',
      'streetlight': 'Electrical Department',
      'water': 'Water Supply Department',
      'drainage': 'Drainage Department'
    };
    return departments[issueType.toLowerCase()] || 'Municipal Corporation';
  };

  const handleUpvote = (reportId: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const hasUpvoted = report.hasUserUpvoted;
        return {
          ...report,
          upvotes: hasUpvoted ? report.upvotes - 1 : report.upvotes + 1,
          hasUserUpvoted: !hasUpvoted
        };
      }
      return report;
    }));
  };

  const handleAddComment = (reportId: string, commentText: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: new Date(),
      author: 'You'
    };

    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const updatedReport = {
          ...report,
          comments: [...report.comments, newComment]
        };
        
        // Update selectedReport if it's the same report being commented on
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updatedReport);
        }
        
        return updatedReport;
      }
      return report;
    }));
  };

  const handleLanguageChange = (language: Language) => {
    setUser(prev => ({ ...prev, language }));
  };

  const handleStatusUpdate = (reportId: string, newStatus: Report['status']) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const updatedReport = {
          ...report,
          status: newStatus,
          ...(newStatus === 'resolved' ? { resolvedAt: new Date() } : {})
        };
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updatedReport);
        }
        return updatedReport;
      }
      return report;
    }));
    toast.success(`Status updated to "${newStatus.replace('_', ' ')}"`, { duration: 3000 });
  };

  const handleRateReport = (reportId: string, rating: number) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const updatedReport = { ...report, satisfactionRating: rating };
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updatedReport);
        }
        return updatedReport;
      }
      return report;
    }));
    toast.success(`Thank you for rating! ${rating}/5 ⭐`, { duration: 3000 });
  };

  const handleToggleAdmin = () => {
    setIsAdminView(prev => !prev);
    toast.info(isAdminView ? 'Switched to Citizen View' : 'Switched to Admin View', { duration: 2000 });
  };

  const t = translations[user.language];

  // Show loading screen first
  if (isLoading) {
    return (
      <>
        <NMCBackground />
        <LoadingScreen />
      </>
    );
  }

  // Show post-location loading screen
  if (isPostLocationLoading) {
    return (
      <>
        <NMCBackground />
        <PostLocationLoadingScreen detectedLocation={user.district} />
      </>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <>
        <NMCBackground />
        <div className="min-h-screen bg-background w-full mx-auto relative mobile-container">
          <OnboardingScreen 
            onComplete={handleCompleteOnboarding}
            currentLanguage={user.language}
            onLanguageChange={handleLanguageChange}
          />
          <Toaster />
        </div>
      </>
    );
  }

  return (
    <>
      <NMCBackground />
      <div className="min-h-screen bg-background w-full mx-auto relative mobile-container">
        <DesktopMobileNotice />
        {currentScreen !== 'map' && (
          // Other screens with bottom padding for navigation
          <div className="pb-20">
            {currentScreen === 'home' && (
              <HomeScreen 
                reports={reports}
                user={user}
                onReportSelect={setSelectedReport}
                onUpvote={handleUpvote}
                onAddComment={handleAddComment}
                selectedReport={selectedReport}
                onCloseModal={() => setSelectedReport(null)}
                onReportAgain={() => setCurrentScreen('report')}
                isAdminView={isAdminView}
                onStatusUpdate={handleStatusUpdate}
                onRateReport={handleRateReport}
              />
            )}
            
            {currentScreen === 'analytics' && (
              <AnalyticsScreen 
                reports={reports}
                user={user}
              />
            )}
            
            {currentScreen === 'report' && (
              <ReportScreen 
                user={user}
                onSubmit={handleAddReport}
                onCancel={() => setCurrentScreen('home')}
              />
            )}
            
            {currentScreen === 'profile' && (
              <ProfileScreen 
                reports={reports.filter(r => r.userId === 'current-user')}
                user={user}
                onLanguageChange={handleLanguageChange}
                onToggleOnline={() => setUser(prev => ({ ...prev, isOnline: !prev.isOnline }))}
                onReportAgain={() => setCurrentScreen('report')}
                isAdminView={isAdminView}
                onToggleAdmin={handleToggleAdmin}
                onRateReport={handleRateReport}
              />
            )}
            
            {currentScreen === 'digital-twin' && (
              <DigitalTwinScreen 
                reports={reports}
                user={user}
              />
            )}
          </div>
        )}
        
        {currentScreen === 'map' && (
          // Map screen handles its own layout
          <LeafletMapScreen 
            reports={reports}
            user={user}
            onReportSelect={setSelectedReport}
            onUpvote={handleUpvote}
          />
        )}

        <BottomNavigation 
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
          language={user.language}
        />
        
        <Toaster />
      </div>
    </>
  );
}