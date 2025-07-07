import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { formatearFechaParaMostrar } from '../utils/dateUtils';

export default function UserDetailsModal({ show, onHide, usuario, reservas }) {
  if (!usuario) return null;

  // Filtrar reservas del usuario
  const reservasUsuario = reservas.filter(r => r.userId === usuario.id);

  // Usar la función utilitaria para formatear fechas

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelado': return 'danger';
      case 'completado': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: 'var(--color-gris)', borderBottom: '1px solid var(--color-acento)' }}>
        <Modal.Title style={{ color: 'var(--color-acento)' }}>
          <i className="bi bi-person-circle me-2"></i>
          Detalles del Usuario
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Información personal */}
        <div className="mb-4">
          <h5 style={{ color: 'var(--color-acento)', borderBottom: '2px solid var(--color-acento)', paddingBottom: '0.5rem' }}>
            <i className="bi bi-person me-2"></i>
            Información Personal
          </h5>
          <Row>
            <Col md={6}>
              <p><strong>Nombre completo:</strong> {usuario.nombre} {usuario.apellido}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Teléfono:</strong> {usuario.telefono}</p>
            </Col>
            <Col md={6}>
              <p><strong>DNI:</strong> {usuario.dni}</p>
              <p><strong>Fecha de registro:</strong> {formatearFechaParaMostrar(usuario.fechaRegistro)}</p>
              <p>
                <strong>Rol:</strong> 
                <Badge bg={usuario.rol === 'admin' ? 'danger' : 'success'} className="ms-2">
                  {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
                </Badge>
              </p>
            </Col>
          </Row>
        </div>

        {/* Reservas del usuario */}
        <div>
          <h5 style={{ color: 'var(--color-acento)', borderBottom: '2px solid var(--color-acento)', paddingBottom: '0.5rem' }}>
            <i className="bi bi-calendar-check me-2"></i>
            Historial de Reservas ({reservasUsuario.length})
          </h5>
          
          {reservasUsuario.length > 0 ? (
            <div className="reservas-usuario">
              {reservasUsuario
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map(reserva => (
                  <div key={reserva.id} className="reserva-item mb-2 p-2" style={{
                    backgroundColor: 'rgba(255, 204, 0, 0.1)',
                    border: '1px solid rgba(255, 204, 0, 0.3)',
                    borderRadius: '5px'
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{formatearFechaParaMostrar(reserva.fecha)} - {reserva.hora}</strong>
                        <br />
                        <span className="text-muted">{reserva.servicio}</span>
                      </div>
                      <Badge bg={obtenerColorEstado(reserva.estado)}>
                        {reserva.estado}
                      </Badge>
                    </div>
                    {reserva.observaciones && (
                      <small className="text-muted mt-1 d-block">
                        <i className="bi bi-chat-text me-1"></i>
                        {reserva.observaciones}
                      </small>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-3" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)', borderRadius: '5px' }}>
              <i className="bi bi-calendar-x" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
              <p className="mt-2 mb-0 text-muted">Este usuario no tiene reservas registradas</p>
            </div>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer style={{ backgroundColor: 'var(--color-gris)', borderTop: '1px solid var(--color-acento)' }}>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 