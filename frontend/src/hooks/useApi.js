import { useState, useCallback } from 'react';

/**
 * Generic hook for async API calls with loading/error state management.
 * Provides: data, loading, error, execute, reset
 *
 * Error messages are user-friendly (not raw stack traces).
 */
export default function useApi(apiFunc) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        // Use the user-friendly message from our API interceptor
        const message =
          err.userMessage ||
          err.response?.data?.message ||
          (err.message === 'Network Error'
            ? 'Backend service unavailable. Please ensure the server is running.'
            : err.message) ||
          'Request failed. Please try again.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
