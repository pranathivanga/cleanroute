import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import {
  Navigation,
  Clock,
  Wind,
  Activity,
  Gauge,
  Search,
  BookmarkPlus,
  CheckCircle,
  MapPin,
  AlertTriangle,
  Shield,
  Sparkles,
  Route,
} from 'lucide-react';
import { routeService } from '../services/routeService';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendationBadge from '../components/RecommendationBadge';
import AQICard from '../components/AQICard';
import LocationSearch from '../components/LocationSearch';
import { formatNumber, getRecommendationStyle } from '../utils/helpers';
import './Dashboard.css';

/**
 * Helper component to auto-fit map bounds when markers change.
 */
function FitBounds({ source, destination }) {
  const map = useMap();

  useEffect(() => {
    if (source && destination) {
      const bounds = [
        [source.lat, source.lon],
        [destination.lat, destination.lon],
      ];
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (source) {
      map.setView([source.lat, source.lon], 14);
    } else if (destination) {
      map.setView([destination.lat, destination.lon], 14);
    }
  }, [source, destination, map]);

  return null;
}

export default function Dashboard() {
  const [source, setSource] = useState(null);        // { lat, lon, shortName, displayName }
  const [destination, setDestination] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [toast, setToast] = useState(null);
  const [geocodeError, setGeocodeError] = useState({ source: '', destination: '' });

  const { data: route, loading, error, execute: findRoute, reset: resetRoute } = useApi(
    (sLon, sLat, eLon, eLat) => routeService.findRoute(sLon, sLat, eLon, eLat)
  );

  const { loading: saving, execute: saveRoute } = useApi((data) =>
    routeService.saveRoute(data)
  );

  const [saved, setSaved] = useState(false);
  const resultsRef = useRef(null);

  const handleFindRoute = async (e) => {
    e.preventDefault();
    setSaved(false);
    setToast(null);
    setGeocodeError({ source: '', destination: '' });

    // Validate both locations are selected
    const errors = { source: '', destination: '' };
    if (!source) errors.source = 'Location not found. Please enter a valid place.';
    if (!destination) errors.destination = 'Location not found. Please enter a valid place.';

    if (errors.source || errors.destination) {
      setGeocodeError(errors);
      return;
    }

    try {
      const result = await findRoute(source.lon, source.lat, destination.lon, destination.lat);

      // Development-only AQI verification logging
      if (import.meta.env.DEV) {
        console.group('[CleanRoute Dev] Route Result');
        console.log('Source coords:', { lat: source.lat, lon: source.lon });
        console.log('Destination coords:', { lat: destination.lat, lon: destination.lon });
        console.log('AQI returned:', result?.aqi);
        console.log('Health Rating:', result?.healthRating);
        console.log('Pollution Score:', result?.pollutionScore);
        console.log('Duration (min):', result?.durationMinutes);
        console.log('Distance (km):', result?.distanceKm);
        console.groupEnd();
      }
    } catch {
      // Error is handled by useApi
    }
  };

  const handleSave = async () => {
    if (!route || !source || !destination) return;

    const name = routeName.trim() ||
      `${source.shortName} → ${destination.shortName}`;

    try {
      await saveRoute({
        routeName: name,
        startLat: source.lat,
        startLon: source.lon,
        endLat: destination.lat,
        endLon: destination.lon,
      });
      setSaved(true);
      setToast({ type: 'success', message: `Route "${name}" saved successfully!` });
      setTimeout(() => setToast(null), 4000);
    } catch {
      setToast({ type: 'error', message: 'Failed to save route. Please try again.' });
    }
  };

  const handleSourceChange = (place) => {
    setSource(place);
    setGeocodeError((prev) => ({ ...prev, source: '' }));
    resetRoute();
    setSaved(false);
  };

  const handleDestinationChange = (place) => {
    setDestination(place);
    setGeocodeError((prev) => ({ ...prev, destination: '' }));
    resetRoute();
    setSaved(false);
  };

  // Auto-scroll results into view when route data arrives
  useEffect(() => {
    if (route && !loading && resultsRef.current) {
      // Small delay to allow DOM to render the results section
      const timer = setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [route, loading]);

  const defaultCenter = [17.385, 78.4867]; // Hyderabad

  const isFormValid = source && destination;

  // Build travel recommendation message
  const getTravelAdvice = () => {
    if (!route) return null;
    const hr = route.healthRating?.toUpperCase?.()?.replace(/[\s_-]+/g, '') || '';
    if (hr === 'GOOD') return { icon: '🌿', text: 'Air quality is excellent along this route. Great conditions for walking, cycling, or commuting!' };
    if (hr === 'MODERATE' || hr === 'FAIR') return { icon: '⚠️', text: 'Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.' };
    if (hr === 'UNHEALTHY' || hr === 'POOR' || hr.includes('SENSITIVE')) return { icon: '🚫', text: 'Air quality is unhealthy. Consider an alternative route or use enclosed transportation.' };
    if (hr === 'SEVERE' || hr === 'HAZARDOUS' || hr === 'VERYPOOR') return { icon: '☠️', text: 'Dangerous air quality! Avoid this route entirely. Use indoor transport only.' };
    return { icon: '📊', text: 'Check current conditions and consider your health sensitivity before commuting.' };
  };

  const advice = getTravelAdvice();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Route Dashboard</h1>
        <p>Enter your source and destination to find the cleanest route</p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type} animate-in`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* Search + Map Grid */}
      <div className="dashboard-grid">
        {/* Left: Search Form */}
        <div className="dashboard-form-section glass-card animate-in">
          <h2 className="section-title">
            <Search size={18} />
            Plan Your Route
          </h2>
          <form onSubmit={handleFindRoute} className="route-form" id="route-form">
            <LocationSearch
              label="Source"
              placeholder="e.g. Koti, Hyderabad"
              value={source}
              onChange={handleSourceChange}
              dotColor="start"
              id="source-search"
              error={geocodeError.source}
            />

            <div className="route-direction-indicator">
              <div className="direction-line"></div>
              <div className="direction-icon">
                <Navigation size={16} />
              </div>
              <div className="direction-line"></div>
            </div>

            <LocationSearch
              label="Destination"
              placeholder="e.g. Hitech City, Hyderabad"
              value={destination}
              onChange={handleDestinationChange}
              dotColor="end"
              id="destination-search"
              error={geocodeError.destination}
            />

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading || !isFormValid}
              id="find-route-btn"
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Analyzing Route...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Cleanest Route
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Map */}
        <div className="dashboard-map-section glass-card animate-in animate-in-delay-1">
          <h2 className="section-title">
            <MapPin size={18} />
            Route Map
          </h2>
          <div className="map-container" style={{ height: '420px' }}>
            <MapContainer
              center={defaultCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FitBounds source={source} destination={destination} />

              {source && (
                <Marker position={[source.lat, source.lon]}>
                  <Popup>
                    <strong>📍 Source</strong><br />
                    {source.shortName}
                  </Popup>
                </Marker>
              )}

              {destination && (
                <Marker position={[destination.lat, destination.lon]}>
                  <Popup>
                    <strong>🏁 Destination</strong><br />
                    {destination.shortName}
                  </Popup>
                </Marker>
              )}

              {source && destination && (
                <Polyline
                  positions={[
                    [source.lat, source.lon],
                    [destination.lat, destination.lon],
                  ]}
                  color="#10b981"
                  weight={4}
                  opacity={0.8}
                  dashArray="8 12"
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner animate-in">
          <AlertTriangle size={16} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner text="Analyzing air quality along your route..." />}

      {/* Results */}
      {route && !loading && (
        <div className="route-results animate-in" ref={resultsRef}>
          {/* Route Summary Header */}
          <div className="result-summary-card glass-card animate-in">
            <div className="summary-route-info">
              <div className="summary-route-names">
                <div className="summary-point">
                  <span className="dot-indicator start"></span>
                  <span>{source?.shortName}</span>
                </div>
                <Navigation size={14} className="summary-arrow" />
                <div className="summary-point">
                  <span className="dot-indicator end"></span>
                  <span>{destination?.shortName}</span>
                </div>
              </div>
              <RecommendationBadge rating={route.healthRating} size="lg" />
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid-5 results-stats">
            <div className="glass-card stat-card animate-in animate-in-delay-1">
              <div className="stat-icon green">
                <Navigation size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Distance</span>
                <span className="stat-value">
                  {formatNumber(route.distanceKm)}
                  <span className="stat-unit"> km</span>
                </span>
              </div>
            </div>

            <div className="glass-card stat-card animate-in animate-in-delay-2">
              <div className="stat-icon blue">
                <Clock size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Duration</span>
                <span className="stat-value">
                  {formatNumber(route.durationMinutes)}
                  <span className="stat-unit"> min</span>
                </span>
              </div>
            </div>

            <div className="glass-card stat-card animate-in animate-in-delay-3">
              <div className="stat-icon purple">
                <Gauge size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">AQI Level</span>
                <div className="stat-aqi-inline">
                  <AQICard aqi={route.aqi} size="sm" />
                </div>
              </div>
            </div>

            <div className="glass-card stat-card animate-in animate-in-delay-4">
              <div className="stat-icon amber">
                <Wind size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Pollution Score</span>
                <span className="stat-value">
                  {formatNumber(route.pollutionScore)}
                </span>
              </div>
            </div>

            <div className="glass-card stat-card animate-in animate-in-delay-4">
              <div className="stat-icon green">
                <Activity size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Health Rating</span>
                <span className="stat-value stat-value-sm">
                  {route.healthRating}
                </span>
              </div>
            </div>
          </div>

          {/* Travel Recommendation Card */}
          {advice && (
            <div className="travel-recommendation-card glass-card animate-in animate-in-delay-2">
              <div className="travel-rec-header">
                <div className="travel-rec-title">
                  <Shield size={20} />
                  <h3>Travel Recommendation</h3>
                </div>
                <RecommendationBadge rating={route.healthRating} size="md" />
              </div>
              <div className="travel-rec-body">
                <div className="travel-rec-emoji">{advice.icon}</div>
                <p className="travel-rec-text">{advice.text}</p>
              </div>
              <div className="travel-rec-stats-bar">
                <div className="travel-rec-mini-stat">
                  <Route size={14} />
                  <span>{formatNumber(route.distanceKm)} km</span>
                </div>
                <div className="travel-rec-divider"></div>
                <div className="travel-rec-mini-stat">
                  <Clock size={14} />
                  <span>{formatNumber(route.durationMinutes)} min</span>
                </div>
                <div className="travel-rec-divider"></div>
                <div className="travel-rec-mini-stat">
                  <Gauge size={14} />
                  <span>AQI {route.aqi}</span>
                </div>
                <div className="travel-rec-divider"></div>
                <div className="travel-rec-mini-stat">
                  <Sparkles size={14} />
                  <span>{route.healthRating}</span>
                </div>
              </div>
            </div>
          )}

          {/* Save Route Section */}
          <div className="save-route-section glass-card animate-in animate-in-delay-3">
            <h3 className="section-title">
              <BookmarkPlus size={18} />
              Save This Route
            </h3>
            <div className="save-route-form">
              <div className="form-group save-name-group">
                <label className="form-label">Route Name (optional)</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder={source && destination
                    ? `${source.shortName} → ${destination.shortName}`
                    : 'e.g. Home to Office'
                  }
                  className="form-input"
                  id="input-route-name"
                />
              </div>
              <button
                className={`btn ${saved ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                onClick={handleSave}
                disabled={saving || saved}
                id="save-route-btn"
              >
                {saved ? (
                  <>
                    <CheckCircle size={16} />
                    Saved!
                  </>
                ) : saving ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={16} />
                    Save Route
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
