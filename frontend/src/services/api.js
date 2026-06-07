import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    console.error('[API Error]', message);
    return Promise.reject(error);
  }
);

export default API;
