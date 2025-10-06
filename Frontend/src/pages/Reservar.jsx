import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { crearFecha, formatearFechaParaMostrar, esFechaPasada, dividirNombreCompleto } from '../utils/dateUtils';
import apiService from '../services/apiService'; // Importar apiService
import { reservationUserDataSchema } from '../validations/reservationSchema';
import '../assets/styles/reservar.css';
import CustomButton from '../components/CustomButton';
import SeleccionHorario from '../components/SeleccionHorario';

export default function Reservar() {
  const { 
    usuario, 
    crearReserva,  
    refrescarUsuario, 
    cargarVehiculosUsuario, 
    servicios // Importar servicios desde el contexto
  } = usarAuth();

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
  
  const { 
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(reservationUserDataSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      patente: '',
      marca: 'RENAULT',
      modelo: '',
      año: '',
      servicio: '',
      fecha: '',
      hora: '',
      observaciones: ''
    }
  });
  const formValues = watch();
  
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  

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
          setValue('patente', vehiculos[0].patente || '');
          setValue('marca', vehiculos[0].marca || 'RENAULT');
          setValue('modelo', vehiculos[0].modelo || '');
          setValue('año', vehiculos[0].año || '');
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
        // endpoint optimizado para obtener todas las reservas del mes
        const reservation = await apiService.getReservationsByMonth(mesActual.año, mesActual.mes + 1);
        const todasLasReservas = reservation.data?.reservations || reservation.data || [];
        
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
          const reservation = await apiService.getReservationsByDate(fechaSeleccionada);
          setReservasDelDia(reservation.data || []);
          console.log('Reserva:', reservation.data);
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
      const { nombre, apellido } = dividirNombreCompleto(usuario.name || '');
      setValue('nombre', nombre || '');
      setValue('apellido', apellido || '');
      setValue('telefono', usuario.phone || '');
      setValue('email', usuario.email || '');
    }
  }, [usuario]);


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

  const esDiaPasado = (dia) => {
    if (!dia) return false;
    
    const fechaCompleta = crearFecha(mesActual.año, mesActual.mes + 1, dia);
    return esFechaPasada(fechaCompleta);
  };


  const seleccionarDia = (dia) => {
    if (!dia || esDiaPasado(dia) || esDiaCompleto(dia)) return;
    
    
    const fechaCompleta = crearFecha(mesActual.año, mesActual.mes + 1, dia);

    setFechaSeleccionada(fechaCompleta);
    setValue('fecha', fechaCompleta, { shouldValidate: true });
    setValue('hora', '', { shouldValidate: true });
    clearErrors(['fecha', 'hora']);
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


  // Los campos del formulario se manejan con react-hook-form usando register.
  // Para valores programáticos (fecha/hora/vehículo) usamos setValue.


  const manejarCambioVehiculo = (vehiculoId) => {
    const vehiculo = vehiculosActivos.find(v => v.id === parseInt(vehiculoId));
    if (vehiculo) {
      setVehiculoSeleccionado(vehiculo);
      setValue('patente', vehiculo.patente || '', { shouldValidate: true });
      setValue('marca', vehiculo.marca || 'RENAULT');
      setValue('modelo', vehiculo.modelo || '');
      setValue('año', vehiculo.año || '');
      clearErrors(['patente', 'modelo', 'año']);
    }
  };


  const onSubmit = async (formData) => {
    if (reservasDelDia.some(reserva => reserva.time === formData.hora && reserva.date === formData.fecha)) {
      setError('hora', { type: 'manual', message: 'Este horario ya está ocupado' });
      return;
    }

    setEstaEnviando(true);

    try {
      const datosCompletos = {
        ...formData,
        vehiculo: {
          patente: formData.patente,
          marca: formData.marca,
          modelo: formData.modelo,
          año: formData.año
        }
      };

      const resultado = await crearReserva(datosCompletos);

      if (resultado.exito) {
        setMostrarExito(true);
        refrescarUsuario();
        const { nombre, apellido } = dividirNombreCompleto(usuario?.name || '');
        reset({
          nombre: nombre || '',
          apellido: apellido || '',
          telefono: usuario?.phone || '',
          email: usuario?.email || '',
          patente: vehiculoSeleccionado?.patente || '',
          marca: 'RENAULT',
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
              selectedTime={watch('hora')}
              onTimeSelect={(hora) => setValue('hora', hora, { shouldValidate: true })}
              availableSlots={horariosDisponibles}
              occupiedSlots={reservasDelDia.map(reserva => reserva.time)}
              disabled={!fechaSeleccionada}
            />
          )}
        </div>
        
        {/* ===== COLUMNA DERECHA - FORMULARIO ===== */}
        <div className="reservar-columna-formulario">
          <h2>Datos de la Reserva</h2>
          
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Información del Cliente */}
            <div className="reservar-seccion-formulario">
              <h3>Información Personal</h3>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Nombre *</Form.Label>
                    <Form.Control
                      {...register('nombre')}
                      type="text"
                      isInvalid={!!errors.nombre}
                      placeholder="Tu nombre"
                      readOnly={true}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errors.nombre?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Apellido *</Form.Label>
                    <Form.Control
                      {...register('apellido')}
                      type="text"
                      isInvalid={!!errors.apellido}
                      placeholder="Tu apellido"
                      readOnly={true}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errors.apellido?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Teléfono *</Form.Label>
                    <Form.Control
                      {...register('telefono')}
                      type="tel"
                      isInvalid={!!errors.telefono}
                      placeholder="11 1234-5678"
                      className="reservar-form-control"
                      readOnly={true}
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errors.telefono?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Email *</Form.Label>
                    <Form.Control
                      {...register('email')}
                      type="email"
                      isInvalid={!!errors.email}
                      placeholder="tu@email.com"
                      readOnly={true}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errors.email?.message}
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
                      {...register('patente')}
                      type="text"
                      isInvalid={!!errors.patente}
                      placeholder="ABC123"
                      className="reservar-form-control"
                      readOnly={vehiculosActivos.length > 0}
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errors.patente?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Marca</Form.Label>
                    <Form.Control
                      {...register('marca')}
                      type="text"
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
                      {...register('modelo')}
                      type="text"
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
                      {...register('año')}
                      type="number"
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
                      {...register('servicio')}
                      isInvalid={!!errors.servicio}
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
                      {errors.servicio?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Fecha Seleccionada *</Form.Label>
                    <Form.Control
                      {...register('fecha')}
                      type="text"
                      value={formatearFechaParaMostrar(watch('fecha'))}
                      isInvalid={!!errors.fecha}
                      placeholder="Selecciona una fecha en el calendario"
                      className="reservar-form-control"
                      readOnly
                      style={{
                        color: watch('fecha') ? 'var(--color-texto)' : '#6c757d',
                        cursor: 'pointer'
                      }}
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errors.fecha?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="reservar-form-group">
                    <Form.Label className="reservar-form-label">Hora Seleccionada *</Form.Label>
                    <Form.Control
                      {...register('hora')}
                      type="text"
                      value={watch('hora') || 'Selecciona una hora en el calendario'}
                      readOnly
                      isInvalid={!!errors.hora}
                      className="reservar-form-control"
                    />
                    <Form.Control.Feedback type="invalid" className="reservar-form-feedback">
                      {errors.hora?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="reservar-form-group">
                <Form.Label className="reservar-form-label">Observaciones</Form.Label>
                <Form.Control
                  {...register('observaciones')}
                  as="textarea"
                  rows={3}
                  onClick={(e) => e.target.select()}
                  placeholder="Información adicional sobre el servicio..."
                  className="reservar-form-control"
                />
              </Form.Group>
            </div>

            {/* Mensaje de éxito */}
            {mostrarExito && (
              <Alert variant="success" className="reservar-alert success">
                <i className="bi bi-check-circle-fill me-2"></i>
                ¡Reserva creada exitosamente! Recibirás confirmación por email.
              </Alert>
            )}

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