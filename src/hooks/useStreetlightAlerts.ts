// IoT Streetlight Alert Hook for Awaaz-AI
// Subscribes to Firebase Realtime Database for streetlight sensor data
// and converts faulty entries into Report-shaped objects

import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { Report } from '../App';

interface StreetlightEntry {
  deviceId: string;
  status: 'operational' | 'faulty' | 'maintenance';
  location: {
    lat: number;
    lng: number;
  };
  ward?: string;
  street?: string;
  lastUpdated?: number;
  voltage?: number;
  description?: string;
}

/**
 * Custom hook that subscribes to the `streetlights` path in Firebase Realtime Database.
 * Returns an array of Report-shaped objects for any entry with status: 'faulty'.
 *
 * Uses stable IDs like `iot-{deviceId}` to prevent duplicates when merged
 * into the main reports state.
 *
 * If Firebase is not configured (placeholder credentials), returns an empty array.
 */
export function useStreetlightAlerts(): Report[] {
  const [alerts, setAlerts] = useState<Report[]>([]);

  useEffect(() => {
    // If Firebase is not configured, return empty — no sensor data available
    if (!database) {
      return;
    }

    // Dynamically import to avoid issues if firebase isn't configured
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const { ref, onValue } = await import('firebase/database');
        const streetlightsRef = ref(database!, 'streetlights');

        unsubscribe = onValue(streetlightsRef, (snapshot) => {
          const data = snapshot.val();
          if (!data) {
            setAlerts([]);
            return;
          }

          const faultyAlerts: Report[] = [];

          Object.entries(data).forEach(([key, entry]) => {
            const streetlight = entry as StreetlightEntry;

            if (streetlight.status === 'faulty') {
              faultyAlerts.push({
                id: `iot-${streetlight.deviceId || key}`,
                title: `⚡ Streetlight Fault Detected — ${streetlight.street || 'Sensor Alert'}`,
                description:
                  streetlight.description ||
                  `IoT sensor detected streetlight malfunction at ${streetlight.ward || 'unknown ward'}. ` +
                  `Voltage anomaly reported. Auto-generated ticket via Awaaz-AI sensor network.`,
                imageUrl: 'https://i.pinimg.com/1200x/f4/c0/5c/f4c05c75472d231f783af9b203cc2ec0.jpg?w=400&h=300',
                district: 'Nagpur',
                ward: streetlight.ward || 'Zone 2 - Dharampeth (Ward 15)',
                street: streetlight.street || 'Sensor Location',
                coordinates: {
                  lat: streetlight.location?.lat || 21.1485,
                  lng: streetlight.location?.lng || 79.0550,
                },
                distance: 0,
                timestamp: new Date(streetlight.lastUpdated || Date.now()),
                aiTag: 'Street Lighting',
                aiConfidence: 98,
                status: 'pending',
                upvotes: 0,
                comments: [],
                severity: 7,
                type: 'streetlight',
                isProactiveSensorAlert: true,
                priority: 'medium',
              });
            }
          });

          setAlerts(faultyAlerts);
        }, (error) => {
          console.warn('[Awaaz-AI] Failed to read streetlight data:', error);
          setAlerts([]);
        });
      } catch (error) {
        console.warn('[Awaaz-AI] Firebase database import failed:', error);
      }
    })();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return alerts;
}
