import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import SavedRoutes from '../pages/SavedRoutes';
import AQIHistory from '../pages/AQIHistory';
import CleanTravel from '../pages/CleanTravel';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/saved-routes" element={<SavedRoutes />} />
      <Route path="/aqi-history" element={<AQIHistory />} />
      <Route path="/clean-travel" element={<CleanTravel />} />
    </Routes>
  );
}
