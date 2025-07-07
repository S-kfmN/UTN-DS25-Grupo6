import { useState } from 'react';
import { Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHistorial } from '../hooks/useHistorial';

export default function HistorialVehiculo() {
  const navigate = useNavigate();
  const location = useLocation();
  // Espera recibir la patente del vehículo por location.state
  const patente = location.state?.patente || 'ABC123';

  // Usar el hook useHistorial para cargar datos reales
  const { historial, loading, error } = useHistorial(patente);

  return (
    <div className="contenedor-admin-reservas">
      <div className="header-admin-reservas">
        <h1>Historial de Servicios</h1>
        <p>Vehículo: <strong>{patente}</strong></p>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Button>
        </div>
      </div>

      {/* Mostrar loading */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" style={{ color: 'var(--color-acento)' }}>
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando historial del vehículo...</p>
        </div>
      )}

      {/* Mostrar error */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error al cargar el historial: {error}
        </Alert>
      )}

      {/* Mostrar historial */}
      {!loading && !error && (
        <Card style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          marginTop: '2rem', 
          borderRadius: '10px', 
          border: '1px solid var(--color-acento)',
          backgroundColor: 'var(--color-gris)'
        }}>
          <Card.Header style={{
            backgroundColor: 'var(--color-acento)',
            color: 'var(--color-fondo)',
            fontWeight: 'bold'
          }}>
            <i className="bi bi-clock-history me-2"></i>
            Historial de Servicios - {patente}
          </Card.Header>
          <Card.Body style={{ color: 'var(--color-texto)' }}>
            {historial.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox" style={{ fontSize: '3rem', color: 'var(--color-acento)', opacity: 0.5 }}></i>
                <p className="mt-3">No hay servicios registrados para este vehículo.</p>
                <small className="text-muted">Los servicios aparecerán aquí una vez que sean registrados por el mecánico.</small>
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead style={{ backgroundColor: 'var(--color-acento)', color: 'var(--color-fondo)' }}>
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
                      <td><strong>{serv.servicio}</strong></td>
                      <td>
                        <Badge bg={serv.resultado === 'Completado' ? 'success' : 
                                  serv.resultado === 'Pendiente' ? 'warning' : 
                                  serv.resultado === 'Cancelado' ? 'danger' : 'info'}>
                          {serv.resultado}
                        </Badge>
                      </td>
                      <td>{serv.mecanico || 'N/A'}</td>
                      <td>{serv.kilometraje ? `${serv.kilometraje} km` : 'N/A'}</td>
                      <td style={{ maxWidth: '200px' }}>
                        <small>{serv.observaciones || 'Sin observaciones'}</small>
                      </td>
                      <td style={{ maxWidth: '150px' }}>
                        <small>{serv.repuestos || 'N/A'}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
} 