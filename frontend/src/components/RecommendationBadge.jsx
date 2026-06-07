import { getHealthBadge } from '../utils/helpers';
import './RecommendationBadge.css';

export default function RecommendationBadge({ rating, size = 'md' }) {
  const { className, label, emoji } = getHealthBadge(rating);

  return (
    <span className={`recommendation-badge badge ${className} recommendation-${size}`} id="recommendation-badge">
      <span className="badge-dot"></span>
      <span className="badge-emoji">{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
