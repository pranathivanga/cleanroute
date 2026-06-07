import { getAQIColor, getAQILabel } from '../utils/helpers';
import './AQICard.css';

export default function AQICard({ aqi, label, size = 'md' }) {
  const color = getAQIColor(aqi);
  const aqiLabel = label || getAQILabel(aqi);

  return (
    <div className={`aqi-card aqi-card-${size}`} id="aqi-card">
      <div className="aqi-ring" style={{ '--aqi-color': color }}>
        <svg viewBox="0 0 120 120" className="aqi-svg">
          <circle cx="60" cy="60" r="52" className="aqi-track" />
          <circle
            cx="60"
            cy="60"
            r="52"
            className="aqi-progress"
            style={{
              stroke: color,
              strokeDasharray: `${(aqi / 5) * 327} 327`,
            }}
          />
        </svg>
        <div className="aqi-value" style={{ color }}>
          {aqi}
        </div>
      </div>
      <span className="aqi-label" style={{ color }}>
        {aqiLabel}
      </span>
    </div>
  );
}
