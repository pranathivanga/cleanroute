import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  return (
    <div className="spinner-container" id="loading-spinner">
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
