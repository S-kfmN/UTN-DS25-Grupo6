import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Verificar si hay un usuario guardado al cargar la app
  useEffect(() => {
    const verificarUsuarioGuardado = async () => {
      try {
        setCargando(true);
        setError(null);
        
        // Intentar obtener token del localStorage
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');
        
        if (token && usuarioGuardado) {
          // Verificar si el token es válido con la API
          try {
            const perfilActualizado = await apiService.getUserProfile();
            setUsuario(perfilActualizado);
          } catch (apiError) {

            const usuarioData = JSON.parse(usuarioGuardado);
            
            // Cargar vehículos desde almacenamiento separado
            const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos') || '{}');
            if (vehiculosGuardados[usuarioData.id]) {
              usuarioData.vehiculos = vehiculosGuardados[usuarioData.id];
            }
            
            setUsuario(usuarioData);
          }
        }
        

        // Los usuarios se cargarán desde la API cuando sea necesario
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
      
      // Login con API real
      const response = await apiService.login(credenciales);
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.user));
      setUsuario(response.user);
      
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
      
      // Registro con API real
      const response = await apiService.register(datosUsuario);
      return { exito: true, usuario: response.user };
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
      
      // Intentar actualizar con API real
      try {
        const usuarioActualizado = await apiService.updateUserProfile(nuevosDatos);
        setUsuario(usuarioActualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        return { exito: true, usuario: usuarioActualizado };
      } catch (apiError) {

      }
      
      
      const usuarioActualizado = { ...usuario, ...nuevosDatos };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      return { exito: true, usuario: usuarioActualizado };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError('Error al actualizar perfil');
      return { exito: false, error: error.message };
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  // Función para agregar vehículo
  const agregarVehiculo = useCallback((nuevoVehiculo) => {
    try {
      const vehiculoCompleto = {
        ...nuevoVehiculo,
        id: Date.now(),
        userId: usuario?.id,
        estado: 'activo' // Asignar estado activo por defecto
      };

      const vehiculosActualizados = [...(usuario?.vehiculos || []), vehiculoCompleto];
      const usuarioActualizado = { ...usuario, vehiculos: vehiculosActualizados };
      
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // También guardar vehículos por separado para persistencia
      const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos') || '{}');
      vehiculosGuardados[usuario.id] = vehiculosActualizados;
      localStorage.setItem('vehiculos', JSON.stringify(vehiculosGuardados));
      
      // ACTUALIZAR LA LISTA COMPLETA DE USUARIOS para que aparezca en gestión de vehículos
      const usuariosActualizados = usuarios.map(u => 
        u.id === usuario.id ? usuarioActualizado : u
      );
      setUsuarios(usuariosActualizados);
      localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
      
      return { exito: true, vehiculo: vehiculoCompleto };
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario, usuarios]);

  // Función para actualizar estado de vehículo
  const actualizarEstadoVehiculo = useCallback((vehiculoId, nuevoEstado) => {
    try {
      const vehiculosActualizados = usuario?.vehiculos?.map(v =>
        v.id === vehiculoId ? { ...v, estado: nuevoEstado } : v
      ) || [];
      
      const usuarioActualizado = { ...usuario, vehiculos: vehiculosActualizados };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // Sincronizar con almacenamiento separado
      const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos') || '{}');
      vehiculosGuardados[usuario.id] = vehiculosActualizados;
      localStorage.setItem('vehiculos', JSON.stringify(vehiculosGuardados));
      
      // ACTUALIZAR LA LISTA COMPLETA DE USUARIOS
      const usuariosActualizados = usuarios.map(u => 
        u.id === usuario.id ? usuarioActualizado : u
      );
      setUsuarios(usuariosActualizados);
      localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
      
      return { exito: true };
    } catch (error) {
      console.error('Error al actualizar estado del vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario, usuarios]);

  // Función para actualizar vehículo
  const actualizarVehiculo = useCallback((vehiculoId, nuevosDatos) => {
    try {
      const vehiculosActualizados = usuario?.vehiculos?.map(v =>
        v.id === vehiculoId ? { ...v, ...nuevosDatos } : v
      ) || [];
      
      const usuarioActualizado = { ...usuario, vehiculos: vehiculosActualizados };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // Sincronizar con almacenamiento separado
      const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos') || '{}');
      vehiculosGuardados[usuario.id] = vehiculosActualizados;
      localStorage.setItem('vehiculos', JSON.stringify(vehiculosGuardados));
      
      // ACTUALIZAR LA LISTA COMPLETA DE USUARIOS
      const usuariosActualizados = usuarios.map(u => 
        u.id === usuario.id ? usuarioActualizado : u
      );
      setUsuarios(usuariosActualizados);
      localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
      
      return { exito: true };
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario, usuarios]);

  // Función para eliminar vehículo
  const eliminarVehiculo = useCallback((vehiculoId) => {
    try {
      const vehiculosActualizados = usuario?.vehiculos?.filter(v => v.id !== vehiculoId) || [];
      const usuarioActualizado = { ...usuario, vehiculos: vehiculosActualizados };
      
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // Sincronizar con almacenamiento separado
      const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos') || '{}');
      vehiculosGuardados[usuario.id] = vehiculosActualizados;
      localStorage.setItem('vehiculos', JSON.stringify(vehiculosGuardados));
      
      // ACTUALIZAR LA LISTA COMPLETA DE USUARIOS
      const usuariosActualizados = usuarios.map(u => 
        u.id === usuario.id ? usuarioActualizado : u
      );
      setUsuarios(usuariosActualizados);
      localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
      
      return { exito: true };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario, usuarios]);

  // Función para crear reserva
  const crearReserva = useCallback(async (datosReserva) => {
    try {
      const reservaCompleta = {
        ...datosReserva,
        id: Date.now(),
        userId: usuario?.id,
        estado: 'pendiente'
      };

      const reservasActualizadas = [...reservas, reservaCompleta];
      setReservas(reservasActualizadas);
      localStorage.setItem('reservas', JSON.stringify(reservasActualizadas));
      
      return { exito: true, reserva: reservaCompleta };
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario, reservas]);

  // Función para obtener reservas del usuario
  const obtenerReservasUsuario = useCallback(() => {
    return reservas.filter(reserva => reserva.userId === usuario?.id);
  }, [reservas, usuario]);

  // Función para cancelar reserva
  const cancelarReserva = useCallback(async (reservaId) => {
    try {
      const ahora = new Date();
      const reservasActualizadas = reservas.map(r =>
        r.id === reservaId
          ? { ...r, estado: 'cancelado', fechaCancelacion: ahora.toISOString() }
          : r
      );
      setReservas(reservasActualizadas);
      localStorage.setItem('reservas', JSON.stringify(reservasActualizadas));
      return { exito: true };
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return { exito: false, error: error.message };
    }
  }, [reservas]);

  // Función para obtener vehículos activos
  const obtenerVehiculosActivos = useCallback(() => {
    return usuario?.vehiculos?.filter(v => 
      v.estado === 'activo' || !v.estado // Incluir vehículos activos y sin estado definido
    ) || [];
  }, [usuario]);

  // Función para cambiar rol
  const cambiarRol = useCallback((nuevoRol) => {
    // Permitir cambiar el rol siempre (para DevTool)
    if (usuario) {
      const usuarioActualizado = { ...usuario, rol: nuevoRol };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }
  }, [usuario]);

  // Función para verificar si es admin
  const esAdmin = useCallback(() => {
    return usuario?.rol === 'admin';
  }, [usuario]);

  // Función para verificar si está autenticado
  const estaAutenticado = useCallback(() => {
    return !!usuario;
  }, [usuario]);

  // Función para buscar usuarios
  const buscarUsuarios = useCallback((termino) => {
    if (!termino) return usuarios;
    
    const terminoLower = termino.toLowerCase();
    
    return usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(terminoLower) ||
      usuario.apellido.toLowerCase().includes(terminoLower) ||
      usuario.email.toLowerCase().includes(terminoLower) ||
      usuario.dni.includes(termino)
    );
  }, [usuarios]);

  // Función para limpiar errores
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  // Función para refrescar datos del usuario desde localStorage
  const refrescarUsuario = useCallback(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario');
      const reservasGuardadas = localStorage.getItem('reservas');
      const usuariosGuardados = localStorage.getItem('usuarios');
      const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos') || '{}');
      
      if (usuarioGuardado) {
        const usuarioData = JSON.parse(usuarioGuardado);
        
        // Cargar vehículos desde almacenamiento separado si existen
        if (vehiculosGuardados[usuarioData.id]) {
          usuarioData.vehiculos = vehiculosGuardados[usuarioData.id];
        }
        
        // Actualizar vehículos sin estado definido
        if (usuarioData.vehiculos) {
          const vehiculosActualizados = usuarioData.vehiculos.map(v => 
            !v.estado ? { ...v, estado: 'activo' } : v
          );
          
          if (vehiculosActualizados.some(v => !v.estado)) {
            usuarioData.vehiculos = vehiculosActualizados;
            localStorage.setItem('usuario', JSON.stringify(usuarioData));
          }
        }
        
        setUsuario(usuarioData);
      }
      
      if (reservasGuardadas) {
        setReservas(JSON.parse(reservasGuardadas));
      }
      
      if (usuariosGuardados) {
        let usuariosData = JSON.parse(usuariosGuardados);
        
        // Sincronizar vehículos de todos los usuarios desde el almacenamiento separado
        usuariosData = usuariosData.map(u => {
          if (vehiculosGuardados[u.id]) {
            return { ...u, vehiculos: vehiculosGuardados[u.id] };
          }
          return u;
        });
        
        setUsuarios(usuariosData);
        localStorage.setItem('usuarios', JSON.stringify(usuariosData));
      }
    } catch (error) {
      console.error('Error al refrescar datos del usuario:', error);
    }
  }, []);

  // Función para limpiar reservas (solo admin)
  const limpiarReservas = useCallback(() => {
    setReservas([]);
    localStorage.removeItem('reservas');
  }, []);

  // Permitir al admin cambiar el estado de cualquier vehículo de cualquier usuario
  const actualizarEstadoVehiculoGlobal = useCallback((usuarioId, vehiculoId, nuevoEstado) => {
    try {
      // Actualizar en la lista de usuarios
      const usuariosActualizados = usuarios.map(u => {
        if (u.id === usuarioId) {
          const vehiculosActualizados = (u.vehiculos || []).map(v =>
            v.id === vehiculoId ? { ...v, estado: nuevoEstado } : v
          );
          return { ...u, vehiculos: vehiculosActualizados };
        }
        return u;
      });
      setUsuarios(usuariosActualizados);
      localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

      // Si el usuario autenticado es el mismo, actualizar también su estado
      if (usuario?.id === usuarioId) {
        setUsuario(usuariosActualizados.find(u => u.id === usuarioId));
        localStorage.setItem('usuario', JSON.stringify(usuariosActualizados.find(u => u.id === usuarioId)));
      }
      return { exito: true };
    } catch (error) {
      console.error('Error al actualizar estado global del vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuarios, usuario]);

  // Valor del contexto
  const valor = {
    // Estados
    usuario,
    cargando,
    error,
    reservas,
    usuarios,
    
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
    
    // Funciones de reservas
    crearReserva,
    obtenerReservasUsuario,
    cancelarReserva,
    
    // Funciones de utilidad
    cambiarRol,
    esAdmin,
    estaAutenticado,
    buscarUsuarios,
    limpiarError,
    refrescarUsuario,
    limpiarReservas,
    actualizarEstadoVehiculoGlobal
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}; 