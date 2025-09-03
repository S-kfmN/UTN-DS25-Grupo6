import React, { useState } from 'react';
import { usarAuth } from '../context/AuthContext';
import { Button, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function GestionVehiculos() {
  const [filtroPatente, setFiltroPatente] = useState('');
  const [vehiculoDetalle, setVehiculoDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { usuarios } = usarAuth();
  const navigate = useNavigate();

  // Obtener todos los vehículos del sistema (de todos los usuarios)
  const vehiculos = usuarios.flatMap(u => (u.vehiculos || []).map(v => ({ ...v, usuario: u })));

  // Filtrar por patente
  const vehiculosFiltrados = vehiculos.filter(v =>
    !filtroPatente || (v.patente && v.patente.toLowerCase().includes(filtroPatente.toLowerCase()))
  );

  return (
    <div className="contenedor-gestion-reservas">
      <div className="header-gestion-reservas">
        <h1>Gestión de Vehículos</h1>
        <p>Consulta y administra todos los vehículos registrados por patente</p>
      </div>
      <div className="filtros-gestion">
        <div className="filtro-grupo">
          <label>Patente:</label>
          <input type="text" value={filtroPatente} onChange={e => setFiltroPatente(e.target.value)} className="form-control" placeholder="Ej: ABC123" />
        </div>
      </div>
      <div className="resultados-gestion">
        {vehiculosFiltrados.length === 0 ? (
          <div className="alert alert-warning mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            No se encontraron vehículos con la patente ingresada.
          </div>
        ) : (
          <div className="tabla-gestion-reservas-wrapper">
            <Table className="tabla-gestion-reservas" responsive>
              <thead>
                <tr>
                  <th>Patente</th>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Año</th>
                  <th>Estado</th>
                  <th>Dueño Actual</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosFiltrados.map(v => (
                  <tr key={v.id}>
                    <td>{v.patente}</td>
                    <td>{v.modelo}</td>
                    <td>{v.marca}</td>
                    <td>{v.año || '-'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{v.estado || 'ACTIVO'}</td>
                    <td>{v.usuario?.nombre} {v.usuario?.apellido}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        style={{ fontWeight: 'bold' }}
                        onClick={() => { setVehiculoDetalle(v); setMostrarModal(true); }}
                      >
                        <i className="bi bi-eye me-1"></i>
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
      {/* Modal de detalle de vehículo */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
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
                <li><b>Estado:</b> {vehiculoDetalle.estado || 'ACTIVO'}</li>
              </ul>
              <h5 className="mt-3">Dueño Actual</h5>
              {vehiculoDetalle.usuario ? (
                <ul>
                  <li><b>Nombre:</b> {vehiculoDetalle.usuario.nombre} {vehiculoDetalle.usuario.apellido}</li>
                  <li><b>Email:</b> {vehiculoDetalle.usuario.email}</li>
                  <li><b>DNI:</b> {vehiculoDetalle.usuario.dni}</li>
                  <li><b>Teléfono:</b> {vehiculoDetalle.usuario.telefono}</li>
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