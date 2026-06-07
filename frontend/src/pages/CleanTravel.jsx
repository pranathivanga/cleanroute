import { useEffect } from 'react';
import {
  Wind,
  Thermometer,
  Droplets,
  ShieldCheck,
  Sparkles,
  Route,
  AlertTriangle,
} from 'lucide-react';
import { recommendationService } from '../services/routeService';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import AQICard from '../components/AQICard';
import { formatNumber, getRecommendationStyle } from '../utils/helpers';
import './CleanTravel.css';

export default function CleanTravel() {
  const { data, loading, error, execute: fetchRecommendations } = useApi(() =>
    recommendationService.getRecommendations()
  );

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // data is an array of recommendation objects
  const recommendations = Array.isArray(data) ? data : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Clean Travel Recommendations</h1>
        <p>Real-time travel advisories based on air quality for your saved routes</p>
      </div>

      {error && (
        <div className="error-banner animate-in">
          <AlertTriangle size={16} />
          <p>{error}</p>
        </div>
      )}

      {loading && <LoadingSpinner text="Fetching travel recommendations..." />}

      {!loading && recommendations.length > 0 && (
        <div className="recommendations-grid">
          {recommendations.map((rec, idx) => {
            const style = getRecommendationStyle(rec.recommendation);
            return (
              <div
                key={idx}
                className={`recommendation-card glass-card animate-in animate-in-delay-${Math.min(idx + 1, 4)}`}
                id={`recommendation-card-${idx}`}
              >
                {/* Recommendation Header */}
                <div className="rec-header">
                  <div className="rec-route-info">
                    <div className="rec-route-icon">
                      <Route size={18} />
                    </div>
                    <h3 className="rec-route-name">{rec.routeName || 'Unknown Route'}</h3>
                  </div>
                  <div
                    className="rec-badge"
                    style={{
                      color: style.color,
                      background: style.bg,
                      borderColor: style.border,
                    }}
                  >
                    <span className="rec-badge-dot" style={{ background: style.color }}></span>
                    <span className="rec-badge-emoji">{style.emoji}</span>
                    <span>{style.label}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="rec-stats">
                  <div className="rec-stat">
                    <ShieldCheck size={16} style={{ color: style.color }} />
                    <div className="rec-stat-content">
                      <span className="rec-stat-value" style={{ color: style.color }}>{rec.aqi ?? '—'}</span>
                      <span className="rec-stat-label">AQI</span>
                    </div>
                  </div>
                  <div className="rec-stat">
                    <Thermometer size={16} className="rec-stat-icon-amber" />
                    <div className="rec-stat-content">
                      <span className="rec-stat-value">{formatNumber(rec.temperature, 1)}°C</span>
                      <span className="rec-stat-label">Temp</span>
                    </div>
                  </div>
                  <div className="rec-stat">
                    <Droplets size={16} className="rec-stat-icon-blue" />
                    <div className="rec-stat-content">
                      <span className="rec-stat-value">{formatNumber(rec.humidity, 0)}%</span>
                      <span className="rec-stat-label">Humidity</span>
                    </div>
                  </div>
                  <div className="rec-stat">
                    <Wind size={16} className="rec-stat-icon-purple" />
                    <div className="rec-stat-content">
                      <span className="rec-stat-value">{formatNumber(rec.windSpeed, 1)} m/s</span>
                      <span className="rec-stat-label">Wind</span>
                    </div>
                  </div>
                </div>

                {/* AQI Visual */}
                <div className="rec-footer">
                  <AQICard aqi={rec.aqi} size="sm" />
                  <p className="rec-advice">
                    {rec.recommendation === 'GOOD_TO_TRAVEL'
                      ? 'Air quality is excellent. Safe for outdoor commuting and exercise!'
                      : rec.recommendation === 'MODERATE'
                      ? 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.'
                      : rec.recommendation === 'AVOID_TRAVEL'
                      ? 'Air quality is poor. Avoid outdoor activities and use indoor transport if possible.'
                      : 'Check current conditions before planning your travel.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && recommendations.length === 0 && !error && (
        <div className="empty-state animate-in">
          <Sparkles size={48} />
          <h3>No recommendations available</h3>
          <p>Save some routes from the Dashboard to get personalized travel recommendations.</p>
        </div>
      )}
    </div>
  );
}
