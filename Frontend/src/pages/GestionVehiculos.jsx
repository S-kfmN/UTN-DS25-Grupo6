import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Badge, Alert, Row, Col, Table, Modal } from 'react-bootstrap';
import GestionTable from '../components/GestionTable';
import { usarAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/gestionvehiculos.css';
import '../assets/styles/modalEdicion.css';
import EditVehicleModal from '../components/EditVehicleModal';
import VehicleDetailsModal from '../components/VehicleDetailsModal';

export default function GestionVehiculos() {
  const [filtroPatente, setFiltroPatente] = useState('');
  const [vehiculoDetalle, setVehiculoDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState(null); // Nuevo estado para editar
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const { allVehicles, cargarTodosLosVehiculos, eliminarVehiculo, actualizarVehiculo, esAdmin } = usarAuth();
  const navigate = useNavigate();

  // Cargar todos los vehículos al montar el componente (para admin)
  useEffect(() => {
    if (esAdmin()) {
      cargarTodosLosVehiculos();
    }
  }, [esAdmin, cargarTodosLosVehiculos]);

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
      (v.usuario?.name && v.usuario.name.toLowerCase().includes(terminoLower)) || // nombre completo
      (v.usuario?.nombre && v.usuario.nombre.toLowerCase().includes(terminoLower)) ||
      (v.usuario?.apellido && v.usuario.apellido.toLowerCase().includes(terminoLower)) ||
      (v.usuario?.email && v.usuario.email.toLowerCase().includes(terminoLower))
    );
  });

  // Nueva función para eliminar vehículo
  const handleEliminarVehiculo = (vehiculoId) => {
    const vehiculo = vehiculos.find(v => v.id === vehiculoId);
    setVehiculoAEliminar(vehiculo);
    setMostrarConfirmacion(true);
  };

  // Nueva función para actualizar vehículo
  const handleActualizarVehiculo = async (vehiculoId, nuevosDatos) => {
    const resultado = await actualizarVehiculo(vehiculoId, nuevosDatos);
    if (resultado.exito) {
      await cargarTodosLosVehiculos();
    } else {
      alert('Error al actualizar el vehículo: ' + (resultado.error || 'Error desconocido'));
    }
  };

  const confirmarEliminarVehiculo = async () => {
    if (!vehiculoAEliminar) return;
    const resultado = await eliminarVehiculo(vehiculoAEliminar.id);
    if (resultado.exito) {
      await cargarTodosLosVehiculos();
      // Puedes mostrar un mensaje con un Alert de Bootstrap si quieres, pero NO uses alert()
    }
    setMostrarConfirmacion(false);
    setVehiculoAEliminar(null);
  };

  return (
    <div className="gestionvehiculos-container">
      {/* Header */}
      <div className="gestionvehiculos-header">
        <h1>Gestión de Vehículos</h1>
        <h3>Consulta y administra todos los vehículos registrados por patente</h3>
      </div>

      {/* Formulario de búsqueda */}
      <Card className="gestionvehiculos-card-busqueda">
        <Card.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="gestionvehiculos-form-label">
                    <i className="bi bi-search me-2"></i>
                    Buscar por patente, modelo, año o dueño
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={filtroPatente}
                    onChange={e => setFiltroPatente(e.target.value)}
                    placeholder="Ej: ABC123, Clio, 2020, Juan Pérez"
                    className="gestionvehiculos-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      {/* Resultados de búsqueda */}
      <div className="gestionvehiculos-busqueda-vehiculos">
        <div className="gestionvehiculos-resultados-header">
          <h3 className="gestionvehiculos-resultados-titulo">
            <i className="bi bi-car-front me-2"></i>
            Resultados ({vehiculosFiltrados.length} vehículos)
          </h3>
          {filtroPatente && (
            <Badge bg="info" className="gestionvehiculos-badge-busqueda">
              Buscando: "{filtroPatente}"
            </Badge>
          )}
        </div>

        <GestionTable
          columns={[
            { key: 'patente', label: 'Patente', sortable: true, width: '140px' },
            { key: 'marca', label: 'Marca', sortable: true },
            { key: 'modelo', label: 'Modelo', sortable: true },
            { key: 'año', label: 'Año', sortable: true, width: '100px', getSortValue: (v) => Number(v.año) || 0 },
            { key: 'dueno', label: 'Dueño', sortable: true, getSortValue: (v) => `${(v.usuario?.apellido || '').toLowerCase()} ${(v.usuario?.nombre || '').toLowerCase()}`.trim(), render: (v) => `${v.usuario?.nombre || ''} ${v.usuario?.apellido || ''}`.trim() || '-' },
            { key: 'email', label: 'Email', sortable: true, render: (v) => v.usuario?.email || '-' }
          ]}
          data={vehiculosFiltrados.map(v => ({ ...v, dueno: v.usuario }))}
          emptyMessage={filtroPatente ? `No se encontraron vehículos que coincidan con "${filtroPatente}"` : 'No hay vehículos registrados en el sistema'}
          renderActions={(v) => (
            <div className="gestionvehiculos-vehiculo-acciones">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => { setVehiculoDetalle(v); setMostrarModal(true); }}
                title="Ver Detalle"
                className="gestionvehiculos-boton-accion gestionvehiculos-boton-ver"
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
                className="gestionvehiculos-boton-accion gestionvehiculos-boton-historial"
              >
                <i className="bi bi-clock-history"></i>
              </Button>
              {/* SOLO ADMIN: Botón eliminar */}
              {esAdmin() && (
                <>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => setVehiculoEditar(v)}
                    title="Modificar vehículo"
                    className="gestionvehiculos-boton-accion gestionvehiculos-boton-editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleEliminarVehiculo(v.id)}
                    title="Eliminar vehículo"
                    className="gestionvehiculos-boton-accion gestionvehiculos-boton-eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </>
              )}
            </div>
          )}
        />
      </div>
      {/* Modal de detalle de vehículo */}
      <VehicleDetailsModal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        vehiculo={vehiculoDetalle}
      />
      {/* Modal para editar vehículo */}
      <EditVehicleModal
        show={!!vehiculoEditar}
        vehiculo={vehiculoEditar}
        onHide={() => setVehiculoEditar(null)}
        onSave={async (nuevosDatos) => {
          await handleActualizarVehiculo(vehiculoEditar.id, nuevosDatos);
          setVehiculoEditar(null);
        }}
      />
      {/* Modal de confirmación de eliminación */}
      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)} centered>
        <Modal.Header closeButton className="modal-edicion-header">
          <Modal.Title className="modal-edicion-title">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-edicion-body">
          ¿Estás seguro de que quieres eliminar el vehículo <b>{vehiculoAEliminar?.patente}</b>? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer className="modal-edicion-footer">
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)} className="modal-edicion-boton-cerrar">
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminarVehiculo}>
            <i className="bi bi-trash me-2"></i>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}