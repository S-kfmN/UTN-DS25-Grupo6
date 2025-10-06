import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/modalEdicion.css';

export default function VehicleDetailsModal({ show, onHide, vehiculo }) {
  const navigate = useNavigate();

  if (!vehiculo) return null;

  const handleVerHistorial = () => {
    onHide();
    navigate('/historial-vehiculo', { state: { patente: vehiculo.patente } });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-edicion .modal-content">
      <Modal.Header closeButton className="modal-edicion-header">
        <Modal.Title className="modal-edicion-title">
          <i className="bi bi-car-front me-2"></i>
          Detalle de Vehículo
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="modal-edicion-body">
        <div className="modal-edicion-detalle-vehiculo">
          <h5>Datos del Vehículo</h5>
          <ul>
            <li><b>Patente:</b><span>{vehiculo.patente}</span></li>
            <li><b>Modelo:</b><span>{vehiculo.modelo}</span></li>
            <li><b>Marca:</b><span>{vehiculo.marca}</span></li>
            <li><b>Año:</b><span>{vehiculo.año || '-'}</span></li>
            {vehiculo.color && (
              <li><b>Color:</b><span>{vehiculo.color}</span></li>
            )}
          </ul>
        </div>

        <div className="modal-edicion-detalle-dueno">
          <h5>Dueño Actual</h5>
          {vehiculo.usuario ? (
          <ul>
            <li><b>Nombre:</b><span>{vehiculo.usuario.nombre} {vehiculo.usuario.apellido}</span></li>
            <li><b>Email:</b><span>{vehiculo.usuario.email}</span></li>
            <li><b>Teléfono:</b><span>{vehiculo.usuario.phone}</span></li>
          </ul>
          ) : (
            <p className="modal-edicion-texto-muted">No se encontró el usuario vinculado.</p>
          )}
        </div>

        <Button 
          variant="outline-info" 
          size="sm" 
          className="modal-edicion-boton-historial-modal"
          onClick={handleVerHistorial}
        >
          <i className="bi bi-clock-history me-2"></i>
          Ver historial de servicios
        </Button>
      </Modal.Body>
      
      <Modal.Footer className="modal-edicion-footer">
        <Button variant="secondary" onClick={onHide} className="modal-edicion-boton-cerrar">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
