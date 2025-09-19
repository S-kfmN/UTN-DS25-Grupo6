import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Badge, Alert, Row, Col, Table, Modal } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GestionVehiculos() {
  const [filtroPatente, setFiltroPatente] = useState('');
  const [vehiculoDetalle, setVehiculoDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { allVehicles, cargarTodosLosVehiculos, allUsers, esAdmin } = usarAuth(); // Obtener allVehicles y cargarTodosLosVehiculos
  const navigate = useNavigate();

  // Cargar todos los vehículos al montar el componente (para admin)
  useEffect(() => {
    if (esAdmin()) {
      cargarTodosLosVehiculos();
    }
  }, [esAdmin, cargarTodosLosVehiculos]);

  // Eliminar la lógica de aplanar vehículos de usuarios, usar allVehicles directamente
  // const vehiculos = usuarios.flatMap(u => (u.vehiculos || []).map(v => ({ ...v, usuario: u })));
  const vehiculos = allVehicles; // Ahora vehiculos contiene todos los vehículos del contexto

  // Filtrar por múltiples características del vehículo
  // Busca en: patente, modelo, año, nombre del dueño, apellido del dueño, email del dueño
  const vehiculosFiltrados = vehiculos.filter(v => {
    if (!filtroPatente) return true;
    
    const terminoLower = filtroPatente.toLowerCase();
    return (
      (v.patente && v.patente.toLowerCase().includes(terminoLower)) ||
      (v.modelo && v.modelo.toLowerCase().includes(terminoLower)) ||
      (v.año && String(v.año).includes(filtroPatente)) ||
      (v.usuario?.nombre && v.usuario.nombre.toLowerCase().includes(terminoLower)) ||
      (v.usuario?.apellido && v.usuario.apellido.toLowerCase().includes(terminoLower)) ||
      (v.usuario?.email && v.usuario.email.toLowerCase().includes(terminoLower))
    );
  });

  return (
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <div className="d-flex justify-content-center align-items-center">
          <div className="text-center">
            <h1>Gestión de Vehículos</h1>
            <h3>Consulta y administra todos los vehículos registrados por patente</h3>
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
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    <i className="bi bi-search me-2"></i>
                    Buscar por patente, modelo, año o dueño
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={filtroPatente}
                    onChange={e => setFiltroPatente(e.target.value)}
                    placeholder="Ej: ABC123, Clio, 2020, Juan Pérez"
                    className="form-control-custom"
                  />
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
            <i className="bi bi-car-front me-2"></i>
            Resultados ({vehiculosFiltrados.length} vehículos)
          </h3>
          {filtroPatente && (
            <Badge bg="info" className="fs-6">
              Buscando: "{filtroPatente}"
            </Badge>
          )}
        </div>

        <div className="resultados-usuarios">
          {vehiculosFiltrados.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              {filtroPatente 
                ? `No se encontraron vehículos que coincidan con "${filtroPatente}"`
                : 'No hay vehículos registrados en el sistema'
              }
            </Alert>
          ) : (
            <div className="d-flex flex-column gap-3">
              {vehiculosFiltrados.map(v => (
                <div key={v.id} className="usuario-card">
                  <div className="usuario-header">
                    <div className="usuario-nombre">
                      <strong>{v.patente}</strong>
                    </div>
                    <div className="usuario-rol">
                      <Badge bg="primary" className="fs-6">
                        Vehículo
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="usuario-info">
                    <div className="cliente-info">
                      <Row className="g-2">
                        <Col md={4}>
                          <p><strong>Modelo:</strong> {v.modelo}</p>
                          <p><strong>Año:</strong> {v.año || '-'}</p>
                        </Col>
                        <Col md={4}>
                          <p><strong>Dueño:</strong> {v.usuario?.nombre} {v.usuario?.apellido}</p>
                          <p><strong>Email:</strong> {v.usuario?.email}</p>
                        </Col>
                        <Col md={4} className="d-flex align-items-center justify-content-end">
                          <div className="usuario-acciones">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => { setVehiculoDetalle(v); setMostrarModal(true); }}
                              title="Ver Detalle"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              onClick={() => {
                                setMostrarModal(false);
                                navigate('/historial-vehiculo', { state: { patente: v.patente } });
                              }}
                              title="Ver Historial"
                            >
                              <i className="bi bi-clock-history"></i>
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
      {/* Modal de detalle de vehículo */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {vehiculoDetalle && (
            <>
              <h5>Datos del Vehículo</h5>
              <ul>
                <li><b>Patente:</b> {vehiculoDetalle.patente}</li>
                <li><b>Modelo:</b> {vehiculoDetalle.modelo}</li>
                <li><b>Marca:</b> {vehiculoDetalle.marca}</li>
                <li><b>Año:</b> {vehiculoDetalle.año || '-'}</li>
              </ul>
              <h5 className="mt-3">Dueño Actual</h5>
              {vehiculoDetalle.usuario ? (
                <ul>
                  <li><b>Nombre:</b> {vehiculoDetalle.usuario.nombre} {vehiculoDetalle.usuario.apellido}</li>
                  <li><b>Email:</b> {vehiculoDetalle.usuario.email}</li>
                  <li><b>DNI:</b> {vehiculoDetalle.usuario.dni}</li>
                  <li><b>Teléfono:</b> {vehiculoDetalle.usuario.phone}</li> {/* Añadido el teléfono del usuario */}
                </ul>
              ) : (
                <p className="text-muted">No se encontró el usuario vinculado.</p>
              )}
              <Button 
                variant="outline-info" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setMostrarModal(false);
                  navigate('/historial-vehiculo', { state: { patente: vehiculoDetalle.patente } });
                }}
              >
                Ver historial de servicios
              </Button>
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