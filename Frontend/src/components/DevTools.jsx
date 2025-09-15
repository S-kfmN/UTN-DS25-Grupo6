import { useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function DevTools() {
  const { usuario, cambiarRol, esAdmin } = usarAuth();
  const [mostrar, setMostrar] = useState(false);

  // Solo mostrar DevTools si el usuario está autenticado Y es administrador
  if (!usuario || !esAdmin()) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {/* Botón para mostrar/ocultar herramientas */}
      <Button
        onClick={() => setMostrar(!mostrar)}
        variant="warning"
        size="sm"
        style={{
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
      >
        <i className="bi bi-gear"></i>
      </Button>

      {/* Panel de herramientas */}
      {mostrar && (
        <Card style={{
          position: 'absolute',
          bottom: '60px',
          right: '0',
          minWidth: '300px',
          backgroundColor: 'var(--color-gris)',
          border: '2px solid var(--color-acento)',
          borderRadius: '10px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}>
          <Card.Header style={{
            backgroundColor: 'var(--color-acento)',
            color: 'var(--color-fondo)',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            <i className="bi bi-tools me-2"></i>Herramientas de Desarrollo
          </Card.Header>
          
          <Card.Body>
            <div className="mb-3">
              <strong style={{ color: 'var(--color-acento)' }}>Usuario actual:</strong>
              <p className="mb-1" style={{ color: 'var(--color-texto)' }}>{usuario.nombre} {usuario.apellido}</p>
              <p className="mb-1" style={{ color: 'var(--color-texto)' }}>Email: {usuario.email}</p>
              <p className="mb-2">
                <span style={{ 
                  color: esAdmin() ? '#28a745' : '#ffc107',
                  fontWeight: 'bold'
                }}>
                  Rol: {esAdmin() ? 'Administrador' : 'Cliente'}
                </span>
              </p>
            </div>

            <div className="mb-3">
              <strong style={{ color: 'var(--color-acento)' }}>Cambiar Rol:</strong>
              <Row className="mt-2">
                <Col>
                  <Button
                    onClick={() => cambiarRol('cliente')}
                    variant={!esAdmin() ? 'success' : 'outline-success'}
                    size="sm"
                    className="w-100"
                  >
                    Cliente
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={() => cambiarRol('admin')}
                    variant={esAdmin() ? 'warning' : 'outline-warning'}
                    size="sm"
                    className="w-100"
                  >
                    Admin
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="mb-3">
              <strong style={{ color: 'var(--color-acento)' }}>Funciones Admin:</strong>
              <div className="mt-2">
                {esAdmin() ? (
                  <div style={{ color: '#28a745', fontSize: '0.9rem' }}>
                    <i className="bi bi-check-circle me-1"></i>Panel de administración disponible
                  </div>
                ) : (
                  <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    <i className="bi bi-x-circle me-1"></i>Solo funciones de cliente
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <strong style={{ color: 'var(--color-acento)' }}>Herramientas de Datos:</strong>
              <div className="mt-2">
                <Button
                  onClick={() => {
                    localStorage.clear();
                    alert('localStorage limpiado. Recarga la página para ver los cambios.');
                  }}
                  variant="danger"
                  size="sm"
                  className="w-100 mb-2"
                >
                  <i className="bi bi-trash me-1"></i>Limpiar localStorage
                </Button>
                <Button
                  onClick={() => {

                  }}
                  variant="info"
                  size="sm"
                  className="w-100 mb-2"
                >
                  <i className="bi bi-graph-up me-1"></i>Ver localStorage
                </Button>
                <Button
                  onClick={() => {
                    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

                    alert(`Usuarios disponibles: ${usuarios.length}\n\n${usuarios.map(u => `${u.email} (${u.role})`).join('\n')}`);
                  }}
                  variant="secondary"
                  size="sm"
                  className="w-100 mb-2"
                >
                  <i className="bi bi-people me-1"></i>Ver Usuarios
                </Button>
                <Button
                  onClick={() => {
                    const vehiculos = JSON.parse(localStorage.getItem('vehiculos') || '{}');

                    alert(`Vehículos almacenados:\n\n${Object.entries(vehiculos).map(([userId, vehs]) => `Usuario ${userId}: ${vehs.length} vehículos`).join('\n')}`);
                  }}
                  variant="warning"
                  size="sm"
                  className="w-100"
                >
                  <i className="bi bi-car-front me-1"></i>Ver Vehículos
                </Button>
              </div>
            </div>

            <div className="text-center">
              <small style={{ color: '#6c757d' }}>
                Solo visible en desarrollo
              </small>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
} 