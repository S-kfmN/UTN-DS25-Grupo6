import { useState } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { dividirNombreCompleto, combinarNombreCompleto } from '../utils/dateUtils';
import '../assets/styles/perfil.css';

export default function MiPerfil() {
  const { usuario, actualizarUsuario } = usarAuth();
  
  // Obtener nombre y apellido del usuario
  const { nombre: nombreUsuario, apellido: apellidoUsuario } = dividirNombreCompleto(usuario?.name);
  
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: nombreUsuario || '',
    apellido: apellidoUsuario || '',
    email: usuario?.email || '',
    telefono: usuario?.phone || ''
  });

  const [errores, setErrores] = useState({});
  const [estaGuardando, setEstaGuardando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosPerfil(previo => ({
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

    if (!datosPerfil.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!datosPerfil.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!datosPerfil.email) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!regexEmail.test(datosPerfil.email)) {
      nuevosErrores.email = 'Ingrese un email válido';
    }

    if (!datosPerfil.telefono) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardar = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setEstaGuardando(true);

    try {
      // Combinar nombre y apellido para enviar al backend
      const datosPerfilParaBackend = {
        name: combinarNombreCompleto(datosPerfil.nombre, datosPerfil.apellido),
        email: datosPerfil.email,
        phone: datosPerfil.telefono
      };
      
      // Simular delay de guardado
      await new Promise(resolver => setTimeout(resolver, 1000));
      
      actualizarUsuario(datosPerfilParaBackend);
      setMostrarExito(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setMostrarExito(false), 3000);
      
    } catch (error) {
      console.error('Error al guardar perfil:', error);
    } finally {
      setEstaGuardando(false);
    }
  };

  return (
    <div className="perfil-container">
      {/* Header */}
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal</p>
      </div>

      {/* Contenedor principal */}
      <div className="perfil-contenedor-principal">
        {/* Información de la cuenta */}
        <div className="perfil-info-cuenta">
          <h3>
            <i className="bi bi-person-circle me-2"></i>
            Información de la Cuenta
          </h3>
          
          <Row>
            <Col md={6}>
              <p><strong>ID de Usuario:</strong> {usuario?.id}</p>
              <p><strong>Rol:</strong> {usuario?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
            </Col>
            <Col md={6}>
              <p><strong>Vehículos Registrados:</strong> {usuario?.vehiculos?.length || 0}</p>
              <p><strong>Fecha de Registro:</strong> {new Date().toLocaleDateString('es-ES')}</p>
            </Col>
          </Row>
        </div>

        {/* Formulario de edición */}
        <div className="perfil-formulario-edicion">
          <h3>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Información Personal
          </h3>

          {mostrarExito && (
            <Alert variant="success" className="perfil-alerta-exito">
              <i className="bi bi-check-circle-fill me-2"></i>
              Perfil actualizado exitosamente
            </Alert>
          )}

          <Form onSubmit={manejarGuardar}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="perfil-form-label">
                    Nombre *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={datosPerfil.nombre}
                    onChange={manejarCambio}
                    isInvalid={!!errores.nombre}
                    placeholder="Ingrese su nombre"
                    className="perfil-form-control"
                  />
                  <Form.Control.Feedback type="invalid" className="perfil-feedback-invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="perfil-form-label">
                    Apellido *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={datosPerfil.apellido}
                    onChange={manejarCambio}
                    isInvalid={!!errores.apellido}
                    placeholder="Ingrese su apellido"
                    className="perfil-form-control"
                  />
                  <Form.Control.Feedback type="invalid" className="perfil-feedback-invalid">
                    {errores.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="perfil-form-label">
                    Email *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={datosPerfil.email}
                    onChange={manejarCambio}
                    isInvalid={!!errores.email}
                    placeholder="ejemplo@email.com"
                    className="perfil-form-control"
                  />
                  <Form.Control.Feedback type="invalid" className="perfil-feedback-invalid">
                    {errores.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="perfil-form-label">
                    Teléfono *
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={datosPerfil.telefono}
                    onChange={manejarCambio}
                    isInvalid={!!errores.telefono}
                    placeholder="11 1234-5678"
                    className="perfil-form-control"
                  />
                  <Form.Control.Feedback type="invalid" className="perfil-feedback-invalid">
                    {errores.telefono}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="perfil-d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={estaGuardando}
                className="perfil-boton-guardar"
              >
                {estaGuardando ? (
                  <>
                    <span className="perfil-spinner spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando cambios...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </Form>
        </div>

        {/* Sección de seguridad */}
        <div className="perfil-seccion-seguridad">
          <h3>
            <i className="bi bi-shield-lock me-2"></i>
            Seguridad
          </h3>
          
          <div className="perfil-seguridad-contenido">
            <div className="perfil-seguridad-info">
              <p className="mb-1"><strong>Contraseña</strong></p>
              <p className="text-muted-light mb-0">Última actualización: Hace 30 días</p>
            </div>
            <Button 
              variant="outline-warning"
              size="sm"
              className="perfil-boton-cambiar-password"
            >
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 