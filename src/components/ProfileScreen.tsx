import React, { useState } from 'react';
import { Settings, Globe, Wifi, WifiOff, Plus, User, MapPin, Calendar, Award, TrendingUp, Languages, Clock, Star, Download, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Report, User as UserType } from '../App';
import { translations, Language } from './translations';
import { TechShowcase } from './TechShowcase';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileScreenProps {
  reports: Report[];
  user: UserType;
  onLanguageChange: (language: Language) => void;
  onToggleOnline: () => void;
  onReportAgain: () => void;
}

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिन्दी (Hindi)' },
  { value: 'marathi', label: 'मराठी (Marathi)' },
  { value: 'bengali', label: 'বাংলা (Bengali)' },
  { value: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)' },
  { value: 'nagpuri', label: 'नागपुरी (Nagpuri)' }
];

export function ProfileScreen({ 
  reports, 
  user, 
  onLanguageChange, 
  onToggleOnline,
  onReportAgain 
}: ProfileScreenProps) {
  const t = translations[user.language];

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return t.statusPending;
      case 'acknowledged': return 'Acknowledged';
      case 'submitted': return t.statusInProgress;
      case 'resolved': return t.statusResolved;
      default: return status;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} ${t.minutesAgo}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${t.hoursAgo}`;
    } else {
      return `${diffDays} ${t.daysAgo}`;
    }
  };

  const handleDownloadCertificate = (reportId: string) => {
    // Generate a simple certificate download
    const certificateData = `
      NAGPUR MUNICIPAL CORPORATION (NMC)
      ISSUE RESOLUTION CERTIFICATE
      
      Report ID: ${reportId}
      Issue Status: RESOLVED
      Date: ${new Date().toLocaleDateString()}
      
      This certifies that the reported civic issue has been 
      successfully resolved by Nagpur Municipal Corporation authorities.
      
      Thank you for active citizen participation via Awaaz-AI.
    `;
    
    const blob = new Blob([certificateData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${reportId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleReportAgain = (originalReport: Report) => {
    // This would typically pre-fill the report form with similar details
    onReportAgain();
  };

  // Mock user reports (since we're using hardcoded data)
  const userReports: Report[] = [
    {
      id: '101',
      title: 'Broken streetlight near bus stop',
      description: 'Streetlight has been non-functional for 3 days',
      imageUrl: 'https://i.pinimg.com/736x/c5/30/95/c530952c19fc1c1258fe15a9714562db.jpg?w=400',
      district: user.district,
      ward: 'Zone 2 - Dharampeth (Ward 15)',
      street: 'Ram Nagar Road',
      coordinates: user.coordinates,
      distance: 0.1,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      aiTag: 'Streetlight',
      aiConfidence: 94,
      status: 'submitted',
      upvotes: 15,
      comments: [],
      severity: 6,
      type: 'Streetlight',
      userId: 'current-user',
      hasUserUpvoted: false
    },
    {
      id: '102',
      title: 'Garbage overflow in residential area',
      description: 'Multiple garbage bins overflowing for past week',
      imageUrl: 'https://i.pinimg.com/736x/5c/7c/6b/5c7c6b139ab69341800be13b9ba038cb.jpg?w=400',
      district: user.district,
      ward: 'Zone 1 - Laxmi Nagar (Ward 36)',
      street: 'Pratap Nagar Main Road',
      coordinates: user.coordinates,
      distance: 0.5,
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
      aiTag: 'Garbage',
      aiConfidence: 89,
      status: 'resolved',
      upvotes: 8,
      comments: [],
      severity: 7,
      type: 'Garbage',
      userId: 'current-user',
      hasUserUpvoted: false
    },
    {
      id: '103',
      title: 'Pothole on main road',
      description: 'Large pothole causing traffic issues',
      imageUrl: 'https://i.pinimg.com/736x/d0/3f/c2/d03fc2fe363172d449e218a84b557508.jpg?w=400',
      district: user.district,
      ward: 'Zone 4 - Dhantoli (Ward 17)',
      street: 'Congress Nagar Road',
      coordinates: user.coordinates,
      distance: 0.8,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      aiTag: 'Road Infrastructure',
      aiConfidence: 96,
      status: 'acknowledged',
      upvotes: 23,
      comments: [],
      severity: 8,
      type: 'Road',
      userId: 'current-user',
      hasUserUpvoted: false
    },
    {
      id: '104',
      title: 'Water supply disruption',
      description: 'No water supply for 2 days in the area',
      imageUrl: 'https://i.pinimg.com/736x/5d/d9/86/5dd9865dc83354c74323a381faf3d3e3.jpg?w=400',
      district: user.district,
      ward: 'Zone 3 - Hanuman Nagar (Ward 31)',
      street: 'Sakkardara Main Road',
      coordinates: user.coordinates,
      distance: 1.2,
      timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
      aiTag: 'Water Supply',
      aiConfidence: 92,
      status: 'resolved',
      upvotes: 31,
      comments: [],
      severity: 9,
      type: 'Water',
      userId: 'current-user',
      hasUserUpvoted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="p-4">
          <h1 className="text-xl text-primary">{t.profile}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-medium">Demo User</h2>
              <p className="text-sm text-muted-foreground">📍 {user.district}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-medium">{userReports.length}</p>
              <p className="text-xs text-muted-foreground">Reports</p>
            </div>
            <div>
              <p className="text-lg font-medium">{userReports.reduce((sum, report) => sum + report.upvotes, 0)}</p>
              <p className="text-xs text-muted-foreground">Upvotes</p>
            </div>
            <div>
              <p className="text-lg font-medium">{userReports.filter(r => r.status === 'resolved').length}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="tech">Tech Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            {/* Settings */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t.settings}
              </h3>
              
              <div className="space-y-4">
                {/* Language Selection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{t.language}</span>
                  </div>
                  <Select value={user.language} onValueChange={(value: string) => onLanguageChange(value as Language)}>
                    <SelectTrigger className="w-auto">
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

                <Separator />

                {/* Online/Offline Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {user.isOnline ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {user.isOnline ? t.onlineMode : t.offlineMode} (Select Automatically)
                    </span>
                  </div>
                  <Switch 
                    checked={user.isOnline} 
                    onCheckedChange={onToggleOnline}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 mt-4">
            {/* My Reports */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-medium mb-4">{t.myReports}</h3>
              
              <div className="space-y-3">
                {userReports.map((report) => (
                  <motion.div
                    key={report.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={report.imageUrl}
                          alt={report.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-medium truncate">{report.title}</h4>
                          <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {report.ward} • {formatTimeAgo(report.timestamp)}
                        </p>
                        
                        {report.status === 'submitted' && (
                          <div className="flex items-center gap-1 text-xs text-orange-600 mb-2">
                            <Clock className="w-3 h-3" />
                            {t.slaCountdown}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          {report.status === 'resolved' && (
                            <>
                              {/* Download Certificate Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-2 flex items-center gap-1"
                                onClick={() => handleDownloadCertificate(report.id)}
                              >
                                <Download className="w-3 h-3" />
                                Download Certificate
                              </Button>
                              
                              {/* Report Again Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-2 flex items-center gap-1"
                                onClick={() => handleReportAgain(report)}
                              >
                                <RotateCcw className="w-3 h-3" />
                                Report Again
                              </Button>
                              
                              {/* Rating Section */}
                              <div className="flex items-center gap-1 ml-auto">
                                <span className="text-xs text-muted-foreground">Rate:</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className="w-3 h-3 text-yellow-400 fill-current cursor-pointer hover:text-yellow-500"
                                    />
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          
                          {report.status === 'acknowledged' && (
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                              <Clock className="w-3 h-3" />
                              <span>Issue acknowledged by government</span>
                            </div>
                          )}
                          
                          {report.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-1 px-2"
                              onClick={() => handleReportAgain(report)}
                            >
                              Report Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {userReports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No reports yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={onReportAgain}
                  >
                    {t.report}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tech" className="mt-4">
            <TechShowcase language={user.language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}