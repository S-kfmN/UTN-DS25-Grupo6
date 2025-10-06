import React, { useState, useEffect } from 'react';
import { usarAuth } from '../context/AuthContext';
import { Modal, Button, Table, Badge, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useHistorial } from '../hooks/useHistorial';
import apiService from '../services/apiService';
import '../assets/styles/gestionreservas.css';
import GestionTable from '../components/GestionTable';

export default function GestionReservas() {
  // Estados para filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const { allReservations, allUsers, esAdmin, cargarTodasLasReservas, eliminarReserva } = usarAuth();
  const navigate = useNavigate();

  // Modal de detalle
  const [reservaDetalle, setReservaDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estado para controlar actualización local
  const [actualizando, setActualizando] = useState(null);

  // Función para cambiar el estado de una reserva
  const handleEstadoChange = async (reservaId, nuevoEstado) => {
    setActualizando(reservaId);
    try {
      await apiService.updateReservation(reservaId, { status: nuevoEstado });
      // Recargar todas las reservas para reflejar el cambio
      await cargarTodasLasReservas();
    } catch (error) {
      alert('Error al actualizar el estado');
    } finally {
      setActualizando(null);
    }
  };

  // Funcion para eliminar reserva
  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta reserva?')) {
      const res = await eliminarReserva(id);
      if (res.exito) {
        await cargarTodasLasReservas();
      } else {
        alert('Error al eliminar la reserva');
      }
    }
  };

  // Estado para el modal de edicion
  const [showEditModal, setShowEditModal] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [editData, setEditData] = useState({ fecha: '', hora: '', status: '' });

  // Abrir modal y setear datos
  const handleOpenEdit = (reserva) => {
    setReservaEditando(reserva);
    setEditData({
      fecha: reserva.fecha,
      hora: reserva.hora,
      status: reserva.status
    });
    setShowEditModal(true);
  };

  // Guardar cambios
  const handleGuardarEdicion = async () => {
    try {
      await apiService.updateReservation(reservaEditando.id, {
        date: editData.fecha,
        time: editData.hora,
        status: editData.status
      });
      setShowEditModal(false);
      setReservaEditando(null);
      await cargarTodasLasReservas();
    } catch (error) {
      alert('Error al modificar la reserva');
    }
  };

  // Cargar todas las reservas al montar el componente (para admin)
  useEffect(() => {
    if (esAdmin()) {
      cargarTodasLasReservas();
    }
  }, [esAdmin, cargarTodasLasReservas]);

  // Filtrado simplificado - usar allReservations
  const reservasFiltradas = allReservations.filter(r => {
    const coincideFecha = !filtroFecha || r.fecha === filtroFecha;
    const coincidePeriodo = !filtroPeriodo || (filtroPeriodo === 'manana' ? (r.hora < '13:00') : (r.hora >= '13:00'));
    const coincideEstado = filtroEstado === 'todos' || r.status === filtroEstado;
    
    // Búsqueda múltiple en un solo campo
    const coincideBusqueda = !filtroBusqueda || (
      (r.patente && r.patente.toLowerCase().includes(filtroBusqueda.toLowerCase())) ||
      (r.dni && r.dni.includes(filtroBusqueda)) ||
      (r.user?.name && r.user.name.toLowerCase().includes(filtroBusqueda.toLowerCase())) || // nombre completo
      (r.nombre && r.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())) ||
      (r.apellido && r.apellido.toLowerCase().includes(filtroBusqueda.toLowerCase()))
    );
    
    return coincideFecha && coincidePeriodo && coincideEstado && coincideBusqueda;
  });

  // Obtener historial del vehículo para el modal
  const { historial, loading: historialLoading, error: historialError } = useHistorial(reservaDetalle?.patente || '', mostrarModal && !!reservaDetalle);

  // Obtener datos del cliente - usar allUsers
  const cliente = reservaDetalle && allUsers.find(u => u.id === reservaDetalle.userId);

  return (
    <div className="gestionreservas-container">
      {/* Header */}
      <div className="gestionreservas-header">
        <h1>Gestión de Reservas</h1>
        <h3>Consulta y administra los turnos con filtros avanzados</h3>
      </div>

      {/* Formulario de búsqueda */}
      <Card className="gestionreservas-card-busqueda">
        <Card.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="gestionreservas-form-label">
                    <i className="bi bi-search me-2"></i>
                    Buscar atributos
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={filtroBusqueda}
                    onChange={e => setFiltroBusqueda(e.target.value)}
                    placeholder="Ej: ABC123, 12345678, Juan Pérez"
                    className="gestionreservas-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="gestionreservas-form-label">
                    <i className="bi bi-calendar me-2"></i>
                    Fecha
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={filtroFecha}
                    onChange={e => setFiltroFecha(e.target.value)}
                    className="gestionreservas-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="gestionreservas-form-label">
                    <i className="bi bi-clock me-2"></i>
                    Período
                  </Form.Label>
                  <Form.Select
                    value={filtroPeriodo}
                    onChange={e => setFiltroPeriodo(e.target.value)}
                    className="gestionreservas-form-control"
                  >
                    <option value="">Todos</option>
                    <option value="manana">Mañana</option>
                    <option value="tarde">Tarde</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="gestionreservas-form-label">
                    <i className="bi bi-check-circle me-2"></i>
                    Estado
                  </Form.Label>
                  <Form.Select
                    value={filtroEstado}
                    onChange={e => setFiltroEstado(e.target.value)}
                    className="gestionreservas-form-control"
                  >
                    <option value="todos">Todos</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="CONFIRMED">Confirmada</option>
                    <option value="COMPLETED">Completada</option>
                    <option value="CANCELLED">Cancelada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      {/* Resultados de búsqueda */}
      <div className="gestionreservas-busqueda-reservas">
        <div className="gestionreservas-resultados-header">
          <h3 className="gestionreservas-resultados-titulo">
            <i className="bi bi-calendar-check me-2"></i>
            Resultados ({reservasFiltradas.length} reservas)
          </h3>
          {(filtroBusqueda || filtroFecha || filtroPeriodo || filtroEstado !== 'todos') && (
            <Badge bg="info" className="gestionreservas-badge-filtros">
              Filtros activos
            </Badge>
          )}
        </div>

        <GestionTable
          columns={[
            { key: 'nombreCompleto', label: 'Nombre', sortable: true, getSortValue: (r) => `${(r.apellido || '').toLowerCase()} ${(r.nombre || '').toLowerCase()}`.trim(), render: (r) => `${r.nombre || ''} ${r.apellido || ''}`.trim() || '-' },
            { key: 'fecha', label: 'Fecha', sortable: true, width: '130px' },
            { key: 'hora', label: 'Hora', sortable: true, width: '110px' },
            { key: 'servicio', label: 'Servicio', sortable: true },
            { key: 'vehiculo', label: 'Vehículo', sortable: true, getSortValue: (r) => `${(r.patente || '').toLowerCase()} ${(r.modelo || '').toLowerCase()}`.trim(), render: (r) => `${r.patente || ''} - ${r.modelo || ''}` },
            { key: 'status', label: 'Estado', sortable: true, render: (r) => (
              <Badge bg={
                r.status === 'CONFIRMED' ? 'success' :
                r.status === 'PENDING' ? 'warning' :
                r.status === 'CANCELLED' ? 'danger' :
                r.status === 'COMPLETED' ? 'secondary' : 'secondary'
              } className="fs-6">
                {{
                  CONFIRMED: 'Confirmado',
                  PENDING: 'Pendiente',
                  CANCELLED: 'Cancelado',
                  COMPLETED: 'Completado'
                }[r.status] || r.status}
              </Badge>
            )}
          ]}
          data={reservasFiltradas}
          emptyMessage={'No se encontraron reservas con los filtros seleccionados.'}
          renderActions={(r) => (
            <div className="gestionreservas-reserva-acciones">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => { setReservaDetalle(r); setMostrarModal(true); }}
                title="Ver Detalle"
                className="gestionreservas-boton-accion gestionreservas-boton-ver"
              >
                <i className="bi bi-eye"></i>
              </Button>
              {/* Botón Modificar */}
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => handleOpenEdit(r)}
                title="Modificar reserva"
                className="gestionreservas-boton-accion gestionreservas-boton-modificar ms-2"
              >
                <i className="bi bi-pencil"></i>
              </Button>
              {/* Botón Eliminar */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleEliminar(r.id)}
                title="Eliminar reserva"
                className="gestionreservas-boton-accion gestionreservas-boton-eliminar ms-2"
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          )}
        />
      </div>
      {/* Modal de detalle de reserva */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body className="gestionreservas-modal-body">
          {reservaDetalle && (
            <>
              <h5>Datos de la Reserva</h5>
              <ul>
                <li><b>Fecha:</b> <span style={{ color: '#111' }}>{reservaDetalle.fecha}</span></li>
                <li><b>Hora:</b> <span style={{ color: '#111' }}>{reservaDetalle.hora}</span></li>
                <li><b>Servicio:</b> <span style={{ color: '#111' }}>{reservaDetalle.servicio}</span></li>
                <li><b>Vehículo:</b> <span style={{ color: '#111' }}>{reservaDetalle.patente} - {reservaDetalle.modelo}</span></li>
                <li><b>Estado:</b> <Badge bg={reservaDetalle.status === 'CONFIRMED' ? 'success' : reservaDetalle.status === 'PENDING' ? 'warning' : 'danger'}>{reservaDetalle.status}</Badge></li>
                <li><b>Observaciones:</b> <span style={{ color: '#111' }}>{reservaDetalle.observaciones || 'Sin observaciones'}</span></li>
              </ul>
              <h5 className="mt-3">Datos del Cliente</h5>
              {cliente ? (
                <ul>
                  <li><b>Nombre:</b> <span style={{ color: '#111' }}> {cliente.nombre} {cliente.apellido}</span></li>
                  <li><b>Email:</b> <span style={{ color: '#111' }}>{cliente.email}</span></li>

                  <li><b>Teléfono:</b> <span style={{ color: '#111' }}>{cliente.telefono}</span></li>
                </ul>
              ) : (
                <p className="gestionreservas-modal-body .text-muted">No se encontró el cliente vinculado.</p>
              )}
              <h5 className="mt-3">Historial del Vehículo</h5>
              {reservaDetalle.patente ? (
                <Button size="sm" variant="outline-primary" className="gestionreservas-boton-historial" onClick={() => {
                  setMostrarModal(false);
                  navigate('/historial-vehiculo', { state: { patente: reservaDetalle.patente } });
                }}>
                  Ver historial completo del vehículo
                </Button>
              ) : null}
              {historial.loading ? (
                <div className="gestionreservas-spinner-container">
                  <span className="gestionreservas-spinner-text">Cargando historial...</span>
                </div>
              ) : historial.error ? (
                <div className="gestionreservas-alert-danger">Error al cargar historial: {historial.error}</div>
              ) : historial.historial && historial.historial.length > 0 ? (
                <Table size="sm" bordered hover className="gestionreservas-tabla-historial">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Servicio</th>
                      <th>Resultado</th>
                      <th>Mecánico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.historial.map((serv, idx) => (
                      <tr key={serv.id || idx}>
                        <td>{serv.fecha}</td>
                        <td>{serv.servicio}</td>
                        <td>{serv.resultado}</td>
                        <td>{serv.mecanico || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="gestionreservas-modal-body .text-muted">No hay historial registrado para este vehículo.</div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={editData.fecha}
                onChange={e => setEditData({ ...editData, fecha: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                value={editData.hora}
                onChange={e => setEditData({ ...editData, hora: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={editData.status}
                onChange={e => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarEdicion}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}