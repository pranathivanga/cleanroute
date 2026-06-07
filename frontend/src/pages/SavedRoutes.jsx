import { useEffect, useState } from 'react';
import { BookmarkCheck, Plus, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { routeService } from '../services/routeService';
import useApi from '../hooks/useApi';
import RouteCard from '../components/RouteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './SavedRoutes.css';

export default function SavedRoutes() {
  const { data: routes, loading, error, execute: fetchRoutes } = useApi(() =>
    routeService.getSavedRoutes()
  );

  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    routeName: '',
    startLat: '',
    startLon: '',
    endLat: '',
    endLon: '',
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        routeName: form.routeName.trim(),
        startLat: parseFloat(form.startLat),
        startLon: parseFloat(form.startLon),
        endLat: parseFloat(form.endLat),
        endLon: parseFloat(form.endLon),
      };
      await routeService.saveRoute(payload);
      setShowForm(false);
      setForm({
        routeName: '',
        startLat: '',
        startLon: '',
        endLat: '',
        endLon: '',
      });
      setToast({ type: 'success', message: 'Route saved successfully!' });
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
        <p>Manage your bookmarked routes and their coordinates</p>
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
          <form onSubmit={handleAdd} className="saved-route-form-grid">
            <div className="form-group form-group-wide">
              <label className="form-label">Route Name</label>
              <input
                name="routeName"
                type="text"
                value={form.routeName}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g. Home to Office"
                id="input-route-name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Latitude</label>
              <input name="startLat" type="number" step="any" value={form.startLat} onChange={handleChange} className="form-input" required placeholder="17.385" />
            </div>
            <div className="form-group">
              <label className="form-label">Start Longitude</label>
              <input name="startLon" type="number" step="any" value={form.startLon} onChange={handleChange} className="form-input" required placeholder="78.4867" />
            </div>
            <div className="form-group">
              <label className="form-label">End Latitude</label>
              <input name="endLat" type="number" step="any" value={form.endLat} onChange={handleChange} className="form-input" required placeholder="17.4399" />
            </div>
            <div className="form-group">
              <label className="form-label">End Longitude</label>
              <input name="endLon" type="number" step="any" value={form.endLon} onChange={handleChange} className="form-input" required placeholder="78.4983" />
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary btn-lg" id="submit-route-btn">
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
          <p>{error}</p>
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
              <p>Find a route from the Dashboard and save it, or add one manually above.</p>
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
