import { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { useLocalStorageSync } from '../hooks/useLocalStorageSync';
import { crearFecha, formatearFechaParaMostrar, esFechaPasada, dividirNombreCompleto } from '../utils/dateUtils';
import apiService from '../services/apiService'; // Importar apiService

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
    if (!dia || !fechaSeleccionada) return [];
    const fechaFormateada = crearFecha(mesActual.año, mesActual.mes + 1, dia);
    // Si la fecha seleccionada coincide con la fecha que estamos procesando,
    // usamos reservasDelDia. De lo contrario, no tenemos información actualizada.
    // En un escenario real, cargarías reservas para todo el mes o un rango.
    if (fechaFormateada === fechaSeleccionada) {
      return reservasDelDia.map(reserva => reserva.time);
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
    return reservasDelDia.some(reserva => reserva.date === fechaFormateada);
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
    <div className="contenedor-reservas" style={{
      backgroundImage: 'url("/fondo-lubricentro.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {/* ===== TÍTULO DE LA PÁGINA ===== */}
      <div className="titulo-reservas">
        <h1>Reservar Turno</h1>
        <p>Selecciona una fecha en el calendario y completa tu reserva</p>
      </div>

      {/* Mensaje de éxito */}
      {mostrarExito && (
        <Alert variant="success" className="mb-4" style={{
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          border: '1px solid #28a745',
          color: '#28a745'
        }}>
          <i className="bi bi-check-circle-fill me-2"></i>
          ¡Reserva creada exitosamente! Recibirás confirmación por email.
        </Alert>
      )}

      {/* ===== CONTENEDOR PRINCIPAL CON DOS COLUMNAS ===== */}
      <div className="contenedor-principal-reservas">
        
        {/* ===== COLUMNA IZQUIERDA - CALENDARIO ===== */}
        <div className="columna-calendario">
          <h2>Calendario de Turnos</h2>
          
          {/* ===== ENCABEZADO DEL CALENDARIO CON NAVEGACIÓN ===== */}
          <div className="encabezado-calendario" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--color-gris)',
            borderRadius: '10px',
            border: '1px solid var(--color-acento)'
          }}>
            <Button 
              onClick={mesAnterior}
              variant="outline-warning"
              size="sm"
              style={{
                borderColor: 'var(--color-acento)',
                color: 'var(--color-acento)',
                padding: '0.5rem 1rem',
                borderRadius: '5px'
              }}
            >
              <i className="bi bi-chevron-left"></i>
            </Button>
            
            <h3 style={{ 
              margin: 0, 
              color: 'var(--color-acento)',
              fontWeight: 'bold'
            }}>
              {nombresMeses[mesActual.mes]} {mesActual.año}
            </h3>
            
            <Button 
              onClick={mesSiguiente}
              variant="outline-warning"
              size="sm"
              style={{
                borderColor: 'var(--color-acento)',
                color: 'var(--color-acento)',
                padding: '0.5rem 1rem',
                borderRadius: '5px'
              }}
            >
              <i className="bi bi-chevron-right"></i>
            </Button>
          </div>
          
          {/* ===== DÍAS DE LA SEMANA ===== */}
          <div className="dias-semana">
            {nombresDias.map(dia => (
              <div key={dia} className="dia-semana">
                {dia}
              </div>
            ))}
          </div>
          
          {/* ===== CUADRICULA DEL CALENDARIO ===== */}
          <div className="cuadricula-calendario">
            {dias.map((dia, index) => (
              <div
                key={index}
                className={`dia-calendario ${
                  !dia ? 'dia-vacio' : ''
                } ${
                  dia && esDiaPasado(dia) ? 'dia-pasado' : ''
                } ${
                  dia && esDiaCompleto(dia) ? 'dia-completo' : '' // Nueva clase para días completos
                } ${
                  // dia con reservas solo si no está completo
                  dia && !esDiaPasado(dia) && diaTieneReservas(dia) && !esDiaCompleto(dia) ? 'dia-con-reservas' : ''
                } ${
                  dia && fechaSeleccionada === crearFecha(mesActual.año, mesActual.mes + 1, dia) ? 'dia-seleccionado' : ''
                }`}
                onClick={() => seleccionarDia(dia)}
                style={{
                  cursor: dia && !esDiaPasado(dia) && !esDiaCompleto(dia) ? 'pointer' : 'default' // No seleccionable si está completo
                }}
              >
                {dia}
              </div>
            ))}
          </div>
          
          {/* ===== LEYENDA DEL CALENDARIO ===== */}
          <div className="leyenda-calendario">
            <div className="leyenda-item">
              <div className="leyenda-color dia-normal"></div>
              <span>Día disponible</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color dia-con-reservas"></div>
              <span>Con reservas (parcial)</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color dia-completo"></div>
              <span>Día completo</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color dia-seleccionado"></div>
              <span>Seleccionado</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color dia-pasado"></div>
              <span>Día pasado</span>
            </div>
          </div>
        </div>
        
        {/* ===== COLUMNA DERECHA - FORMULARIO ===== */}
        <div className="columna-formulario">
          <h2>Datos de la Reserva</h2>
          
          <Form onSubmit={enviarReserva}>
            {/* Información del Cliente */}
            <div className="seccion-formulario">
              <h3>Información Personal</h3>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.nombre}
                      onChange={(e) => manejarCambioFormulario('nombre', e.target.value)}
                      isInvalid={!!errores.nombre}
                      placeholder="Tu nombre"
                      readOnly={true}
                      className="form-control-custom"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.nombre}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido *</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.apellido}
                      onChange={(e) => manejarCambioFormulario('apellido', e.target.value)}
                      isInvalid={!!errores.apellido}
                      placeholder="Tu apellido"
                      readOnly={true}
                      className="form-control-custom"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.apellido}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono *</Form.Label>
                    <Form.Control
                      type="tel"
                      value={datosReserva.telefono}
                      onChange={(e) => manejarCambioFormulario('telefono', e.target.value)}
                      isInvalid={!!errores.telefono}
                      placeholder="11 1234-5678"
                      className="form-control-custom"
                      readOnly={true}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.telefono}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={datosReserva.email}
                      onChange={(e) => manejarCambioFormulario('email', e.target.value)}
                      isInvalid={!!errores.email}
                      placeholder="tu@email.com"
                      readOnly={true}
                      className="form-control-custom"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Información del Vehículo */}
            <div className="seccion-formulario">
              <h3>Información del Vehículo</h3>
              
              <div className="mb-3">
                <span>Vehículos disponibles: {vehiculosActivos.length}</span>
              </div>
              
              {vehiculosActivos.length > 0 ? (
                <Form.Group className="mb-3">
                  <Form.Label>Seleccionar Vehículo</Form.Label>
                  <Form.Select
                    value={vehiculoSeleccionado?.id || ''}
                    onChange={(e) => manejarCambioVehiculo(e.target.value)}
                    className="form-control-custom"
                  >
                    {vehiculosActivos.map(vehiculo => (
                      <option key={vehiculo.id} value={vehiculo.id}>
                        {vehiculo.patente} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.año})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <Alert variant="warning" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No tienes vehículos activos. Ve a <strong>Mis Vehículos</strong> para registrar uno.
                </Alert>
              )}
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patente *</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.patente}
                      onChange={(e) => manejarCambioFormulario('patente', e.target.value)}
                      isInvalid={!!errores.patente}
                      placeholder="ABC123"
                      className="form-control-custom"
                      readOnly={vehiculosActivos.length > 0}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.patente}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Marca</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.marca}
                      placeholder="RENAULT"
                      className="form-control-custom"
                      readOnly={true}
                      style={{ opacity: 0.7 }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control
                      type="text"
                      value={datosReserva.modelo}
                      onChange={(e) => manejarCambioFormulario('modelo', e.target.value)}
                      placeholder="Clio"
                      className="form-control-custom"
                      readOnly={vehiculosActivos.length > 0}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Año</Form.Label>
                    <Form.Control
                      type="number"
                      value={datosReserva.año}
                      onChange={(e) => manejarCambioFormulario('año', e.target.value)}
                      placeholder="2020"
                      className="form-control-custom"
                      readOnly={vehiculosActivos.length > 0}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Información del Servicio */}
            <div className="seccion-formulario">
              <h3>Detalles del Servicio</h3>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Servicio *</Form.Label>
                    <Form.Select
                      value={datosReserva.servicio}
                      onChange={(e) => manejarCambioFormulario('servicio', e.target.value)}
                      isInvalid={!!errores.servicio}
                      className="form-control-custom"
                    >
                      <option value="">Selecciona un servicio</option>
                      {servicios.map(servicio => (
                        <option key={servicio.id} value={servicio.name}>
                          {servicio.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.servicio}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Seleccionada *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatearFechaParaMostrar(datosReserva.fecha)}
                      isInvalid={!!errores.fecha}
                      placeholder="Selecciona una fecha en el calendario"
                      className="form-control-custom"
                      readOnly
                      style={{
                        backgroundColor: 'var(--color-gris)',
                        border: '1px solid var(--color-acento)',
                        color: datosReserva.fecha ? 'var(--color-texto)' : '#6c757d',
                        cursor: 'pointer'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.fecha}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora *</Form.Label>
                    <Form.Select
                      value={datosReserva.hora}
                      onChange={(e) => manejarCambioFormulario('hora', e.target.value)}
                      isInvalid={!!errores.hora}
                      className="form-control-custom"
                    >
                      <option value="">Selecciona una hora</option>
                      {horariosDisponibles.map(hora => {
                        const isOcupado = reservasDelDia.some(reserva => reserva.time === hora);
                        return (
                          <option 
                            key={hora} 
                            value={hora} 
                            disabled={isOcupado}
                            className={isOcupado ? 'horario-ocupado' : ''} // Clase para estilos visuales
                          >
                            {hora} {isOcupado && '(Ocupado)'}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.hora}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={datosReserva.observaciones}
                  onChange={(e) => manejarCambioFormulario('observaciones', e.target.value)}
                  onClick={(e) => e.target.select()}
                  placeholder="Información adicional sobre el servicio..."
                  className="form-control-custom"
                />
              </Form.Group>
            </div>

            {/* Botón de envío */}
            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                disabled={estaEnviando || vehiculosActivos.length === 0}
                style={{
                  backgroundColor: 'var(--color-acento)',
                  color: 'var(--color-fondo)',
                  border: 'none',
                  padding: '1rem 2rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderRadius: '5px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {estaEnviando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creando reserva...
                  </>
                ) : (
                  'Confirmar Reserva'
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}