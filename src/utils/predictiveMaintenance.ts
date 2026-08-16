// Predictive Maintenance Module for Awaaz-AI
// ============================================
// NOTE: This is a RULE-BASED SIMULATION, not a real ML model.
// It analyzes historical report patterns to generate predicted risk areas.
// In production, this would be replaced by a trained ML pipeline.

import { Report } from '../App';

export interface PredictedRisk {
  /** Unique ID for the prediction */
  id: string;
  /** Location/area description */
  location: string;
  /** Ward name */
  ward: string;
  /** Risk level */
  riskLevel: 'high' | 'medium' | 'low';
  /** Human-readable description */
  description: string;
  /** Category of predicted issue */
  category: string;
  /** Number of historical incidents driving this prediction */
  historicalCount: number;
  /** Confidence score (simulated) */
  confidence: number;
}

/**
 * RULE-BASED SIMULATION: Flags locations with 2+ historical streetlight faults
 * as "high probability of repeat failure" based on aging infrastructure patterns.
 */
export function getStreetlightRiskPredictions(reports: Report[]): PredictedRisk[] {
  const streetlightReports = reports.filter(
    r => r.type === 'streetlight' || r.aiTag === 'Street Lighting'
  );

  // Group by ward
  const wardCounts = new Map<string, Report[]>();
  streetlightReports.forEach(r => {
    const existing = wardCounts.get(r.ward) || [];
    existing.push(r);
    wardCounts.set(r.ward, existing);
  });

  const predictions: PredictedRisk[] = [];

  wardCounts.forEach((wardReports, ward) => {
    if (wardReports.length >= 2) {
      predictions.push({
        id: `sl-risk-${ward.replace(/\s/g, '-').toLowerCase()}`,
        location: wardReports[0].street || ward,
        ward,
        riskLevel: wardReports.length >= 3 ? 'high' : 'medium',
        description: `${wardReports.length} historical streetlight failures recorded. ` +
          `Pattern suggests aging electrical infrastructure — proactive maintenance recommended.`,
        category: 'Streetlight Infrastructure',
        historicalCount: wardReports.length,
        confidence: Math.min(95, 70 + wardReports.length * 8),
      });
    }
  });

  return predictions;
}

/**
 * RULE-BASED SIMULATION: Flags wards with 2+ historical drainage/water reports
 * as "high waterlogging risk during monsoon" based on seasonal patterns.
 */
export function getWaterloggingRiskPredictions(reports: Report[]): PredictedRisk[] {
  const waterReports = reports.filter(
    r => r.type === 'drainage' || r.type === 'water' ||
         r.aiTag === 'Drainage System' || r.aiTag === 'Water Supply'
  );

  // Group by ward
  const wardCounts = new Map<string, Report[]>();
  waterReports.forEach(r => {
    const existing = wardCounts.get(r.ward) || [];
    existing.push(r);
    wardCounts.set(r.ward, existing);
  });

  const predictions: PredictedRisk[] = [];

  wardCounts.forEach((wardReports, ward) => {
    if (wardReports.length >= 2) {
      predictions.push({
        id: `wl-risk-${ward.replace(/\s/g, '-').toLowerCase()}`,
        location: wardReports[0].street || ward,
        ward,
        riskLevel: wardReports.some(r => r.severity >= 8) ? 'high' : 'medium',
        description: `${wardReports.length} drainage/water issues reported in this ward. ` +
          `Monsoon season pattern analysis suggests high waterlogging risk — pre-emptive desilting recommended.`,
        category: 'Waterlogging Risk',
        historicalCount: wardReports.length,
        confidence: Math.min(90, 65 + wardReports.length * 10),
      });
    }
  });

  return predictions;
}

/**
 * Returns all predicted risks, sorted by risk level (high first).
 */
export function getAllPredictions(reports: Report[]): PredictedRisk[] {
  const allRisks = [
    ...getStreetlightRiskPredictions(reports),
    ...getWaterloggingRiskPredictions(reports),
  ];

  const riskOrder = { high: 0, medium: 1, low: 2 };
  return allRisks.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
}
