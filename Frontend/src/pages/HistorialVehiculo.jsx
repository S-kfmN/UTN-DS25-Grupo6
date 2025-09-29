import { useState } from 'react';
import { Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHistorial } from '../hooks/useHistorial';
import '../assets/styles/historialvehiculo.css';

export default function HistorialVehiculo() {
  const navigate = useNavigate();
  const location = useLocation();
  // Espera recibir la patente del vehículo por location.state
  const patente = location.state?.patente || 'ABC123';

  // Usar el hook useHistorial para cargar datos reales
  const { historial, loading, error } = useHistorial(patente);

  return (
    <div className="historialvehiculo-container">
      <div className="historialvehiculo-header">
        <h1>Historial de Servicios</h1>
        <p>Vehículo: <strong>{patente}</strong></p>
        <div className="historialvehiculo-botones">
          <Button variant="secondary" className="historialvehiculo-boton-volver" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Button>
        </div>
      </div>

      {/* Mostrar loading */}
      {loading && (
        <div className="historialvehiculo-spinner-container">
          <Spinner animation="border" role="status" className="historialvehiculo-spinner">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="historialvehiculo-spinner-text">Cargando historial del vehículo...</p>
        </div>
      )}

      {/* Mostrar error */}
      {error && (
        <Alert variant="danger" className="historialvehiculo-alert-error">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error al cargar el historial: {error}
        </Alert>
      )}

      {/* Mostrar historial */}
      {!loading && !error && (
        <Card className="historialvehiculo-card">
          <Card.Header className="historialvehiculo-card-header">
            <i className="bi bi-clock-history me-2"></i>
            Historial de Servicios - {patente}
          </Card.Header>
          <Card.Body className="historialvehiculo-card-body">
            {historial.length === 0 ? (
              <div className="historialvehiculo-sin-servicios">
                <i className="bi bi-inbox historialvehiculo-icono-vacio"></i>
                <p className="historialvehiculo-mensaje-vacio">No hay servicios registrados para este vehículo.</p>
                <small className="historialvehiculo-submensaje-vacio">Los servicios aparecerán aquí una vez que sean registrados por el mecánico.</small>
              </div>
            ) : (
              <div className="historialvehiculo-tabla-container">
                <Table striped bordered hover responsive className="historialvehiculo-tabla">
                  <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Servicio</th>
                    <th>Resultado</th>
                    <th>Mecánico</th>
                    <th>Kilometraje</th>
                    <th>Observaciones</th>
                    <th>Repuestos</th>
                  </tr>
                </thead>
                <tbody>
                  {historial
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha más reciente
                    .map((serv, idx) => (
                    <tr key={serv.id || idx}>
                      <td>{serv.fecha}</td>
                      <td className="historialvehiculo-servicio">{serv.servicio}</td>
                      <td>
                        <Badge className={`historialvehiculo-badge-${serv.resultado === 'Completado' ? 'completado' : 
                                  serv.resultado === 'Pendiente' ? 'pendiente' : 
                                  serv.resultado === 'Cancelado' ? 'cancelado' : 'info'}`}>
                          {serv.resultado}
                        </Badge>
                      </td>
                      <td>{serv.mecanico || 'N/A'}</td>
                      <td>{serv.kilometraje ? `${serv.kilometraje} km` : 'N/A'}</td>
                      <td className="historialvehiculo-observaciones">
                        <small>{serv.observaciones || 'Sin observaciones'}</small>
                      </td>
                      <td className="historialvehiculo-repuestos">
                        <small>{serv.repuestos || 'N/A'}</small>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
} 