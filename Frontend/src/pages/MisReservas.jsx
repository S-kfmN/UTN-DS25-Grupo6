import React, { useEffect, useState } from 'react';
import { Button, Badge, Alert, Collapse, Modal } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { formatearFechaParaMostrar } from '../utils/dateUtils';
import { formatearFechaHoraParaMostrar, combinarNombreCompleto } from '../utils/dateUtils';
import '../assets/styles/misreservas.css';
import EditReservaModal from "../components/EditReservaModal";

export default function MisReservas() {
  // QUITA setReservaEditar DEL CONTEXTO
  const { usuario, obtenerReservasUsuario, cancelarReserva, reservas, modificarReserva, servicios } = usarAuth();

  // AGREGA EL ESTADO LOCAL
  const [reservaEditar, setReservaEditar] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);
  const [modalCancelar, setModalCancelar] = useState({ show: false, reserva: null, error: '' });

  const reservasUsuario = reservas; // Asignar directamente las reservas del contexto
  console.log('🔍 MisReservas: reservasUsuario del contexto (completo):', reservasUsuario);

  useEffect(() => {
    if (usuario?.id) {
      obtenerReservasUsuario(usuario.id); // Esto asegura que siempre se pase el userId
    }
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
    confirmadas: reservasUsuario.filter(r => {
      console.log('🔍 MisReservas: Estado de reserva para filtro confirmado:', r.estado);
      return r.estado === 'confirmado';
    }).length,
    pendientes: reservasUsuario.filter(r => {
      console.log('🔍 MisReservas: Estado de reserva para filtro pendiente:', r.estado);
      return r.estado === 'pendiente';
    }).length,
    canceladas: reservasUsuario.filter(r => {
      console.log('🔍 MisReservas: Estado de reserva para filtro cancelado:', r.estado);
      return r.estado === 'cancelado';
    }).length
  };

  const handleEliminarReserva = async (reservaId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) return;
    const resultado = await cancelarReserva(reservaId);
    if (resultado.exito) {
      await obtenerReservasUsuario(usuario.id);
      alert('Reserva eliminada correctamente.');
    } else {
      alert('Error al eliminar la reserva: ' + (resultado.error || 'Error desconocido'));
    }
  };

  if (!reservas.length) {
    return <Alert variant="info">No tienes reservas registradas.</Alert>;
  }

  return (
    <div className="misreservas-container">
      {/* Header */}
      <div className="misreservas-header">
        <h1>Mis Reservas</h1>
        <p>Gestiona tus turnos programados</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="misreservas-estadisticas-rapidas">
        <div className="misreservas-stat-card">
          <h3>Total Reservas</h3>
          <p className="misreservas-stat-numero">{estadisticas.total}</p>
        </div>
        <div className="misreservas-stat-card">
          <h3>Confirmadas</h3>
          <p className="misreservas-stat-numero confirmado">{estadisticas.confirmadas}</p>
        </div>
        <div className="misreservas-stat-card">
          <h3>Pendientes</h3>
          <p className="misreservas-stat-numero pendiente">{estadisticas.pendientes}</p>
        </div>
        <div className="misreservas-stat-card">
          <h3>Canceladas</h3>
          <p className="misreservas-stat-numero cancelado">{estadisticas.canceladas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="misreservas-filtros">
        <div className="misreservas-filtro-grupo">
          <label>Filtrar por estado:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="misreservas-form-select"
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
      <div className="misreservas-lista-reservas">
        {reservasFiltradas.length > 0 ? (
          <div className="misreservas-grupo-fecha">
            <h2 className="misreservas-fecha-titulo">Mis Turnos Programados</h2>
            <div className="misreservas-reservas-del-dia">
              {reservasFiltradas
                .filter(reserva => reserva && reserva.id && reserva.estado !== 'cancelado')
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map(reserva => (
                  <div key={reserva.id} className="misreservas-reserva-card">
                    <div className="misreservas-reserva-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="misreservas-reserva-hora" style={{ fontWeight: 'bold' }}>
                        {formatearFechaHoraParaMostrar(reserva.date, reserva.time)}
                      </div>
                    </div>
                    <span className={`badge bg-${obtenerColorEstado(reserva.estado)}`} style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                      {obtenerTextoEstado(reserva.estado)}
                    </span>
                    <div className="misreservas-reserva-info">
                      <div className="misreservas-cliente-info">
                        <h4>{reserva.servicio || 'Servicio no especificado'}</h4>
                        <p><strong>Vehículo:</strong> {reserva.patente || 'N/A'} - {reserva.modelo || 'N/A'}</p>
                        <p><strong>Cliente:</strong> {combinarNombreCompleto(reserva.nombre, reserva.apellido) || 'N/A'}</p>
                      </div>
                      {reserva.observaciones && (
                        <div className="misreservas-observaciones">
                          <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                        </div>
                      )}
                    </div>
                    <div className="misreservas-reserva-acciones">
                      {reserva.estado === 'pendiente' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => intentarCancelarReserva(reserva)}
                          className="misreservas-boton-cancelar"
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Cancelar Reserva
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleEliminarReserva(reserva.id)}
                        title="Eliminar reserva"
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setReservaEditar(reserva)}
                        className="misreservas-boton-editar"
                      >
                        <i className="bi bi-pencil"></i> Modificar
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="misreservas-sin-reservas">
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
            className="misreservas-boton-toggle-canceladas mb-2"
          >
            {mostrarCanceladas ? 'Ocultar' : 'Mostrar'} Turnos Cancelados ({reservasCanceladas.length})
          </Button>
          <Collapse in={mostrarCanceladas}>
            <div id="turnos-cancelados">
              <div className="misreservas-grupo-fecha">
                <h2 className="misreservas-fecha-titulo">Turnos Cancelados</h2>
                <div className="misreservas-reservas-del-dia">
                  {reservasCanceladas
                    .filter(reserva => reserva && reserva.id)
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                    .map(reserva => (
                      <div key={reserva.id} className="misreservas-reserva-card" style={{ opacity: 0.7 }}>
                        <div className="misreservas-reserva-header">
                          <div className="misreservas-reserva-hora">
                            <strong>{formatearFechaHoraParaMostrar(reserva.date, reserva.time)}</strong>
                          </div>
                          <div className="misreservas-reserva-estado">
                            <span className={`badge bg-${obtenerColorEstado(reserva.estado)}`}>{obtenerTextoEstado(reserva.estado)}</span>
                          </div>
                        </div>
                        <div className="misreservas-reserva-info">
                          <div className="misreservas-cliente-info">
                            <h4>{reserva.servicio || 'Servicio no especificado'}</h4>
                            <p><strong>Vehículo:</strong> {reserva.patente || 'N/A'} - {reserva.modelo || 'N/A'}</p>
                            <p><strong>Cliente:</strong> {combinarNombreCompleto(reserva.nombre, reserva.apellido) || 'N/A'}</p>
                          </div>
                          {reserva.observaciones && (
                            <div className="misreservas-observaciones">
                              <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                            </div>
                          )}
                          {reserva.fechaCancelacion && (
                            <div className="misreservas-texto-cancelacion">
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
      <div className="misreservas-info-adicional">
        <h6>
          <i className="bi bi-info-circle me-2"></i>
          Información Importante:
        </h6>
        <ul>
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
            <div className="alert alert-warning misreservas-modal-alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {modalCancelar.error}
            </div>
          ) : (
            <>
              <p>¿Estás seguro de que quieres cancelar esta reserva?</p>
              <ul className="misreservas-modal-lista">
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

      {/* Modal para editar reserva */}
      <EditReservaModal
        show={!!reservaEditar}
        reserva={reservaEditar}
        onHide={() => setReservaEditar(null)}
        onSave={async (nuevosDatos) => {
          // Buscar el servicio por nombre
          const servicioSeleccionado = servicios.find(s => s.name === nuevosDatos.servicio);
          await modificarReserva(reservaEditar.id, {
            date: nuevosDatos.fecha,
            time: nuevosDatos.hora,
            notes: nuevosDatos.observaciones,
            serviceId: servicioSeleccionado?.id // <-- enviar el id del servicio
          });
          setReservaEditar(null);
          await obtenerReservasUsuario(usuario.id);
        }}
      />
    </div>
  );
}