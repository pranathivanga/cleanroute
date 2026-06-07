import API from './api';

export const routeService = {
  /**
   * Calculate route with AQI data.
   * GET /api/routes?startLon=&startLat=&endLon=&endLat=
   */
  findRoute: (startLon, startLat, endLon, endLat) =>
    API.get('/api/routes', {
      params: { startLon, startLat, endLon, endLat },
    }),

  /**
   * Get all saved routes.
   * GET /api/saved-routes
   */
  getSavedRoutes: () => API.get('/api/saved-routes'),

  /**
   * Save a new route (name + coordinates only, backend computes AQI).
   * POST /api/saved-routes
   * Body: { routeName, startLat, startLon, endLat, endLon }
   */
  saveRoute: (routeData) => API.post('/api/saved-routes', routeData),
};

export const aqiService = {
  /**
   * Get historical AQI records.
   * GET /api/aqi-history
   */
  getHistory: () => API.get('/api/aqi-history'),
};

export const recommendationService = {
  /**
   * Get route recommendations with travel advisories.
   * GET /api/recommendations
   */
  getRecommendations: () => API.get('/api/recommendations'),
};
