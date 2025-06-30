import { useState } from 'react';

export default function Reservas() {
  // ===== ESTADOS PARA LA VISTA DE ADMINISTRADOR =====
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  // Estado para las reservas (simulamos datos mas completos)
  const [reservas, setReservas] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      apellido: 'García',
      telefono: '123-456-7890',
      patente: 'ABC123',
      modelo: 'Renault Clio',
      fecha: '2025-01-15',
      hora: '10:00',
      servicio: 'Cambio de Aceite',
      estado: 'confirmado',
      observaciones: 'Cliente frecuente'
    },
    {
      id: 2,
      nombre: 'María López',
      apellido: 'Rodríguez',
      telefono: '098-765-4321',
      patente: 'XYZ789',
      modelo: 'Renault Megane',
      fecha: '2025-01-15',
      hora: '14:30',
      servicio: 'Limpieza de Filtro',
      estado: 'pendiente',
      observaciones: 'Primera vez'
    },
    {
      id: 3,
      nombre: 'Carlos Silva',
      apellido: 'Martínez',
      telefono: '555-123-4567',
      patente: 'DEF456',
      modelo: 'Renault Captur',
      fecha: '2025-01-20',
      hora: '09:00',
      servicio: 'Revisión de Niveles',
      estado: 'confirmado',
      observaciones: ''
    },
    {
      id: 4,
      nombre: 'Ana González',
      apellido: 'Fernández',
      telefono: '777-888-9999',
      patente: 'GHI789',
      modelo: 'Renault Duster',
      fecha: '2025-01-16',
      hora: '11:00',
      servicio: 'Cambio de Aceite',
      estado: 'cancelado',
      observaciones: 'Cliente canceló por enfermedad'
    },
    {
      id: 5,
      nombre: 'Roberto Díaz',
      apellido: 'Herrera',
      telefono: '444-555-6666',
      patente: 'JKL012',
      modelo: 'Renault Logan',
      fecha: '2025-01-17',
      hora: '15:00',
      servicio: 'Limpieza de Filtro',
      estado: 'confirmado',
      observaciones: 'Urgente'
    }
  ]);

  // ===== FUNCIONES AUXILIARES =====
  
  // Funcion para obtener las proximas fechas
  const obtenerProximasFechas = () => {
    const fechas = [];
    const hoy = new Date();
    
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      fechas.push(fecha.toISOString().split('T')[0]);
    }
    
    return fechas;
  };

  // Funcion para filtrar reservas
  const reservasFiltradas = reservas.filter(reserva => {
    const cumpleFiltroFecha = !filtroFecha || reserva.fecha === filtroFecha;
    const cumpleFiltroEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado;
    
    return cumpleFiltroFecha && cumpleFiltroEstado;
  });

  // Funcion para agrupar reservas por fecha
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

  // Funcion para cambiar estado de reserva
  const cambiarEstadoReserva = (id, nuevoEstado) => {
    setReservas(prev => prev.map(reserva => 
      reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
    ));
  };

  // Función para eliminar reserva
  const eliminarReserva = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      setReservas(prev => prev.filter(reserva => reserva.id !== id));
    }
  };

  // Funcion para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  // Funcion para formatear fecha
  const formatearFecha = (fecha) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // ===== VARIABLES =====
  const proximasFechas = obtenerProximasFechas();
  const reservasAgrupadas = agruparReservasPorFecha(reservasFiltradas);

  return (
    <div className="contenedor-admin-reservas">
      {/* ===== TITULO Y FILTROS ===== */}
      <div className="header-admin-reservas">
        <h1>Panel de Administración - Reservas</h1>
        <p>Gestiona todas las reservas del sistema</p>
        
        {/* ===== FILTROS ===== */}
        <div className="filtros-admin">
          <div className="filtro-grupo">
            <label>Filtrar por fecha:</label>
            <select 
              value={filtroFecha} 
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="form-select"
            >
              <option value="">Todas las fechas</option>
              {proximasFechas.map(fecha => (
                <option key={fecha} value={fecha}>
                  {formatearFecha(fecha)}
                </option>
              ))}
            </select>
          </div>
          
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
            </select>
          </div>
        </div>
      </div>

      {/* ===== ESTADISTICAS RAPIDAS ===== */}
      <div className="estadisticas-rapidas">
        <div className="stat-card">
          <h3>Total Reservas</h3>
          <p className="stat-numero">{reservas.length}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmadas</h3>
          <p className="stat-numero confirmado">{reservas.filter(r => r.estado === 'confirmado').length}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p className="stat-numero pendiente">{reservas.filter(r => r.estado === 'pendiente').length}</p>
        </div>
        <div className="stat-card">
          <h3>Canceladas</h3>
          <p className="stat-numero cancelado">{reservas.filter(r => r.estado === 'cancelado').length}</p>
        </div>
      </div>

      {/* ===== LISTA DE RESERVAS ===== */}
      <div className="lista-reservas-admin">
        {Object.keys(reservasAgrupadas).length > 0 ? (
          Object.entries(reservasAgrupadas).map(([fecha, reservasDelDia]) => (
            <div key={fecha} className="grupo-fecha">
              <h2 className="fecha-titulo">{formatearFecha(fecha)}</h2>
              
              <div className="reservas-del-dia">
                {reservasDelDia
                  .sort((a, b) => a.hora.localeCompare(b.hora))
                  .map(reserva => (
                    <div key={reserva.id} className="reserva-card">
                      <div className="reserva-header">
                        <div className="reserva-hora">
                          <strong>{reserva.hora}</strong>
                        </div>
                        <div className="reserva-estado">
                          <span className={`badge bg-${obtenerColorEstado(reserva.estado)}`}>
                            {reserva.estado.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="reserva-info">
                        <div className="cliente-info">
                          <h4>{reserva.nombre} {reserva.apellido}</h4>
                          <p><strong>Teléfono:</strong> {reserva.telefono}</p>
                        </div>
                        
                        <div className="vehiculo-info">
                          <p><strong>Vehículo:</strong> {reserva.patente} - {reserva.modelo}</p>
                          <p><strong>Servicio:</strong> {reserva.servicio}</p>
                        </div>
                        
                        {reserva.observaciones && (
                          <div className="observaciones">
                            <p><strong>Observaciones:</strong> {reserva.observaciones}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="reserva-acciones">
                        <select 
                          value={reserva.estado}
                          onChange={(e) => cambiarEstadoReserva(reserva.id, e.target.value)}
                          className="form-select form-select-sm"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                        
                        <button 
                          onClick={() => eliminarReserva(reserva.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="sin-reservas">
            <p>No hay reservas que coincidan con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </div>
  );
} 