import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import {
  Navigation,
  Clock,
  Wind,
  Activity,
  Gauge,
  Search,
  BookmarkPlus,
  CheckCircle,
} from 'lucide-react';
import { routeService } from '../services/routeService';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendationBadge from '../components/RecommendationBadge';
import AQICard from '../components/AQICard';
import { formatNumber } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const [form, setForm] = useState({
    startLat: '',
    startLon: '',
    endLat: '',
    endLon: '',
  });

  const [routeName, setRouteName] = useState('');
  const [toast, setToast] = useState(null);

  const { data: route, loading, error, execute: findRoute } = useApi(
    (sLon, sLat, eLon, eLat) => routeService.findRoute(sLon, sLat, eLon, eLat)
  );

  const { loading: saving, execute: saveRoute } = useApi((data) =>
    routeService.saveRoute(data)
  );

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setToast(null);
    await findRoute(form.startLon, form.startLat, form.endLon, form.endLat);
  };

  const handleSave = async () => {
    if (!route) return;
    if (!routeName.trim()) {
      setToast({ type: 'error', message: 'Please enter a route name before saving.' });
      return;
    }
    try {
      await saveRoute({
        routeName: routeName.trim(),
        startLat: parseFloat(form.startLat),
        startLon: parseFloat(form.startLon),
        endLat: parseFloat(form.endLat),
        endLon: parseFloat(form.endLon),
      });
      setSaved(true);
      setToast({ type: 'success', message: 'Route saved successfully!' });
      setTimeout(() => setToast(null), 4000);
    } catch {
      setToast({ type: 'error', message: 'Failed to save route. Please try again.' });
    }
  };

  const mapCenter = route
    ? [
        (parseFloat(form.startLat) + parseFloat(form.endLat)) / 2,
        (parseFloat(form.startLon) + parseFloat(form.endLon)) / 2,
      ]
    : [17.385, 78.4867]; // Default: Hyderabad

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Route Dashboard</h1>
        <p>Find the cleanest route between two points based on real-time air quality</p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type} animate-in`}>
          {toast.type === 'success' && <CheckCircle size={16} />}
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      {/* Route Form */}
      <div className="dashboard-grid">
        <div className="dashboard-form-section glass-card animate-in">
          <h2 className="section-title">
            <Search size={18} />
            Find Route
          </h2>
          <form onSubmit={handleSubmit} className="route-form" id="route-form">
            <div className="form-row">
              <div className="form-col">
                <h3 className="form-col-title">
                  <span className="dot-indicator start"></span>
                  Origin
                </h3>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="startLat"
                    value={form.startLat}
                    onChange={handleChange}
                    placeholder="e.g. 17.385"
                    className="form-input"
                    required
                    id="input-start-lat"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="startLon"
                    value={form.startLon}
                    onChange={handleChange}
                    placeholder="e.g. 78.4867"
                    className="form-input"
                    required
                    id="input-start-lon"
                  />
                </div>
              </div>

              <div className="form-divider">
                <Navigation size={20} />
              </div>

              <div className="form-col">
                <h3 className="form-col-title">
                  <span className="dot-indicator end"></span>
                  Destination
                </h3>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="endLat"
                    value={form.endLat}
                    onChange={handleChange}
                    placeholder="e.g. 17.4399"
                    className="form-input"
                    required
                    id="input-end-lat"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="endLon"
                    value={form.endLon}
                    onChange={handleChange}
                    placeholder="e.g. 78.4983"
                    className="form-input"
                    required
                    id="input-end-lon"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
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

        {/* Map */}
        <div className="dashboard-map-section glass-card animate-in animate-in-delay-1">
          <h2 className="section-title">
            <Navigation size={18} />
            Route Map
          </h2>
          <div className="map-container" style={{ height: '380px' }}>
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              key={mapCenter.join(',')}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {route && form.startLat && form.endLat && (
                <>
                  <Marker position={[parseFloat(form.startLat), parseFloat(form.startLon)]}>
                    <Popup>Origin</Popup>
                  </Marker>
                  <Marker position={[parseFloat(form.endLat), parseFloat(form.endLon)]}>
                    <Popup>Destination</Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [parseFloat(form.startLat), parseFloat(form.startLon)],
                      [parseFloat(form.endLat), parseFloat(form.endLon)],
                    ]}
                    color="#10b981"
                    weight={4}
                    opacity={0.8}
                  />
                </>
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner animate-in">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner text="Analyzing air quality along route..." />}

      {/* Results */}
      {route && !loading && (
        <div className="route-results animate-in">
          <div className="results-header">
            <h2 className="section-title">
              <Activity size={18} />
              Route Analysis
            </h2>
            <div className="results-actions">
              <RecommendationBadge rating={route.healthRating} size="lg" />
            </div>
          </div>

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

          {/* Save Route Section */}
          <div className="save-route-section glass-card animate-in animate-in-delay-3">
            <h3 className="section-title">
              <BookmarkPlus size={18} />
              Save This Route
            </h3>
            <div className="save-route-form">
              <div className="form-group save-name-group">
                <label className="form-label">Route Name</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Home to Office"
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
                    Route Saved!
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
