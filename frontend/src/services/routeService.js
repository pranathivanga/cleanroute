import API from './api';

/**
 * Route service — all route-related API calls go through Spring Boot.
 * No direct calls to external routing/weather APIs.
 *
 * Valid backend endpoints:
 *   GET  /api/routes
 *   GET  /api/weather
 *   GET  /api/saved-routes
 *   POST /api/saved-routes
 *   GET  /api/aqi-history
 *   GET  /api/aqi-history/clean-travel-window
 */
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
   * Save a new route (name + coordinates).
   * POST /api/saved-routes
   * Body: { routeName, startLat, startLon, endLat, endLon }
   */
  saveRoute: (routeData) => API.post('/api/saved-routes', routeData),
};

/**
 * Weather service — weather data from Spring Boot.
 */
export const weatherService = {
  /**
   * Get current weather data.
   * GET /api/weather
   */
  getWeather: () => API.get('/api/weather'),
};

/**
 * AQI History service — all AQI-related API calls go through Spring Boot.
 */
export const aqiService = {
  /**
   * Get historical AQI records.
   * GET /api/aqi-history
   */
  getHistory: () => API.get('/api/aqi-history'),

  /**
   * Get clean travel window recommendation.
   * GET /api/aqi-history/clean-travel-window
   */
  getCleanTravelWindow: () => API.get('/api/aqi-history/clean-travel-window'),
};
