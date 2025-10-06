import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import '../assets/styles/historialvehiculo.css';

export default function HistorialVehiculo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { esAdmin } = usarAuth();
  
  // Obtener la patente del vehículo desde location.state
  const patente = location.state?.patente || 'ABC123';
  
  // Estados para manejar los datos
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehiculoInfo, setVehiculoInfo] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);

  // Cargar historial del vehículo
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar historial del vehículo
        const response = await apiService.getServiceHistory(patente);
        
        if (response.success) {
          setHistorial(response.data);
          setVehiculoInfo(response.vehiculo);
        } else {
          setError(response.message || 'Error al cargar el historial');
        }
        
        // Cargar estadísticas
        try {
          const statsResponse = await apiService.getServiceHistoryStats({ patente });
          if (statsResponse.success) {
            setEstadisticas(statsResponse.data);
          }
        } catch (statsError) {
          console.warn('No se pudieron cargar las estadísticas:', statsError);
        }
        
      } catch (err) {
        console.error('Error al cargar historial:', err);
        setError('Error de conexión al cargar el historial del vehículo');
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [patente]);

  // Verificar permisos de acceso
  if (!esAdmin()) {
    return (
      <div className="historialvehiculo-container">
        <div className="historialvehiculo-header">
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para ver el historial de servicios</p>
        </div>
        <Alert variant="danger" className="historialvehiculo-alert-denegado">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Solo los administradores pueden ver el historial de servicios.
        </Alert>
        <div className="historialvehiculo-botones">
          <Button variant="secondary" className="historialvehiculo-boton-volver" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="historialvehiculo-container">
      <div className="historialvehiculo-header">
        <h1>Historial de Servicios</h1>
        <p>Vehículo: <strong>{patente}</strong></p>
        {vehiculoInfo && (
          <p className="historialvehiculo-info-vehiculo">
            {vehiculoInfo.marca} {vehiculoInfo.modelo} ({vehiculoInfo.año})
          </p>
        )}
        <div className="historialvehiculo-botones">
          <Button variant="secondary" className="historialvehiculo-boton-volver" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Button>
        </div>
      </div>

      {/* Estadísticas del vehículo */}
      {estadisticas && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="historialvehiculo-stat-card">
              <Card.Body className="text-center">
                <h5 className="historialvehiculo-stat-number">{estadisticas.totalServicios}</h5>
                <p className="historialvehiculo-stat-label">Total Servicios</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="historialvehiculo-stat-card">
              <Card.Body className="text-center">
                <h5 className="historialvehiculo-stat-number text-success">{estadisticas.serviciosCompletados}</h5>
                <p className="historialvehiculo-stat-label">Completados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="historialvehiculo-stat-card">
              <Card.Body className="text-center">
                <h5 className="historialvehiculo-stat-number text-warning">{estadisticas.serviciosPendientes}</h5>
                <p className="historialvehiculo-stat-label">Pendientes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="historialvehiculo-stat-card">
              <Card.Body className="text-center">
                <h5 className="historialvehiculo-stat-number text-info">{estadisticas.porcentajeCompletados}%</h5>
                <p className="historialvehiculo-stat-label">Eficiencia</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

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
                      <th>Hora</th>
                      <th>Servicio</th>
                      <th>Resultado</th>
                      <th>Mecánico</th>
                      <th>Kilometraje</th>
                      <th>Observaciones</th>
                      <th>Repuestos</th>
                      <th>Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((servicio, idx) => (
                      <tr key={servicio.id || idx}>
                        <td>{servicio.fecha}</td>
                        <td>{servicio.hora}</td>
                        <td className="historialvehiculo-servicio">{servicio.servicio}</td>
                        <td>
                          <Badge className={`historialvehiculo-badge-${servicio.resultado === 'Completado' ? 'completado' : 
                                    servicio.resultado === 'Pendiente' ? 'pendiente' : 
                                    servicio.resultado === 'Cancelado' ? 'cancelado' : 'info'}`}>
                            {servicio.resultado}
                          </Badge>
                        </td>
                        <td>{servicio.mecanico || 'N/A'}</td>
                        <td>{servicio.kilometraje ? `${servicio.kilometraje} km` : 'N/A'}</td>
                        <td className="historialvehiculo-observaciones">
                          <small>{servicio.observaciones || 'Sin observaciones'}</small>
                        </td>
                        <td className="historialvehiculo-repuestos">
                          <small>{servicio.repuestos || 'N/A'}</small>
                        </td>
                        <td>{servicio.cliente || 'N/A'}</td>
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