// AI Classification Utilities for Awaaz-AI (Nagpur Civic App)
// Simulates advanced AI analysis for issue detection and priority assignment for NMC

export interface AIAnalysisResult {
  primaryIssue: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity: number;
  suggestedDepartment: string;
  urgencyScore: number;
  riskFactors: string[];
  estimatedResolutionTime: string;
  keywords: string[];
}

export interface LocationContext {
  district: string;
  ward: string;
  coordinates: { lat: number; lng: number };
  nearbyLandmarks?: string[];
  trafficLevel?: 'low' | 'medium' | 'high';
  populationDensity?: 'low' | 'medium' | 'high';
}

const issuePatterns = {
  pothole: {
    keywords: ['pothole', 'road', 'damage', 'crack', 'hole', 'asphalt'],
    riskFactors: ['vehicle damage', 'accident risk', 'traffic congestion'],
    department: 'Public Works Department',
    baseUrgency: 6,
    resolutionTime: '3-5 days'
  },
  garbage: {
    keywords: ['garbage', 'waste', 'trash', 'dump', 'overflow', 'collection'],
    riskFactors: ['health hazard', 'pest attraction', 'odor'],
    department: 'Waste Management Department',
    baseUrgency: 4,
    resolutionTime: '1-2 days'
  },
  streetlight: {
    keywords: ['streetlight', 'lamp', 'light', 'dark', 'broken', 'electricity'],
    riskFactors: ['safety concern', 'crime risk', 'visibility'],
    department: 'Electrical Department',
    baseUrgency: 5,
    resolutionTime: '2-3 days'
  },
  water: {
    keywords: ['water', 'pipe', 'leak', 'supply', 'pressure', 'quality'],
    riskFactors: ['health risk', 'wastage', 'property damage'],
    department: 'Water Supply Department',
    baseUrgency: 7,
    resolutionTime: '1-3 days'
  },
  drainage: {
    keywords: ['drainage', 'sewer', 'flood', 'overflow', 'blockage', 'storm'],
    riskFactors: ['flooding risk', 'health hazard', 'property damage'],
    department: 'Drainage Department',
    baseUrgency: 8,
    resolutionTime: '1-2 days'
  }
};

const urgencyFactors = {
  nearSchool: +2,
  nearHospital: +3,
  nearMarket: +1,
  highTraffic: +2,
  highPopulation: +1,
  monsoonSeason: +2,
  nightTime: +1
};

export function analyzeImage(imageUrl: string, description: string, location: LocationContext): AIAnalysisResult {
  // Simulate AI image analysis based on description and context
  const text = (description || '').toLowerCase();
  let bestMatch = { type: 'other', score: 0, pattern: issuePatterns.garbage };
  
  // Find best matching issue type
  Object.entries(issuePatterns).forEach(([type, pattern]) => {
    const score = pattern.keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > bestMatch.score) {
      bestMatch = { type, score, pattern };
    }
  });
  
  // Calculate confidence based on keyword matches and image analysis simulation
  const baseConfidence = Math.min(85 + (bestMatch.score * 5), 99);
  const confidence = Math.floor(baseConfidence + Math.random() * 5);
  
  // Calculate urgency score with location and context factors
  let urgencyScore = bestMatch.pattern.baseUrgency;
  
  // Add location-based urgency modifiers
  if (location.ward.includes('School') || text.includes('school')) urgencyScore += urgencyFactors.nearSchool;
  if (location.ward.includes('Hospital') || text.includes('hospital')) urgencyScore += urgencyFactors.nearHospital;
  if (location.ward.includes('Market') || text.includes('market')) urgencyScore += urgencyFactors.nearMarket;
  
  // Add random environmental factors for demo
  const environmentalFactors = Math.floor(Math.random() * 3);
  urgencyScore += environmentalFactors;
  
  // Cap urgency score
  urgencyScore = Math.min(urgencyScore, 10);
  
  // Determine priority based on urgency score
  let priority: 'low' | 'medium' | 'high' | 'critical';
  if (urgencyScore >= 9) priority = 'critical';
  else if (urgencyScore >= 7) priority = 'high';
  else if (urgencyScore >= 4) priority = 'medium';
  else priority = 'low';
  
  // Generate AI insights
  const keywords = bestMatch.pattern.keywords.filter(keyword => text.includes(keyword));
  
  return {
    primaryIssue: bestMatch.type.charAt(0).toUpperCase() + bestMatch.type.slice(1),
    confidence,
    priority,
    severity: urgencyScore,
    suggestedDepartment: bestMatch.pattern.department,
    urgencyScore,
    riskFactors: bestMatch.pattern.riskFactors,
    estimatedResolutionTime: bestMatch.pattern.resolutionTime,
    keywords: keywords.length > 0 ? keywords : ['general issue']
  };
}

export function calculatePriorityScore(
  issueType: string,
  severity: number,
  location: LocationContext,
  timeOfDay: number = new Date().getHours()
): number {
  let score = severity;
  
  // Time-based modifiers
  if (timeOfDay >= 22 || timeOfDay <= 6) {
    if (issueType === 'streetlight' || issueType === 'drainage') {
      score += 2; // Higher priority at night for safety issues
    }
  }
  
  // Location-based modifiers
  if (location.trafficLevel === 'high') score += 1;
  if (location.populationDensity === 'high') score += 1;
  
  return Math.min(score, 10);
}

export function generateInsights(reports: any[]): {
  totalReports: number;
  resolvedPercentage: number;
  averageResolutionTime: string;
  topIssueTypes: Array<{type: string, count: number, trend: 'up' | 'down' | 'stable'}>;
  criticalAreas: Array<{ward: string, issueCount: number}>;
} {
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const resolvedPercentage = Math.floor((resolvedReports / totalReports) * 100);
  
  // Count issue types
  const issueTypeCounts = reports.reduce((acc, report) => {
    acc[report.type] = (acc[report.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topIssueTypes = Object.entries(issueTypeCounts)
    .map(([type, count]) => ({
      type,
      count: count as number,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable' as 'up' | 'down' | 'stable'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Count issues by ward
  const wardCounts = reports.reduce((acc, report) => {
    acc[report.ward] = (acc[report.ward] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const criticalAreas = Object.entries(wardCounts)
    .map(([ward, issueCount]) => ({ ward, issueCount: issueCount as number }))
    .sort((a, b) => b.issueCount - a.issueCount)
    .slice(0, 3);
  
  return {
    totalReports,
    resolvedPercentage,
    averageResolutionTime: '2.3 days',
    topIssueTypes,
    criticalAreas
  };
}