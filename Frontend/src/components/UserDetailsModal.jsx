import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { formatearFechaParaMostrar } from '../utils/dateUtils';
import '../assets/styles/modalEdicion.css';

export default function UserDetailsModal({ show, onHide, usuario, reservas }) {
  if (!usuario) return null;

  // Filtrar reservas del usuario
  const reservasUsuario = reservas.filter(r => r.userId === usuario.id);

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
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-edicion .modal-content">
      <Modal.Header closeButton className="modal-edicion-header">
        <Modal.Title className="modal-edicion-title">
          <i className="bi bi-person-circle me-2"></i>
          Detalles del Usuario
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="modal-edicion-body">
        {/* Información personal */}
        <div className="modal-edicion-seccion">
          <h5 className="modal-edicion-seccion-titulo">
            <i className="bi bi-person me-2"></i>
            Información Personal
          </h5>
          <Row>
            <Col md={6}>
              <div className="modal-edicion-info-personal">
                <p><strong>Nombre completo:</strong> {usuario.nombre} {usuario.apellido}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Teléfono:</strong> {usuario.telefono}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="modal-edicion-info-personal">
                <p><strong>DNI:</strong> {usuario.dni}</p>
                <p><strong>Fecha de registro:</strong> {formatearFechaParaMostrar(usuario.fechaRegistro)}</p>
                <p>
                  <strong>Rol:</strong> 
                  <Badge bg={usuario.role === 'ADMIN' ? 'danger' : 'success'} className="ms-2">
                    {usuario.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                  </Badge>
                </p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Reservas del usuario */}
        <div className="modal-edicion-reservas-container">
          <h5 className="modal-edicion-seccion-titulo">
            <i className="bi bi-calendar-check me-2"></i>
            Historial de Reservas ({reservasUsuario.length})
          </h5>
          
          {reservasUsuario.length > 0 ? (
            <div className="reservas-usuario">
              {reservasUsuario
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map(reserva => (
                  <div key={reserva.id} className="modal-edicion-reserva-item">
                    <div className="modal-edicion-reserva-header">
                      <div>
                        <strong className="modal-edicion-reserva-fecha">{formatearFechaParaMostrar(reserva.fecha)} - {reserva.hora}</strong>
                        <br />
                        <span className="modal-edicion-reserva-servicio">{reserva.servicio}</span>
                      </div>
                      <Badge bg={obtenerColorEstado(reserva.estado)}>
                        {reserva.estado}
                      </Badge>
                    </div>
                    {reserva.observaciones && (
                      <small className="modal-edicion-reserva-observaciones">
                        <i className="bi bi-chat-text me-1"></i>
                        {reserva.observaciones}
                      </small>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="modal-edicion-reservas-vacio">
              <i className="bi bi-calendar-x"></i>
              <p>Este usuario no tiene reservas registradas</p>
            </div>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer className="modal-edicion-footer">
        <Button className="modal-edicion-boton-cerrar" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 