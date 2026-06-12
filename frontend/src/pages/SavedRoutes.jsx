import { useEffect, useState } from 'react';
import { BookmarkCheck, Plus, MapPin, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { routeService } from '../services/routeService';
import useApi from '../hooks/useApi';
import RouteCard from '../components/RouteCard';
import LocationSearch from '../components/LocationSearch';
import LoadingSpinner from '../components/LoadingSpinner';
import './SavedRoutes.css';

export default function SavedRoutes() {
  const { data: routes, loading, error, execute: fetchRoutes } = useApi(() =>
    routeService.getSavedRoutes()
  );

  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!source) {
      setFormError('Please select a valid source location.');
      return;
    }
    if (!destination) {
      setFormError('Please select a valid destination.');
      return;
    }

    const name = routeName.trim() ||
      `${source.shortName} → ${destination.shortName}`;

    try {
      await routeService.saveRoute({
        routeName: name,
        startLat: source.lat,
        startLon: source.lon,
        endLat: destination.lat,
        endLon: destination.lon,
      });
      setShowForm(false);
      setRouteName('');
      setSource(null);
      setDestination(null);
      setToast({ type: 'success', message: `Route "${name}" saved successfully!` });
      setTimeout(() => setToast(null), 4000);
      fetchRoutes();
    } catch {
      setToast({ type: 'error', message: 'Failed to save route. Please try again.' });
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Saved Routes</h1>
        <p>Manage your bookmarked routes for air quality tracking</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast-notification toast-${toast.type} animate-in`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="saved-routes-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          id="add-route-btn"
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Route'}
        </button>
      </div>

      {/* Add Route Form */}
      {showForm && (
        <div className="glass-card add-route-form animate-in" id="add-route-form">
          <h2 className="section-title">
            <MapPin size={18} />
            Add New Route
          </h2>
          <form onSubmit={handleAdd} className="saved-route-form-new">
            <div className="form-group">
              <label className="form-label">Route Name (optional)</label>
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="form-input"
                placeholder="e.g. Home to Office"
                id="input-route-name"
              />
            </div>

            <div className="location-fields-row">
              <div className="location-field-col">
                <LocationSearch
                  label="Source"
                  placeholder="e.g. Koti, Hyderabad"
                  value={source}
                  onChange={setSource}
                  dotColor="start"
                  id="saved-source-search"
                />
              </div>

              <div className="location-arrow-divider">
                <Navigation size={16} />
              </div>

              <div className="location-field-col">
                <LocationSearch
                  label="Destination"
                  placeholder="e.g. Hitech City, Hyderabad"
                  value={destination}
                  onChange={setDestination}
                  dotColor="end"
                  id="saved-dest-search"
                />
              </div>
            </div>

            {formError && (
              <p className="form-error-message">
                <AlertCircle size={14} />
                {formError}
              </p>
            )}

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!source || !destination}
                id="submit-route-btn"
              >
                <BookmarkCheck size={18} />
                Save Route
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-banner animate-in">
          <AlertCircle size={16} />
          <p>{error === 'Network Error' ? 'Backend service unavailable.' : error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner text="Loading saved routes..." />}

      {/* Routes List */}
      {!loading && routes && (
        <div className="routes-grid">
          {routes.length === 0 ? (
            <div className="empty-state animate-in">
              <BookmarkCheck size={48} />
              <h3>No saved routes yet</h3>
              <p>Find a route from the Dashboard and save it, or add one above.</p>
            </div>
          ) : (
            routes.map((route, idx) => (
              <div key={route.id || idx} className={`animate-in animate-in-delay-${Math.min(idx + 1, 4)}`}>
                <RouteCard route={route} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
