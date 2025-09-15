import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestión del historial de servicios
 * Maneja operaciones CRUD para el historial de vehículos
 */
export const useHistorial = (patente = null) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL base para la API de historial
  const baseUrl = 'http://localhost:3000';
  


  // Cargar historial usando useEffect
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!patente) {
          setHistorial([]);
          setLoading(false);
          return;
        }
        
        // Cargar desde la API real
        const response = await fetch(`${baseUrl}/api/services/history?patente=${patente}`);
        if (response.ok) {
          const data = await response.json();
          setHistorial(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error en useHistorial:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [patente]);

  /**
   * Registrar un nuevo servicio en el historial
   * @param {Object} datosServicio - Datos del servicio realizado
   */
  const registrarServicio = async (datosServicio) => {
    try {
      // Crear fecha en formato local para evitar problemas de zona horaria
      const hoy = new Date();
      const año = hoy.getFullYear();
      const mes = String(hoy.getMonth() + 1).padStart(2, '0');
      const dia = String(hoy.getDate()).padStart(2, '0');
      const fecha = `${año}-${mes}-${dia}`;
      
      const servicioCompleto = {
        ...datosServicio,
        id: Date.now(),
        fecha: fecha,
        patente: patente
      };

      // Guardar en la API real
      const response = await fetch(`${baseUrl}/api/services/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicioCompleto)
      });

      if (response.ok) {
        setHistorial(prev => [...prev, servicioCompleto]);
        return { success: true, servicio: servicioCompleto };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error al registrar servicio:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Obtener historial por fecha
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  const obtenerHistorialPorFecha = (fecha) => {
    return historial.filter(servicio => servicio.fecha === fecha);
  };

  /**
   * Obtener historial por servicio
   * @param {string} tipoServicio - Tipo de servicio
   */
  const obtenerHistorialPorServicio = (tipoServicio) => {
    return historial.filter(servicio => servicio.servicio === tipoServicio);
  };

  /**
   * Obtener estadísticas del historial
   */
  const obtenerEstadisticas = () => {
    const total = historial.length;
    const completados = historial.filter(s => s.resultado === 'Completado').length;
    const pendientes = historial.filter(s => s.resultado === 'Pendiente').length;
    
    return {
      total,
      completados,
      pendientes,
      porcentajeCompletados: total > 0 ? Math.round((completados / total) * 100) : 0
    };
  };

  /**
   * Limpiar historial del vehículo
   */
  const limpiarHistorial = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/services/history?patente=${patente}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setHistorial([]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      throw error;
    }
  };

  return {
    historial,
    loading,
    error,
    registrarServicio,
    obtenerHistorialPorFecha,
    obtenerHistorialPorServicio,
    obtenerEstadisticas,
    limpiarHistorial
  };
}; 