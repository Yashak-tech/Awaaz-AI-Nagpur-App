// Duplicate Detection Utility for Awaaz-AI
// Uses Haversine formula to find geographically nearby reports with matching categories

import { Report } from '../App';

/**
 * Calculates the distance in meters between two geographic coordinates
 * using the Haversine formula.
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const DUPLICATE_DISTANCE_THRESHOLD_METERS = 50;
const DUPLICATE_TIME_WINDOW_DAYS = 14;

/**
 * Finds an existing report that is likely a duplicate of the new report.
 *
 * A report is considered a duplicate if:
 * 1. Distance between coordinates < 50 meters (Haversine)
 * 2. Same aiTag category
 * 3. Existing report timestamp is within the last 14 days
 * 4. Existing report status is NOT 'resolved'
 *
 * @returns The matching existing report, or null if no duplicate found
 */
export function findDuplicate(
  newReport: { coordinates: { lat: number; lng: number }; aiTag: string },
  existingReports: Report[]
): Report | null {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - DUPLICATE_TIME_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  for (const existing of existingReports) {
    // Skip resolved reports
    if (existing.status === 'resolved') continue;

    // Check time window — report must be within the last 14 days
    if (existing.timestamp < cutoffTime) continue;

    // Check category match (case-insensitive)
    if (existing.aiTag.toLowerCase() !== newReport.aiTag.toLowerCase()) continue;

    // Check geographic proximity
    const distance = haversineDistance(
      newReport.coordinates.lat, newReport.coordinates.lng,
      existing.coordinates.lat, existing.coordinates.lng
    );

    if (distance < DUPLICATE_DISTANCE_THRESHOLD_METERS) {
      return existing;
    }
  }

  return null;
}
