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
        

        const reservasGuardadas = localStorage.getItem('reservas');
        const usuariosGuardados = localStorage.getItem('usuarios');
        
        if (reservasGuardadas) {
          setReservas(JSON.parse(reservasGuardadas));
        } else {
          // Cargar reservas de ejemplo si no existen
          const reservasEjemplo = [
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
              userId: 2
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
              userId: 3
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
              userId: 4
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
              userId: 5
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
              userId: 6
            }
          ];
          localStorage.setItem('reservas', JSON.stringify(reservasEjemplo));
          setReservas(reservasEjemplo);
        }

        // Cargar usuarios de ejemplo si no existen
        if (!usuariosGuardados) {
          const usuariosEjemplo = [
            {
              id: 1,
              nombre: 'Admin',
              apellido: 'Sistema',
              email: 'admin@lubricentro.com',
              contraseña: 'admin123',
              telefono: '11 1234-5678',
              dni: '12345678',
              rol: 'admin',
              fechaRegistro: '2024-01-15',
              vehiculos: [
                {
                  id: 1,
                  patente: 'ABC123',
                  marca: 'Renault',
                  modelo: 'Clio',
                  año: 2020,
                  estado: 'activo'
                },
                {
                  id: 2,
                  patente: 'XYZ789',
                  marca: 'Renault',
                  modelo: 'Megane',
                  año: 2019,
                  estado: 'registrado'
                }
              ]
            },
            {
              id: 2,
              nombre: 'Juan',
              apellido: 'Perez',
              email: 'juan.perez@email.com',
              contraseña: 'cliente123',
              telefono: '11 2345-6789',
              dni: '23456789',
              rol: 'cliente',
              fechaRegistro: '2024-02-20',
              vehiculos: []
            },
            {
              id: 3,
              nombre: 'Maria',
              apellido: 'Gonzalez',
              email: 'maria.gonzalez@email.com',
              contraseña: 'cliente123',
              telefono: '11 3456-7890',
              dni: '34567890',
              rol: 'cliente',
              fechaRegistro: '2024-04-05',
              vehiculos: []
            },
            {
              id: 4,
              nombre: 'Carlos',
              apellido: 'Lopez',
              email: 'carlos.lopez@email.com',
              contraseña: 'cliente123',
              telefono: '11 4567-8901',
              dni: '45678901',
              rol: 'cliente',
              fechaRegistro: '2024-03-25',
              vehiculos: []
            },
            {
              id: 5,
              nombre: 'Ana',
              apellido: 'Martinez',
              email: 'ana.martinez@email.com',
              contraseña: 'cliente123',
              telefono: '11 5678-9012',
              dni: '56789012',
              rol: 'cliente',
              fechaRegistro: '2024-04-05',
              vehiculos: []
            },
            {
              id: 6,
              nombre: 'Roberto',
              apellido: 'Fernandez',
              email: 'roberto.fernandez@email.com',
              contraseña: 'cliente123',
              telefono: '11 6789-0123',
              dni: '67890123',
              rol: 'cliente',
              fechaRegistro: '2024-04-12',
              vehiculos: []
            },
            {
              id: 7,
              nombre: 'Laura',
              apellido: 'Rodriguez',
              email: 'laura.rodriguez@email.com',
              contraseña: 'cliente123',
              telefono: '11 7890-1234',
              dni: '78901234',
              rol: 'cliente',
              fechaRegistro: '2024-04-18',
              vehiculos: []
            },
            {
              id: 8,
              nombre: 'Diego',
              apellido: 'Sanchez',
              email: 'diego.sanchez@email.com',
              contraseña: 'cliente123',
              telefono: '11 8901-2345',
              dni: '89012345',
              rol: 'cliente',
              fechaRegistro: '2024-04-25',
              vehiculos: []
            },
            {
              id: 9,
              nombre: 'Sofia',
              apellido: 'Torres',
              email: 'sofia.torres@email.com',
              contraseña: 'cliente123',
              telefono: '11 9012-3456',
              dni: '90123456',
              rol: 'cliente',
              fechaRegistro: '2024-05-02',
              vehiculos: []
            },
            {
              id: 10,
              nombre: 'Miguel',
              apellido: 'Ramirez',
              email: 'miguel.ramirez@email.com',
              contraseña: 'cliente123',
              telefono: '11 0123-4567',
              dni: '01234567',
              rol: 'cliente',
              fechaRegistro: '2024-05-10',
              vehiculos: []
            }
          ];
          localStorage.setItem('usuarios', JSON.stringify(usuariosEjemplo));
          setUsuarios(usuariosEjemplo);
        } else {
          setUsuarios(JSON.parse(usuariosGuardados));
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
      
      // Intentar login con API real
      try {
        const response = await apiService.login(credenciales);
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response.user));
        setUsuario(response.user);
        
        return { exito: true };
      } catch (apiError) {

      }
      

      await new Promise(resolver => setTimeout(resolver, 1000));
      
      // Obtener usuarios desde localStorage para asegurar que estén disponibles
      const usuariosGuardados = localStorage.getItem('usuarios');
      const usuariosDisponibles = usuariosGuardados ? JSON.parse(usuariosGuardados) : usuarios;
      

      
      // Buscar usuario por email
      const usuarioEncontrado = usuariosDisponibles.find(u => u.email === credenciales.email);
      

      
      if (!usuarioEncontrado) {
        setError('Usuario no encontrado');
        return { exito: false, error: 'Usuario no encontrado' };
      }
      
      // Verificar contraseña (en un sistema real esto sería hash)
      if (usuarioEncontrado.contraseña !== credenciales.contraseña) {
        setError('Contraseña incorrecta');
        return { exito: false, error: 'Contraseña incorrecta' };
      }
      
      // Cargar vehículos desde almacenamiento separado
      const vehiculosGuardados = JSON.parse(localStorage.getItem('vehiculos') || '{}');
      if (vehiculosGuardados[usuarioEncontrado.id]) {
        usuarioEncontrado.vehiculos = vehiculosGuardados[usuarioEncontrado.id];
      }
      
      // Login exitoso
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
      setUsuario(usuarioEncontrado);
      
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
      
      // Verificar si el email ya existe
      const emailExiste = usuarios.some(u => u.email === datosUsuario.email);
      if (emailExiste) {
        return { exito: false, error: 'El email ya está registrado' };
      }
      
      // Intentar registro con API real
      try {
        const response = await apiService.register(datosUsuario);
        return { exito: true, usuario: response.user };
      } catch (apiError) {

      }
      
      
      await new Promise(resolver => setTimeout(resolver, 1000));
      
      // Crear fecha en formato local para evitar problemas de zona horaria
      const hoy = new Date();
      const año = hoy.getFullYear();
      const mes = String(hoy.getMonth() + 1).padStart(2, '0');
      const dia = String(hoy.getDate()).padStart(2, '0');
      const fechaRegistro = `${año}-${mes}-${dia}`;
      
      const nuevoUsuario = {
        id: Date.now(),
        ...datosUsuario,
        rol: 'cliente',
        fechaRegistro: fechaRegistro,
        vehiculos: []
      };
      
      // Agregar a la lista de usuarios
      const usuariosActualizados = [...usuarios, nuevoUsuario];
      setUsuarios(usuariosActualizados);
      localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
      
      return { exito: true, usuario: nuevoUsuario };
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