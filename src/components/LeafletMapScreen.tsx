import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowUp, Eye, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Report, User } from '../App';
import { translations } from './translations';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getDistrictCenter, generateRandomCoordinates } from '../utils/mapConfig';
import { getSeverityColor } from '../utils/severityColors';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapScreenProps {
  reports: Report[];
  user: User;
  onReportSelect: (report: Report) => void;
  onUpvote: (reportId: string) => void;
}

type FilterType = 'all' | 'road' | 'garbage' | 'water' | 'streetlight' | 'unresolved';

export function LeafletMapScreen({ reports, user, onReportSelect, onUpvote }: LeafletMapScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedPin, setSelectedPin] = useState<Report | null>(null);
  const [reportCoordinates, setReportCoordinates] = useState<Map<string, [number, number]>>(new Map());
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const t = translations[user.language];

  const filterOptions: { value: FilterType; label: string; color: string }[] = [
    { value: 'all', label: t.allReports, color: 'bg-gray-500' },
    { value: 'road', label: t.road, color: 'bg-red-500' },
    { value: 'garbage', label: t.garbage, color: 'bg-orange-500' },
    { value: 'water', label: t.water, color: 'bg-blue-500' },
    { value: 'streetlight', label: t.streetlight, color: 'bg-yellow-500' },
    { value: 'unresolved', label: t.unresolved, color: 'bg-red-600' }
  ];

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return '#ef4444';
      case 'submitted': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return t.statusPending;
      case 'submitted': return t.statusInProgress;
      case 'resolved': return t.statusResolved;
      default: return status;
    }
  };

  const filteredReports = reports
    .filter(report => report.district === user.district)
    .filter(report => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'unresolved') return report.status !== 'resolved';
      return report.type.toLowerCase() === selectedFilter;
    });

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

  // Generate stable coordinates for reports (only when reports change, not on filter)
  useEffect(() => {
    const districtCenter = getDistrictCenter(user.district);
    const newCoordinates = new Map<string, [number, number]>();
    
    // Generate coordinates for all reports in the district
    const districtReports = reports.filter(report => report.district === user.district);
    const coordinates = generateRandomCoordinates(districtCenter, districtReports.length, 5);
    
    districtReports.forEach((report, index) => {
      if (!reportCoordinates.has(report.id)) {
        newCoordinates.set(report.id, coordinates[index] || districtCenter);
      } else {
        newCoordinates.set(report.id, reportCoordinates.get(report.id)!);
      }
    });
    
    setReportCoordinates(newCoordinates);
  }, [reports, user.district]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Get district center coordinates
    const districtCenter = getDistrictCenter(user.district);
    
    // Initialize map with proper options
    leafletMapRef.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true
    }).setView([districtCenter[1], districtCenter[0]], 12);

    // Ensure zoom control is positioned correctly
    leafletMapRef.current.zoomControl.setPosition('topright');

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | Fallback Map'
    }).addTo(leafletMapRef.current);

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [user.district]);

  // Update markers when reports change
  useEffect(() => {
    if (!leafletMapRef.current || reportCoordinates.size === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      leafletMapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers for filtered reports
    filteredReports.forEach((report) => {
      const coordinates = reportCoordinates.get(report.id);
      if (!coordinates) return;
      
      // Create custom icon based on severity
      const severityColor = getSeverityColor(report.severity);
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${severityColor.hex};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease;
            position: relative;
          ">
            📍
            ${report.severity >= 8 ? `
              <div style="
                position: absolute;
                top: -3px;
                right: -3px;
                width: 12px;
                height: 12px;
                background: #dc2626;
                border-radius: 50%;
                border: 2px solid white;
                animation: pulse 2s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon })
        .addTo(leafletMapRef.current!);

      // Add popup
      const popupContent = `
        <div style="min-width: 250px; max-width: 300px;">
          <div style="display: flex; align-items: center; justify-between; margin-bottom: 8px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">${report.title}</h3>
            <span style="font-size: 12px; color: #6b7280;">${formatTimeAgo(report.timestamp)}</span>
          </div>
          
          <p style="margin: 8px 0; font-size: 13px; color: #4b5563;">${report.ward} • ${report.street}</p>
          <p style="margin: 8px 0; font-size: 14px; color: #1f2937; line-height: 1.4;">${report.description}</p>
          
          <div style="margin: 12px 0; display: flex; align-items: center; gap: 8px;">
            <span style="
              background: ${getStatusColor(report.status)};
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            ">
              ${getStatusText(report.status)}
            </span>
            <span style="
              background: #f3f4f6;
              color: #374151;
              padding: 4px 8px;
              border-radius: 8px;
              font-size: 11px;
            ">
              ${report.aiTag} - ${report.aiConfidence}%
            </span>
          </div>
          
          <button 
            onclick="window.selectReportFromMap('${report.id}')" 
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12px;
              font-weight: 500;
              margin-top: 8px;
              transition: background-color 0.2s ease;
            "
            onmouseover="this.style.backgroundColor='#2563eb'"
            onmouseout="this.style.backgroundColor='#3b82f6'"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });
      
      // Add click handler for both marker and popup
      marker.on('click', (e) => {
        e.originalEvent?.stopPropagation();
        setSelectedPin(report);
      });

      // Also handle popup close to close our sheet
      marker.on('popupclose', () => {
        // Small delay to allow popup button clicks to work
        setTimeout(() => {
          if (selectedPin?.id === report.id) {
            setSelectedPin(null);
          }
        }, 100);
      });

      markersRef.current.push(marker);
    });

    // Global function for popup button clicks
    (window as any).selectReportFromMap = (reportId: string) => {
      const report = filteredReports.find(r => r.id === reportId);
      if (report) {
        setSelectedPin(report);
        // Close any open popups
        leafletMapRef.current?.closePopup();
      }
    };

  }, [filteredReports, reportCoordinates, selectedPin, t]);

  return (
    <div className="flex flex-col bg-background relative" style={{ height: 'calc(100vh - 5rem)' }}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl text-primary">{t.map}</h1>
            <Badge variant="secondary" className="text-xs">
              🍃 OpenStreetMap
            </Badge>
          </div>
          
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedFilter(option.value)}
              >
                <div className={`w-2 h-2 rounded-full ${option.color} mr-2`}></div>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container - takes remaining space above bottom nav */}
      <div className="relative flex-1 z-10">
        <div 
          ref={mapRef} 
          className="w-full h-full relative z-10"
          style={{ minHeight: '400px' }}
        />

        {/* District Info */}
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded-lg text-sm font-medium shadow-lg z-20">
          📍 {user.district} • {filteredReports.length} reports
        </div>
      </div>

      {/* Custom Bottom Popup for Selected Pin (without backdrop) */}
      {selectedPin && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200 rounded-t-lg shadow-lg z-[10000]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
        >
          <div className="h-[60vh] overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-left">{selectedPin.title}</h3>
              <button
                onClick={() => setSelectedPin(null)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedPin.imageUrl}
                  alt={selectedPin.title}
                  className="w-full h-full object-cover"
                />
                {selectedPin.isTamperDetected && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    {t.tamperDetected}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`text-xs ${
                    selectedPin.status === 'pending' ? 'bg-red-100 text-red-800' :
                    selectedPin.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getStatusText(selectedPin.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(selectedPin.timestamp)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {selectedPin.ward} • {selectedPin.street} • {selectedPin.distance}km
                </p>

                <Badge variant="secondary" className="text-xs mb-3">
                  {selectedPin.aiTag} — {selectedPin.aiConfidence}% {t.confidence}
                </Badge>

                <p className="text-sm mb-4">{selectedPin.description}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onReportSelect(selectedPin)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t.viewDetails}
                </Button>
                
                <motion.button
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${
                    selectedPin.hasUserUpvoted
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  onClick={() => onUpvote(selectedPin.id)}
                  whileTap={{ scale: 1.05 }}
                >
                  <ArrowUp className="w-4 h-4" />
                  {selectedPin.upvotes}
                </motion.button>
                
                <Button variant="outline">
                  {t.reportAgain}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}