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
  const [servicios, setServicios] = useState([]); // Nuevo estado para servicios

  // Nuevos estados para datos globales (administrador)
  const [allReservations, setAllReservations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  // --- Definiciones de funciones useCallback ---

  // Función para cargar vehículos del usuario desde la API
  const cargarVehiculosUsuario = useCallback(async (userId, statusFilter = null) => {
    console.log('🔍 cargarVehiculosUsuario: Llamado para userId:', userId, 'statusFilter:', statusFilter);
    if (!userId) {
      console.log('⚠️ cargarVehiculosUsuario: userId es nulo o indefinido.');
      return [];
    }
    
    try {
      const response = await apiService.getVehicles(userId, statusFilter); // Pasar statusFilter
      console.log('🚗 cargarVehiculosUsuario: Respuesta de la API para vehículos:', response);
      const vehiculos = response.data || [];
      const vehiculosTransformados = vehiculos.map(vehiculo => ({
        ...vehiculo,
        patente: vehiculo.license,
        marca: vehiculo.brand,
        modelo: vehiculo.model,
        año: vehiculo.year,
        color: vehiculo.color,
        estado: vehiculo.status || 'ACTIVE'
      }));
      console.log('🚗 cargarVehiculosUsuario: Vehículos transformados devueltos:', vehiculosTransformados);
      return vehiculosTransformados;
    } catch (error) {
      console.error('❌ cargarVehiculosUsuario: Error al cargar vehículos:', error);
      return [];
    }
  }, []);

  // Función para obtener reservas del usuario
  const obtenerReservasUsuario = useCallback(async (userId) => {
    console.log('🔍 obtenerReservasUsuario: Llamado para userId:', userId);
    if (!userId) {
      console.log('⚠️ obtenerReservasUsuario: userId es nulo o indefinido.');
      return [];
    }
    try {
      // Asegurarse de que la llamada usa el userId para filtrar en el backend
      const response = await apiService.getReservations(userId); 
      console.log('📅 obtenerReservasUsuario: Respuesta de la API para reservas:', response);
      const loadedReservas = response.data.reservations || [];
      const reservasTransformadas = loadedReservas.map(reserva => ({
        ...reserva,
        fecha: reserva.date, // Mapear 'date' del backend a 'fecha' para el frontend
        hora: reserva.time,  // Mapear 'time' del backend a 'hora' para el frontend
        servicio: reserva.service?.name,
        patente: reserva.vehicle?.license,
        marca: reserva.vehicle?.brand,
        modelo: reserva.vehicle?.model,
        año: reserva.vehicle?.year,
        nombre: reserva.user?.name,   
        apellido: reserva.user?.name?.split(' ').slice(1).join(' ') || '',
        dni: reserva.user?.dni, // Asegurarse de que el DNI se mapee si existe en el user
      }));
      setReservas(reservasTransformadas); 
      console.log('📅 obtenerReservasUsuario: Reservas transformadas devueltas:', reservasTransformadas);
      return reservasTransformadas; 
    } catch (error) {
      console.error('Error al obtener reservas del usuario:', error);
      return [];
    }
  }, [setReservas]);

  // Función para cargar servicios desde la API
  const cargarServicios = useCallback(async () => {
    try {
      const response = await apiService.getServices();
      const loadedServices = response.data.services || [];
      setServicios(loadedServices);
      return loadedServices;
    } catch (error) {
      console.error('❌ cargarServicios: Error al cargar servicios:', error);
      return [];
    }
  }, [setServicios]);

  // Función para cargar TODOS los usuarios (Admin)
  const cargarTodosLosUsuarios = useCallback(async () => {
    console.log('🔍 AuthContext: Llamando a cargarTodosLosUsuarios...');
    try {
      const response = await apiService.getAllUsers();
      console.log('👥 AuthContext: Respuesta de apiService.getAllUsers:', response);
      const loadedUsers = response.data || []; // Asumiendo que devuelve directamente un array de usuarios

      // Transformar loadedUsers para que coincida con la estructura esperada por el frontend
      const usersTransformados = loadedUsers.map(user => {
        const [nombre, ...apellidoParts] = user.name?.split(' ') || [];
        const apellido = apellidoParts.join(' ');
        return {
          ...user,
          nombre: nombre || '',
          apellido: apellido || '',
          telefono: user.phone,
          fechaRegistro: user.createdAt, // Mapear createdAt a fechaRegistro
        };
      });

      console.log('👥 AuthContext: Usuarios transformados para setAllUsers:', usersTransformados);
      setAllUsers(usersTransformados);
      console.log('👥 AuthContext: loadedUsers (antes de setAllUsers):', usersTransformados);
      console.log('👥 AuthContext: allUsers (después de setAllUsers):', usersTransformados); 
      return usersTransformados;
    } catch (error) {
      console.error('❌ AuthContext: Error al cargar todos los usuarios:', error);
      return [];
    }
  }, [setAllUsers]);

  // Función para cargar TODAS las reservas (Admin)
  const cargarTodasLasReservas = useCallback(async () => {
    try {
      // Llamar a getReservations con forAdminAll para la nueva ruta que obtiene todas las reservas
      const response = await apiService.getReservations(null, true); 
      const loadedReservas = response.data.reservations || [];
      console.log('🔍 AuthContext: loadedReservas (antes de transformar):', loadedReservas[0]); // Log de una reserva cruda
      // Transformar loadedReservas para que tenga los campos de las relaciones directamente accesibles
      const reservasTransformadas = loadedReservas.map(reserva => ({
        ...reserva,
        fecha: reserva.date, // Mapear 'date' del backend a 'fecha' para el frontend
        hora: reserva.time,  // Mapear 'time' del backend a 'hora' para el frontend
        servicio: reserva.service?.name, 
        patente: reserva.vehicle?.license, 
        marca: reserva.vehicle?.brand,
        modelo: reserva.vehicle?.model,
        año: reserva.vehicle?.year,
        nombre: reserva.user?.name,   
        apellido: reserva.user?.name?.split(' ').slice(1).join(' ') || '',
        dni: reserva.user?.dni, // Asegurarse de que el DNI se mapee si existe en el user
      }));

      console.log('🔍 Debug AuthContext: reservasTransformadas en cargarTodasLasReservas', reservasTransformadas);
      setAllReservations(reservasTransformadas); 
      console.log('📅 AuthContext: Todas las reservas cargadas y transformadas:', reservasTransformadas);
      return reservasTransformadas; 
    } catch (error) {
      console.error('❌ AuthContext: Error al cargar todas las reservas:', error);
      return [];
    }
  }, [setAllReservations]);

  // Función para cargar TODOS los vehículos (Admin)
  const cargarTodosLosVehiculos = useCallback(async () => {
    try {
      // apiService.getVehicles sin userId debería devolver todos los vehículos
      const response = await apiService.getVehicles(null, null, true); // Pasar true para forAdminAll
      const loadedVehiculos = response.data || [];
      const vehiculosTransformados = loadedVehiculos.map(vehiculo => ({
        ...vehiculo,
        patente: vehiculo.license,
        marca: vehiculo.brand,
        modelo: vehiculo.model,
        año: vehiculo.year,
        color: vehiculo.color,
        estado: vehiculo.status || 'ACTIVE',
        // Mapear la información del usuario propietario al campo 'usuario' esperado por el frontend
        usuario: vehiculo.user ? {
          id: vehiculo.user.id,
          nombre: vehiculo.user.name, // El backend envía 'name', el frontend espera 'nombre'
          apellido: vehiculo.user.name?.split(' ').slice(1).join(' ') || '', // Dividir el nombre para obtener el apellido
          email: vehiculo.user.email,
          phone: vehiculo.user.phone
        } : undefined,
      }));
      setAllVehicles(vehiculosTransformados); 
      console.log('🚗 AuthContext: Todos los vehículos cargados y transformados:', vehiculosTransformados);
      return vehiculosTransformados; 
    } catch (error) {
      console.error('❌ AuthContext: Error al cargar todos los vehículos:', error);
      return [];
    }
  }, [setAllVehicles]);

  // Función para iniciar sesión
  const iniciarSesion = useCallback(async (credenciales) => {
    console.log('➡️ AuthContext: Iniciando sesión...');
    try {
      setCargando(true);
      setError(null);
      
      const credencialesParaBackend = {
        email: credenciales.email,
        password: credenciales.contraseña
      };
      
      const response = await apiService.login(credencialesParaBackend);
      console.log('➡️ AuthContext: Respuesta de login exitosa:', response);
      
      const usuarioTransformado = {
        ...response.data.user,
        nombre: response.data.user.name,
        rol: response.data.user.role
      };
      
      localStorage.setItem('token', response.data.token);
      
      const vehiculosCargados = await cargarVehiculosUsuario(usuarioTransformado.id);
      const reservasCargadas = await obtenerReservasUsuario(usuarioTransformado.id);
      const reservasTransformadasUsuario = reservasCargadas.map(reserva => ({
        ...reserva,
        fecha: reserva.date, // Mapear 'date' del backend a 'fecha' para el frontend
        hora: reserva.time,  // Mapear 'time' del backend a 'hora' para el frontend
      }));
      const usuarioCompleto = { ...usuarioTransformado, vehiculos: vehiculosCargados, reservas: reservasTransformadasUsuario };
      
      localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
      setUsuario(usuarioCompleto);
      console.log('🎉 AuthContext: Sesión iniciada y usuario establecido (completo).', usuarioCompleto);
      
      return { exito: true };
    } catch (error) {
      console.error('❌ AuthContext: Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
      return { exito: false, error: error.message };
    } finally {
      setCargando(false);
      console.log('🏁 AuthContext: Inicio de sesión finalizado. Cargando:', false);
    }
  }, [cargarVehiculosUsuario, obtenerReservasUsuario]); // Añadir dependencias

  // Función para registrar usuario
  const registrarUsuario = useCallback(async (datosUsuario) => {
    try {
      setCargando(true);
      setError(null);
      
      const datosParaBackend = {
        name: `${datosUsuario.nombre} ${datosUsuario.apellido}`.trim(),
        email: datosUsuario.email,
        password: datosUsuario.contraseña,
        phone: datosUsuario.telefono
      };
      
      const response = await apiService.register(datosParaBackend);
      
      const usuarioTransformado = {
        ...response.data.user,
        nombre: response.data.user.name,
        rol: response.data.user.role
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
      try {
        await apiService.logout();
      } catch (apiError) {

      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
      setError(null);
      setReservas([]); // Limpiar reservas al cerrar sesión
    }
  }, []);

  // Función para actualizar usuario
  const actualizarUsuario = useCallback(async (nuevosDatos) => {
    try {
      setCargando(true);
      setError(null);
      
      try {
        const usuarioActualizado = await apiService.updateUserProfile(nuevosDatos);
        setUsuario(usuarioActualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        return { exito: true, usuario: usuarioActualizado };
      } catch (apiError) {
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
  const agregarVehiculo = useCallback(async (vehiculoDataFromFrontend) => {
    try {
      console.log('🔍 AuthContext: Datos de vehículo recibidos de MisVehiculos:', vehiculoDataFromFrontend);
      const vehiculoParaBackend = {
        license: vehiculoDataFromFrontend.license.toUpperCase(), // Usar license directamente y convertir a mayúsculas
        brand: vehiculoDataFromFrontend.brand,
        model: vehiculoDataFromFrontend.model,
        year: vehiculoDataFromFrontend.year, // Ya viene como número
        color: vehiculoDataFromFrontend.color,
        userId: vehiculoDataFromFrontend.userId // Ya viene incluido
      };

      const response = await apiService.createVehicle(vehiculoParaBackend);
      const vehiculoData = response.data;
      
      const vehiculoCompleto = {
        ...vehiculoData,
        patente: vehiculoData.license,
        marca: vehiculoData.brand,
        modelo: vehiculoData.model,
        año: vehiculoData.year,
        color: vehiculoData.color,
        estado: 'ACTIVE'
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
      
      return { exito: true };
    } catch (error) {
      console.error('Error al actualizar estado del vehículo:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario]);

  // Función para actualizar vehículo
  const actualizarVehiculo = useCallback(async (vehiculoId, nuevosDatos) => {
    try {
      const vehiculoParaBackend = {};
      
      if (nuevosDatos.patente) vehiculoParaBackend.license = nuevosDatos.patente;
      if (nuevosDatos.marca) vehiculoParaBackend.brand = nuevosDatos.marca;
      if (nuevosDatos.modelo) vehiculoParaBackend.model = nuevosDatos.modelo;
      if (nuevosDatos.año) vehiculoParaBackend.year = parseInt(nuevosDatos.año);
      if (nuevosDatos.color) vehiculoParaBackend.color = nuevosDatos.color;
      if (nuevosDatos.estado) vehiculoParaBackend.status = nuevosDatos.estado;

      const response = await apiService.updateVehicle(vehiculoId, vehiculoParaBackend);
      const vehiculoData = response.data;
      
      const vehiculosActualizados = usuario?.vehiculos?.map(v =>
        v.id === vehiculoId ? { 
          ...v, 
          ...nuevosDatos,
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
      await apiService.deleteVehicle(vehiculoId);
      
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
      if (!usuario?.id) {
        throw new Error('Usuario no autenticado para crear reserva');
      }

      const vehiculoEncontrado = usuario.vehiculos.find(v => v.patente === datosReserva.patente);
      if (!vehiculoEncontrado) {
        throw new Error('Vehículo no encontrado para la patente proporcionada.');
      }
      const vehicleId = vehiculoEncontrado.id;

      const servicioEncontrado = servicios.find(s => s.name === datosReserva.servicio);
      if (!servicioEncontrado) {
        throw new Error('Servicio no encontrado.');
      }
      const serviceId = servicioEncontrado.id;

      const reservaParaBackend = {
        userId: usuario.id,
        vehicleId: vehicleId,
        serviceId: serviceId,
        date: datosReserva.fecha,
        time: datosReserva.hora,
        notes: datosReserva.observaciones
      };

      const response = await apiService.createReservation(reservaParaBackend);
      const reservaCreada = response.data;

      // En lugar de añadir la reserva transformada manualmente, recargamos todas las reservas
      // para asegurar la consistencia con el backend, incluyendo cualquier campo relacionado
      // que el backend haya adjuntado o transformado.
      await obtenerReservasUsuario(usuario.id);

      // La línea de localStorage.setItem('reservas', ...) será manejada por obtenerReservasUsuario
      // si decide guardar en localStorage, o se dejará que AuthContext maneje la persistencia si ya lo hace.
      
      return { exito: true, reserva: reservaCreada };
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return { exito: false, error: error.message };
    }
  }, [usuario, obtenerReservasUsuario, servicios]);

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
      v.estado === 'ACTIVO' || !v.estado
    ) || [];
  }, [usuario]);

  // Función para cambiar rol
  const cambiarRol = useCallback((nuevoRol) => {
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
  const refrescarUsuario = useCallback(async () => {
    try {
      const usuarioGuardadoStr = localStorage.getItem('usuario');
      const reservasGuardadas = localStorage.getItem('reservas');
      
      if (usuarioGuardadoStr) {
        const usuarioData = JSON.parse(usuarioGuardadoStr);
        
        const vehiculosCargados = await cargarVehiculosUsuario(usuarioData.id);
        const usuarioCompleto = { ...usuarioData, vehiculos: vehiculosCargados };
        setUsuario(usuarioCompleto);
        localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
      }
      
      if (reservasGuardadas) {
        setReservas(JSON.parse(reservasGuardadas));
      }
    } catch (error) {
      console.error('❌ Error al refrescar datos del usuario:', error);
    }
  }, [cargarVehiculosUsuario]);

  // Función para limpiar reservas (solo admin)
  const limpiarReservas = useCallback(() => {
    setReservas([]);
    localStorage.removeItem('reservas');
  }, []);

  // Permitir al admin cambiar el estado de cualquier vehículo de cualquier usuario
  const actualizarEstadoVehiculoGlobal = useCallback((usuarioId, vehiculoId, nuevoEstado) => {
    try {
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

  // --- Fin de definiciones de funciones useCallback ---

  // Verificar si hay un usuario guardado al cargar la app
  useEffect(() => {
    const verificarUsuarioGuardado = async () => {
      console.log('🔄 AuthContext: Iniciando verificación de usuario guardado...');
      try {
        setCargando(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const usuarioGuardadoStr = localStorage.getItem('usuario');
        
        console.log('🔄 AuthContext: Token en localStorage:', token ? 'Encontrado' : 'No encontrado');
        console.log('🔄 AuthContext: Usuario en localStorage:', usuarioGuardadoStr ? 'Encontrado' : 'No encontrado');
        
        if (token && usuarioGuardadoStr) {
          console.log('🔄 AuthContext: Token y usuario guardado encontrados. Intentando validar perfil...');
          try {
            const perfilActualizado = await apiService.getUserProfile();
            console.log('✅ AuthContext: Perfil de usuario validado con éxito:', perfilActualizado);
            
            if (!perfilActualizado.data || !perfilActualizado.data.id) {
              throw new Error('ID de usuario no encontrado en el perfil actualizado.');
            }
            const userId = perfilActualizado.data.id;
            const userRole = perfilActualizado.data.role || perfilActualizado.data.rol; // Obtener el rol del usuario

            const vehiculosCargados = await cargarVehiculosUsuario(userId);
            const reservasCargadas = await obtenerReservasUsuario(userId);
            const reservasTransformadasUsuario = reservasCargadas.map(reserva => ({
              ...reserva,
              fecha: reserva.date, // Mapear 'date' del backend a 'fecha' para el frontend
              hora: reserva.time,  // Mapear 'time' del backend a 'hora' para el frontend
            }));
            const usuarioCompleto = { ...perfilActualizado.data, vehiculos: vehiculosCargados, reservas: reservasTransformadasUsuario };
            setUsuario(usuarioCompleto);
            localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
            console.log('🎉 AuthContext: Usuario establecido y guardado en localStorage (completo).', usuarioCompleto);

            // Si el usuario es administrador, cargar todos los datos globales
            if (userRole === 'ADMIN') {
              console.log('👑 AuthContext: Usuario es ADMIN. Cargando datos globales...');
              await cargarTodosLosUsuarios();
              await cargarTodasLasReservas();
              await cargarTodosLosVehiculos();
              console.log('👑 AuthContext: Datos globales cargados para ADMIN.');
            }

          } catch (apiError) {
            console.error('❌ AuthContext: Token inválido o expirado. Limpiando sesión:', apiError);
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            setUsuario(null);
            setReservas([]);
            console.log('🗑️ AuthContext: Sesión limpiada.');
          }
        } else {
          console.log('⚠️ AuthContext: No hay token o usuario guardado. Asegurando sesión limpia.');
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setUsuario(null);
          setReservas([]);
          console.log('🗑️ AuthContext: Sesión limpia forzada.');
        }
        
        await cargarServicios();
      } catch (error) {
        console.error('❌ AuthContext: Error en verificarUsuarioGuardado:', error);
        setError('Error al cargar datos de sesión');
      } finally {
        setCargando(false);
        console.log('🏁 AuthContext: Verificación de usuario guardado finalizada. Cargando:', false);
      }
    };

    verificarUsuarioGuardado();
  }, [cargarVehiculosUsuario, obtenerReservasUsuario, cargarServicios, cargarTodosLosUsuarios, cargarTodasLasReservas, cargarTodosLosVehiculos]);

  // Valor del contexto
  const valor = {
    // Estados
    usuario,
    cargando,
    error,
    reservas,
    usuarios,
    servicios, // Exportar servicios
    
    // Nuevos estados y funciones para el administrador
    allReservations,
    allUsers,
    allVehicles,
    cargarTodosLosUsuarios,
    cargarTodasLasReservas,
    cargarTodosLosVehiculos,
    
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
    cargarServicios, // Exportar función para cargar servicios
    
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