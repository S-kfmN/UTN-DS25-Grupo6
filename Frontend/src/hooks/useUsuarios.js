import { useState } from 'react';
import apiService from '../services/apiService';

// Datos simulados por si la API no responde
const usuariosSimulados = [
  {
    id: 1,
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@lubricentro.com',
    telefono: '11 1234-5678',
    dni: '12345678',
    rol: 'admin',
  },
  {
    id: 2,
    nombre: 'Juan',
    apellido: 'Perez',
    email: 'juan.perez@email.com',
    telefono: '11 2345-6789',
    dni: '23456789',
    rol: 'cliente',
  },
  {
    id: 3,
    nombre: 'Maria',
    apellido: 'Gonzalez',
    email: 'maria.gonzalez@email.com',
    telefono: '11 3456-7890',
    dni: '34567890',
    rol: 'cliente',
  },
];

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
      // Fallback: filtrar localmente
      const textoLower = texto.toLowerCase();
      const filtrados = usuariosSimulados.filter(u =>
        u.nombre.toLowerCase().includes(textoLower) ||
        u.apellido.toLowerCase().includes(textoLower) ||
        u.dni.includes(texto) ||
        u.email.toLowerCase().includes(textoLower)
      );
      setUsuarios(filtrados);
      setError('No se pudo conectar a la API, usando datos simulados');
    } finally {
      setLoading(false);
    }
  };

  return { usuarios, loading, error, buscarUsuarios };
} 