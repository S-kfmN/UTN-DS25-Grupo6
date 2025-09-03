import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function EditUserModal({ show, onHide, usuario, onSave }) {
  const { actualizarEstadoVehiculoGlobal } = usarAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    dni: ''
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        dni: usuario.dni || ''
      });
    }
  }, [usuario]);

  const manejarCambio = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpiar error del campo
    if (errores[campo]) {
      setErrores(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    }

    if (!formData.dni.trim()) {
      nuevosErrores.dni = 'El DNI es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) return;

    setGuardando(true);
    try {
      await onSave(formData);
      onHide();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: 'var(--color-gris)', borderBottom: '1px solid var(--color-acento)' }}>
        <Modal.Title style={{ color: 'var(--color-acento)' }}>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Usuario
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => manejarCambio('nombre', e.target.value)}
                  isInvalid={!!errores.nombre}
                  placeholder="Nombre del usuario"
                />
                <Form.Control.Feedback type="invalid">
                  {errores.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
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
                <Form.Label>Email *</Form.Label>
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
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => manejarCambio('telefono', e.target.value)}
                  isInvalid={!!errores.telefono}
                  placeholder="11 1234-5678"
                />
                <Form.Control.Feedback type="invalid">
                  {errores.telefono}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>DNI *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.dni}
                  onChange={(e) => manejarCambio('dni', e.target.value)}
                  isInvalid={!!errores.dni}
                  placeholder="12345678"
                />
                <Form.Control.Feedback type="invalid">
                  {errores.dni}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  type="text"
                  value={usuario?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                  disabled
                  style={{ backgroundColor: 'var(--color-gris)' }}
                />
                <Form.Text className="text-muted">
                  El rol no se puede modificar desde esta interfaz
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        {usuario?.vehiculos && usuario.vehiculos.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '0.7rem', marginBottom: '1rem' }}>
            <strong>Vehículos del usuario:</strong>
            {usuario.vehiculos.map(vehiculo => (
              <div key={vehiculo.id} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.97rem' }}>
                <span style={{ minWidth: 80 }}><b>{vehiculo.patente}</b> ({vehiculo.marca} {vehiculo.modelo})</span>
                <select
                  value={vehiculo.estado}
                  onChange={e => {
                    if (window.confirm('¿Seguro que quieres cambiar el estado de este vehículo? Esta acción es sensible.')) {
                      actualizarEstadoVehiculoGlobal(usuario.id, vehiculo.id, e.target.value);
                    }
                  }}
                  className="form-select form-select-sm"
                  style={{ maxWidth: 130, marginLeft: 8, marginRight: 8 }}
                >
                  <option value="registrado">Registrado</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
                <span className={`badge bg-${vehiculo.estado === 'ACTIVO' ? 'success' : vehiculo.estado === 'INACTIVO' ? 'danger' : 'info'}`}>{vehiculo.estado}</span>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer style={{ backgroundColor: 'var(--color-gris)', borderTop: '1px solid var(--color-acento)' }}>
        <Button variant="secondary" onClick={onHide} disabled={guardando}>
          Cancelar
        </Button>
        <Button 
          variant="warning" 
          onClick={manejarGuardar}
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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