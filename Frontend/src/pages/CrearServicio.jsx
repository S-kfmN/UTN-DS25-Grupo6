// Nuevo componente: src/pages/CrearServicio.jsx
import { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Table, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import '../assets/styles/gestionreservas.css';

export default function CrearServicio() {
  const { esAdmin, cargarServicios } = usarAuth();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nuevo: estados para eliminar servicio
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Cargar servicios existentes al montar
  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      try {
        const lista = await cargarServicios();
        setServicios(lista);
      } catch (err) {
        setError('Error al cargar servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, [success, cargarServicios]); // recarga al crear uno nuevo

  if (!esAdmin()) {
    return (
      <div className="gestionreservas-container">
        <div className="gestionreservas-header">
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para acceder a esta página</p>
        </div>
        <Alert variant="danger" className="mt-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Solo los administradores pueden crear servicios.
        </Alert>
      </div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const serviceData = {
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration)
      };
      await apiService.createService(serviceData);
      setSuccess('Servicio creado exitosamente');
      setForm({ name: '', description: '', category: '', price: '', duration: '' });
    } catch (err) {
      setError('Error al crear servicio: ' + (err?.response?.data?.message || err.message || 'Error desconocido'));
    }
  };

  // Eliminar servicio
  const handleEliminarServicio = async () => {
    if (!servicioAEliminar) return;
    setError('');
    setSuccess('');
    try {
      await apiService.deleteService(servicioAEliminar.id);
      setSuccess('Servicio eliminado correctamente');
      setMostrarConfirmacion(false);
      setServicioAEliminar(null);
      // Recargar servicios
      const lista = await cargarServicios();
      setServicios(lista);
    } catch (err) {
      setError('Error al eliminar servicio: ' + (err?.response?.data?.message || err.message || 'Error desconocido'));
      setMostrarConfirmacion(false);
      setServicioAEliminar(null);
    }
  };

  return (
    <div className="gestionreservas-container">
      {/* Header */}
      <div className="gestionreservas-header">
        <h1>
          <i className="bi bi-tools me-2"></i>
          <span style={{ color: 'var(--color-acento)' }}>Gestión de Servicios</span>
        </h1>
        <h3 style={{ color: 'var(--color-texto)' }}>Consulta y administra los servicios disponibles</h3>
      </div>

      {/* Mensajes */}
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}

      {/* Tabla de servicios existentes */}
      <div className="gestionreservas-busqueda-reservas">
        <div className="gestionreservas-resultados-header">
          <h3 className="gestionreservas-resultados-titulo" style={{ color: 'var(--color-acento)' }}>
            <i className="bi bi-list-ul me-2"></i>
            Servicios ({servicios.length})
          </h3>
        </div>
        <Card className="gestionreservas-card-busqueda" style={{
          background: 'rgba(30,30,30,0.95)',
          border: '2px solid var(--color-acento)',
          color: 'var(--color-texto)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.5)'
        }}>
          <Card.Body>
            {loading ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>Cargando servicios...</span>
              </div>
            ) : servicios.length === 0 ? (
              <Alert variant="info">No hay servicios registrados.</Alert>
            ) : (
              <Table striped bordered hover responsive className="gestionreservas-tabla-historial" style={{
                background: 'transparent',
                color: 'var(--color-texto)'
              }}>
                <thead style={{ background: 'var(--color-acento)', color: '#222' }}>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Duración</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map(servicio => (
                    <tr key={servicio.id}>
                      <td>{servicio.name}</td>
                      <td>{servicio.description}</td>
                      <td>
                        <Badge bg="info">{servicio.category}</Badge>
                      </td>
                      <td>${servicio.price}</td>
                      <td>{servicio.duration} min</td>
                      <td>
                        <Badge bg={servicio.isActive ? "success" : "secondary"}>
                          {servicio.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => { setServicioAEliminar(servicio); setMostrarConfirmacion(true); }}
                          title="Eliminar servicio"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar el servicio <b>{servicioAEliminar?.name}</b>? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarServicio}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Formulario de alta */}
      <Card className="gestionreservas-card-busqueda" style={{
        background: 'rgba(30,30,30,0.95)',
        border: '2px solid var(--color-acento)',
        color: 'var(--color-texto)',
        marginTop: '2rem',
        boxShadow: '0 2px 16px rgba(0,0,0,0.5)'
      }}>
        <Card.Header style={{ background: 'transparent', color: 'var(--color-acento)', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <i className="bi bi-plus-circle me-2"></i>
          Crear Nuevo Servicio
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Cambio de aceite"
                    style={{
                      background: 'var(--color-gris)',
                      color: 'var(--color-texto)',
                      border: '1px solid var(--color-acento)'
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    placeholder="Detalle del servicio"
                    style={{
                      background: 'var(--color-gris)',
                      color: 'var(--color-texto)',
                      border: '1px solid var(--color-acento)'
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    style={{
                      background: 'var(--color-gris)',
                      color: 'var(--color-texto)',
                      border: '1px solid var(--color-acento)'
                    }}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="REPARACION">Reparación</option>
                    <option value="DIAGNOSTICO">Diagnóstico</option>
                    <option value="LIMPIEZA">Limpieza</option>
                    <option value="OTROS">Otros</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min={0}
                    step={0.01}
                    placeholder="Ej: 3500"
                    style={{
                      background: 'var(--color-gris)',
                      color: 'var(--color-texto)',
                      border: '1px solid var(--color-acento)'
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duración (minutos)</Form.Label>
                  <Form.Control
                    name="duration"
                    type="number"
                    value={form.duration}
                    onChange={handleChange}
                    required
                    min={1}
                    placeholder="Ej: 45"
                    style={{
                      background: 'var(--color-gris)',
                      color: 'var(--color-texto)',
                      border: '1px solid var(--color-acento)'
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-grid gap-2">
              <Button type="submit" variant="success" size="lg" style={{
                background: 'var(--color-acento)',
                color: 'var(--color-fondo)',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                <i className="bi bi-save me-2"></i>
                Crear Servicio
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}