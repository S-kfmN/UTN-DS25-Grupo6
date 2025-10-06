import { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { useServicios } from '../hooks/useServicios';
import apiService from '../services/apiService';
import '../assets/styles/registrarservicio.css';

export default function RegistrarServicioModal({ 
  show, 
  onHide, 
  reserva, 
  onSuccess 
}) {
  const { usuario, esAdmin, refrescarUsuario } = usarAuth();
  
  // Hooks personalizados
  const { servicios, loading: loadingServicios, obtenerServicioPorId } = useServicios();
  
  // Estados del formulario
  const [datosServicio, setDatosServicio] = useState({
    servicio: reserva?.servicio || '',
    resultado: 'Completado',
    observaciones: '',
    repuestos: '',
    kilometraje: '',
    mecanico: usuario?.nombre ? `${usuario.nombre} ${usuario.apellido}` : ''
  });
  
  const [errores, setErrores] = useState({});
  const [estaGuardando, setEstaGuardando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [error, setError] = useState(null);

  // useEffect para cargar datos iniciales
  useEffect(() => {
    if (reserva && reserva.servicio) {
      setDatosServicio(prev => ({
        ...prev,
        servicio: reserva.servicio
      }));
    }
  }, [reserva]);

  // Función para manejar cambios en el formulario
  const manejarCambio = (campo, valor) => {
    setDatosServicio(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpiar error del campo cuando el usuario escriba
    if (errores[campo]) {
      setErrores(previo => ({
        ...previo,
        [campo]: ''
      }));
    }
  };

  // Función para validar el formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosServicio.servicio) {
      nuevosErrores.servicio = 'El servicio es requerido';
    }

    if (!datosServicio.resultado.trim()) {
      nuevosErrores.resultado = 'El resultado es requerido';
    }

    if (!datosServicio.observaciones.trim()) {
      nuevosErrores.observaciones = 'Las observaciones son requeridas';
    }

    if (!datosServicio.mecanico.trim()) {
      nuevosErrores.mecanico = 'El mecánico es requerido';
    }

    if (!datosServicio.kilometraje) {
      nuevosErrores.kilometraje = 'El kilometraje es requerido';
    } else if (datosServicio.kilometraje < 0) {
      nuevosErrores.kilometraje = 'El kilometraje debe ser válido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para registrar servicio en el historial
  const registrarServicioEnHistorial = async (datosCompletos) => {
    try {
      const response = await apiService.createServiceHistory(datosCompletos);
      return response;
    } catch (error) {
      console.error('Error al registrar servicio en historial:', error);
      throw error;
    }
  };

  // Función para guardar el servicio
  const manejarGuardar = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setEstaGuardando(true);
    try {
      // Crear información detallada del servicio para agregar a las notas
      const servicioInfo = {
        servicioRealizado: obtenerNombreServicio(datosServicio.servicio),
        resultado: datosServicio.resultado,
        observaciones: datosServicio.observaciones,
        repuestos: datosServicio.repuestos,
        kilometraje: datosServicio.kilometraje,
        mecanico: datosServicio.mecanico,
        fechaServicio: new Date().toISOString(),
        registradoPor: usuario?.nombre ? `${usuario.nombre} ${usuario.apellido}` : 'Sistema'
      };

      // Datos completos para el historial
      const datosCompletos = {
        userId: reserva?.userId || usuario?.id,
        vehicleId: reserva?.vehicleId,
        serviceId: parseInt(datosServicio.servicio),
        reservationId: reserva?.id || null,
        resultado: datosServicio.resultado,
        observaciones: datosServicio.observaciones,
        repuestos: datosServicio.repuestos,
        kilometraje: parseInt(datosServicio.kilometraje),
        mecanico: datosServicio.mecanico,
        registradoPor: usuario?.role || 'MECHANIC'
      };

      const resultado = await registrarServicioEnHistorial(datosCompletos);
      if (resultado.success) {
        setMostrarExito(true);
        setDatosServicio({
          servicio: reserva?.servicio || '',
          resultado: 'Completado',
          observaciones: '',
          repuestos: '',
          kilometraje: '',
          mecanico: usuario?.nombre ? `${usuario.nombre} ${usuario.apellido}` : ''
        });
        
        // Cambiar estado de la reserva a 'completado' si existe
        if (reserva && reserva.id) {
          try {
            await apiService.updateReservationStatus(reserva.id, 'COMPLETED');
          } catch (error) {
            console.error('Error al actualizar estado de reserva:', error);
          }
        }
        
        // Llamar callback de éxito
        if (onSuccess) {
          onSuccess(resultado.data);
        }
        
        setTimeout(() => {
          setMostrarExito(false);
          onHide(); // Cerrar modal después del éxito
        }, 2000);
      } else {
        setError('No se pudo registrar el servicio en el historial. Intenta más tarde.');
      }
    } catch (error) {
      setError('Error al guardar servicio: ' + error.message);
    } finally {
      setEstaGuardando(false);
    }
  };

  // Verificar si el usuario es admin/mecánico
  if (!esAdmin()) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Acceso Denegado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Solo los mecánicos pueden registrar servicios.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Función para obtener el nombre del servicio
  const obtenerNombreServicio = (servicioId) => {
    const servicio = obtenerServicioPorId(parseInt(servicioId));
    return servicio ? (servicio.name || servicio.nombre) : datosServicio.servicio;
  };

  // Obtener información del servicio seleccionado
  const servicioSeleccionado = obtenerServicioPorId(parseInt(datosServicio.servicio));

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="registrarservicio-modal-header">
        <Modal.Title>
          <i className="bi bi-tools me-2"></i>
          Registrar Servicio Realizado
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="registrarservicio-modal-body">
        {/* Información de la reserva */}
        {reserva && (
          <Card className="registrarservicio-card-reserva mb-4">
            <Card.Header className="registrarservicio-card-reserva-header">
              <i className="bi bi-calendar-check me-2"></i>
              Información de la Reserva
            </Card.Header>
            <Card.Body className="registrarservicio-card-reserva-body">
              <Row>
                <Col md={6}>
                  <p><strong>Cliente:</strong> {reserva.nombre} {reserva.apellido}</p>
                  <p><strong>Vehículo:</strong> {reserva.patente} - {reserva.marca} {reserva.modelo}</p>
                  <p><strong>Fecha:</strong> {reserva.fecha}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Hora:</strong> {reserva.hora}</p>
                  <p><strong>Servicio:</strong> {reserva.servicio}</p>
                  <p><strong>Estado:</strong> 
                    <Badge className="registrarservicio-badge-completado">Completado</Badge>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Mensaje de éxito */}
        {mostrarExito && (
          <Alert variant="success" className="registrarservicio-alert-exito mb-4">
            <i className="bi bi-check-circle-fill me-2"></i>
            ¡Servicio registrado exitosamente en el historial!
          </Alert>
        )}

        {/* Mensaje de error */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Formulario de registro */}
        <Card className="registrarservicio-card-formulario">
          <Card.Header className="registrarservicio-card-formulario-header">
            <i className="bi bi-tools me-2"></i>
            Datos del Servicio Realizado
          </Card.Header>
          <Card.Body className="registrarservicio-card-formulario-body">
            <Form onSubmit={manejarGuardar}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                      Servicio Realizado *
                    </Form.Label>
                    <Form.Select
                      value={datosServicio.servicio}
                      onChange={(e) => manejarCambio('servicio', e.target.value)}
                      isInvalid={!!errores.servicio}
                      style={{
                        backgroundColor: 'var(--color-gris)',
                        border: '1px solid var(--color-acento)',
                        color: 'var(--color-texto)'
                      }}
                    >
                      <option value="">Seleccionar servicio</option>
                      {Array.isArray(servicios) && servicios.map(servicio => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.name || servicio.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.servicio}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                      Resultado *
                    </Form.Label>
                    <Form.Select
                      value={datosServicio.resultado}
                      onChange={(e) => manejarCambio('resultado', e.target.value)}
                      isInvalid={!!errores.resultado}
                      style={{
                        backgroundColor: 'var(--color-gris)',
                        border: '1px solid var(--color-acento)',
                        color: 'var(--color-texto)'
                      }}
                    >
                      <option value="Completado">Completado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Requiere Repuestos">Requiere Repuestos</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.resultado}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                      Mecánico Responsable *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={datosServicio.mecanico}
                      onChange={(e) => manejarCambio('mecanico', e.target.value)}
                      isInvalid={!!errores.mecanico}
                      placeholder="Nombre del mecánico"
                      style={{
                        backgroundColor: 'var(--color-gris)',
                        border: '1px solid var(--color-acento)',
                        color: 'var(--color-texto)'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.mecanico}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                      Kilometraje *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={datosServicio.kilometraje}
                      onChange={(e) => manejarCambio('kilometraje', e.target.value)}
                      isInvalid={!!errores.kilometraje}
                      placeholder="Ej: 45000"
                      style={{
                        backgroundColor: 'var(--color-gris)',
                        border: '1px solid var(--color-acento)',
                        color: 'var(--color-texto)'
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.kilometraje}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                  Observaciones *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={datosServicio.observaciones}
                  onChange={(e) => manejarCambio('observaciones', e.target.value)}
                  isInvalid={!!errores.observaciones}
                  placeholder="Describe el trabajo realizado, problemas encontrados, recomendaciones..."
                  style={{
                    backgroundColor: 'var(--color-gris)',
                    border: '1px solid var(--color-acento)',
                    color: 'var(--color-texto)'
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.observaciones}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                  Repuestos Utilizados
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={datosServicio.repuestos}
                  onChange={(e) => manejarCambio('repuestos', e.target.value)}
                  placeholder="Lista de repuestos utilizados (opcional)"
                  style={{
                    backgroundColor: 'var(--color-gris)',
                    border: '1px solid var(--color-acento)',
                    color: 'var(--color-texto)'
                  }}
                />
              </Form.Group>

              {/* Información del servicio seleccionado */}
              {servicioSeleccionado && (
                <Alert variant="info" className="mb-4" style={{
                  backgroundColor: 'rgba(13, 202, 240, 0.1)',
                  border: '1px solid #0dcaf0',
                  color: '#0dcaf0'
                }}>
                  <h6><i className="bi bi-info-circle me-2"></i>Información del Servicio</h6>
                  <p><strong>Descripción:</strong> {servicioSeleccionado.description || servicioSeleccionado.descripcion}</p>
                  <p><strong>Duración estimada:</strong> {servicioSeleccionado.duration || servicioSeleccionado.duracion} minutos</p>
                  <p><strong>Categoría:</strong> {servicioSeleccionado.category || servicioSeleccionado.categoria}</p>
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
      
      <Modal.Footer className="registrarservicio-modal-footer">
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button 
          onClick={manejarGuardar}
          disabled={estaGuardando || loadingServicios}
          style={{
            backgroundColor: 'var(--color-acento)',
            color: 'var(--color-fondo)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            fontWeight: 'bold',
            borderRadius: '5px'
          }}
        >
          {estaGuardando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-save me-2"></i>
              Registrar Servicio
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
