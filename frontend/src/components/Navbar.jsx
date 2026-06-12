import { Menu, Bell } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick} id="menu-toggle">
          <Menu size={20} />
        </button>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" id="notifications-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        <div className="navbar-avatar" id="user-avatar">
          <span>CR</span>
        </div>
      </div>
    </header>
  );
}
