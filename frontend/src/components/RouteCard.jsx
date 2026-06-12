import { useState, useEffect } from 'react';
import { MapPin, Navigation, Route, Loader2 } from 'lucide-react';
import { reverseGeocode } from '../services/geocodingService';
import './RouteCard.css';

/**
 * RouteCard — displays a saved route with human-readable place names.
 * Reverse-geocodes coordinates into readable location names.
 * Users never see raw coordinates.
 */
export default function RouteCard({ route }) {
  const [originName, setOriginName] = useState(null);
  const [destName, setDestName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadNames() {
      setLoading(true);
      try {
        const [origin, dest] = await Promise.all([
          reverseGeocode(route.startLat, route.startLon),
          reverseGeocode(route.endLat, route.endLon),
        ]);
        if (!cancelled) {
          setOriginName(origin?.shortName || 'Origin');
          setDestName(dest?.shortName || 'Destination');
        }
      } catch {
        if (!cancelled) {
          setOriginName('Origin');
          setDestName('Destination');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (route.startLat != null && route.startLon != null) {
      loadNames();
    } else {
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [route.startLat, route.startLon, route.endLat, route.endLon]);

  return (
    <div className="route-card glass-card animate-in" id={`route-card-${route.id || 'new'}`}>
      <div className="route-card-header">
        <div className="route-card-title">
          <div className="route-name-icon">
            <Route size={18} />
          </div>
          <h3 className="route-name">{route.routeName || 'Unnamed Route'}</h3>
        </div>
        {route.id && <span className="route-id-badge">#{route.id}</span>}
      </div>

      <div className="route-coordinates">
        <div className="coord-row">
          <div className="route-icon-group">
            <span className="route-dot start"></span>
            <span className="route-line"></span>
            <span className="route-dot end"></span>
          </div>
          <div className="route-endpoints">
            {loading ? (
              <div className="route-loading">
                <Loader2 size={14} className="route-loading-spin" />
                <span>Loading locations...</span>
              </div>
            ) : (
              <>
                <span className="route-point">
                  <MapPin size={14} />
                  <span className="coord-label">Origin</span>
                  <span className="coord-place-name">{originName}</span>
                </span>
                <span className="route-point">
                  <Navigation size={14} />
                  <span className="coord-label">Destination</span>
                  <span className="coord-place-name">{destName}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
