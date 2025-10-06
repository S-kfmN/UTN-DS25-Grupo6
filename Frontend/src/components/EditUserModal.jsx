import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import '../assets/styles/modalEdicion.css';

export default function EditUserModal({ show, onHide, usuario, onSave }) {
  const { actualizarEstadoVehiculoGlobal } = usarAuth();
  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    email: '',
    phone: ''
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (usuario) {
      setFormData({
        name: usuario.name || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        phone: usuario.phone || ''
      });
    }
  }, [usuario]);

  const manejarCambio = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    if (errores[campo]) {
      setErrores(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.name.trim()) {
      nuevosErrores.name = 'El nombre es requerido';
    }
    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    if (!formData.phone.trim()) {
      nuevosErrores.phone = 'El teléfono es requerido';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) return;
    setGuardando(true);
    try {
      const payload = {};
      if (formData.name !== usuario.name) payload.name = formData.name;
      if (formData.apellido !== usuario.apellido) payload.apellido = formData.apellido;
      if (formData.email !== usuario.email) payload.email = formData.email;
      if (formData.phone !== usuario.phone) payload.phone = formData.phone;
      await onSave(payload);
      onHide();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-edicion .modal-content">
      <Modal.Header closeButton className="modal-edicion-header">
        <Modal.Title className="modal-edicion-title">
          <i className="bi bi-pencil-square me-2"></i>
          Editar Usuario
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="modal-edicion-body">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="modal-edicion-label"><strong>Nombre *</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => manejarCambio('name', e.target.value)}
                  isInvalid={!!errores.name}
                  placeholder="Nombre del usuario"
                />
                <Form.Control.Feedback type="invalid">
                  {errores.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="modal-edicion-label"><strong>Apellido *</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => manejarCambio('apellido', e.target.value)}
                  isInvalid={!!errores.apellido}
                  placeholder="Apellido del usuario"
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
                <Form.Label className="modal-edicion-label"><strong>Email *</strong></Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => manejarCambio('email', e.target.value)}
                  isInvalid={!!errores.email}
                  placeholder="usuario@email.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errores.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="modal-edicion-label"><strong>Teléfono *</strong></Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => manejarCambio('phone', e.target.value)}
                  isInvalid={!!errores.phone}
                  placeholder="11 1234-5678"
                />
                <Form.Control.Feedback type="invalid">
                  {errores.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="modal-edicion-label"><strong>Rol</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={usuario?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                  disabled
                  className="modal-edicion-rol-disabled"
                />
                <Form.Text className="modal-edicion-texto-ayuda">
                  El rol no se puede modificar desde esta interfaz
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="modal-edicion-footer">
        <Button className="modal-edicion-boton-cerrar" onClick={onHide}>
          Cancelar
        </Button>
        <Button 
          variant="warning" 
          onClick={manejarGuardar}
          disabled={guardando}
          className="modal-edicion-boton-guardar"
        >
          {guardando ? (
            <>
              <span className="spinner-border spinner-border-sm modal-edicion-spinner" role="status"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Guardar Cambios
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}