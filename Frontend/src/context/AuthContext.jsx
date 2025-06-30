import { createContext, useContext, useState, useEffect } from 'react';

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
  const [reservas, setReservas] = useState([]);

  // Verificar si hay un usuario guardado al cargar la app
  useEffect(() => {
    const verificarUsuarioGuardado = () => {
      try {
        const usuarioGuardado = localStorage.getItem('usuario');
        const reservasGuardadas = localStorage.getItem('reservas');
        
        if (usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        }
        
        if (reservasGuardadas) {
          setReservas(JSON.parse(reservasGuardadas));
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setCargando(false);
      }
    };

    verificarUsuarioGuardado();
  }, []);

  // Función para iniciar sesión
  const iniciarSesion = async (credenciales) => {
    try {
      setCargando(true);
      
      // Aquí irá la llamada al backend cuando lo implementemos
      // Por ahora simulamos un login exitoso
      await new Promise(resolver => setTimeout(resolver, 1000));
      
      // Simulamos datos de usuario (esto vendrá del backend)
      const usuarioSimulado = {
        id: 1,
        nombre: 'Admin',
        apellido: 'Sistema',
        email: credenciales.email,
        telefono: '11 1234-5678',
        rol: 'admin', // Cambiado a 'admin' para pruebas
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
      };

      // Guardar en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuarioSimulado));
      setUsuario(usuarioSimulado);
      
      return { exito: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { exito: false, error: 'Error al iniciar sesión' };
    } finally {
      setCargando(false);
    }
  };

  // Función para registrar usuario
  const registrarUsuario = async (datosUsuario) => {
    try {
      setCargando(true);
      
      // Aquí irá la llamada al backend cuando lo implementemos
      await new Promise(resolver => setTimeout(resolver, 1000));
      
      // Simulamos registro exitoso
      const nuevoUsuario = {
        id: Date.now(), // ID temporal
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        telefono: datosUsuario.telefono,
        rol: 'cliente',
        vehiculos: []
      };

      // Guardar en localStorage
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      setUsuario(nuevoUsuario);
      
      return { exito: true };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return { exito: false, error: 'Error al registrar usuario' };
    } finally {
      setCargando(false);
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('reservas');
    setUsuario(null);
    setReservas([]);
  };

  // Función para actualizar datos del usuario
  const actualizarUsuario = (nuevosDatos) => {
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  // Función para agregar vehículo
  const agregarVehiculo = (nuevoVehiculo) => {
    const vehiculoConId = {
      ...nuevoVehiculo,
      id: Date.now(),
      estado: 'registrado'
    };
    
    const usuarioActualizado = {
      ...usuario,
      vehiculos: [...usuario.vehiculos, vehiculoConId]
    };
    
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  // Función para actualizar estado de vehículo
  const actualizarEstadoVehiculo = (vehiculoId, nuevoEstado) => {
    const vehiculosActualizados = usuario.vehiculos.map(vehiculo =>
      vehiculo.id === vehiculoId 
        ? { ...vehiculo, estado: nuevoEstado }
        : vehiculo
    );
    
    const usuarioActualizado = {
      ...usuario,
      vehiculos: vehiculosActualizados
    };
    
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  // Función para eliminar vehículo
  const eliminarVehiculo = (vehiculoId) => {
    const vehiculosFiltrados = usuario.vehiculos.filter(
      vehiculo => vehiculo.id !== vehiculoId
    );
    
    const usuarioActualizado = {
      ...usuario,
      vehiculos: vehiculosFiltrados
    };
    
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  // Función para crear reserva
  const crearReserva = async (datosReserva) => {
    try {
      // Simular delay de creación
      await new Promise(resolver => setTimeout(resolver, 1000));
      
      const nuevaReserva = {
        id: Date.now(),
        ...datosReserva,
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString(),
        usuarioId: usuario.id
      };
      
      const reservasActualizadas = [...reservas, nuevaReserva];
      setReservas(reservasActualizadas);
      localStorage.setItem('reservas', JSON.stringify(reservasActualizadas));
      
      return { exito: true, reserva: nuevaReserva };
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return { exito: false, error: 'Error al crear reserva' };
    }
  };

  // Función para obtener reservas del usuario
  const obtenerReservasUsuario = () => {
    return reservas.filter(reserva => reserva.usuarioId === usuario?.id);
  };

  // Función para cancelar reserva
  const cancelarReserva = async (reservaId) => {
    try {
      const reservasActualizadas = reservas.map(reserva =>
        reserva.id === reservaId 
          ? { ...reserva, estado: 'cancelado' }
          : reserva
      );
      
      setReservas(reservasActualizadas);
      localStorage.setItem('reservas', JSON.stringify(reservasActualizadas));
      
      return { exito: true };
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return { exito: false, error: 'Error al cancelar reserva' };
    }
  };

  // Función para obtener vehículos activos del usuario
  const obtenerVehiculosActivos = () => {
    return usuario?.vehiculos?.filter(vehiculo => vehiculo.estado === 'activo') || [];
  };

  // Función para cambiar rol del usuario (solo para pruebas)
  const cambiarRol = (nuevoRol) => {
    if (usuario) {
      const usuarioActualizado = { ...usuario, rol: nuevoRol };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);
    }
  };

  // Verificar si el usuario es administrador
  const esAdmin = () => {
    return usuario?.rol === 'admin';
  };

  // Verificar si el usuario está autenticado
  const estaAutenticado = () => {
    return usuario !== null;
  };

  // Valor del contexto
  const valor = {
    usuario,
    cargando,
    reservas,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    actualizarUsuario,
    agregarVehiculo,
    actualizarEstadoVehiculo,
    eliminarVehiculo,
    crearReserva,
    obtenerReservasUsuario,
    cancelarReserva,
    obtenerVehiculosActivos,
    cambiarRol,
    esAdmin,
    estaAutenticado
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}; 