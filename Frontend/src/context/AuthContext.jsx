import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const usarAuth = () => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('usarAuth debe ser usado dentro de un AuthProvider');
  }
  return contexto;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un usuario guardado al cargar la app
  useEffect(() => {
    const verificarUsuarioGuardado = async () => {
      try {
        setCargando(true);
        setError(null);
        
        // Solo verificar token del localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verificar si el token es válido con la API
          try {
            const perfilActualizado = await apiService.getUserProfile();
            setUsuario(perfilActualizado);
          } catch (apiError) {
            // Token inválido, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            setUsuario(null);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar datos de sesión');
      } finally {
        setCargando(false);
      }
    };

    verificarUsuarioGuardado();
  }, []);

  // Función para iniciar sesión
  const iniciarSesion = useCallback(async (credenciales) => {
    try {
      setCargando(true);
      setError(null);
      
      // Transformar datos para que coincidan con el backend
      const credencialesParaBackend = {
        email: credenciales.email,
        password: credenciales.contraseña
      };
      
      // Login con API real
      const response = await apiService.login(credencialesParaBackend);
      
      // Transformar datos del usuario para el frontend
      const usuarioTransformado = {
        ...response.data.user,
        nombre: response.data.user.name, // Mapear name -> nombre
        rol: response.data.user.role     // Mapear role -> rol para compatibilidad
      };
      
      // Guardar solo el token
      localStorage.setItem('token', response.data.token);
      setUsuario(usuarioTransformado);
      
      return { exito: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
      return { exito: false, error: error.message };
    } finally {
      setCargando(false);
    }
  }, [usuarios]);

  // Función para registrar usuario
  const registrarUsuario = useCallback(async (datosUsuario) => {
    try {
      setCargando(true);
      setError(null);
      
      // Transformar datos para que coincidan con el backend
      const datosParaBackend = {
        name: `${datosUsuario.nombre} ${datosUsuario.apellido}`.trim(),
        email: datosUsuario.email,
        password: datosUsuario.contraseña,
        phone: datosUsuario.telefono
      };
      
      // Registro con API real
      const response = await apiService.register(datosParaBackend);
      
      // Transformar datos del usuario para el frontend
      const usuarioTransformado = {
        ...response.data.user,
        nombre: response.data.user.name, // Mapear name -> nombre
        rol: response.data.user.role     // Mapear role -> rol para compatibilidad
      };
      
      return { exito: true, usuario: usuarioTransformado };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Error al registrar usuario');
      return { exito: false, error: error.message };
    } finally {
      setCargando(false);
    }
  }, [usuarios]);

  // Función para cerrar sesión
  const cerrarSesion = useCallback(async () => {
    try {
      // Intentar logout con API real
      try {
        await apiService.logout();
      } catch (apiError) {

      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar solo el token y el usuario actual, pero mantener los datos en localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
      setError(null);
    }
  }, []);

  // Función para actualizar usuario
  const actualizarUsuario = useCallback(async (nuevosDatos) => {
    try {
      setCargando(true);
      setError(null);
      
      // Actualizar con API real
      const usuarioActualizado = await apiService.updateUserProfile(nuevosDatos);
      setUsuario(usuarioActualizado);
      
      return { exito: true, usuario: usuarioActualizado };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError('Error al actualizar perfil');
      return { exito: false, error: error.message };
    } finally {
      setCargando(false);
    }
  }, []);

  // Función para agregar vehículo
  const agregarVehiculo = useCallback(async (nuevoVehiculo) => {
    try {
      // Transformar datos para el backend
      const vehiculoParaBackend = {
        license: nuevoVehiculo.patente,
        brand: nuevoVehiculo.marca,
        model: nuevoVehiculo.modelo,
        year: parseInt(nuevoVehiculo.año),
        color: nuevoVehiculo.color,
        userId: usuario?.id
      };

      // Crear vehículo en el backend
      const response = await apiService.createVehicle(vehiculoParaBackend);
      
      // El backend devuelve { success: true, data: {...} }
      const vehiculoData = response.data;
      
      // Actualizar usuario local con el nuevo vehículo
      const vehiculoCompleto = {
        ...vehiculoData,
        patente: vehiculoData.license,
        marca: vehiculoData.brand,
        modelo: vehiculoData.model,
        año: vehiculoData.year,
        color: vehiculoData.color,
        estado: 'activo'
      };

      return { exito: true, vehiculo: vehiculoCompleto };
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario]);

  // Función para actualizar estado de vehículo
  const actualizarEstadoVehiculo = useCallback(async (vehiculoId, nuevoEstado) => {
    try {
      // Actualizar estado en el backend
      await apiService.updateVehicle(vehiculoId, { status: nuevoEstado });
      return { exito: true };
    } catch (error) {
      console.error('Error al actualizar estado del vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, []);

  // Función para actualizar vehículo
  const actualizarVehiculo = useCallback(async (vehiculoId, nuevosDatos) => {
    try {
      // Transformar datos para el backend
      const vehiculoParaBackend = {
        license: nuevosDatos.patente,
        brand: nuevosDatos.marca,
        model: nuevosDatos.modelo,
        year: parseInt(nuevosDatos.año),
        color: nuevosDatos.color
      };

      // Actualizar vehículo en el backend
      const response = await apiService.updateVehicle(vehiculoId, vehiculoParaBackend);
      
      // El backend devuelve { success: true, data: {...} }
      const vehiculoData = response.data;
      
      return { exito: true };
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario]);

  // Función para eliminar vehículo
  const eliminarVehiculo = useCallback(async (vehiculoId) => {
    try {
      // Eliminar vehículo en el backend
      await apiService.deleteVehicle(vehiculoId);
      
      return { exito: true };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario]);

  // Función para crear reserva
  const crearReserva = useCallback(async (datosReserva) => {
    try {
      // Crear reserva en el backend
      const response = await apiService.createReservation(datosReserva);
      return { exito: true, reserva: response.data };
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return { exito: false, error: error.message };
    }
  }, []);

  // Función para obtener reservas del usuario
  const obtenerReservasUsuario = useCallback(async () => {
    try {
      const reservas = await apiService.getReservations(usuario?.id);
      return reservas;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      return [];
    }
  }, [usuario?.id]);

  // Función para cancelar reserva
  const cancelarReserva = useCallback(async (reservaId) => {
    try {
      await apiService.cancelReservation(reservaId);
      return { exito: true };
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return { exito: false, error: error.message };
    }
  }, []);

  // Función para obtener vehículos activos
  const obtenerVehiculosActivos = useCallback(async () => {
    try {
      const vehiculos = await cargarVehiculosUsuario();
      return vehiculos.filter(v => v.estado === 'activo' || !v.estado);
    } catch (error) {
      console.error('Error al obtener vehículos activos:', error);
      return [];
    }
  }, []);

  // Función para cambiar rol (solo para desarrollo)
  const cambiarRol = useCallback((nuevoRol) => {
    if (usuario) {
      const usuarioActualizado = { ...usuario, rol: nuevoRol };
      setUsuario(usuarioActualizado);
    }
  }, [usuario]);

  // Función para verificar si es admin
  const esAdmin = useCallback(() => {
    return usuario?.role === 'ADMIN' || usuario?.rol === 'ADMIN';
  }, [usuario]);

  // Función para verificar si está autenticado
  const estaAutenticado = useCallback(() => {
    return !!usuario;
  }, [usuario]);

  // Función para cargar vehículos del usuario desde la API
  const cargarVehiculosUsuario = useCallback(async () => {
    if (!usuario?.id) {
      console.log('⚠️ cargarVehiculosUsuario: No hay usuario.id');
      return [];
    }
    
    try {
      console.log('📡 cargarVehiculosUsuario: Llamando a apiService.getVehicles...');
      const response = await apiService.getVehicles(usuario.id);
      console.log('📡 cargarVehiculosUsuario: Respuesta del backend:', response);
      
      // El backend devuelve { success: true, data: [...] }
      const vehiculos = response.data || [];
      console.log('🚗 cargarVehiculosUsuario: Vehículos del backend:', vehiculos);
      
      // Transformar datos del backend al formato del frontend
      const vehiculosTransformados = vehiculos.map(vehiculo => ({
        ...vehiculo,
        patente: vehiculo.license,
        marca: vehiculo.brand,
        modelo: vehiculo.model,
        año: vehiculo.year,
        color: vehiculo.color,
        estado: vehiculo.status?.toLowerCase() || 'activo'
      }));

      console.log('🔄 cargarVehiculosUsuario: Vehículos transformados:', vehiculosTransformados);
      
      return vehiculosTransformados;
    } catch (error) {
      console.error('❌ cargarVehiculosUsuario: Error al cargar vehículos:', error);
      return [];
    }
  }, [usuario]);

  // Función para buscar usuarios
  const buscarUsuarios = useCallback(async (termino) => {
    try {
      const usuarios = await apiService.searchUsers(termino);
      return usuarios;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      return [];
    }
  }, []);

  // Función para limpiar errores
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  // Valor del contexto
  const valor = {
    // Estados
    usuario,
    cargando,
    error,
    
    // Funciones de autenticación
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    actualizarUsuario,
    
    // Funciones de vehículos
    agregarVehiculo,
    actualizarVehiculo,
    actualizarEstadoVehiculo,
    eliminarVehiculo,
    obtenerVehiculosActivos,
    cargarVehiculosUsuario,
    
    // Funciones de reservas
    crearReserva,
    obtenerReservasUsuario,
    cancelarReserva,
    
    // Funciones de utilidad
    cambiarRol,
    esAdmin,
    estaAutenticado,
    buscarUsuarios,
    limpiarError
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}; 