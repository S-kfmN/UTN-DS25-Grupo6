import { useState, useEffect } from 'react';
import { Button, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import { useReservasSync } from '../hooks/useReservasSync';
import ErrorBoundary from '../components/ErrorBoundary';
import { formatearFechaParaMostrar } from '../utils/dateUtils';

export default function AdminPanel() {
  const { 
    usuario, 
    esAdmin, 
    allReservations: reservas, 
    allUsers: usuarios, // Renombrar usuarios para evitar conflicto con el estado local
    refrescarUsuario,
    cargarTodosLosUsuarios,
    cargarTodasLasReservas,
    cargarTodosLosVehiculos
  } = usarAuth();
  
  // Usar el hook de sincronización de reservas
  const { sincronizarReservas } = useReservasSync();
  
  // Manejo de errores
  if (!usuario) {
    return (
      <div className="contenedor-admin-reservas">
        <div className="header-admin-reservas">
          <h1>Cargando...</h1>
          <p>Inicializando panel de administración</p>
        </div>
      </div>
    );
  }
  
  // Sincronizar datos del localStorage y monitorear cambios
  useEffect(() => {
    try {
      refrescarUsuario();
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
    }
  }, [refrescarUsuario]);
  


  // El hook useReservasSync maneja toda la sincronización automática


  
  const [estadisticas, setEstadisticas] = useState({
    totalReservas: 0,
    reservasPendientes: 0,
    reservasConfirmadas: 0,
    reservasCanceladas: 0,
    totalUsuarios: 0
  });

  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  // Cargar todos los datos administrativos al montar el componente
  useEffect(() => {
    if (esAdmin()) {
      cargarTodosLosUsuarios();
      cargarTodasLasReservas();
      cargarTodosLosVehiculos();
    }
  }, [esAdmin, cargarTodosLosUsuarios, cargarTodasLasReservas, cargarTodosLosVehiculos]);

  // Usar useFetch para obtener datos adicionales del sistema
  const { data: datosSistema, loading: loadingSistema, error: errorSistema } = useFetch(
    'https://jsonplaceholder.typicode.com/posts/1',
    {},
    []
  );

  useEffect(() => {
    try {
    // Calcular estadísticas
    const stats = {
        totalReservas: reservas?.length || 0,
        reservasPendientes: reservas?.filter(r => r.status === 'PENDING').length || 0,
        reservasConfirmadas: reservas?.filter(r => r.status === 'CONFIRMED').length || 0,
        reservasCanceladas: reservas?.filter(r => r.status === 'CANCELLED').length || 0,
        totalUsuarios: usuarios?.length || 0
    };
    setEstadisticas(stats);
      setUltimaActualizacion(new Date());
    } catch (error) {
      console.error('Error al calcular estadísticas:', error);
    }
  }, [reservas, usuarios]);

  // Verificar si el usuario es admin
  if (!usuario || !esAdmin()) {
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

  console.log('🔍 Debug AdminPanel: Reservas (allReservations) en AdminPanel:', reservas);

  return (
    <ErrorBoundary>
    <div className="contenedor-admin-reservas">

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
              <i className="bi bi-calendar-event" style={{ fontSize: '2rem', color: 'var(--color-acento)' }}></i>
              <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Turnos del Día</h5>
              <Link to="/reservas">
                <Button 
                  variant="warning" 
                  size="lg" 
                  className="mt-2 boton-turnos-dia-principal"
                  style={{ 
                    width: '100%',
                    fontWeight: 'bold', 
                    fontSize: '1.25rem', 
                    color: '#222', 
                    backgroundColor: '#ffc107', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(255,204,0,0.25)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    padding: '1.1rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.7rem'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,204,0,0.35)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,204,0,0.25)'; }}
                >
                  <i className="bi bi-lightning" style={{ fontSize: '2rem', color: '#222' }}></i>
                  Turnos del Día
                </Button>
              </Link>
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
              <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: 'var(--color-acento)' }}></i>
              <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Gestionar Reservas</h5>
              <Link to="/gestion-reservas">
                <Button variant="outline-warning" size="sm" className="mt-2" style={{ width: '100%' }}>
                  Ver Todas
                </Button>
              </Link>
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
              <Link to="/buscar-usuarios">
                <Button variant="outline-warning" size="sm" className="mt-2" style={{ width: '100%' }}>
                  Buscar Usuarios
                </Button>
              </Link>
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
              <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Gestionar Vehiculos</h5>
              <Link to="/gestion-vehiculos">
                <Button variant="outline-warning" size="sm" className="mt-2" style={{ width: '100%' }}>
                  Buscar Vehiculos
                </Button>
              </Link>
            </Card>
          </Col>

          {/* ===== BOTON DE CONFIGURACION ===== */}
          {/*
            <Col md={3}>
              <Card style={{
                backgroundColor: 'var(--color-gris)',
                border: '1px solid var(--color-acento)',
                borderRadius: '10px',
                textAlign: 'center',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <i className="bi bi-gear" style={{ fontSize: '2rem', color: 'var(--color-acento)' }}></i>
                <h5 className="mt-2" style={{ color: 'var(--color-texto)' }}>Configuración</h5>
                <Button variant="outline-warning" size="sm" className="mt-2">
                  Configurar
                </Button>
              </Card>
            </Col>
          */}
        </Row>
      </div>

      {/* Últimas reservas */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 style={{ color: 'var(--color-acento)', marginBottom: 0 }}>
          <i className="bi bi-clock-history me-2"></i>
            Últimas Reservas ({reservas?.length || 0} total)
        </h3>

        </div>
        

        

        
        {reservas && reservas.length > 0 ? (
          <div className="lista-reservas-admin">
            {reservas
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha más reciente
              .slice(0, 5)
              .map(reserva => (
              <div key={reserva.id} className="reserva-card">
                <div className="reserva-header">
                  <div className="reserva-hora">
                    <strong>{formatearFechaParaMostrar(reserva.fecha)} - {reserva.hora}</strong>
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
                    <h4>{reserva.servicio || 'Servicio no especificado'}</h4>
                    <p><strong>Cliente:</strong> {reserva.nombre || 'N/A'} {reserva.apellido || ''}</p>
                      <p><strong>Vehículo:</strong> {reserva.patente || 'N/A'} - {reserva.marca || 'N/A'} {reserva.modelo || 'N/A'}</p>
                      {reserva.observaciones && (
                        <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                      )}
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
          {loadingSistema && <li>Estado API: Cargando...</li>}
          {errorSistema && <li>Estado API: Error - {errorSistema}</li>}
          {datosSistema && <li>Estado API: Conectado (ID: {datosSistema.id})</li>}
        </ul>
      </div>
    </div>
    </ErrorBoundary>
  );
} 