import { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageSync } from '../hooks/useLocalStorageSync';

export default function MisVehiculos() {
  const { usuario, agregarVehiculo, actualizarVehiculo, eliminarVehiculo, cargarVehiculosUsuario } = usarAuth();
  const navigate = useNavigate();
  
  // Estado para los vehículos del backend
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Cargar vehículos desde la API al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      console.log('🔄 Iniciando carga de vehículos...');
      console.log('👤 Usuario:', usuario);
      
      if (usuario?.id) {
        setCargando(true);
        try {
          console.log('📡 Llamando a cargarVehiculosUsuario...');
          const vehiculosDelBackend = await cargarVehiculosUsuario();
          console.log('🚗 Vehículos recibidos del backend:', vehiculosDelBackend);
          setVehiculos(vehiculosDelBackend || []);
        } catch (error) {
          console.error('❌ Error al cargar vehículos:', error);
          setVehiculos([]);
        } finally {
          console.log('✅ Finalizando carga de vehículos');
          setCargando(false);
        }
      } else {
        console.log('⚠️ No hay usuario.id, no se cargan vehículos');
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, [usuario?.id]);
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    patente: '',
    marca: 'RENAULT',
    modelo: '',
    año: '',
    color: ''
  });

  const [errores, setErrores] = useState({});

  // Filtrar vehículos por búsqueda
  const vehiculosFiltrados = vehiculos.filter(vehiculo =>
    vehiculo.patente.toLowerCase().includes(busqueda.toLowerCase()) ||
    vehiculo.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
    vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setNuevoVehiculo(previo => ({
      ...previo,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario escriba
    if (errores[name]) {
      setErrores(previo => ({
        ...previo,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!nuevoVehiculo.patente.trim()) {
      nuevosErrores.patente = 'La patente es requerida';
    }

    // La marca siempre es RENAULT, no necesita validación

    if (!nuevoVehiculo.modelo.trim()) {
      nuevosErrores.modelo = 'El modelo es requerido';
    }

    if (!nuevoVehiculo.año) {
      nuevosErrores.año = 'El año es requerido';
    } else if (nuevoVehiculo.año < 2000 || nuevoVehiculo.año > new Date().getFullYear() + 1) {
      nuevosErrores.año = 'El año debe ser válido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardarVehiculo = async (evento) => {
    evento.preventDefault();
    if (!validarFormulario()) return;

    try {
      if (modoEdicion && vehiculoAEditar) {
        // Editar vehículo existente
        const resultado = await actualizarVehiculo(vehiculoAEditar.id, nuevoVehiculo);
        if (resultado.exito) {
          setMostrarExito(true);
          setTimeout(() => setMostrarExito(false), 3000);
          // Recargar vehículos desde el backend
          const vehiculosActualizados = await cargarVehiculosUsuario();
          setVehiculos(vehiculosActualizados || []);
        }
      } else {
        // Agregar nuevo vehículo
        const resultado = await agregarVehiculo(nuevoVehiculo);
        if (resultado.exito) {
          setMostrarExito(true);
          setTimeout(() => setMostrarExito(false), 3000);
          // Recargar vehículos desde el backend
          const vehiculosActualizados = await cargarVehiculosUsuario();
          setVehiculos(vehiculosActualizados || []);
        }
      }
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    }

    setNuevoVehiculo({ patente: '', marca: 'RENAULT', modelo: '', año: '', color: '' });
    setModoEdicion(false);
    setVehiculoAEditar(null);
    setMostrarModal(false);
  };

  const manejarEliminarVehiculo = (vehiculo) => {
    setVehiculoAEliminar(vehiculo);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    if (vehiculoAEliminar) {
      try {
        const resultado = await eliminarVehiculo(vehiculoAEliminar.id);
        if (resultado.exito) {
          setMostrarConfirmacion(false);
          setVehiculoAEliminar(null);
          // Recargar vehículos desde el backend
          const vehiculosActualizados = await cargarVehiculosUsuario();
          setVehiculos(vehiculosActualizados || []);
        }
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
      }
    }
  };
  const manejarEditarVehiculo = (vehiculo) => {
    setNuevoVehiculo({ ...vehiculo, marca: 'RENAULT' }); // Siempre forzar marca RENAULT
    setVehiculoAEditar(vehiculo);
    setModoEdicion(true);
    setMostrarModal(true);
  };
  const obtenerColorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'success';
      case 'inactivo': return 'danger';
      default: return 'secondary';
    }
  };

  const obtenerTextoEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      default: return estado || 'Desconocido';
    }
  };

  return (
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <h1>Mis Vehículos</h1>
        <p>Gestiona tus vehículos registrados</p>
      </div>

      {/* Botón para agregar vehículo */}
      <div className="mb-4 text-center">
        <Button 
          onClick={() => setMostrarModal(true)}
          style={{
            backgroundColor: 'var(--color-acento)',
            color: 'var(--color-fondo)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            fontWeight: 'bold',
            borderRadius: '5px'
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Agregar Vehículo
        </Button>

      </div>

      {/* Mensaje de éxito */}
      {mostrarExito && (
        <Alert variant="success" className="mb-4" style={{
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          border: '1px solid #28a745',
          color: '#28a745'
        }}>
          <i className="bi bi-check-circle-fill me-2"></i>
          Vehículo agregado exitosamente
        </Alert>
      )}

          {/* Lista de vehículos */}
    <div className="lista-reservas-admin">
        {cargando ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando vehículos...</span>
            </div>
            <p className="mt-2">Cargando vehículos desde el servidor...</p>
          </div>
        ) : vehiculos.length > 0 ? (
        <div className="grupo-fecha">
          <h2 className="fecha-titulo">Vehículos Registrados</h2>

          {/* Input de búsqueda */}
          <div className="mb-3 text-center">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por patente o propietario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                maxWidth: '400px',
                margin: '0 auto',
                borderRadius: '8px',
                padding: '0.75rem',
                backgroundColor: 'var(--color-gris)',
                border: '1px solid var(--color-acento)',
                color: 'var(--color-texto)'
              }}
            />
          </div>

          <div className="reservas-del-dia">
              {vehiculosFiltrados.map(vehiculo => (
                <div key={vehiculo.id} className="reserva-card">
                  <div className="reserva-header">
                    <div className="reserva-hora">
                      <strong>{vehiculo.patente}</strong>
                    </div>
                    <div className="reserva-estado">
                      <span className={`badge bg-${obtenerColorEstado(vehiculo.estado)}`}>
                        {obtenerTextoEstado(vehiculo.estado)}
                      </span>
                    </div>
                  </div>

                  <div className="reserva-info">
                    <div className="cliente-info">
                      <h4>{vehiculo.marca} {vehiculo.modelo}</h4>
                      <p><strong>Año:</strong> {vehiculo.año}</p>
                      {vehiculo.color && <p><strong>Color:</strong> {vehiculo.color}</p>}
                      <p><strong>Propietario:</strong> {usuario.nombre} {usuario.apellido}</p>
                    </div>
                  </div>

                <div className="reserva-acciones">
                  <div className="mb-2">
                    <select 
                      value={vehiculo.estado}
                      onChange={async (e) => {
                        try {
                          await actualizarVehiculo(vehiculo.id, { estado: e.target.value });
                          // Recargar vehículos desde el backend
                          const vehiculosActualizados = await cargarVehiculosUsuario();
                          setVehiculos(vehiculosActualizados || []);
                        } catch (error) {
                          console.error('Error al actualizar estado:', error);
                        }
                      }}
                      className="form-select form-select-sm"
                      style={{
                        backgroundColor: 'var(--color-gris)',
                        border: '1px solid var(--color-acento)',
                        color: 'var(--color-texto)',
                        padding: '0.5rem',
                        borderRadius: '5px',
                        minWidth: '120px'
                      }}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-start gap-2">
                    <Button 
                      onClick={() => manejarEditarVehiculo(vehiculo)}
                      variant="primary"
                      size="sm"
                      style={{
                        fontWeight: 'bold',
                        padding: '0.4rem 1rem',
                        borderRadius: '5px',
                        fontSize: '0.8rem'
                      }}
                    >
                      Editar
                    </Button>

                      <Button 
                        variant="info" 
                        size="sm" 
                        onClick={() => navigate('/historial-vehiculo', { state: { patente: vehiculo.patente } })}
                        style={{
                          fontWeight: 'bold',
                          padding: '0.4rem 1rem',
                          borderRadius: '5px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <i className="bi bi-clock-history me-1"></i>
                        Ver historial
                      </Button>

                    <Button 
                      onClick={() => manejarEliminarVehiculo(vehiculo)}
                      variant="danger"
                      size="sm"
                      style={{
                        fontWeight: 'bold',
                        padding: '0.4rem 1rem',
                        borderRadius: '5px',
                        fontSize: '0.8rem'
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>  
            ))}
          </div>
        </div>
      ) : (
        <div className="sin-reservas">
          <p>No tienes vehículos registrados. ¡Agrega tu primer vehículo!</p>
        </div>
      )}
    </div>

      {/* Modal para agregar vehículo */}
      <Modal 
        show={mostrarModal} 
        onHide={() => setMostrarModal(false)}
        centered
      >
        <Modal.Header 
          closeButton
          style={{
            background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
            color: 'white'
          }}
        >
          <Modal.Title>{modoEdicion ? 'Editar Vehículo' : 'Agregar Vehículo'}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ backgroundColor: 'var(--color-gris)', color: 'var(--color-texto)' }}>
          <Form onSubmit={manejarGuardarVehiculo}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    Patente *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="patente"
                    value={nuevoVehiculo.patente}
                    onChange={manejarCambio}
                    isInvalid={!!errores.patente}
                    placeholder="ABC123"
                    style={{
                      backgroundColor: 'var(--color-gris)',
                      border: '1px solid var(--color-acento)',
                      color: 'var(--color-texto)',
                      padding: '0.75rem',
                      borderRadius: '5px'
                    }}
                    className="form-control-custom"
                  />
                  <Form.Control.Feedback type="invalid" style={{ color: '#dc3545' }}>
                    {errores.patente}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    Marca *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="marca"
                    value={nuevoVehiculo.marca}
                    readOnly
                    style={{
                      backgroundColor: 'var(--color-gris)',
                      border: '1px solid var(--color-acento)',
                      color: 'var(--color-texto)',
                      padding: '0.75rem',
                      borderRadius: '5px',
                      opacity: 0.7
                    }}
                    className="form-control-custom"
                  />
                  <Form.Control.Feedback type="invalid" style={{ color: '#dc3545' }}>
                    {errores.marca}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    Modelo *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="modelo"
                    value={nuevoVehiculo.modelo}
                    onChange={manejarCambio}
                    isInvalid={!!errores.modelo}
                    placeholder="Clio"
                    style={{
                      backgroundColor: 'var(--color-gris)',
                      border: '1px solid var(--color-acento)',
                      color: 'var(--color-texto)',
                      padding: '0.75rem',
                      borderRadius: '5px'
                    }}
                    className="form-control-custom"
                  />
                  <Form.Control.Feedback type="invalid" style={{ color: '#dc3545' }}>
                    {errores.modelo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    Año *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="año"
                    value={nuevoVehiculo.año}
                    onChange={manejarCambio}
                    isInvalid={!!errores.año}
                    placeholder="2025"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    style={{
                      backgroundColor: 'var(--color-gris)',
                      border: '1px solid var(--color-acento)',
                      color: 'var(--color-texto)',
                      padding: '0.75rem',
                      borderRadius: '5px'
                    }}
                    className="form-control-custom"
                  />
                  <Form.Control.Feedback type="invalid" style={{ color: '#dc3545' }}>
                    {errores.año}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                Color
              </Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={nuevoVehiculo.color}
                onChange={manejarCambio}
                placeholder="Blanco"
                style={{
                  backgroundColor: 'var(--color-gris)',
                  border: '1px solid var(--color-acento)',
                  color: 'var(--color-texto)',
                  padding: '0.75rem',
                  borderRadius: '5px'
                }}
                className="form-control-custom"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setMostrarModal(false)}
                  style={{
                    backgroundColor: 'var(--color-gris)',
                    border: '1px solid var(--color-acento)',
                    color: 'var(--color-texto)'
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                type="submit"
                style={{
                  backgroundColor: 'var(--color-acento)',
                  color: 'var(--color-fondo)',
                  border: 'none',
                  fontWeight: 'bold'
                }}
              >
                {modoEdicion ? 'Guardar Cambios' : 'Agregar Vehículo'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal 
        show={mostrarConfirmacion} 
        onHide={() => setMostrarConfirmacion(false)}
        centered
      >
        <Modal.Header 
          closeButton
          style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            color: 'white'
          }}
        >
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ backgroundColor: 'var(--color-gris)', color: 'var(--color-texto)' }}>
          <p>¿Estás seguro de que quieres eliminar el vehículo <strong>{vehiculoAEliminar?.patente}</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        
        <Modal.Footer style={{ backgroundColor: 'var(--color-gris)', borderTop: '1px solid var(--color-acento)' }}>
          <Button 
            variant="secondary" 
            onClick={() => setMostrarConfirmacion(false)}
            style={{
              backgroundColor: 'var(--color-gris)',
              border: '1px solid var(--color-acento)',
              color: 'var(--color-texto)'
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmarEliminacion}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 