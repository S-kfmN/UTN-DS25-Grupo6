import { useEffect, useCallback } from 'react';
import { usarAuth } from '../context/AuthContext';

export const useReservasSync = () => {
  const { refrescarUsuario, reservas } = usarAuth();

  const sincronizarReservas = useCallback(() => {
    console.log('Sincronizando reservas...');
    refrescarUsuario();
  }, [refrescarUsuario]);

  useEffect(() => {
    // Escuchar eventos de reservas actualizadas
    const manejarReservasActualizadas = (e) => {
      console.log('Evento de reservas actualizadas recibido:', e.detail);
      sincronizarReservas();
    };

    // Escuchar cambios en localStorage
    const manejarCambioLocalStorage = (e) => {
      if (e.key === 'reservas') {
        console.log('Cambio detectado en localStorage - reservas');
        sincronizarReservas();
      }
    };

    // Monitorear cambios en la misma pestaña
    const intervalo = setInterval(() => {
      const reservasGuardadas = localStorage.getItem('reservas');
      if (reservasGuardadas) {
        const reservasParseadas = JSON.parse(reservasGuardadas);
        if (reservasParseadas.length !== (reservas?.length || 0)) {
          console.log('Cambio detectado en reservas - actualizando...');
          sincronizarReservas();
        }
      }
    }, 3000); // Verificar cada 3 segundos

    // Agregar event listeners
    window.addEventListener('reservasActualizadas', manejarReservasActualizadas);
    window.addEventListener('storage', manejarCambioLocalStorage);

    // Cleanup
    return () => {
      window.removeEventListener('reservasActualizadas', manejarReservasActualizadas);
      window.removeEventListener('storage', manejarCambioLocalStorage);
      clearInterval(intervalo);
    };
  }, [sincronizarReservas, reservas?.length]);

  return { sincronizarReservas };
}; 