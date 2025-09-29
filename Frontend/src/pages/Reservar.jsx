import { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { useLocalStorageSync } from '../hooks/useLocalStorageSync';
import { crearFecha, formatearFechaParaMostrar, esFechaPasada, dividirNombreCompleto } from '../utils/dateUtils';
import apiService from '../services/apiService'; // Importar apiService
import '../assets/styles/reservar.css';
import CustomButton from '../components/CustomButton';
import SeleccionHorario from '../components/SeleccionHorario';

export default function Reservar() {
  const { 
    usuario, 
    crearReserva, 
    obtenerVehiculosActivos, 
    refrescarUsuario, 
    cargarVehiculosUsuario, 
    servicios // Importar servicios desde el contexto
  } = usarAuth();
  

  useLocalStorageSync();
  

  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [vehiculosActivos, setVehiculosActivos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [reservasDelDia, setReservasDelDia] = useState([]); // Nuevo estado para reservas del día
  const [reservasDelMes, setReservasDelMes] = useState([]); // Estado para reservas de todo el mes
  const [cargandoReservasMes, setCargandoReservasMes] = useState(false); // Estado de carga
  
  const [mesActual, setMesActual] = useState(() => {
    const fecha = new Date();
    return {
      año: fecha.getFullYear(),
      mes: fecha.getMonth()
    };
  });
  
  const [datosReserva, setDatosReserva] = useState(() => {
    const { nombre, apellido } = dividirNombreCompleto(usuario?.name || '');
    return {
      nombre: nombre,
      apellido: apellido,
      telefono: usuario?.phone || '',
      email: usuario?.email || '',
      patente: '',
      marca: 'RENAULT',
      modelo: '',
      año: '',
      servicio: '',
      fecha: '',
      hora: '',
      observaciones: ''
    };
  });
  
  const [errores, setErrores] = useState({});
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  
  const [reservasExistentes, setReservasExistentes] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (usuario?.id) {
        // Cargar vehículos desde el backend
        const loadedVehiculos = await cargarVehiculosUsuario(usuario.id, 'active'); // Solicitar solo vehículos activos
        console.log('✅ Reservar.jsx - Vehículos cargados:', loadedVehiculos); // Debug: ver vehículos cargados
        
        // Obtener vehículos activos después de cargar
        const vehiculos = loadedVehiculos.filter(v => 
          v.estado === 'ACTIVE' || !v.estado // Incluir vehículos activos y sin estado definido
        );
        console.log('✅ Reservar.jsx - Vehículos activos (filtrados):', vehiculos); // Debug: ver vehículos activos
        setVehiculosActivos(vehiculos);

        if (vehiculos.length > 0) {
          setVehiculoSeleccionado(vehiculos[0]);
          setDatosReserva(prev => ({
            ...prev,
            patente: vehiculos[0].patente,
            marca: vehiculos[0].marca,
            modelo: vehiculos[0].modelo,
            año: vehiculos[0].año
          }));
        }

        // Cargar reservas existentes
        const reservasGuardadas = localStorage.getItem('reservas');
        if (reservasGuardadas) {
          setReservasExistentes(JSON.parse(reservasGuardadas));
        }
      }
    };

    cargarDatos();
  }, [usuario?.id, cargarVehiculosUsuario]);

  // Efecto para cargar las reservas de todo el mes
  useEffect(() => {
    const cargarReservasDelMes = async () => {
      setCargandoReservasMes(true);
      try {
        // Usar el nuevo endpoint optimizado para obtener todas las reservas del mes
        const response = await apiService.getReservationsByMonth(mesActual.año, mesActual.mes + 1);
        const todasLasReservas = response.data.reservations || [];
        
        // Agrupar las reservas por fecha
        const reservasAgrupadas = {};
        todasLasReservas.forEach(reserva => {
          if (!reservasAgrupadas[reserva.date]) {
            reservasAgrupadas[reserva.date] = [];
          }
          reservasAgrupadas[reserva.date].push(reserva);
        });
        
        // Convertir a array con la estructura esperada
        const reservasDelMes = Object.keys(reservasAgrupadas).map(fecha => ({
          fecha: fecha,
          reservas: reservasAgrupadas[fecha]
        }));
        
        setReservasDelMes(reservasDelMes);
        console.log('✅ Reservas del mes cargadas:', reservasDelMes);
      } catch (error) {
        console.error('Error al cargar reservas del mes:', error);
        setReservasDelMes([]);
      } finally {
        setCargandoReservasMes(false);
      }
    };
    
    cargarReservasDelMes();
  }, [mesActual]); // Se ejecuta cuando cambia el mes

  // Efecto para cargar las reservas de la fecha seleccionada
  useEffect(() => {
    const cargarReservasDelDia = async () => {
      if (fechaSeleccionada) {
        try {
          const response = await apiService.getReservationsByDate(fechaSeleccionada);
          // Asegúrate de que response.data.reservations es un array
          setReservasDelDia(response.data.reservations || []);
        } catch (error) {
          console.error('Error al cargar reservas del día:', error);
          setReservasDelDia([]);
        }
      } else {
        setReservasDelDia([]);
      }
    };
    cargarReservasDelDia();
  }, [fechaSeleccionada]); // Dependencia: se ejecuta cuando cambia la fecha seleccionada

  // Dividir nombre completo en nombre y apellido
  useEffect(() => {
    if (usuario) {
      setDatosReserva(prev => {
        // Usar la función dividirNombreCompleto para extraer nombre y apellido del campo 'name'
        const { nombre, apellido } = dividirNombreCompleto(usuario.name || '');

        return {
          ...prev,
          nombre: nombre,
          apellido: apellido,
          telefono: usuario.phone || '', // Pre-llenar teléfono del usuario
          email: usuario.email || '',     // Pre-llenar email del usuario
        };
      });
    }
  }, [usuario]);

  useEffect(() => {
    const reservasGuardadas = localStorage.getItem('reservas');
    if (reservasGuardadas) {
      setReservasExistentes(JSON.parse(reservasGuardadas));
    }
  }, []);


  const generarDiasDelMes = (año, mes) => {
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    
    const dias = [];
    

    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    

    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i);
    }
    
    return dias;
  };


  const obtenerHorariosOcupadosParaDia = (dia) => {
    if (!dia) return [];
    const fechaFormateada = crearFecha(mesActual.año, mesActual.mes + 1, dia);
    
    // Buscar las reservas de este día en las reservas del mes
    const reservasDelDia = reservasDelMes.find(item => item.fecha === fechaFormateada);
    if (reservasDelDia) {
      return reservasDelDia.reservas.map(reserva => reserva.time);
    }
    return [];
  };

  const esDiaCompleto = (dia) => {
    const horariosOcupados = obtenerHorariosOcupadosParaDia(dia);
    return horariosOcupados.length === horariosDisponibles.length;
  };

  const diaTieneReservas = (dia) => {
    if (!dia) return false;
    const fechaFormateada = crearFecha(mesActual.año, mesActual.mes + 1, dia);
    
    // Buscar las reservas de este día en las reservas del mes
    const reservasDelDia = reservasDelMes.find(item => item.fecha === fechaFormateada);
    return reservasDelDia && reservasDelDia.reservas.length > 0;
  };


  const esDiaPasado = (dia) => {
    if (!dia) return false;
    
    const fechaCompleta = crearFecha(mesActual.año, mesActual.mes + 1, dia);
    return esFechaPasada(fechaCompleta);
  };


  const seleccionarDia = (dia) => {
    if (!dia || esDiaPasado(dia) || esDiaCompleto(dia)) return;
    
    
    const fechaCompleta = crearFecha(mesActual.año, mesActual.mes + 1, dia);

    setFechaSeleccionada(fechaCompleta);
    setDatosReserva(prev => ({ ...prev, fecha: fechaCompleta, hora: '' }));
  };


  const mesAnterior = () => {
    setMesActual(prev => {
      if (prev.mes === 0) {
        return { año: prev.año - 1, mes: 11 };
      } else {
        return { año: prev.año, mes: prev.mes - 1 };
      }
    });
  };


  const mesSiguiente = () => {
    setMesActual(prev => {
      if (prev.mes === 11) {
        return { año: prev.año + 1, mes: 0 };
      } else {
        return { año: prev.año, mes: prev.mes + 1 };
      }
    });
  };


  const manejarCambioFormulario = (campo, valor) => {
    setDatosReserva(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    
    if (errores[campo]) {
      setErrores(previo => ({
        ...previo,
        [campo]: ''
      }));
    }
  };


  const manejarCambioVehiculo = (vehiculoId) => {
    const vehiculo = vehiculosActivos.find(v => v.id === parseInt(vehiculoId));
    if (vehiculo) {
      setVehiculoSeleccionado(vehiculo);
      setDatosReserva(prev => ({
        ...prev,
        patente: vehiculo.patente,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        año: vehiculo.año
      }));
    }
  };


  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosReserva.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!datosReserva.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }

    if (!datosReserva.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    }

    if (!datosReserva.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    }

    if (!datosReserva.patente.trim()) {
      nuevosErrores.patente = 'La patente es requerida';
    }

    if (!datosReserva.servicio) {
      nuevosErrores.servicio = 'Debe seleccionar un servicio';
    }

    if (!datosReserva.fecha) {
      nuevosErrores.fecha = 'Debe seleccionar una fecha';
    }

    if (!datosReserva.hora) {
      nuevosErrores.hora = 'Debe seleccionar una hora';
    } else if (reservasDelDia.some(reserva => reserva.time === datosReserva.hora && reserva.date === datosReserva.fecha)) { // Validar si la hora ya está ocupada
      nuevosErrores.hora = 'Este horario ya está ocupado';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };


  const enviarReserva = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setEstaEnviando(true);

    try {
      
      const datosCompletos = {
        ...datosReserva,
        vehiculo: {
          patente: datosReserva.patente,
          marca: datosReserva.marca,
          modelo: datosReserva.modelo,
          año: datosReserva.año
        }
      };

      const resultado = await crearReserva(datosCompletos);
      

      
      if (resultado.exito) {
        setMostrarExito(true);
        

        setReservasExistentes(prev => [...prev, resultado.reserva]);
        
        
        refrescarUsuario();
        
        
        
        
        
        
        const { nombre, apellido } = dividirNombreCompleto(usuario?.name || '');
        setDatosReserva({
          nombre: nombre,
          apellido: apellido,
          telefono: usuario?.phone || '',
          email: usuario?.email || '',
          patente: vehiculoSeleccionado?.patente || '',
          marca: 'RENAULT', // Siempre RENAULT
          modelo: vehiculoSeleccionado?.modelo || '',
          año: vehiculoSeleccionado?.año || '',
          servicio: '',
          fecha: '',
          hora: '',
          observaciones: ''
        });
        
        setFechaSeleccionada(null);
        

        setTimeout(() => setMostrarExito(false), 5000);
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);
    } finally {
      setEstaEnviando(false);
    }
  };


  const dias = generarDiasDelMes(mesActual.año, mesActual.mes);
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'];


  const horariosDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];


  // const serviciosDisponibles = [
  //   'Cambio de Aceite',
  //   'Limpieza de Filtro',
  //   'Revisión de Niveles',
  //   'Cambio de Bujías',
  //   'Revisión de Frenos',
  //   'Cambio de Filtro de Aire',
  //   'Revisión General'
  // ];

  return (
    <div className="reservar-container">
      {/* ===== TÍTULO DE LA PÁGINA ===== */}
      <div className="reservar-titulo">
        <h1>Reservar Turno</h1>
        <p>Selecciona una fecha en el calendario y completa tu reserva</p>
      </div>

      {/* Mensaje de éxito */}
      {mostrarExito && (
        <Alert variant="success" className="reservar-alert success">
          <i className="bi bi-check-circle-fill me-2"></i>
          ¡Reserva creada exitosamente! Recibirás confirmación por email.
        </Alert>
      )}

      {/* ===== CONTENEDOR PRINCIPAL CON DOS COLUMNAS ===== */}
      <div className="reservar-contenedor-principal">
        
        {/* ===== COLUMNA IZQUIERDA - CALENDARIO ===== */}
        <div className="reservar-columna-calendario">
          <h2>Calendario de Turnos</h2>
          
          {/* ===== ENCABEZADO DEL CALENDARIO CON NAVEGACIÓN ===== */}
          <div className="reservar-encabezado-calendario">
            <Button 
              onClick={mesAnterior}
              variant="outline-warning"
              size="sm"
              className="reservar-nav-button"
            >
              <i className="bi bi-chevron-left"></i>
            </Button>
            
            <h3>
              {nombresMeses[mesActual.mes]} {mesActual.año}
            </h3>
            
            <Button 
              onClick={mesSiguiente}
              variant="outline-warning"
              size="sm"
              className="reservar-nav-button"
            >
              <i className="bi bi-chevron-right"></i>
            </Button>
          </div>
          
          {/* ===== DÍAS DE LA SEMANA ===== */}
          <div className="reservar-dias-semana">
            {nombresDias.map(dia => (
              <div key={dia} className="reservar-dia-semana">
                {dia}
              </div>
            ))}
          </div>
          
          {/* ===== CUADRICULA DEL CALENDARIO ===== */}
          <div className="reservar-cuadricula-calendario">
            {cargandoReservasMes && (
              <div className="reservar-cargando-mes">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Cargando disponibilidad del mes...
              </div>
            )}
            {dias.map((dia, index) => (
              <div
                key={index}
                className={`reservar-dia-calendario ${
                  !dia ? 'reservar-dia-vacio' : ''
                } ${
                  dia && esDiaPasado(dia) ? 'reservar-dia-pasado' : ''
                } ${
                  dia && esDiaCompleto(dia) ? 'reservar-dia-completo' : ''
                } ${
                  dia && !esDiaPasado(dia) && diaTieneReservas(dia) && !esDiaCompleto(dia) ? 'reservar-dia-con-reservas' : ''
                } ${
                  dia && fechaSeleccionada === crearFecha(mesActual.año, mesActual.mes + 1, dia) ? 'reservar-dia-seleccionado' : ''
                }`}
                onClick={() => seleccionarDia(dia)}
                style={{
                  cursor: dia && !esDiaPasado(dia) && !esDiaCompleto(dia) ? 'pointer' : 'default'
                }}
              >
                {dia}
              </div>
            ))}
          </div>
          
          {/* ===== LEYENDA DEL CALENDARIO ===== */}
          <div className="reservar-leyenda-calendario">
            <div className="reservar-leyenda-item">
              <div className="reservar-leyenda-color dia-normal"></div>
              <span>Día disponible</span>
            </div>
            <div className="reservar-leyenda-item">
              <div className="reservar-leyenda-color dia-completo"></div>
              <span>Día completo</span>
            </div>
            <div className="reservar-leyenda-item">
              <div className="reservar-leyenda-color dia-seleccionado"></div>
              <span>Seleccionado</span>
            </div>
          </div>

          {/* ===== SELECTOR DE HORARIOS ===== */}
          {fechaSeleccionada && (
            <SeleccionHorario
              selectedTime={datosReserva.hora}
              onTimeSelect={(hora) => manejarCambioFormulario('hora', hora)}
              availableSlots={horariosDisponibles}
              occupiedSlots={reservasDelDia.map(reserva => reserva.time)}
              disabled={!fechaSeleccionada}
            />
          )}
        </div>
        
        {/* ===== COLUMNA DERECHA - FORMULARIO ===== */}
        <div className="reservar-columna-formulario">
          <h2>Datos de la Reserva</h2>
          
          <Form onSubmit={enviarReserva}>
            {/* Información del Cliente */}
            <div className="reservar-seccion-formulario">
              <h3>Información Personal</h3>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Nombre *</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.nombre}
                      onChange={(e) => manejarCambioFormulario('nombre', e.target.value)}
                      isInvalid={!!errores.nombre}
                      placeholder="Tu nombre"
                      readOnly={true}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.nombre}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Apellido *</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.apellido}
                      onChange={(e) => manejarCambioFormulario('apellido', e.target.value)}
                      isInvalid={!!errores.apellido}
                      placeholder="Tu apellido"
                      readOnly={true}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.apellido}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Teléfono *</Form.Label>
                    <Form.Control
                      type="tel"
                      value={datosReserva.telefono}
                      onChange={(e) => manejarCambioFormulario('telefono', e.target.value)}
                      isInvalid={!!errores.telefono}
                      placeholder="11 1234-5678"
                      className="reservar-form-control"
                      readOnly={true}
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.telefono}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={datosReserva.email}
                      onChange={(e) => manejarCambioFormulario('email', e.target.value)}
                      isInvalid={!!errores.email}
                      placeholder="tu@email.com"
                      readOnly={true}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Información del Vehículo */}
            <div className="reservar-seccion-formulario">
              <h3>Información del Vehículo</h3>
              
              <div className="reservar-vehiculos-info">
                <span>Vehículos disponibles: {vehiculosActivos.length}</span>
              </div>
              
              {vehiculosActivos.length > 0 ? (
                <Form.Group className="reservar-form-group">
                  <Form.Label className="reservar-form-label">Seleccionar Vehículo</Form.Label>
                  <Form.Select
                    value={vehiculoSeleccionado?.id || ''}
                    onChange={(e) => manejarCambioVehiculo(e.target.value)}
                    className="reservar-form-control"
                  >
                    {vehiculosActivos.map(vehiculo => (
                      <option key={vehiculo.id} value={vehiculo.id}>
                        {vehiculo.patente} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.año})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <Alert variant="warning" className="reservar-alert warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No tienes vehículos activos. Ve a <strong>Mis Vehículos</strong> para registrar uno.
                </Alert>
              )}
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Patente *</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.patente}
                      onChange={(e) => manejarCambioFormulario('patente', e.target.value)}
                      isInvalid={!!errores.patente}
                      placeholder="ABC123"
                      className="reservar-form-control"
                      readOnly={vehiculosActivos.length > 0}
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.patente}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Marca</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.marca}
                      placeholder="RENAULT"
                      className="reservar-form-control"
                      readOnly={true}
                      style={{ color: '#6c757d' }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Modelo</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.modelo}
                      onChange={(e) => manejarCambioFormulario('modelo', e.target.value)}
                      placeholder="Clio"
                      className="reservar-form-control"
                      readOnly={vehiculosActivos.length > 0}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Año</Form.Label>
                    <Form.Control
                      type="number"
                      value={datosReserva.año}
                      onChange={(e) => manejarCambioFormulario('año', e.target.value)}
                      placeholder="2020"
                      className="reservar-form-control"
                      readOnly={vehiculosActivos.length > 0}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Información del Servicio */}
            <div className="reservar-seccion-formulario">
              <h3>Detalles del Servicio</h3>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Servicio *</Form.Label>
                    <Form.Select
                      value={datosReserva.servicio}
                      onChange={(e) => manejarCambioFormulario('servicio', e.target.value)}
                      isInvalid={!!errores.servicio}
                      className="reservar-form-control"
                    >
                      <option value="">Selecciona un servicio</option>
                      {servicios.map(servicio => (
                        <option key={servicio.id} value={servicio.name}>
                          {servicio.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.servicio}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Fecha Seleccionada *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatearFechaParaMostrar(datosReserva.fecha)}
                      isInvalid={!!errores.fecha}
                      placeholder="Selecciona una fecha en el calendario"
                      className="reservar-form-control"
                      readOnly
                      style={{
                        color: datosReserva.fecha ? 'var(--color-texto)' : '#6c757d',
                        cursor: 'pointer'
                      }}
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.fecha}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Hora Seleccionada *</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.hora || 'Selecciona una hora en el calendario'}
                      readOnly
                      isInvalid={!!errores.hora}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errores.hora}
                    </Form.Control.Feedback>
                    <Form.Text className="reservar-form-text">
                      <i className="bi bi-info-circle me-1"></i>
                      Selecciona la hora en el calendario de la izquierda
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="reservar-form-group">
                <Form.Label className="reservar-form-label">Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={datosReserva.observaciones}
                  onChange={(e) => manejarCambioFormulario('observaciones', e.target.value)}
                  onClick={(e) => e.target.select()}
                  placeholder="Información adicional sobre el servicio..."
                  className="reservar-form-control"
                />
              </Form.Group>
            </div>

            {/* Botón de envío */}
            <div className="d-grid gap-2">
              <CustomButton 
                type="submit" 
                disabled={estaEnviando || vehiculosActivos.length === 0}
                className="reservar-submit-button"
              >
                {estaEnviando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creando reserva...
                  </>
                ) : (
                  'Confirmar Reserva'
                )}
              </CustomButton>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}