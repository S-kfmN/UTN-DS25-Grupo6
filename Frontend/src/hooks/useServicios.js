import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestión de servicios
 * Maneja operaciones CRUD para servicios del lubricentro
 */
export const useServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL base para la API de servicios
  const baseUrl = 'http://localhost:3000';
  


  // Cargar servicios usando useEffect
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${baseUrl}/api/services`);
        if (response.ok) {
          const data = await response.json();
          setServicios(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error en useServicios:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

  /**
   * Obtener un servicio por ID
   * @param {number} servicioId - ID del servicio
   */
  const obtenerServicioPorId = (servicioId) => {
    return servicios.find(servicio => servicio.id === servicioId);
  };

  /**
   * Obtener servicios por categoría
   * @param {string} categoria - Categoría de servicios
   */
  const obtenerServiciosPorCategoria = (categoria) => {
    return servicios.filter(servicio => servicio.categoria === categoria);
  };

  /**
   * Buscar servicios por nombre
   * @param {string} termino - Término de búsqueda
   */
  const buscarServicios = (termino) => {
    if (!termino) return servicios;
    
    return servicios.filter(servicio => 
      servicio.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(termino.toLowerCase())
    );
  };

  return {
    servicios,
    loading,
    error,
    obtenerServicioPorId,
    obtenerServiciosPorCategoria,
    buscarServicios
  };
}; 