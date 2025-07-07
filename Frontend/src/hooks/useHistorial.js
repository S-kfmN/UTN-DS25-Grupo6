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
  const baseUrl = 'http://localhost:3001';
  
  // Datos simulados de historial cuando la API no está disponible
  const historialSimulado = {
    'ABC123': [
      {
        id: 1,
        fecha: '2025-01-10',
        servicio: 'Cambio de Aceite',
        resultado: 'Completado',
        observaciones: 'Sin novedades, aceite en buen estado',
        repuestos: 'Filtro de aceite, Aceite 5W40',
        mecanico: 'Carlos López',
        patente: 'ABC123',
        kilometraje: 45000
      },
      {
        id: 2,
        fecha: '2024-12-01',
        servicio: 'Revisión de Frenos',
        resultado: 'Completado',
        observaciones: 'Pastillas desgastadas, se cambiaron',
        repuestos: 'Pastillas de freno delanteras',
        mecanico: 'María González',
        patente: 'ABC123',
        kilometraje: 42000
      }
    ],
    'XYZ789': [
      {
        id: 3,
        fecha: '2025-01-05',
        servicio: 'Limpieza de Filtro',
        resultado: 'Completado',
        observaciones: 'Filtro muy sucio, se recomienda cambio en 6 meses',
        repuestos: 'N/A',
        mecanico: 'Roberto Silva',
        patente: 'XYZ789',
        kilometraje: 38000
      }
    ]
  };

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
        
        // Intentar cargar desde la API real
        try {
          const response = await fetch(`${baseUrl}/historial?patente=${patente}`);
          if (response.ok) {
            const data = await response.json();
            setHistorial(data);
            return;
          }
        } catch (apiError) {
          console.log('API no disponible, usando datos simulados');
        }
        
        // Intentar cargar desde localStorage
        try {
          const historialGuardado = localStorage.getItem(`historial_${patente}`);
          console.log(`Cargando historial desde localStorage para ${patente}:`, historialGuardado);
          if (historialGuardado) {
            const historialLocal = JSON.parse(historialGuardado);
            console.log('Historial cargado desde localStorage:', historialLocal);
            setHistorial(historialLocal);
            return;
          }
        } catch (localError) {
          console.log('Error al cargar desde localStorage:', localError);
        }
        
        // Usar datos simulados como fallback
        const historialVehiculo = historialSimulado[patente] || [];
        setHistorial(historialVehiculo);
        
        // Guardar datos simulados en localStorage para futuras consultas
        try {
          localStorage.setItem(`historial_${patente}`, JSON.stringify(historialVehiculo));
        } catch (localError) {
          console.error('Error al guardar datos simulados en localStorage:', localError);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error en useHistorial:', err);
        // En caso de error, usar datos simulados
        const historialVehiculo = historialSimulado[patente] || [];
        setHistorial(historialVehiculo);
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

      // Intentar guardar en la API real
      try {
        const response = await fetch(`${baseUrl}/historial`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(servicioCompleto)
        });

        if (response.ok) {
          setHistorial(prev => [...prev, servicioCompleto]);
          return { success: true, servicio: servicioCompleto };
        }
      } catch (apiError) {
        console.log('API no disponible, guardando localmente');
      }
      
      // En caso de error o API no disponible, guardar localmente
      const nuevoHistorial = [...historial, servicioCompleto];
      setHistorial(nuevoHistorial);
      
      // Guardar en localStorage para persistencia
      try {
        localStorage.setItem(`historial_${patente}`, JSON.stringify(nuevoHistorial));
        console.log(`Servicio guardado en historial_${patente}:`, servicioCompleto);
      } catch (localError) {
        console.error('Error al guardar en localStorage:', localError);
      }
      
      return { success: true, servicio: servicioCompleto };
      
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
  const limpiarHistorial = () => {
    setHistorial([]);
    try {
      localStorage.removeItem(`historial_${patente}`);
    } catch (localError) {
      console.error('Error al limpiar localStorage:', localError);
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