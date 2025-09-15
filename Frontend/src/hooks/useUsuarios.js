import { useState } from 'react';
import apiService from '../services/apiService';



// Hook para buscar usuarios
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar usuarios por texto
  const buscarUsuarios = async (texto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.searchUsers(texto);
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al buscar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  return { usuarios, loading, error, buscarUsuarios };
} 