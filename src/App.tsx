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
    const initialReports: Report[] = [
      {
        id: '1',
        title: 'Major pothole near Chhatrapati Square',
        description: 'Deep pothole on Wardha Road near Chhatrapati Square causing severe traffic slowdowns and vehicle damage. Water logging during monsoon makes it worse.',
        imageUrl: 'https://www.transpoco.com/hubfs/the_pothole_problem_1%2C000%2C000%20reports%20every%20year%20(one%20every%20two%20minutes).png?w=400',
        media: [
          {
            id: '1-1',
            type: 'image',
            url: 'https://www.transpoco.com/hubfs/the_pothole_problem_1%2C000%2C000%20reports%20every%20year%20(one%20every%20two%20minutes).png?w=400'
          },
          {
            id: '1-2',
            type: 'image',
            url: 'https://i.pinimg.com/736x/bd/b7/e8/bdb7e8ec4259508ce023744b1aeb99fa.jpg?w=400'
          },
          {
            id: '1-3',
            type: 'video',
            url: 'https://example.com/pothole-video.mp4',
            thumbnail: 'https://i.pinimg.com/1200x/9a/f9/0d/9af90dfa7704caa1ea391a9b3f61b24c.jpg?w=400'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 1 - Laxmi Nagar (Ward 36)',
        street: 'Wardha Road',
        coordinates: { lat: 21.1125, lng: 79.0650 },
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
        title: 'Garbage overflow at Sitabuldi Main Market',
        description: 'Multiple municipal garbage containers overflowing at Sitabuldi main street market. Creating health hazard and foul odor.',
        imageUrl: 'https://i.pinimg.com/736x/80/f3/96/80f3960217c48c2f1a8eda45ff5da35b.jpg?w=400',
        media: [
          {
            id: '2-1',
            type: 'image',
            url: 'https://i.pinimg.com/736x/80/f3/96/80f3960217c48c2f1a8eda45ff5da35b.jpg?w=400'
          },
          {
            id: '2-2',
            type: 'image',
            url: 'https://i.pinimg.com/1200x/96/16/38/96163836005bd8560ce0ebd6d3aa3e14.jpg?w=400'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 4 - Dhantoli (Ward 17)',
        street: 'Sitabuldi Main Road',
        coordinates: { lat: 21.1462, lng: 79.0838 },
        distance: 1.2,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        aiTag: 'Waste Management',
        aiConfidence: 91,
        status: 'submitted',
        upvotes: 23,
        comments: [
          { id: '4', text: 'NMC Sanitation department should clear this daily', timestamp: new Date(), author: 'Dr. Anita Devi' },
          { id: '5', text: 'High footfall area needs frequent bin collection', timestamp: new Date(), author: 'Ravi Gupta' }
        ],
        severity: 7,
        type: 'garbage',
        hasUserUpvoted: false,
        priority: 'medium',
        isProactiveSensorAlert: true,
        suggestedDepartment: 'Waste Management Department',
        audioUrl: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3',
        voiceDurationSeconds: 12
      },
      {
        id: '3',
        title: 'Non-functional LED streetlights on Amravati Road',
        description: 'LED street light pole damaged near Law College Square on Amravati Road. Area becomes dark and unsafe after sunset.',
        imageUrl: 'https://i.pinimg.com/1200x/f4/c0/5c/f4c05c75472d231f783af9b203cc2ec0.jpg?w=400&h=300',
        media: [
          {
            id: '3-1',
            type: 'image',
            url: 'https://i.pinimg.com/1200x/f4/c0/5c/f4c05c75472d231f783af9b203cc2ec0.jpg?w=400&h=300'
          },
          {
            id: '2-2',
            type: 'image',
            url: 'https://i.pinimg.com/1200x/90/13/ef/9013ef81025bd58455e717daaaa1934b.jpg?w=400&h=300'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 2 - Dharampeth (Ward 15)',
        street: 'Amravati Road',
        coordinates: { lat: 21.1485, lng: 79.0550 },
        distance: 2.1,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        aiTag: 'Street Lighting',
        aiConfidence: 96,
        status: 'resolved',
        upvotes: 15,
        comments: [
          { id: '6', text: 'Fixed! Thank you NMC Electrical department team', timestamp: new Date(), author: 'Suresh Mahato' }
        ],
        severity: 6,
        type: 'streetlight',
        hasUserUpvoted: false,
        priority: 'low',
        suggestedDepartment: 'Electrical Department',
        resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        satisfactionRating: 4
      },
      {
        id: '4',
        title: 'Water pipeline disruption near Medical Square',
        description: 'Water pipeline leak near GMCH Medical Square area. Residential colonies facing low pressure for 2 days.',
        imageUrl: 'https://i.pinimg.com/1200x/1f/fe/4b/1ffe4b43e9dd07dda46f73aa463883e9.jpg?w=400',
        media: [
          {
            id: '3-1',
            type: 'image',
            url: 'https://i.pinimg.com/1200x/1f/fe/4b/1ffe4b43e9dd07dda46f73aa463883e9.jpg?w=400&h=400'
          },
          {
            id: '2-2',
            type: 'image',
            url: 'https://i.pinimg.com/736x/95/b9/99/95b9990ad03eef2a719e7d2dba1e431a.jpg?w=400&h=400'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 3 - Hanuman Nagar (Ward 31)',
        street: 'Medical College Road',
        coordinates: { lat: 21.1305, lng: 79.0975 },
        distance: 3.2,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        aiTag: 'Water Supply',
        aiConfidence: 89,
        status: 'submitted',
        upvotes: 67,
        comments: [
          { id: '7', text: 'Please urgently restore full water supply!', timestamp: new Date(), author: 'Meera Gupta' },
          { id: '8', text: 'Hospitals and residents nearby are affected', timestamp: new Date(), author: 'Ashok Kumar' },
          { id: '9', text: 'NMC Water Works team is fixing the main valve', timestamp: new Date(), author: 'NMC Official' }
        ],
        severity: 10,
        type: 'water',
        hasUserUpvoted: true,
        priority: 'high',
        suggestedDepartment: 'Water Supply Department'
      },
      {
        id: '5',
        title: 'Drainage overflow at Central Avenue Itwari',
        description: 'Main storm drainage line blocked near Itwari market causing foul water logging on Central Avenue during rain.',
        imageUrl: 'https://i.pinimg.com/1200x/2b/79/8c/2b798c30e78d360375daafa709d68270.jpg?w=400',
        media: [
          {
            id: '3-1',
            type: 'image',
            url: 'https://i.pinimg.com/1200x/2b/79/8c/2b798c30e78d360375daafa709d68270.jpg?w=400'
          },
          {
            id: '2-2',
            type: 'image',
            url: 'https://i.pinimg.com/736x/3b/46/d9/3b46d9f4426d98d5d45e035c53b5836d.jpg?w=400'
          }
        ],
        district: 'Nagpur',
        ward: 'Zone 6 - Gandhibagh (Ward 18)',
        street: 'Central Avenue, Itwari',
        coordinates: { lat: 21.1520, lng: 79.1050 },
        distance: 1.8,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        aiTag: 'Drainage System',
        aiConfidence: 87,
        status: 'pending',
        upvotes: 34,
        comments: [
          { id: '10', text: 'Itwari market shoppers having trouble walking', timestamp: new Date(), author: 'Ravi Tiwari' },
          { id: '11', text: 'NMC desilting machine required urgently', timestamp: new Date(), author: 'Sita Devi' }
        ],
        severity: 8,
        type: 'drainage',
        hasUserUpvoted: false,
        priority: 'high',
        suggestedDepartment: 'Drainage Department'
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