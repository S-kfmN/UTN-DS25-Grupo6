import { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { vehicleSchema } from '../validations/vehicleSchema';
import { usarAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import '../assets/styles/misvehiculos.css';

export default function MisVehiculos() {
  const { usuario, agregarVehiculo, actualizarVehiculo, eliminarVehiculo, cargarVehiculosUsuario } = usarAuth();
  const navigate = useNavigate();
  
  // Estado para los vehículos del backend
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Cargar vehículos desde la API al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      if (usuario?.id) {
        setCargando(true);
        try {
          console.log('MisVehiculos.jsx: usuario.id', usuario.id); // Id del usuario
          const vehiculosDelBackend = await cargarVehiculosUsuario(usuario.id); // No pasar 'all' aquí
          console.log('MisVehiculos.jsx: Vehículos del backend', vehiculosDelBackend); // Vehículos obtenidos del backend
          setVehiculos(vehiculosDelBackend || []);
        } catch (error) {
          console.error('Error al cargar vehículos:', error);
          setVehiculos([]);
        } finally {
          setCargando(false);
        }
      } else {
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
  // Formulario del modal (react-hook-form + yup)
  const {
    register: registerVehiculo,
    handleSubmit: handleSubmitVehiculo,
    formState: { errors: errorsVehiculo, isSubmitting: isSubmittingVehiculo },
    reset: resetVehiculo,
    setValue: setValueVehiculo
  } = useForm({
    resolver: yupResolver(vehicleSchema),
    defaultValues: {
      license: '',
      brand: 'RENAULT',
      model: '',
      year: '',
      color: ''
    }
  });

  // Filtrar vehículos por búsqueda
  const vehiculosFiltrados = vehiculos.filter(vehiculo =>
    (vehiculo.license || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (vehiculo.brand || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (vehiculo.model || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para formatear patente automáticamente
  const formatearPatente = (patente) => {
    // Si está vacío o es null/undefined, devolver string vacío
    if (!patente || patente.trim() === '') {
      return '';
    }
    
    // Remover espacios y convertir a mayúsculas
    let patenteLimpia = patente.replace(/\s/g, '').toUpperCase();
    
    // Solo agregar guión si tiene exactamente 6 caracteres Y no tiene guión
    if (patenteLimpia.length === 6 && !patenteLimpia.includes('-')) {
      return patenteLimpia.slice(0, 3) + '-' + patenteLimpia.slice(3);
    }
    
    // Si ya tiene guión, mantener el formato
    if (patenteLimpia.includes('-')) {
      return patenteLimpia;
    }
    
    return patenteLimpia;
  };

  // Formateo en vivo de la patente con RHF
  const manejarCambioPatente = (e) => {
    const valor = e.target.value;
    const formateado = formatearPatente(valor);
    setValueVehiculo('license', formateado, { shouldValidate: true, shouldDirty: true });
  };

  // Abrir modal para agregar usando RHF
  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setVehiculoAEditar(null);
    resetVehiculo({ license: '', brand: 'RENAULT', model: '', year: '', color: '' });
    setMostrarModal(true);
  };

  // Guardar vehiculo con RHF
  const onSubmitVehiculo = async (data) => {
    try {
      if (modoEdicion && vehiculoAEditar) {
        const vehicleDataToSend = {
          brand: data.brand || vehiculoAEditar.brand,
          model: data.model || vehiculoAEditar.model,
          year: data.year || vehiculoAEditar.year,
          color: data.color ?? vehiculoAEditar.color,
        };
        if (data.license && data.license.toUpperCase() !== (vehiculoAEditar.license || '').toUpperCase()) {
          vehicleDataToSend.license = data.license.toUpperCase();
        }
        const resultado = await actualizarVehiculo(vehiculoAEditar.id, vehicleDataToSend);
        if (resultado.exito) {
          setMostrarExito(true);
          setTimeout(() => setMostrarExito(false), 3000);
          const vehiculosActualizados = await cargarVehiculosUsuario(usuario.id);
          setVehiculos(vehiculosActualizados || []);
        }
      } else {
        const vehicleDataToSend = {
          license: (data.license || '').toUpperCase(),
          brand: data.brand,
          model: data.model,
          year: data.year,
          color: data.color || '',
          userId: usuario.id
        };
        const resultado = await agregarVehiculo(vehicleDataToSend);
        if (resultado.exito) {
          setMostrarExito(true);
          setTimeout(() => setMostrarExito(false), 3000);
          const vehiculosActualizados = await cargarVehiculosUsuario(usuario.id);
          setVehiculos(vehiculosActualizados || []);
        }
      }
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    }

    setModoEdicion(false);
    setVehiculoAEditar(null);
    setMostrarModal(false);
    resetVehiculo({ license: '', brand: 'RENAULT', model: '', year: '', color: '' });
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
          const vehiculosActualizados = await cargarVehiculosUsuario(usuario.id);
          setVehiculos(vehiculosActualizados || []);
        }
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
      }
    }
  };
  const manejarEditarVehiculo = (vehiculo) => {
    resetVehiculo({
      license: vehiculo.license || '',
      brand: vehiculo.brand || 'RENAULT',
      model: vehiculo.model || '',
      year: vehiculo.year || '',
      color: vehiculo.color || ''
    });
    setVehiculoAEditar(vehiculo);
    setModoEdicion(true);
    setMostrarModal(true);
  };
  const obtenerColorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      default: return 'secondary';
    }
  };

  const obtenerTextoEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return estado || 'Desconocido';
    }
  };

  return (
    <div className="misvehiculos-container">
      {/* Header */}
      <div className="misvehiculos-header">
        <h1>Mis Vehículos</h1>
        <p>Gestiona tus vehículos registrados</p>
      </div>

      {/* Botón para agregar vehículo */}
      <div className="text-center">
        <CustomButton 
          onClick={abrirModalAgregar}
          className="misvehiculos-boton-agregar"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Agregar Vehículo
        </CustomButton>
      </div>

      {/* Mensaje de éxito */}
      {mostrarExito && (
        <Alert variant="success" className="misvehiculos-alerta-exito">
          <i className="bi bi-check-circle-fill me-2"></i>
          Vehículo agregado exitosamente
        </Alert>
      )}

      {/* Lista de vehículos */}
      <div className="misvehiculos-lista-vehiculos">
        {cargando ? (
          <div className="misvehiculos-spinner-container">
            <div className="spinner-border misvehiculos-spinner" role="status">
              <span className="visually-hidden">Cargando vehículos...</span>
            </div>
            <p className="misvehiculos-spinner-text">Cargando vehículos desde el servidor...</p>
          </div>
        ) : vehiculos.length > 0 ? (
        <div className="misvehiculos-grupo-fecha">

          {/* Input de búsqueda */}
          <div className="text-center">
            <input
              type="text"
              className="misvehiculos-busqueda"
              placeholder="Buscar por patente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="misvehiculos-reservas-del-dia">
              {vehiculosFiltrados.map(vehiculo => (
                <div key={vehiculo.id} className="misvehiculos-reserva-card">
                  <div className="misvehiculos-reserva-header">
                    <div className="misvehiculos-reserva-identificacion">
                      <div className="misvehiculos-reserva-patente">
                        {vehiculo.license}
                      </div>
                      <div className="misvehiculos-reserva-divisor"></div>
                      <div className="misvehiculos-reserva-marca">
                        {vehiculo.brand}
                      </div>
                    </div>
                    <div className="misvehiculos-reserva-estado">
                      <span className={`badge bg-${obtenerColorEstado(vehiculo.status)}`}>
                        {obtenerTextoEstado(vehiculo.status)}
                      </span>
                    </div>
                  </div>

                  <div className="misvehiculos-reserva-info">
                    <div className="misvehiculos-cliente-info">
                      <h4>{vehiculo.model}</h4>
                      <p><strong>Año:</strong> {vehiculo.year}</p>
                      {vehiculo.color && <p><strong>Color:</strong> {vehiculo.color}</p>}
                      <p><strong>Propietario:</strong> {usuario.nombre} {usuario.apellido}</p>
                    </div>
                  </div>

                  <div className="misvehiculos-reserva-acciones">
                  {/* VER CON LOS CHICOS */}
                  {/*<div className="mb-2">
                    <select 
                      value={vehiculo.estado}
                      onChange={async (e) => {
                        try {
                          await actualizarVehiculo(vehiculo.id, { estado: e.target.value });
                          // Recargar vehículos desde el backend
                          const vehiculosActualizados = await cargarVehiculosUsuario(usuario.id);
                          setVehiculos(vehiculosActualizados || []);
                        } catch (error) {
                          console.error('Error al actualizar estado:', error);
                        }
                      }}
                      className="misvehiculos-select-estado"
                    >
                      <option value="ACTIVE">Activo</option>
                      <option value="INACTIVE">Inactivo</option>
                    </select>
                  </div>*/}

                  <div className="misvehiculos-botones-accion">
                    <Button 
                      onClick={() => manejarEditarVehiculo(vehiculo)}
                      size="sm"
                      className="misvehiculos-boton-accion misvehiculos-boton-editar"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </Button>

                      <Button 
                        variant="info" 
                        size="sm" 
                        onClick={() => navigate('/historial-vehiculo', { state: { patente: vehiculo.patente } })}
                        className="misvehiculos-boton-accion misvehiculos-boton-historial"
                      >
                        <i className="bi bi-clock-history me-1"></i>
                        Ver historial
                      </Button>

                    <Button 
                      onClick={() => manejarEliminarVehiculo(vehiculo)}
                      variant="danger"
                      size="sm"
                      className="misvehiculos-boton-accion misvehiculos-boton-eliminar"
                    >
                      <i className="bi bi-trash me-1"></i>
                    </Button>
                  </div>
                </div>
              </div>  
            ))}
          </div>
        </div>
      ) : (
        <div className="misvehiculos-sin-vehiculos">
          <p>No tienes vehículos registrados. ¡Agrega tu primer vehículo!</p>
        </div>
      )}
    </div>

      {/* Modal para agregar y editar vehículo */}
      <Modal 
        show={mostrarModal} 
        onHide={() => setMostrarModal(false)}
        centered
      >
        <Modal.Header 
          closeButton
          className="misvehiculos-modal-header"
        >
          <Modal.Title>{modoEdicion ? 'Editar Vehículo' : 'Agregar Vehículo'}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="misvehiculos-modal-body">
          <Form onSubmit={handleSubmitVehiculo(onSubmitVehiculo)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="misvehiculos-modal-label">
                    Patente *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ABC-123"
                    className="misvehiculos-modal-control"
                    {...registerVehiculo('license', { onChange: manejarCambioPatente })}
                    isInvalid={!!errorsVehiculo.license}
                  />
                  <Form.Control.Feedback type="invalid" className="misvehiculos-feedback-invalid">
                    {errorsVehiculo.license?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="misvehiculos-modal-label">
                    Marca *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    readOnly={true}
                    className="misvehiculos-modal-control"
                    {...registerVehiculo('brand')}
                    isInvalid={!!errorsVehiculo.brand}
                  />
                  <Form.Control.Feedback type="invalid" className="misvehiculos-feedback-invalid">
                    {errorsVehiculo.brand?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="misvehiculos-modal-label">
                    Modelo *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Clio"
                    className="misvehiculos-modal-control"
                    {...registerVehiculo('model')}
                    isInvalid={!!errorsVehiculo.model}
                  />
                  <Form.Control.Feedback type="invalid" className="misvehiculos-feedback-invalid">
                    {errorsVehiculo.model?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="misvehiculos-modal-label">
                    Año *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="2025"
                    min="1900"
                    max="2099"
                    className="misvehiculos-modal-control"
                    {...registerVehiculo('year', { valueAsNumber: true })}
                    isInvalid={!!errorsVehiculo.year}
                  />
                  <Form.Control.Feedback type="invalid" className="misvehiculos-feedback-invalid">
                    {errorsVehiculo.year?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="misvehiculos-modal-label">
                Color
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Blanco"
                className="misvehiculos-modal-control"
                {...registerVehiculo('color')}
                isInvalid={!!errorsVehiculo.color}
              />
              <Form.Control.Feedback type="invalid" className="misvehiculos-feedback-invalid">
                {errorsVehiculo.color?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="misvehiculos-modal-botones">
                <Button 
                  variant="secondary" 
                  onClick={() => setMostrarModal(false)}
                  className="misvehiculos-boton-cancelar"
                >
                  Cancelar
                </Button>
                <CustomButton 
                className="custom-btn--xs" 
                type="submit"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Agregar Vehículo'}
              </CustomButton>
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
          className="misvehiculos-modal-confirm-header"
        >
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="misvehiculos-modal-confirm-body">
          <p>¿Estás seguro de que quieres eliminar el vehículo <strong>{vehiculoAEliminar?.patente}</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        
        <Modal.Footer className="misvehiculos-modal-confirm-footer">
          <Button 
            variant="secondary" 
            onClick={() => setMostrarConfirmacion(false)}
            className="misvehiculos-boton-confirm-cancelar"
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