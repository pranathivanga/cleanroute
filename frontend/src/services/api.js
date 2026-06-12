import axios from 'axios';

/**
 * Centralized API client for all backend communication.
 * Frontend must ONLY call http://localhost:8081.
 * NO direct calls to openrouteservice.org, api.heigit.org, or openweathermap.org.
 */
const API = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — normalize error messages
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error / backend unreachable
      error.userMessage = 'Backend service unavailable. Please ensure the server is running.';
    } else {
      error.userMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Something went wrong';
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
