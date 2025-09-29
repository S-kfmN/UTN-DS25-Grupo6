import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';
import { useReservasSync } from '../hooks/useReservasSync';
import { obtenerProximasFechas, formatearFechaParaMostrar, dividirNombreCompleto, obtenerFechaActual, formatearFechaHoraParaMostrar } from '../utils/dateUtils';
import { Collapse, Button } from 'react-bootstrap';
import apiService from '../services/apiService';
import '../assets/styles/reservas.css';

export default function Reservas() {
  const navigate = useNavigate();
  

  const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaActual());
  const [reservasDelDia, setReservasDelDia] = useState([]);
  const [loadingReservasDelDia, setLoadingReservasDelDia] = useState(false);
  const [errorReservasDelDia, setErrorReservasDelDia] = useState(null);

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  

  const { 
    usuario, 
    reservas, 
    cancelarReserva,
    refrescarUsuario 
  } = usarAuth();
  

  const { sincronizarReservas } = useReservasSync();
  

  const [loadingReservas, setLoadingReservas] = useState(false);
  const [errorReservas, setErrorReservas] = useState(null);

  useEffect(() => {
    const cargarReservasPorFecha = async () => {
      setLoadingReservasDelDia(true);
      setErrorReservasDelDia(null);
      try {
        const response = await apiService.getReservationsByDate(fechaSeleccionada);
        if (response.success) {
          const reservasTransformadas = response.data.map(reserva => ({
            ...reserva,
            fecha: reserva.date, // Mapear 'date' a 'fecha'
            hora: reserva.time, // Mapear 'time' a 'hora'
            estado: reserva.status, // Mapear 'status' a 'estado'
            nombre: reserva.user ? reserva.user.name : 'N/A',
            telefono: reserva.user ? reserva.user.phone : 'N/A',
            patente: reserva.vehicle ? reserva.vehicle.license : 'N/A',
            modelo: reserva.vehicle ? `${reserva.vehicle.brand} ${reserva.vehicle.model}` : 'N/A',
            servicio: reserva.service ? reserva.service.name : 'N/A',
            observaciones: reserva.notes || '',
          }));
          setReservasDelDia(reservasTransformadas);
        } else {
          setErrorReservasDelDia(response.message || 'Error al cargar reservas del día.');
        }
      } catch (error) {
        console.error('Error al cargar reservas por fecha:', error);
        setErrorReservasDelDia('Error de conexión o del servidor.');
      } finally {
        setLoadingReservasDelDia(false);
      }
    };

    cargarReservasPorFecha();
  }, [fechaSeleccionada]);

  const [mostrarConfirmadas, setMostrarConfirmadas] = useState(false);
  const [mostrarCanceladas, setMostrarCanceladas] = useState(false);


  useEffect(() => {

  }, [reservas]);


  



  const reservasFiltradas = reservas.filter(reserva => {
    const cumpleFiltroFecha = !filtroFecha || reserva.fecha === filtroFecha;
    const cumpleFiltroEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado;
    
    return cumpleFiltroFecha && cumpleFiltroEstado;
  });


  const agruparReservasPorFecha = (reservas) => {
    const agrupadas = {};
    
    reservas.forEach(reserva => {
      if (!agrupadas[reserva.fecha]) {
        agrupadas[reserva.fecha] = [];
      }
      agrupadas[reserva.fecha].push(reserva);
    });
    
    return agrupadas;
  };


  const cambiarEstadoReserva = async (id, nuevoEstado) => {
    if (nuevoEstado === 'cancelado') {
      const resultado = await cancelarReserva(id);
      if (resultado.exito) {


        refrescarUsuario();
      }
    }
  };


  const irARegistrarServicio = (reserva) => {
    
    navigate('/registrar-servicio', { state: { reserva: reserva } });
  };


  const hoy = new Date().toISOString().slice(0, 10);

  const reservasPendientesHoy = reservas.filter(r => r.estado === 'pendiente' && r.fecha === hoy);
  const reservasCompletadas = reservas.filter(r => r.estado === 'completado');
  const reservasCanceladas = reservas.filter(r => r.estado === 'cancelado');


  const eliminarReserva = async (id) => {
    const credencial = window.prompt('Ingrese credencial de ADMIN para cancelar la reserva:');
    if (credencial && credencial.toLowerCase() === 'admin123') {
      const resultado = await cancelarReserva(id);
      if (resultado.exito) {
        // Recargar las reservas del día después de cancelar
        const responseReservas = await apiService.getReservationsByDate(fechaSeleccionada);
        if (responseReservas.success) {
          const reservasTransformadas = responseReservas.data.map(reserva => ({
            ...reserva,
            fecha: reserva.date,
            hora: reserva.time,
            estado: reserva.status,
            nombre: reserva.user ? reserva.user.name : 'N/A',
            telefono: reserva.user ? reserva.user.phone : 'N/A',
            patente: reserva.vehicle ? reserva.vehicle.license : 'N/A',
            modelo: reserva.vehicle ? `${reserva.vehicle.brand} ${reserva.vehicle.model}` : 'N/A',
            servicio: reserva.service ? reserva.service.name : 'N/A',
            observaciones: reserva.notes || '',
          }));
          setReservasDelDia(reservasTransformadas);
        }
        alert('Reserva cancelada exitosamente');
      } else {
        alert('Error al cancelar la reserva: ' + resultado.error);
      }
    } else {
      alert('Credencial incorrecta. Solo el admin puede cancelar reservas.');
    }
  };


  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      case 'CONFIRMED': return 'primary';
      default: return 'secondary';
    }
  };




  const proximasFechas = obtenerProximasFechas(7);

  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente');
  const reservasAgrupadas = agruparReservasPorFecha(reservasPendientes);

  return (
    <div className="reservas-container">
      {/* ===== TÍTULO Y FILTROS ===== */}
      <div className="reservas-header">
        <div className="reservas-header-content">
          <div>
        <h1>Turnos del Día</h1>
        <p>Visualiza todas las reservas para la fecha seleccionada</p>
          </div>
          <div className="reservas-filtro-fecha">
            <label htmlFor="fechaSeleccionada">Fecha:</label>
            <input
              type="date"
              id="fechaSeleccionada"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===== ESTADÍSTICAS RÁPIDAS ===== */}
      <div className="reservas-estadisticas-rapidas">
        <div className="reservas-stat-card">
          <h3>Total Reservas</h3>
          <p className="reservas-stat-numero">{reservasDelDia.length}</p>
        </div>
        <div className="reservas-stat-card">
          <h3>Completadas</h3>
          <p className="reservas-stat-numero completada">{reservasDelDia.filter(r => r.estado === 'COMPLETED').length}</p>
        </div>
        <div className="reservas-stat-card">
          <h3>Pendientes</h3>
          <p className="reservas-stat-numero pendiente">{reservasDelDia.filter(r => r.estado === 'PENDING').length}</p>
        </div>
        <div className="reservas-stat-card">
          <h3>Canceladas</h3>
          <p className="reservas-stat-numero cancelado">{reservasDelDia.filter(r => r.estado === 'CANCELLED').length}</p>
        </div>
      </div>

      {/* ===== LISTA DE RESERVAS ===== */}
      <div className="reservas-lista-reservas-admin">
        {loadingReservasDelDia ? (
          <div className="reservas-spinner-container">
            <div className="reservas-spinner" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="reservas-spinner-text">Cargando reservas...</p>
          </div>
        ) : errorReservasDelDia ? (
          <div className="reservas-alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Error al cargar reservas: {errorReservasDelDia}
          </div>
        ) : Object.keys(agruparReservasPorFecha(reservasDelDia)).length > 0 ? (
          Object.entries(agruparReservasPorFecha(reservasDelDia)).map(([fecha, reservasDelDiaFecha]) => (
            <div key={fecha} className="reservas-grupo-fecha">
              <h2 className="reservas-fecha-titulo">{formatearFechaParaMostrar(fecha)}</h2>

              <div className="reservas-reservas-del-dia">
                {reservasDelDiaFecha
                  .sort((a, b) => a.hora.localeCompare(b.hora))
                  .map(reserva => (
                    <div key={reserva.id} className="reservas-reserva-card">
                      <div className="reservas-reserva-header">
                        <div className="reservas-reserva-hora">
                          <strong>{reserva.hora}</strong>
                        </div>
                        <div className="reservas-reserva-estado">
                          <span className={`badge bg-${obtenerColorEstado(reserva.estado)}`}>
                            {reserva.estado}
                          </span>
                        </div>
                      </div>

                      <div className="reservas-reserva-info">
                        <div className="reservas-reserva-contenido">
                          <div className="reservas-cliente-info">
                            <h4>{reserva.servicio || 'Servicio no especificado'}</h4>
                            <p><strong>Cliente:</strong> {reserva.nombre || 'N/A'}</p>
                          </div>

                          <div className="reservas-vehiculo-info">
                            <p><strong>Vehículo:</strong> {reserva.patente} - {reserva.modelo}</p>
                            <p><strong>Servicio:</strong> {reserva.servicio}</p>
                          </div>

                          {reserva.observaciones && (
                            <div className="reservas-observaciones">
                              <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                            </div>
                          )}
                        </div>

                        <div className="reservas-reserva-acciones">
                          {reserva.estado === 'PENDING' && (
                            <Button 
                              variant="success"
                              size="sm"
                              onClick={() => irARegistrarServicio(reserva)}
                              className="reservas-boton-registrar"
                            >
                              Registrar Servicio
                            </Button>
                          )}

                          <button 
                            onClick={() => eliminarReserva(reserva.id)}
                            className="reservas-boton-cancelar"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="reservas-sin-reservas">
            <p>No hay reservas que coincidan con los filtros seleccionados para el día {formatearFechaParaMostrar(fechaSeleccionada)}</p>
            {reservasDelDia?.length === 0 && (
              <div className="reservas-alert-info">
                <i className="bi bi-info-circle me-2"></i>
                No hay reservas registradas para esta fecha. Las reservas creadas aparecerán aquí automáticamente.
              </div>
            )}
          </div>
        )}
        {/* Lista de reservas pendientes del día */}
        <div className="reservas-grupo-fecha" style={{ display: 'none' }}>
          <h2 className="reservas-fecha-titulo">Pendientes de Hoy</h2>
          <div className="reservas-reservas-del-dia">
            {reservasPendientesHoy.length === 0 ? (
              <p>No hay reservas pendientes para hoy.</p>
            ) : (
              reservasPendientesHoy.map(reserva => (
                <div key={reserva.id} className="reservas-reserva-card">
                  <div className="reservas-reserva-header">
                    <div className="reservas-reserva-hora">
                      <strong>{reserva.hora}</strong>
                    </div>
                    <div className="reservas-reserva-estado">
                      <span className={`badge bg-warning`}>Pendiente</span>
                    </div>
                  </div>
                  <div className="reservas-reserva-info">
                    <div className="reservas-reserva-contenido">
                      <div className="reservas-cliente-info">
                        <h4 style={{ color: 'var(--color-acento)' }}>{reserva.servicio || 'Servicio no especificado'}</h4>
                        <p><strong>Cliente:</strong> {reserva.nombre || 'N/A'}</p>
                      </div>
                      {reserva.observaciones && (
                        <div className="reservas-observaciones">
                          <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                        </div>
                      )}
                    </div>
                    <div className="reservas-reserva-acciones">
                      {reserva.estado === 'pendiente' && (
                        <Button 
                          variant="success"
                          size="sm"
                          onClick={() => irARegistrarServicio(reserva)}
                          className="reservas-boton-registrar"
                        >
                          Registrar Servicio
                        </Button>
                      )}
                      <Button 
                        variant="danger"
                        size="sm"
                        onClick={() => eliminarReserva(reserva.id)}
                        className="reservas-boton-cancelar"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        
        </div>
        
        {/* Sección colapsable de Completadas */}
        <div className="mt-1" style={{ display: 'none' }}>
          <Button
            variant="outline-primary"
            onClick={() => setMostrarConfirmadas(v => !v)}
            aria-controls="reservas-completadas"
            aria-expanded={mostrarConfirmadas}
            className="mb-2"
            style={{ fontWeight: 'bold' }}
          >
            {mostrarConfirmadas ? 'Ocultar' : 'Mostrar'} Reservas Completadas ({reservasCompletadas.length})
          </Button>
          <Collapse in={mostrarConfirmadas}>
            <div id="reservas-completadas">
              <div className="reservas-grupo-fecha">
                <h2 className="reservas-fecha-titulo">Reservas Completadas</h2>
                <div className="reservas-reservas-del-dia">
                  {reservasCompletadas.length === 0 ? (
                    <p>No hay reservas completadas.</p>
                  ) : (
                    reservasCompletadas.map(reserva => (
                      <div key={reserva.id} className="reservas-reserva-card" style={{ opacity: 0.8 }}>
                        <div className="reservas-reserva-header">
                          <div className="reservas-reserva-hora">
                            <strong>{reserva.hora}</strong>
                          </div>
                          <div className="reservas-reserva-estado">
                            <span className={`badge bg-success`}>Completada</span>
                          </div>
                        </div>
                        <div className="reservas-reserva-info">
                          <div className="reservas-reserva-contenido">
                            <div className="reservas-cliente-info">
                              <h4 style={{ color: 'var(--color-acento)' }}>{reserva.servicio || 'Servicio no especificado'}</h4>
                              <p><strong>Vehículo:</strong> {reserva.patente || 'N/A'} - {reserva.modelo || 'N/A'}</p>
                              <p><strong>Cliente:</strong> {reserva.nombre || 'N/A'}</p>
                            </div>
                            {reserva.observaciones && (
                              <div className="reservas-observaciones">
                                <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Collapse>
        </div>
        {/* Sección colapsable de Canceladas */}
        <div className="mt-1" style={{ display: 'none' }}>
          <Button
            variant="outline-warning"
            onClick={() => setMostrarCanceladas(v => !v)}
            aria-controls="reservas-canceladas"
            aria-expanded={mostrarCanceladas}
            className="mb-2"
            style={{ fontWeight: 'bold' }}
          >
            {mostrarCanceladas ? 'Ocultar' : 'Mostrar'} Reservas Canceladas ({reservasCanceladas.length})
          </Button>
          <Collapse in={mostrarCanceladas}>
            <div id="reservas-canceladas">
              <div className="reservas-grupo-fecha">
                <h2 className="reservas-fecha-titulo">Reservas Canceladas</h2>
                <div className="reservas-reservas-del-dia">
                  {reservasCanceladas.length === 0 ? (
                    <p>No hay reservas canceladas.</p>
                  ) : (
                    reservasCanceladas.map(reserva => (
                      <div key={reserva.id} className="reservas-reserva-card" style={{ opacity: 0.7 }}>
                        <div className="reservas-reserva-header">
                          <div className="reservas-reserva-hora">
                            <strong>{reserva.hora}</strong>
                          </div>
                          <div className="reservas-reserva-estado">
                            <span className={`badge bg-danger`}>Cancelada</span>
                          </div>
                        </div>
                        <div className="reservas-reserva-info">
                          <div className="reservas-reserva-contenido">
                            <div className="reservas-cliente-info">
                              <h4 style={{ color: 'var(--color-acento)' }}>{reserva.servicio || 'Servicio no especificado'}</h4>
                              <p><strong>Vehículo:</strong> {reserva.patente || 'N/A'} - {reserva.modelo || 'N/A'}</p>
                              <p><strong>Cliente:</strong> {reserva.nombre || 'N/A'}</p>
                            </div>
                            {reserva.observaciones && (
                              <div className="reservas-observaciones">
                                <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
} 