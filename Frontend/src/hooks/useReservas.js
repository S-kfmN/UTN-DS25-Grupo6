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

  // Datos simulados de reservas cuando la API no está disponible
  const reservasSimuladas = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      apellido: 'García',
      telefono: '123-456-7890',
      patente: 'ABC123',
      modelo: 'Renault Clio',
      fecha: '2025-01-15',
      hora: '10:00',
      servicio: 'Cambio de Aceite',
      estado: 'confirmado',
      observaciones: 'Cliente frecuente',
      userId: 1
    },
    {
      id: 2,
      nombre: 'María López',
      apellido: 'Rodríguez',
      telefono: '098-765-4321',
      patente: 'XYZ789',
      modelo: 'Renault Megane',
      fecha: '2025-01-15',
      hora: '14:30',
      servicio: 'Limpieza de Filtro',
      estado: 'pendiente',
      observaciones: 'Primera vez',
      userId: 2
    },
    {
      id: 3,
      nombre: 'Carlos Silva',
      apellido: 'Martínez',
      telefono: '555-123-4567',
      patente: 'DEF456',
      modelo: 'Renault Captur',
      fecha: '2025-01-20',
      hora: '09:00',
      servicio: 'Revisión de Niveles',
      estado: 'confirmado',
      observaciones: '',
      userId: 3
    },
    {
      id: 4,
      nombre: 'Ana González',
      apellido: 'Fernández',
      telefono: '777-888-9999',
      patente: 'GHI789',
      modelo: 'Renault Duster',
      fecha: '2025-01-16',
      hora: '11:00',
      servicio: 'Cambio de Aceite',
      estado: 'cancelado',
      observaciones: 'Cliente canceló por enfermedad',
      userId: 4
    },
    {
      id: 5,
      nombre: 'Roberto Díaz',
      apellido: 'Herrera',
      telefono: '444-555-6666',
      patente: 'JKL012',
      modelo: 'Renault Logan',
      fecha: '2025-01-17',
      hora: '15:00',
      servicio: 'Limpieza de Filtro',
      estado: 'confirmado',
      observaciones: 'Urgente',
      userId: 5
    },
    {
      id: 6,
      nombre: 'Laura Morales',
      apellido: 'Vargas',
      telefono: '333-444-5555',
      patente: 'MNO345',
      modelo: 'Renault Sandero',
      fecha: '2025-01-18',
      hora: '08:30',
      servicio: 'Revisión de Frenos',
      estado: 'pendiente',
      observaciones: 'Cliente nuevo',
      userId: 6
    }
  ];

  // Cargar reservas usando useEffect
  useEffect(() => {
    const cargarReservas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar cargar desde la API real
        try {
          const data = await apiService.getReservations(userId);
          setReservas(data);
          return;
        } catch (apiError) {
          console.log('API no disponible, usando datos simulados:', apiError.message);
        }
        
        // Usar datos simulados como fallback
        setReservas(reservasSimuladas);
        
      } catch (err) {
        setError(err.message);
        console.error('Error en useReservas:', err);
        // En caso de error, usar datos simulados
        setReservas(reservasSimuladas);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, [userId]);

  const refetch = () => {
    setLoading(true);
    setReservas(reservasSimuladas);
    setLoading(false);
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
        console.log('API no disponible, creando localmente:', apiError.message);
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
        console.log('API no disponible, cancelando localmente:', apiError.message);
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