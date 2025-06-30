import { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function Reservar() {
  const { usuario, crearReserva, obtenerVehiculosActivos } = usarAuth();
  
  // ===== ESTADOS (VARIABLES QUE CAMBIAN) =====
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [vehiculosActivos, setVehiculosActivos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  
  // Estado para el mes actual del calendario
  const [mesActual, setMesActual] = useState(() => {
    const fecha = new Date();
    return {
      año: fecha.getFullYear(),
      mes: fecha.getMonth()
    };
  });
  
  // Estado para los datos del formulario de reserva
  const [datosReserva, setDatosReserva] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    telefono: usuario?.telefono || '',
    email: usuario?.email || '',
    patente: '',
    marca: '',
    modelo: '',
    año: '',
    servicio: '',
    fecha: '',
    hora: '',
    observaciones: ''
  });
  
  // Estados para el formulario
  const [errores, setErrores] = useState({});
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  
  // Estado para las reservas existentes (simulamos datos)
  const [reservasExistentes, setReservasExistentes] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      apellido: 'García',
      patente: 'ABC123',
      modelo: 'Renault Clio',
      fecha: '2025-01-15',
      hora: '10:00'
    },
    {
      id: 2,
      nombre: 'María López',
      apellido: 'Rodríguez',
      patente: 'XYZ789',
      modelo: 'Renault Megane',
      fecha: '2025-01-15',
      hora: '14:30'
    },
    {
      id: 3,
      nombre: 'Carlos Silva',
      apellido: 'Martínez',
      patente: 'DEF456',
      modelo: 'Renault Captur',
      fecha: '2025-01-20',
      hora: '09:00'
    }
  ]);

  // Cargar vehículos activos del usuario
  useEffect(() => {
    if (usuario) {
      const vehiculos = obtenerVehiculosActivos();
      setVehiculosActivos(vehiculos);
      
      // Si el usuario tiene vehículos activos, seleccionar el primero por defecto
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
    }
  }, [usuario, obtenerVehiculosActivos]);

  // ===== FUNCIONES AUXILIARES =====
  
  // Función para generar los días del mes
  const generarDiasDelMes = (año, mes) => {
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    
    const dias = [];
    
    // Agregar días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    
    // Agregar todos los días del mes
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i);
    }
    
    return dias;
  };

  // Función para verificar si un día tiene reservas
  const diaTieneReservas = (dia) => {
    if (!dia) return false;
    
    const fechaCompleta = `${mesActual.año}-${String(mesActual.mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    return reservasExistentes.some(reserva => reserva.fecha === fechaCompleta);
  };

  // Función para obtener las reservas de un día específico
  const obtenerReservasDelDia = (dia) => {
    if (!dia) return [];
    
    const fechaCompleta = `${mesActual.año}-${String(mesActual.mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    return reservasExistentes.filter(reserva => reserva.fecha === fechaCompleta);
  };

  // Función para verificar si un día es pasado
  const esDiaPasado = (dia) => {
    if (!dia) return false;
    
    const fechaCompleta = new Date(mesActual.año, mesActual.mes, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return fechaCompleta < hoy;
  };

  // Función para manejar el clic en un día del calendario
  const seleccionarDia = (dia) => {
    if (!dia || esDiaPasado(dia)) return;
    
    const fechaCompleta = `${mesActual.año}-${String(mesActual.mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    setFechaSeleccionada(fechaCompleta);
    setDatosReserva(prev => ({ ...prev, fecha: fechaCompleta }));
  };

  // Función para navegar al mes anterior
  const mesAnterior = () => {
    setMesActual(prev => {
      if (prev.mes === 0) {
        return { año: prev.año - 1, mes: 11 };
      } else {
        return { año: prev.año, mes: prev.mes - 1 };
      }
    });
  };

  // Función para navegar al mes siguiente
  const mesSiguiente = () => {
    setMesActual(prev => {
      if (prev.mes === 11) {
        return { año: prev.año + 1, mes: 0 };
      } else {
        return { año: prev.año, mes: prev.mes + 1 };
      }
    });
  };

  // Función para formatear fecha para mostrar
  const formatearFechaMostrar = (fecha) => {
    if (!fecha) return '';
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Función para manejar cambios en el formulario
  const manejarCambioFormulario = (campo, valor) => {
    setDatosReserva(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpiar error del campo cuando el usuario escriba
    if (errores[campo]) {
      setErrores(previo => ({
        ...previo,
        [campo]: ''
      }));
    }
  };

  // Función para manejar cambio de vehículo seleccionado
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

  // Función para validar el formulario
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
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para enviar el formulario
  const enviarReserva = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setEstaEnviando(true);

    try {
      // Preparar datos de la reserva
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
        
        // Limpiar el formulario
        setDatosReserva({
          nombre: usuario?.nombre || '',
          apellido: usuario?.apellido || '',
          telefono: usuario?.telefono || '',
          email: usuario?.email || '',
          patente: vehiculoSeleccionado?.patente || '',
          marca: vehiculoSeleccionado?.marca || '',
          modelo: vehiculoSeleccionado?.modelo || '',
          año: vehiculoSeleccionado?.año || '',
          servicio: '',
          fecha: '',
          hora: '',
          observaciones: ''
        });
        
        setFechaSeleccionada(null);
        
        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => setMostrarExito(false), 5000);
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);
    } finally {
      setEstaEnviando(false);
    }
  };

  // ===== VARIABLES PARA EL CALENDARIO =====
  const dias = generarDiasDelMes(mesActual.año, mesActual.mes);
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'];

  // Horarios disponibles
  const horariosDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Servicios disponibles
  const serviciosDisponibles = [
    'Cambio de Aceite',
    'Limpieza de Filtro',
    'Revisión de Niveles',
    'Cambio de Bujías',
    'Revisión de Frenos',
    'Cambio de Filtro de Aire',
    'Revisión General'
  ];

  return (
    <div className="contenedor-reservas">
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
                  dia && !esDiaPasado(dia) && diaTieneReservas(dia) ? 'dia-con-reservas' : ''
                } ${
                  dia && !esDiaPasado(dia) && fechaSeleccionada === `${mesActual.año}-${String(mesActual.mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}` ? 'dia-seleccionado' : ''
                }`}
                onClick={() => seleccionarDia(dia)}
                style={{
                  cursor: dia && !esDiaPasado(dia) ? 'pointer' : 'default'
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
              <span>Con reservas</span>
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
                      onChange={(e) => manejarCambioFormulario('marca', e.target.value)}
                      placeholder="Renault"
                      className="form-control-custom"
                      readOnly={vehiculosActivos.length > 0}
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
                      {serviciosDisponibles.map(servicio => (
                        <option key={servicio} value={servicio}>
                          {servicio}
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
                      value={formatearFechaMostrar(datosReserva.fecha)}
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
                      {horariosDisponibles.map(hora => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
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