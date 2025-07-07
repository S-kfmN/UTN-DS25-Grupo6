import { useEffect } from 'react';
import { usarAuth } from '../context/AuthContext';

/**
 * Hook personalizado para sincronizar datos del localStorage con el contexto
 * Se ejecuta automáticamente cuando se monta el componente
 */
export const useLocalStorageSync = () => {
  const { refrescarUsuario } = usarAuth();

  useEffect(() => {
    // Refrescar datos del usuario al montar el componente
    refrescarUsuario();
    
    // Escuchar cambios en localStorage (solo cuando cambia desde otra pestaña)
    const handleStorageChange = (e) => {
      if (e.key === 'usuario' || e.key === 'reservas' || e.key === 'usuarios') {
        refrescarUsuario();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refrescarUsuario]);
}; 