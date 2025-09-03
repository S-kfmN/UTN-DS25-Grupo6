import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

/**
 * Hook personalizado para gestión de reservas
 * Maneja operaciones CRUD para reservas
 */
export const useReservas = (userId = null) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Cargar reservas usando useEffect
  useEffect(() => {
    const cargarReservas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getReservations(userId);
        setReservas(data);
        
      } catch (err) {
        setError(err.message);
        console.error('Error en useReservas:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, [userId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getReservations(userId);
      setReservas(data);
    } catch (err) {
      setError(err.message);
      console.error('Error en refetch:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear una nueva reserva
   * @param {Object} datosReserva - Datos de la reserva a crear
   */
  const crearReserva = async (datosReserva) => {
    try {
      const reservaCompleta = {
        ...datosReserva,
        estado: 'pendiente',
        userId: userId
      };

      // Intentar crear en la API real
      try {
        const nuevaReserva = await apiService.createReservation(reservaCompleta);
        setReservas(prev => [...prev, nuevaReserva]);
        return { success: true, reserva: nuevaReserva };
      } catch (apiError) {
        // API no disponible, continuar con fallback local
      }
      
      // Fallback: crear localmente
      const reservaLocal = {
        ...reservaCompleta,
        id: Date.now()
      };
      setReservas(prev => [...prev, reservaLocal]);
      return { success: true, reserva: reservaLocal };
      
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Cancelar una reserva
   * @param {number} reservaId - ID de la reserva a cancelar
   */
  const cancelarReserva = async (reservaId) => {
    try {
      // Intentar cancelar en la API real
      try {
        await apiService.cancelReservation(reservaId);
        setReservas(prev => 
          prev.map(r => r.id === reservaId ? { ...r, estado: 'cancelado' } : r)
        );
        return { success: true };
      } catch (apiError) {
        // API no disponible, continuar con fallback local
      }
      
      // Fallback: actualizar localmente
      setReservas(prev => 
        prev.map(r => r.id === reservaId ? { ...r, estado: 'cancelado' } : r)
      );
      
      return { success: true };
      
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Obtener reservas de un usuario específico
   * @param {number} userId - ID del usuario
   */
  const obtenerReservasUsuario = (userId) => {
    return reservas.filter(reserva => reserva.userId === userId);
  };

  /**
   * Obtener reservas por fecha
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  const obtenerReservasPorFecha = (fecha) => {
    return reservas.filter(reserva => reserva.fecha === fecha);
  };

  /**
   * Verificar si un día tiene reservas
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  const diaTieneReservas = (fecha) => {
    return reservas.some(reserva => reserva.fecha === fecha);
  };

  /**
   * Filtrar reservas por estado
   * @param {string} estado - Estado de la reserva
   */
  const filtrarPorEstado = (estado) => {
    if (!estado || estado === 'todos') return reservas;
    return reservas.filter(reserva => reserva.estado === estado);
  };

  return {
    reservas,
    loading,
    error,
    refetch,
    crearReserva,
    cancelarReserva,
    obtenerReservasUsuario,
    obtenerReservasPorFecha,
    diaTieneReservas,
    filtrarPorEstado
  };
}; 