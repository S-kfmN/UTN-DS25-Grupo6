import { useState, useEffect } from 'react';
import { Button, Badge, Alert } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function MisReservas() {
  const { usuario, obtenerReservasUsuario, cancelarReserva } = usarAuth();
  
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Cargar reservas del usuario
  useEffect(() => {
    const reservasUsuario = obtenerReservasUsuario();
    setReservas(reservasUsuario);
  }, [obtenerReservasUsuario]);

  // Filtrar reservas según el estado seleccionado
  const reservasFiltradas = reservas.filter(reserva => {
    return filtroEstado === 'todos' || reserva.estado === filtroEstado;
  });

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelado': return 'danger';
      case 'completado': return 'info';
      default: return 'secondary';
    }
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'Confirmado';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      case 'completado': return 'Completado';
      default: return estado;
    }
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Función para cancelar reserva
  const manejarCancelarReserva = async (reservaId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      const resultado = await cancelarReserva(reservaId);
      if (resultado.exito) {
        // Actualizar la lista de reservas
        const reservasUsuario = obtenerReservasUsuario();
        setReservas(reservasUsuario);
      }
    }
  };

  // Estadísticas
  const estadisticas = {
    total: reservas.length,
    confirmadas: reservas.filter(r => r.estado === 'confirmado').length,
    pendientes: reservas.filter(r => r.estado === 'pendiente').length,
    canceladas: reservas.filter(r => r.estado === 'cancelado').length
  };

  return (
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <h1>Mis Reservas</h1>
        <p>Gestiona tus turnos programados</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="estadisticas-rapidas">
        <div className="stat-card">
          <h3>Total Reservas</h3>
          <p className="stat-numero">{estadisticas.total}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmadas</h3>
          <p className="stat-numero confirmado">{estadisticas.confirmadas}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p className="stat-numero pendiente">{estadisticas.pendientes}</p>
        </div>
        <div className="stat-card">
          <h3>Canceladas</h3>
          <p className="stat-numero cancelado">{estadisticas.canceladas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-admin">
        <div className="filtro-grupo">
          <label>Filtrar por estado:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="confirmado">Confirmado</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelado">Cancelado</option>
            <option value="completado">Completado</option>
          </select>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="lista-reservas-admin">
        {reservasFiltradas.length > 0 ? (
          <div className="grupo-fecha">
            <h2 className="fecha-titulo">Mis Turnos Programados</h2>
            
            <div className="reservas-del-dia">
              {reservasFiltradas
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map(reserva => (
                  <div key={reserva.id} className="reserva-card">
                    <div className="reserva-header">
                      <div className="reserva-hora">
                        <strong>{formatearFecha(reserva.fecha)} - {reserva.hora}</strong>
                      </div>
                      <div className="reserva-estado">
                        <span className={`badge bg-${obtenerColorEstado(reserva.estado)}`}>
                          {obtenerTextoEstado(reserva.estado)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="reserva-info">
                      <div className="cliente-info">
                        <h4>{reserva.servicio}</h4>
                        <p><strong>Vehículo:</strong> {reserva.vehiculo.patente} - {reserva.vehiculo.marca} {reserva.vehiculo.modelo}</p>
                        <p><strong>Cliente:</strong> {reserva.nombre} {reserva.apellido}</p>
                      </div>
                      
                      {reserva.observaciones && (
                        <div className="observaciones">
                          <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="reserva-acciones">
                      {reserva.estado === 'pendiente' && (
                        <Button 
                          onClick={() => manejarCancelarReserva(reserva.id)}
                          variant="danger"
                          size="sm"
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Cancelar Reserva
                        </Button>
                      )}
                      
                      {reserva.estado === 'confirmado' && (
                        <Button 
                          variant="outline-primary"
                          size="sm"
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            borderColor: 'var(--color-acento)',
                            color: 'var(--color-acento)'
                          }}
                        >
                          Ver Detalles
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="sin-reservas">
            <p>No tienes reservas que coincidan con los filtros seleccionados</p>
            <Button 
              as="a" 
              href="/reservar"
              style={{
                backgroundColor: 'var(--color-acento)',
                color: 'var(--color-fondo)',
                border: 'none',
                padding: '0.75rem 1.5rem',
                fontWeight: 'bold',
                borderRadius: '5px',
                textDecoration: 'none'
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Hacer Nueva Reserva
            </Button>
          </div>
        )}
      </div>

      {/* Información adicional */}
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
          Información Importante
        </h6>
        <ul style={{ 
          color: 'var(--color-texto)', 
          fontSize: '0.9rem',
          margin: 0,
          paddingLeft: '1.5rem'
        }}>
          <li>Las reservas se pueden cancelar hasta 24 horas antes del turno</li>
          <li>Recibirás confirmación por email cuando tu turno sea confirmado</li>
          <li>Llega 10 minutos antes de tu hora programada</li>
          <li>Trae la documentación del vehículo si es necesario</li>
        </ul>
      </div>
    </div>
  );
} 