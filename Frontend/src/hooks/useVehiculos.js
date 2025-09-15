import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestión de vehículos
 * Maneja operaciones CRUD para vehículos del usuario
 */
export const useVehiculos = (userId) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL base para la API de vehículos
  const baseUrl = 'http://localhost:3000';
  


  // Cargar vehículos usando useEffect
  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (userId) {
          const response = await fetch(`${baseUrl}/api/vehicles?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setVehiculos(data);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          setVehiculos([]);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error en useVehiculos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarVehiculos();
  }, [userId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (userId) {
        const response = await fetch(`${baseUrl}/api/vehicles?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setVehiculos(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        setVehiculos([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error en refetch:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar un nuevo vehículo
   * @param {Object} nuevoVehiculo - Datos del vehículo a agregar
   */
  const agregarVehiculo = async (nuevoVehiculo) => {
    try {
      const vehiculoCompleto = {
        ...nuevoVehiculo,
        id: Date.now(), // ID temporal
        userId: userId || 1,
        estado: 'registrado'
      };

      // Simular llamada a API
      const response = await fetch(`${baseUrl}/vehiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehiculoCompleto)
      });

      if (response.ok) {
        setVehiculos(prev => [...prev, vehiculoCompleto]);
        return { success: true, vehiculo: vehiculoCompleto };
      }
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      // En caso de error, agregar localmente
      const vehiculoCompleto = {
        ...nuevoVehiculo,
        id: Date.now(),
        userId: userId || 1,
        estado: 'registrado'
      };
      setVehiculos(prev => [...prev, vehiculoCompleto]);
      return { success: true, vehiculo: vehiculoCompleto };
    }
  };

  /**
   * Actualizar estado de un vehículo
   * @param {number} vehiculoId - ID del vehículo
   * @param {string} nuevoEstado - Nuevo estado del vehículo
   */
  const actualizarEstadoVehiculo = async (vehiculoId, nuevoEstado) => {
    try {
      const vehiculoActualizado = vehiculos.find(v => v.id === vehiculoId);
      if (!vehiculoActualizado) return { success: false, error: 'Vehículo no encontrado' };

      const vehiculoModificado = { ...vehiculoActualizado, estado: nuevoEstado };

      // Simular llamada a API
      const response = await fetch(`${baseUrl}/vehiculos/${vehiculoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        setVehiculos(prev => 
          prev.map(v => v.id === vehiculoId ? vehiculoModificado : v)
        );
        return { success: true, vehiculo: vehiculoModificado };
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      // En caso de error, actualizar localmente
      setVehiculos(prev => 
        prev.map(v => v.id === vehiculoId ? { ...v, estado: nuevoEstado } : v)
      );
      return { success: true };
    }
  };

  /**
   * Eliminar un vehículo
   * @param {number} vehiculoId - ID del vehículo a eliminar
   */
  const eliminarVehiculo = async (vehiculoId) => {
    try {
      // Simular llamada a API
      const response = await fetch(`${baseUrl}/vehiculos/${vehiculoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setVehiculos(prev => prev.filter(v => v.id !== vehiculoId));
        return { success: true };
      }
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      // En caso de error, eliminar localmente
      setVehiculos(prev => prev.filter(v => v.id !== vehiculoId));
      return { success: true };
    }
  };

  /**
   * Buscar vehículos por patente o propietario
   * @param {string} termino - Término de búsqueda
   */
  const buscarVehiculos = (termino) => {
    if (!termino) return vehiculos;
    
    return vehiculos.filter(vehiculo => 
      vehiculo.patente.toLowerCase().includes(termino.toLowerCase()) ||
      vehiculo.marca.toLowerCase().includes(termino.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(termino.toLowerCase())
    );
  };

  return {
    vehiculos,
    loading,
    error,
    refetch,
    agregarVehiculo,
    actualizarEstadoVehiculo,
    eliminarVehiculo,
    buscarVehiculos
  };
}; 