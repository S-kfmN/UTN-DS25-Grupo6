import { useState, useEffect } from 'react';
import { Button, Badge, Alert, Collapse, Modal } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { formatearFechaParaMostrar } from '../utils/dateUtils';
import { formatearFechaHoraParaMostrar } from '../utils/dateUtils';

export default function MisReservas() {
  const { usuario, obtenerReservasUsuario, cancelarReserva } = usarAuth();
  
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [reservasUsuario, setReservasUsuario] = useState([]);
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);
  const [modalCancelar, setModalCancelar] = useState({ show: false, reserva: null, error: '' });

  // Obtener reservas del usuario desde el contexto
  useEffect(() => {
    const cargarReservas = async () => {
      if (usuario) {
        const reservas = await obtenerReservasUsuario(); // Ahora es asíncrona
        console.log('MisReservas: Reservas cargadas en useEffect:', reservas); // Debugging
        setReservasUsuario(reservas);
      }
    };
    cargarReservas();
  }, [usuario, obtenerReservasUsuario]);

  // Efecto para sincronizar cuando cambien las reservas en el contexto
  useEffect(() => {
    const cargarReservas = async () => {
      if (usuario) {
        const reservas = await obtenerReservasUsuario(); // Ahora es asíncrona
        console.log('MisReservas: Reservas sincronizadas en useEffect:', reservas); // Debugging
        setReservasUsuario(reservas);
      }
    };
    cargarReservas();
  }, [usuario, obtenerReservasUsuario]);



  // Filtrar reservas según el estado seleccionado
  const reservasFiltradas = filtroEstado === 'todos' 
    ? reservasUsuario 
    : reservasUsuario.filter(reserva => reserva.estado === filtroEstado);

  // Verificar que reservas sea un array
  const reservasSeguras = Array.isArray(reservasFiltradas) ? reservasFiltradas : [];

  // Separar reservas activas y canceladas
  const reservasActivas = reservasUsuario.filter(r => r.estado !== 'cancelado');
  const reservasCanceladas = reservasUsuario.filter(r => r.estado === 'cancelado');

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelado': return 'danger';
      case 'completado': return 'success';
      default: return 'secondary';
    }
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'Confirmado';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      case 'completado': return 'Completado';
      default: return estado;
    }
  };

  // Usar la función utilitaria para formatear fechas

  // Nueva función para validar y abrir modal
  const intentarCancelarReserva = (reserva) => {
    // Calcular fecha y hora del turno
    const fechaHoraTurno = new Date(`${reserva.fecha}T${reserva.hora}`);
    const ahora = new Date();
    const diffHoras = (fechaHoraTurno - ahora) / (1000 * 60 * 60);
    if (diffHoras < 24) {
      setModalCancelar({ show: true, reserva: null, error: 'Solo puedes cancelar reservas con más de 24hs de anticipación.' });
    } else {
      setModalCancelar({ show: true, reserva, error: '' });
    }
  };

  // Modificar manejarCancelarReserva para usar el modal
  const manejarCancelarReserva = async () => {
    if (!modalCancelar.reserva) return;
    const resultado = await cancelarReserva(modalCancelar.reserva.id);
    if (resultado.exito) {
      const reservas = obtenerReservasUsuario();
      setReservasUsuario(reservas);
    }
    setModalCancelar({ show: false, reserva: null, error: '' });
  };

  // Estadísticas
  const estadisticas = {
    total: reservasUsuario.length,
    confirmadas: reservasUsuario.filter(r => r.estado === 'confirmado').length,
    pendientes: reservasUsuario.filter(r => r.estado === 'pendiente').length,
    canceladas: reservasUsuario.filter(r => r.estado === 'cancelado').length
  };

  return (
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <h1>Mis Reservas</h1>
        <p>Gestiona tus turnos programados</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="estadisticas-rapidas">
        <div className="stat-card">
          <h3>Total Reservas</h3>
          <p className="stat-numero">{estadisticas.total}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmadas</h3>
          <p className="stat-numero confirmado">{estadisticas.confirmadas}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p className="stat-numero pendiente">{estadisticas.pendientes}</p>
        </div>
        <div className="stat-card">
          <h3>Canceladas</h3>
          <p className="stat-numero cancelado">{estadisticas.canceladas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-admin">
        <div className="filtro-grupo">
          <label>Filtrar por estado:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="confirmado">Confirmado</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelado">Cancelado</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        

      </div>

      {/* Lista de reservas activas */}
      <div className="lista-reservas-admin">
        {reservasActivas.length > 0 ? (
          <div className="grupo-fecha">
            <h2 className="fecha-titulo">Mis Turnos Programados</h2>
            <div className="reservas-del-dia">
              {reservasActivas
                .filter(reserva => reserva && reserva.id)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map(reserva => (
                  <div key={reserva.id} className="reserva-card">
                    <div className="reserva-header">
                      <div className="reserva-hora">
                        <strong>{formatearFechaHoraParaMostrar(reserva.date, reserva.time)}</strong>
                      </div>
                      <div className="reserva-estado">
                        <span className={`badge bg-${obtenerColorEstado(reserva.estado)}`}>{obtenerTextoEstado(reserva.estado)}</span>
                      </div>
                    </div>
                    <div className="reserva-info">
                      <div className="cliente-info">
                        <h4 style={{ color: 'var(--color-acento)' }}>{reserva.servicio || 'Servicio no especificado'}</h4>
                        <p><strong>Vehículo:</strong> {reserva.patente || 'N/A'} - {reserva.modelo || 'N/A'}</p>
                        <p><strong>Cliente:</strong> {reserva.nombre || 'N/A'} {reserva.apellido || ''}</p>
                      </div>
                      {reserva.observaciones && (
                        <div className="observaciones">
                          <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                        </div>
                      )}
                    </div>
                    <div className="reserva-acciones mt-2">
                      {reserva.estado === 'pendiente' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => intentarCancelarReserva(reserva)}
                          style={{ fontWeight: 'bold' }}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Cancelar Reserva
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="sin-reservas">
            <p>No tienes reservas activas.</p>
          </div>
        )}
      </div>
      {/* Sección colapsable de turnos cancelados */}
      {reservasCanceladas.length > 0 && (
        <div className="mt-4">
          <Button
            variant="outline-warning"
            onClick={() => setMostrarCanceladas(v => !v)}
            aria-controls="turnos-cancelados"
            aria-expanded={mostrarCanceladas}
            className="mb-2"
            style={{ fontWeight: 'bold' }}
          >
            {mostrarCanceladas ? 'Ocultar' : 'Mostrar'} Turnos Cancelados ({reservasCanceladas.length})
          </Button>
          <Collapse in={mostrarCanceladas}>
            <div id="turnos-cancelados">
              <div className="grupo-fecha">
                <h2 className="fecha-titulo">Turnos Cancelados</h2>
                <div className="reservas-del-dia">
                  {reservasCanceladas
                    .filter(reserva => reserva && reserva.id)
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                    .map(reserva => (
                      <div key={reserva.id} className="reserva-card" style={{ opacity: 0.7 }}>
                        <div className="reserva-header">
                          <div className="reserva-hora">
                            <strong>{formatearFechaHoraParaMostrar(reserva.date, reserva.time)}</strong>
                          </div>
                          <div className="reserva-estado">
                            <span className={`badge bg-${obtenerColorEstado(reserva.estado)}`}>{obtenerTextoEstado(reserva.estado)}</span>
                          </div>
                        </div>
                        <div className="reserva-info">
                          <div className="cliente-info">
                            <h4 style={{ color: 'var(--color-acento)' }}>{reserva.servicio || 'Servicio no especificado'}</h4>
                            <p><strong>Vehículo:</strong> {reserva.patente || 'N/A'} - {reserva.modelo || 'N/A'}</p>
                            <p><strong>Cliente:</strong> {reserva.nombre || 'N/A'} {reserva.apellido || ''}</p>
                          </div>
                          {reserva.observaciones && (
                            <div className="observaciones">
                              <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                            </div>
                          )}
                          {reserva.fechaCancelacion && (
                            <div className="text-muted mt-2" style={{ fontSize: '0.95em' }}>
                              <i className="bi bi-clock-history me-1"></i>
                              Cancelado el {formatearFechaParaMostrar(reserva.fechaCancelacion)} a las {new Date(reserva.fechaCancelacion).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 p-3" style={{
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        border: '1px solid rgba(255, 204, 0, 0.3)',
        borderRadius: '5px',
        borderLeft: '4px solid var(--color-acento)'
      }}>
        <h6 style={{ 
          color: 'var(--color-acento)', 
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          <i className="bi bi-info-circle me-2"></i>
          Información Importante
        </h6>
        <ul style={{ 
          color: 'var(--color-texto)', 
          fontSize: '0.9rem',
          margin: 0,
          paddingLeft: '1.5rem'
        }}>
          <li>Las reservas se pueden cancelar hasta 24 horas antes del turno</li>
          <li>Recibirás confirmación por email cuando tu turno sea confirmado</li>
          <li>Llega 10 minutos antes de tu hora programada</li>
          <li>Trae la documentación del vehículo si es necesario</li>
        </ul>
      </div>

      {/* Modal de confirmación de cancelación */}
      <Modal show={modalCancelar.show} onHide={() => setModalCancelar({ show: false, reserva: null, error: '' })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalCancelar.error ? (
            <div className="alert alert-warning mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {modalCancelar.error}
            </div>
          ) : (
            <>
              <p>¿Estás seguro de que quieres cancelar esta reserva?</p>
              <ul>
                <li><b>Fecha:</b> {modalCancelar.reserva?.fecha}</li>
                <li><b>Hora:</b> {modalCancelar.reserva?.hora}</li>
                <li><b>Servicio:</b> {modalCancelar.reserva?.servicio}</li>
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalCancelar({ show: false, reserva: null, error: '' })}>
            Cerrar
          </Button>
          {!modalCancelar.error && (
            <Button variant="danger" onClick={manejarCancelarReserva}>
              Cancelar Reserva
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
} 