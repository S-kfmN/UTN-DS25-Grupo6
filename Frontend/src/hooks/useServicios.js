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
  const baseUrl = 'http://localhost:3001';
  
  // Datos simulados de servicios cuando la API no está disponible
  const serviciosSimulados = [
    {
      id: 1,
      nombre: 'Cambio de Aceite',
      descripcion: 'Cambio completo de aceite y filtro',
      duracion: '30 minutos',
      precio: 15000,
      categoria: 'Mantenimiento'
    },
    {
      id: 2,
      nombre: 'Limpieza de Filtro',
      descripcion: 'Limpieza y revisión de filtros',
      duracion: '20 minutos',
      precio: 8000,
      categoria: 'Mantenimiento'
    },
    {
      id: 3,
      nombre: 'Revisión de Niveles',
      descripcion: 'Control de todos los fluidos del vehículo',
      duracion: '15 minutos',
      precio: 5000,
      categoria: 'Revisión'
    },
    {
      id: 4,
      nombre: 'Cambio de Bujías',
      descripcion: 'Reemplazo de bujías de encendido',
      duracion: '45 minutos',
      precio: 12000,
      categoria: 'Mantenimiento'
    },
    {
      id: 5,
      nombre: 'Revisión de Frenos',
      descripcion: 'Inspección completa del sistema de frenos',
      duracion: '40 minutos',
      precio: 10000,
      categoria: 'Seguridad'
    }
  ];

  // Cargar servicios usando useEffect
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar cargar desde la API real
        try {
          const response = await fetch(`${baseUrl}/servicios`);
          if (response.ok) {
            const data = await response.json();
            setServicios(data);
            return;
          }
        } catch (apiError) {
          console.log('API no disponible, usando datos simulados');
        }
        
        // Usar datos simulados como fallback
        setServicios(serviciosSimulados);
        
      } catch (err) {
        setError(err.message);
        console.error('Error en useServicios:', err);
        // En caso de error, usar datos simulados
        setServicios(serviciosSimulados);
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