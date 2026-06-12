import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookmarkCheck,
  BarChart3,
  Sparkles,
  Leaf,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/saved-routes', label: 'Saved Routes', icon: BookmarkCheck },
  { path: '/aqi-history', label: 'AQI History', icon: BarChart3 },
  { path: '/clean-travel', label: 'Clean Travel', icon: Sparkles },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} id="sidebar-nav">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Leaf size={22} />
          </div>
          <div className="brand-text">
            <h1>CleanRoute</h1>
            <span>Smart Air Quality Routing</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Navigation</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={onClose}
                id={`nav-${item.path.replace('/', '') || 'dashboard'}`}
              >
                <span className="nav-icon">
                  <Icon size={18} />
                </span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="nav-active-dot" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-card">
            <Leaf size={16} />
            <span>v1.0 — Portfolio Project</span>
          </div>
        </div>
      </aside>
    </>
  );
}
