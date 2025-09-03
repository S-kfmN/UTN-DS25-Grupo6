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
            // Si falla la API, usar datos del localStorage
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
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(usuarioTransformado));
      setUsuario(usuarioTransformado);
      
      // Cargar vehículos del usuario desde la API
      setTimeout(() => {
        cargarVehiculosUsuario();
      }, 100);
      
      return { exito: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
      return { exito: false, error: error.message };
    } finally {
      setCargando(false);
    }
  }, []);

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
  }, []);

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
        // Si falla la API, actualizar localmente
        const usuarioActualizado = { ...usuario, ...nuevosDatos };
        setUsuario(usuarioActualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        return { exito: true, usuario: usuarioActualizado };
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError('Error al actualizar perfil');
      return { exito: false, error: error.message };
    } finally {
      setCargando(false);
    }
  }, [usuario]);

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
        estado: 'ACTIVO'
      };

      const vehiculosActualizados = [...(usuario?.vehiculos || []), vehiculoCompleto];
      const usuarioActualizado = { ...usuario, vehiculos: vehiculosActualizados };
      
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      return { exito: true, vehiculo: vehiculoCompleto };
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario]);

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
  const actualizarVehiculo = useCallback(async (vehiculoId, nuevosDatos) => {
    try {
      // Transformar datos para el backend - solo incluir campos que están presentes
      const vehiculoParaBackend = {};
      
      if (nuevosDatos.patente) vehiculoParaBackend.license = nuevosDatos.patente;
      if (nuevosDatos.marca) vehiculoParaBackend.brand = nuevosDatos.marca;
      if (nuevosDatos.modelo) vehiculoParaBackend.model = nuevosDatos.modelo;
      if (nuevosDatos.año) vehiculoParaBackend.year = parseInt(nuevosDatos.año);
      if (nuevosDatos.color) vehiculoParaBackend.color = nuevosDatos.color;
      if (nuevosDatos.estado) vehiculoParaBackend.status = nuevosDatos.estado;

      // Actualizar vehículo en el backend
      const response = await apiService.updateVehicle(vehiculoId, vehiculoParaBackend);
      
      // El backend devuelve { success: true, data: {...} }
      const vehiculoData = response.data;
      
      // Actualizar usuario local - solo actualizar campos que están presentes en vehiculoData
      const vehiculosActualizados = usuario?.vehiculos?.map(v =>
        v.id === vehiculoId ? { 
          ...v, 
          ...nuevosDatos,
          // Solo actualizar campos si vehiculoData los contiene
          ...(vehiculoData.license && { patente: vehiculoData.license }),
          ...(vehiculoData.brand && { marca: vehiculoData.brand }),
          ...(vehiculoData.model && { modelo: vehiculoData.model }),
          ...(vehiculoData.year && { año: vehiculoData.year }),
          ...(vehiculoData.color && { color: vehiculoData.color }),
          ...(vehiculoData.status && { estado: vehiculoData.status })
        } : v
      ) || [];
      
      const usuarioActualizado = { ...usuario, vehiculos: vehiculosActualizados };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
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
      
      // Actualizar usuario local
      const vehiculosActualizados = usuario?.vehiculos?.filter(v => v.id !== vehiculoId) || [];
      const usuarioActualizado = { ...usuario, vehiculos: vehiculosActualizados };
      
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      return { exito: true };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario]);

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
      v.estado === 'ACTIVO' || !v.estado // Incluir vehículos activos y sin estado definido
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
    return usuario?.role === 'ADMIN' || usuario?.rol === 'ADMIN';
  }, [usuario]);

  // Función para verificar si está autenticado
  const estaAutenticado = useCallback(() => {
    return !!usuario;
  }, [usuario]);

  // Función para cargar vehículos del usuario desde la API
  const cargarVehiculosUsuario = useCallback(async () => {
    if (!usuario?.id) {
      return [];
    }
    
    try {
      const response = await apiService.getVehicles(usuario.id);
      
      // El backend devuelve { success: true, data: [...] }
      const vehiculos = response.data || [];
      
      // Transformar datos del backend al formato del frontend
      const vehiculosTransformados = vehiculos.map(vehiculo => ({
        ...vehiculo,
        patente: vehiculo.license,
        marca: vehiculo.brand,
        modelo: vehiculo.model,
        año: vehiculo.year,
        color: vehiculo.color,
        estado: vehiculo.status || 'ACTIVO'
      }));

      const usuarioActualizado = { ...usuario, vehiculos: vehiculosTransformados };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      return vehiculosTransformados;
    } catch (error) {
      console.error('❌ cargarVehiculosUsuario: Error al cargar vehículos:', error);
      return [];
    }
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
            !v.estado ? { ...v, estado: 'ACTIVO' } : v
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