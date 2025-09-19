import React, { useState, useEffect } from 'react';
import { usarAuth } from '../context/AuthContext';
import { Modal, Button, Table, Badge, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useHistorial } from '../hooks/useHistorial';
import apiService from '../services/apiService'; // <-- IMPORTANTE

export default function GestionReservas() {
  // Estados para filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const { allReservations, allUsers, esAdmin, cargarTodasLasReservas } = usarAuth();
  const navigate = useNavigate();
  // Eliminar la declaración duplicada de historial
  // const { historial, loading: historialLoading, error: historialError } = useHistorial(reservaDetalle?.patente || '', mostrarModal && !!reservaDetalle);

  // Modal de detalle
  const [reservaDetalle, setReservaDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // NUEVO: Estado para controlar actualización local
  const [actualizando, setActualizando] = useState(null);

  // NUEVO: Función para cambiar el estado de una reserva
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
    const coincideEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    
    // Búsqueda múltiple en un solo campo
    const coincideBusqueda = !filtroBusqueda || (
      (r.patente && r.patente.toLowerCase().includes(filtroBusqueda.toLowerCase())) ||
      (r.dni && r.dni.includes(filtroBusqueda)) ||
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
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <div className="d-flex justify-content-center align-items-center">
          <div className="text-center">
            <h1>Gestión de Reservas</h1>
            <h3>Consulta y administra los turnos con filtros avanzados</h3>
          </div>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <Card style={{
        backgroundColor: 'var(--color-gris)',
        border: '1px solid var(--color-acento)',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <Card.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    <i className="bi bi-search me-2"></i>
                    Buscar atributos
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={filtroBusqueda}
                    onChange={e => setFiltroBusqueda(e.target.value)}
                    placeholder="Ej: ABC123, 12345678, Juan Pérez"
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    <i className="bi bi-calendar me-2"></i>
                    Fecha
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={filtroFecha}
                    onChange={e => setFiltroFecha(e.target.value)}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    <i className="bi bi-clock me-2"></i>
                    Período
                  </Form.Label>
                  <Form.Select
                    value={filtroPeriodo}
                    onChange={e => setFiltroPeriodo(e.target.value)}
                    className="form-control-custom"
                  >
                    <option value="">Todos</option>
                    <option value="manana">Mañana</option>
                    <option value="tarde">Tarde</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    <i className="bi bi-check-circle me-2"></i>
                    Estado
                  </Form.Label>
                  <Form.Select
                    value={filtroEstado}
                    onChange={e => setFiltroEstado(e.target.value)}
                    className="form-control-custom"
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
      <div className="busqueda-usuarios">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 style={{ color: 'var(--color-acento)' }}>
            <i className="bi bi-calendar-check me-2"></i>
            Resultados ({reservasFiltradas.length} reservas)
          </h3>
          {(filtroBusqueda || filtroFecha || filtroPeriodo || filtroEstado !== 'todos') && (
            <Badge bg="info" className="fs-6">
              Filtros activos
            </Badge>
          )}
        </div>

        <div className="resultados-usuarios">
          {reservasFiltradas.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron reservas con los filtros seleccionados.
            </Alert>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reservasFiltradas.map(r => (
                <div key={r.id} className="usuario-card">
                  <div className="usuario-header">
                    <div className="usuario-nombre">
                      <strong>{r.nombre} {r.apellido}</strong>
                    </div>
                    <div className="usuario-rol">
                      <Badge bg={
                        r.status === 'CONFIRMED' ? 'success' :
                        r.status === 'PENDING' ? 'warning' :
                        r.status === 'CANCELLED' ? 'danger' : 'secondary'
                      } className="fs-6">
                        {{
                          CONFIRMED: 'Completado',
                          PENDING: 'Pendiente',
                          CANCELLED: 'Cancelado'
                        }[r.status] || r.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="usuario-info">
                    <div className="cliente-info">
                      <Row className="g-2">
                        <Col md={3}>
                          <p><strong>Fecha:</strong> {r.fecha}</p>
                          <p><strong>Hora:</strong> {r.hora}</p>
                        </Col>
                        <Col md={3}>
                          <p><strong>Servicio:</strong> {r.servicio}</p>
                          <p><strong>Vehículo:</strong> {r.patente} - {r.modelo}</p>
                        </Col>
                        <Col md={3}>
                          {/*<p><strong>DNI:</strong> {r.dni}</p>*/}
                        </Col>
                        <Col md={3} className="d-flex align-items-center justify-content-end">
                          <div className="usuario-acciones">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => { setReservaDetalle(r); setMostrarModal(true); }}
                              title="Ver Detalle"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modal de detalle de reserva */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservaDetalle && (
            <>
              <h5>Datos de la Reserva</h5>
              <ul>
                <li><b>Fecha:</b> {reservaDetalle.fecha}</li>
                <li><b>Hora:</b> {reservaDetalle.hora}</li>
                <li><b>Servicio:</b> {reservaDetalle.servicio}</li>
                <li><b>Vehículo:</b> {reservaDetalle.patente} - {reservaDetalle.modelo}</li>
                <li><b>Estado:</b> <Badge bg={reservaDetalle.status === 'CONFIRMED' ? 'success' : reservaDetalle.status === 'PENDING' ? 'warning' : 'danger'}>{reservaDetalle.status}</Badge></li>
                <li><b>Observaciones:</b> {reservaDetalle.observaciones || 'Sin observaciones'}</li>
              </ul>
              <h5 className="mt-3">Datos del Cliente</h5>
              {cliente ? (
                <ul>
                  <li><b>Nombre:</b> {cliente.nombre} {cliente.apellido}</li>
                  <li><b>Email:</b> {cliente.email}</li>
                  <li><b>DNI:</b> {cliente.dni}</li>
                  <li><b>Teléfono:</b> {cliente.telefono}</li>
                </ul>
              ) : (
                <p className="text-muted">No se encontró el cliente vinculado.</p>
              )}
              <h5 className="mt-3">Historial del Vehículo</h5>
              {reservaDetalle.patente ? (
                <Button size="sm" variant="outline-primary" className="mb-2" onClick={() => {
                  setMostrarModal(false);
                  navigate('/historial-vehiculo', { state: { patente: reservaDetalle.patente } });
                }}>
                  Ver historial completo del vehículo
                </Button>
              ) : null}
              {historial.loading ? (
                <div className="text-center my-3">
                  <span>Cargando historial...</span>
                </div>
              ) : historial.error ? (
                <div className="alert alert-danger">Error al cargar historial: {historial.error}</div>
              ) : historial.historial && historial.historial.length > 0 ? (
                <Table size="sm" bordered hover>
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
                <div className="text-muted">No hay historial registrado para este vehículo.</div>
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
    </div>
  );
}