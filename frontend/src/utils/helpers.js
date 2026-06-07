/**
 * Returns CSS class and label for a given health rating.
 */
export function getHealthBadge(rating) {
  if (!rating) return { className: 'badge-moderate', label: 'Unknown', emoji: '🟡' };

  const normalized = rating.toUpperCase().replace(/[\s_-]+/g, '');
  const map = {
    GOOD: { className: 'badge-good', label: 'Good', emoji: '🟢' },
    MODERATE: { className: 'badge-moderate', label: 'Moderate', emoji: '🟡' },
    FAIR: { className: 'badge-fair', label: 'Fair', emoji: '🟠' },
    UNHEALTHY: { className: 'badge-unhealthy', label: 'Unhealthy', emoji: '🔴' },
    UNHEALTHYFORSENSITIVE: { className: 'badge-unhealthy', label: 'Unhealthy (Sensitive)', emoji: '🔴' },
    POOR: { className: 'badge-unhealthy', label: 'Poor', emoji: '🔴' },
    SEVERE: { className: 'badge-severe', label: 'Severe', emoji: '🟣' },
    HAZARDOUS: { className: 'badge-severe', label: 'Hazardous', emoji: '⚫' },
    VERYPOOR: { className: 'badge-severe', label: 'Very Poor', emoji: '🟣' },
  };

  return map[normalized] || { className: 'badge-moderate', label: rating, emoji: '🟡' };
}

/**
 * Returns a color hex for a given AQI value (1-5 scale).
 */
export function getAQIColor(aqi) {
  if (aqi <= 1) return '#22c55e';
  if (aqi <= 2) return '#84cc16';
  if (aqi <= 3) return '#f59e0b';
  if (aqi <= 4) return '#ef4444';
  return '#dc2626';
}

/**
 * Returns a descriptive label for AQI value.
 */
export function getAQILabel(aqi) {
  if (aqi <= 1) return 'Good';
  if (aqi <= 2) return 'Fair';
  if (aqi <= 3) return 'Moderate';
  if (aqi <= 4) return 'Poor';
  return 'Very Poor';
}

/**
 * Format a number to fixed decimal places.
 */
export function formatNumber(value, decimals = 2) {
  if (value == null) return '—';
  return Number(value).toFixed(decimals);
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Returns color and label for a recommendation status.
 * Values: GOOD_TO_TRAVEL, MODERATE, AVOID_TRAVEL
 */
export function getRecommendationStyle(recommendation) {
  if (!recommendation) return { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', label: 'Unknown', emoji: '❓' };

  const normalized = recommendation.toUpperCase().replace(/[\s]+/g, '_');
  const map = {
    GOOD_TO_TRAVEL: {
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.12)',
      border: 'rgba(34, 197, 94, 0.3)',
      label: 'Good to Travel',
      emoji: '✅',
    },
    MODERATE: {
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      label: 'Moderate',
      emoji: '⚠️',
    },
    AVOID_TRAVEL: {
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
      label: 'Avoid Travel',
      emoji: '🚫',
    },
  };

  return map[normalized] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', label: recommendation.replace(/_/g, ' '), emoji: '❓' };
}
