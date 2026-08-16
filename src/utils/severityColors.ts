// Severity Color Coding Utility for Awaaz-AI
// Provides consistent severity-based color coding across all screens
// Scale: severity >= 8 → critical/red, 5-7 → moderate/orange, < 5 → minor/yellow

export interface SeverityColors {
  /** Tailwind background class (e.g., 'bg-red-100') */
  bg: string;
  /** Tailwind text class (e.g., 'text-red-800') */
  text: string;
  /** Tailwind dot/indicator class (e.g., 'bg-red-500') */
  dot: string;
  /** Label for the severity level */
  label: string;
  /** Hex color for use in map markers and charts */
  hex: string;
}

/**
 * Returns consistent severity color classes based on a 1-10 severity score.
 *
 * - severity >= 8 → Critical (Red)
 * - severity 5-7  → Moderate (Orange)
 * - severity < 5  → Minor (Yellow)
 */
export function getSeverityColor(severity: number): SeverityColors {
  if (severity >= 8) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      dot: 'bg-red-500',
      label: 'Critical',
      hex: '#ef4444'
    };
  }
  if (severity >= 5) {
    return {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      dot: 'bg-orange-500',
      label: 'Moderate',
      hex: '#f97316'
    };
  }
  return {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
    label: 'Minor',
    hex: '#eab308'
  };
}
