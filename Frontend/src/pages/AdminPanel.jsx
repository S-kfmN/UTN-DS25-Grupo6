import { useState, useEffect } from 'react';
import { Button, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { usuario, esAdmin, reservas } = usarAuth();
  const [estadisticas, setEstadisticas] = useState({
    totalReservas: 0,
    reservasPendientes: 0,
    reservasConfirmadas: 0,
    reservasCanceladas: 0,
    totalUsuarios: 0
  });

  useEffect(() => {
    // Calcular estadísticas
    const stats = {
      totalReservas: reservas.length,
      reservasPendientes: reservas.filter(r => r.estado === 'pendiente').length,
      reservasConfirmadas: reservas.filter(r => r.estado === 'confirmado').length,
      reservasCanceladas: reservas.filter(r => r.estado === 'cancelado').length,
      totalUsuarios: 1 // Simulado por ahora
    };
    setEstadisticas(stats);
  }, [reservas]);

  // Verificar si el usuario es admin
  if (!esAdmin()) {
    return (
      <div className="contenedor-admin-reservas">
        <div className="header-admin-reservas">
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para acceder al panel de administración</p>
        </div>
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Solo los administradores pueden acceder a esta página.
        </Alert>
      </div>
    );
  }

  return (
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <h1>Panel de Administración</h1>
        <p>Gestiona el sistema del lubricentro</p>
      </div>

      {/* Información del administrador */}
      <div className="mb-4" style={{
        backgroundColor: 'var(--color-gris)',
        borderRadius: '10px',
        padding: '1.5rem',
        border: '1px solid var(--color-acento)'
      }}>
        <h3 style={{ color: 'var(--color-acento)', marginBottom: '1rem' }}>
          <i className="bi bi-person-badge me-2"></i>
          Administrador Conectado
        </h3>
        <Row>
          <Col md={6}>
            <p><strong style={{ color: 'var(--color-acento)' }}>Nombre:</strong> {usuario?.nombre} {usuario?.apellido}</p>
            <p><strong style={{ color: 'var(--color-acento)' }}>Email:</strong> {usuario?.email}</p>
          </Col>
          <Col md={6}>
            <p><strong style={{ color: 'var(--color-acento)' }}>Rol:</strong> 
              <Badge bg="warning" className="ms-2">Administrador</Badge>
            </p>
            <p><strong style={{ color: 'var(--color-acento)' }}>Último acceso:</strong> {new Date().toLocaleString('es-ES')}</p>
          </Col>
        </Row>
      </div>

      {/* Estadísticas rápidas */}
      <div className="estadisticas-rapidas">
        <div className="stat-card">
          <h3>Total Reservas</h3>
          <p className="stat-numero">{estadisticas.totalReservas}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p className="stat-numero pendiente">{estadisticas.reservasPendientes}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmadas</h3>
          <p className="stat-numero confirmado">{estadisticas.reservasConfirmadas}</p>
        </div>
        <div className="stat-card">
          <h3>Canceladas</h3>
          <p className="stat-numero cancelado">{estadisticas.reservasCanceladas}</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mb-4">
        <h3 style={{ color: 'var(--color-acento)', marginBottom: '1.5rem' }}>
          <i className="bi bi-lightning me-2"></i>
          Acciones Rápidas
        </h3>
        <Row>
          <Col md={3}>
            <Card style={{
              backgroundColor: 'var(--color-gris)',
              border: '1px solid var(--color-acento)',
              borderRadius: '10px',
              textAlign: 'center',
              padding: '1rem'
            }}>
              <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: 'var(--color-acento)' }}></i>
              <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Gestionar Reservas</h5>
              <Button variant="outline-warning" size="sm" className="mt-2">
                Ver Todas
              </Button>
            </Card>
          </Col>
          <Col md={3}>
            <Card style={{
              backgroundColor: 'var(--color-gris)',
              border: '1px solid var(--color-acento)',
              borderRadius: '10px',
              textAlign: 'center',
              padding: '1rem'
            }}>
              <i className="bi bi-people" style={{ fontSize: '2rem', color: 'var(--color-acento)' }}></i>
              <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Gestionar Usuarios</h5>
              <Button variant="outline-warning" size="sm" className="mt-2">
                Ver Usuarios
              </Button>
            </Card>
          </Col>
          <Col md={3}>
            <Card style={{
              backgroundColor: 'var(--color-gris)',
              border: '1px solid var(--color-acento)',
              borderRadius: '10px',
              textAlign: 'center',
              padding: '1rem'
            }}>
              <i className="bi bi-car-front" style={{ fontSize: '2rem', color: 'var(--color-acento)' }}></i>
              <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Gestionar Vehículos</h5>
              <Button variant="outline-warning" size="sm" className="mt-2">
                Ver Vehículos
              </Button>
            </Card>
          </Col>
          <Col md={3}>
            <Card style={{
              backgroundColor: 'var(--color-gris)',
              border: '1px solid var(--color-acento)',
              borderRadius: '10px',
              textAlign: 'center',
              padding: '1rem'
            }}>
              <i className="bi bi-gear" style={{ fontSize: '2rem', color: 'var(--color-acento)' }}></i>
              <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Configuración</h5>
              <Button variant="outline-warning" size="sm" className="mt-2">
                Configurar
              </Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Últimas reservas */}
      <div>
        <h3 style={{ color: 'var(--color-acento)', marginBottom: '1.5rem' }}>
          <i className="bi bi-clock-history me-2"></i>
          Últimas Reservas
        </h3>
        {reservas.length > 0 ? (
          <div className="lista-reservas-admin">
            {reservas.slice(0, 5).map(reserva => (
              <div key={reserva.id} className="reserva-card">
                <div className="reserva-header">
                  <div className="reserva-hora">
                    <strong>{new Date(reserva.fecha).toLocaleDateString('es-ES')} - {reserva.hora}</strong>
                  </div>
                  <div className="reserva-estado">
                    <Badge bg={
                      reserva.estado === 'confirmado' ? 'success' :
                      reserva.estado === 'pendiente' ? 'warning' :
                      reserva.estado === 'cancelado' ? 'danger' : 'secondary'
                    }>
                      {reserva.estado}
                    </Badge>
                  </div>
                </div>
                <div className="reserva-info">
                  <div className="cliente-info">
                    <h4>{reserva.servicio}</h4>
                    <p><strong>Cliente:</strong> {reserva.nombre} {reserva.apellido}</p>
                    <p><strong>Vehículo:</strong> {reserva.vehiculo?.patente} - {reserva.vehiculo?.marca} {reserva.vehiculo?.modelo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            No hay reservas registradas en el sistema.
          </Alert>
        )}
      </div>

      {/* Información del sistema */}
      <div className="mt-4 p-3" style={{
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        border: '1px solid rgba(255, 204, 0, 0.3)',
        borderRadius: '5px',
        borderLeft: '4px solid var(--color-acento)'
      }}>
        <h6 style={{ 
          color: 'var(--color-acento)', 
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          <i className="bi bi-info-circle me-2"></i>
          Información del Sistema
        </h6>
        <ul style={{ 
          color: 'var(--color-texto)', 
          fontSize: '0.9rem',
          margin: 0,
          paddingLeft: '1.5rem'
        }}>
          <li>Versión del sistema: 1.0.0</li>
          <li>Última actualización: {new Date().toLocaleDateString('es-ES')}</li>
          <li>Estado del sistema: Operativo</li>
          <li>Modo: Desarrollo</li>
        </ul>
      </div>
    </div>
  );
} 