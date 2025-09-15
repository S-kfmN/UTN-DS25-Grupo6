import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar llamadas a APIs
 * @param {string} url - URL de la API
 * @param {Object} options - Opciones de fetch (método, headers, body, etc.)
 * @param {Array} dependencies - Dependencias para re-ejecutar el fetch
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      
    } catch (err) {
      setError(err.message);
      console.error('Error en useFetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, ...dependencies]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}; 