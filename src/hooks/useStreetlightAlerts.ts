// IoT Streetlight Alert Hook for Awaaz-AI
// Subscribes to ESP32 IoT Hardware Telemetry & Firebase Realtime Database
// and converts faulty streetlight entries into Report objects for the map and feed.

import { useState, useEffect } from 'react';
import { iotHardwareService } from '../utils/iotHardwareService';
import { Report } from '../App';

export function useStreetlightAlerts(): Report[] {
  const [alerts, setAlerts] = useState<Report[]>(() => {
    const devices = iotHardwareService.getDevices();
    return devices
      .filter(d => d.status === 'faulty')
      .map(d => ({
        id: `iot-${d.deviceId}`,
        title: `⚡ Streetlight Fault Detected — ${d.name}`,
        description:
          d.faultReason ||
          `ESP32 sensor detected streetlight malfunction at ${d.location.address}. ` +
          `Current anomaly reported (${d.currentReading}A). Auto-generated ticket via Awaaz-AI sensor network.`,
        imageUrl: 'https://i.pinimg.com/1200x/f4/c0/5c/f4c05c75472d231f783af9b203cc2ec0.jpg?w=400&h=300',
        district: 'Nagpur',
        ward: `${d.location.zone} (${d.location.ward})`,
        street: d.location.address,
        coordinates: {
          lat: d.location.lat,
          lng: d.location.lng,
        },
        distance: 0.2,
        timestamp: new Date(d.lastUpdated),
        aiTag: 'Street Lighting',
        aiConfidence: 98,
        status: 'pending' as const,
        upvotes: 0,
        comments: [],
        severity: 8,
        type: 'streetlight',
        isProactiveSensorAlert: true,
        priority: 'high' as const,
        suggestedDepartment: 'Electrical Department'
      }));
  });

  useEffect(() => {
    const unsubscribe = iotHardwareService.subscribe(() => {
      const devices = iotHardwareService.getDevices();
      const faultyAlerts: Report[] = devices
        .filter(d => d.status === 'faulty')
        .map(d => ({
          id: `iot-${d.deviceId}`,
          title: `⚡ Streetlight Fault Detected — ${d.name}`,
          description:
            d.faultReason ||
            `ESP32 sensor detected streetlight malfunction at ${d.location.address}. ` +
            `Current anomaly reported (${d.currentReading}A). Auto-generated ticket via Awaaz-AI sensor network.`,
          imageUrl: 'https://i.pinimg.com/1200x/f4/c0/5c/f4c05c75472d231f783af9b203cc2ec0.jpg?w=400&h=300',
          district: 'Nagpur',
          ward: `${d.location.zone} (${d.location.ward})`,
          street: d.location.address,
          coordinates: {
            lat: d.location.lat,
            lng: d.location.lng,
          },
          distance: 0.2,
          timestamp: new Date(d.lastUpdated),
          aiTag: 'Street Lighting',
          aiConfidence: 98,
          status: 'pending' as const,
          upvotes: 0,
          comments: [],
          severity: 8,
          type: 'streetlight',
          isProactiveSensorAlert: true,
          priority: 'high' as const,
          suggestedDepartment: 'Electrical Department'
        }));
      setAlerts(faultyAlerts);
    });

    return unsubscribe;
  }, []);

  return alerts;
}
