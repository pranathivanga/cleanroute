import { MapPin, Navigation, Route } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import './RouteCard.css';

export default function RouteCard({ route }) {
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
            <span className="route-point">
              <MapPin size={14} />
              <span className="coord-label">Origin</span>
              <span className="coord-value">({formatNumber(route.startLat, 4)}, {formatNumber(route.startLon, 4)})</span>
            </span>
            <span className="route-point">
              <Navigation size={14} />
              <span className="coord-label">Destination</span>
              <span className="coord-value">({formatNumber(route.endLat, 4)}, {formatNumber(route.endLon, 4)})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
