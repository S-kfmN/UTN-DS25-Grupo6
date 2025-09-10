import React, { useState } from 'react';
import { usarAuth } from '../context/AuthContext';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useHistorial } from '../hooks/useHistorial';

export default function GestionReservas() {
  // Estados para filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroPatente, setFiltroPatente] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroApellido, setFiltroApellido] = useState('');
  const [filtroDNI, setFiltroDNI] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const { allReservations, allUsers } = usarAuth();
  const navigate = useNavigate();
  // Eliminar la declaración duplicada de historial
  // const { historial, loading: historialLoading, error: historialError } = useHistorial(reservaDetalle?.patente || '', mostrarModal && !!reservaDetalle);

  // Modal de detalle
  const [reservaDetalle, setReservaDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Filtrado avanzado - usar allReservations
  const reservasFiltradas = allReservations.filter(r => {
    const coincideFecha = !filtroFecha || r.fecha === filtroFecha;
    const coincidePeriodo = !filtroPeriodo || (filtroPeriodo === 'manana' ? (r.hora < '13:00') : (r.hora >= '13:00'));
    const coincidePatente = !filtroPatente || (r.patente && r.patente.toLowerCase().includes(filtroPatente.toLowerCase()));
    const coincideNombre = !filtroNombre || (r.nombre && r.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));
    const coincideApellido = !filtroApellido || (r.apellido && r.apellido.toLowerCase().includes(filtroApellido.toLowerCase()));
    const coincideDNI = !filtroDNI || (r.dni && r.dni.includes(filtroDNI));
    const coincideEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
    return coincideFecha && coincidePeriodo && coincidePatente && coincideNombre && coincideApellido && coincideDNI && coincideEstado;
  });

  // Obtener historial del vehículo para el modal
  const { historial, loading: historialLoading, error: historialError } = useHistorial(reservaDetalle?.patente || '', mostrarModal && !!reservaDetalle);

  // Obtener datos del cliente - usar allUsers
  const cliente = reservaDetalle && allUsers.find(u => u.id === reservaDetalle.userId);

  return (
    <div className="contenedor-gestion-reservas">
      <div className="header-gestion-reservas">
        <h1>Gestión de Reservas</h1>
        <p>Consulta y administra los turnos con filtros avanzados</p>
      </div>
      <div className="filtros-gestion">
        <div className="filtro-grupo">
          <label>Fecha:</label>
          <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} className="form-control" />
        </div>
        <div className="filtro-grupo">
          <label>Periodo:</label>
          <select value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)} className="form-select">
            <option value="">Todos</option>
            <option value="manana">Mañana</option>
            <option value="tarde">Tarde</option>
          </select>
        </div>
        <div className="filtro-grupo">
          <label>Patente:</label>
          <input type="text" value={filtroPatente} onChange={e => setFiltroPatente(e.target.value)} className="form-control" placeholder="Ej: ABC123" />
        </div>
        <div className="filtro-grupo">
          <label>Nombre:</label>
          <input type="text" value={filtroNombre} onChange={e => setFiltroNombre(e.target.value)} className="form-control" />
        </div>
        <div className="filtro-grupo">
          <label>Apellido:</label>
          <input type="text" value={filtroApellido} onChange={e => setFiltroApellido(e.target.value)} className="form-control" />
        </div>
        <div className="filtro-grupo">
          <label>DNI:</label>
          <input type="text" value={filtroDNI} onChange={e => setFiltroDNI(e.target.value)} className="form-control" />
        </div>
        <div className="filtro-grupo">
          <label>Estado:</label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="form-select">
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>
      <div className="resultados-gestion">
        {reservasFiltradas.length === 0 ? (
          <div className="alert alert-warning mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            No se encontraron reservas con los filtros seleccionados.
          </div>
        ) : (
          <div className="tabla-gestion-reservas-wrapper">
            <Table className="tabla-gestion-reservas" responsive>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Servicio</th>
                  <th>Vehículo</th>
                  <th>Cliente</th>
                  <th>DNI</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map(r => {
                  console.log('🔍 Debug GestionReservas: Reserva en tabla:', r);
                  return (
                    <tr key={r.id}>
                      <td>{r.fecha}</td>
                      <td>{r.hora}</td>
                      <td>{r.servicio}</td>
                      <td>{r.patente} - {r.modelo}</td>
                      <td>{r.nombre} {r.apellido}</td>
                      <td>{r.dni}</td>
                      <td>
                        <Badge bg={
                          r.status === 'CONFIRMED' ? 'success' :
                          r.status === 'PENDING' ? 'warning' :
                          r.status === 'CANCELLED' ? 'danger' : 'secondary'
                        }>
                          {r.status}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => { setReservaDetalle(r); setMostrarModal(true); }}
                          style={{ fontWeight: 'bold' }}
                        >
                          <i className="bi bi-eye me-1"></i>
                          Ver Detalle
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
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