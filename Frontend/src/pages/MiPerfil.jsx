import { useState } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function MiPerfil() {
  const { usuario, actualizarUsuario } = usarAuth();
  
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || ''
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
      // Simular delay de guardado
      await new Promise(resolver => setTimeout(resolver, 1000));
      
      actualizarUsuario(datosPerfil);
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
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal</p>
      </div>

      {/* Contenedor principal */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto'
      }}>
        {/* Información de la cuenta */}
        <div className="mb-4" style={{
          backgroundColor: 'var(--color-gris)',
          borderRadius: '10px',
          padding: '1.5rem',
          border: '1px solid var(--color-acento)'
        }}>
          <h3 style={{ color: 'var(--color-acento)', marginBottom: '1rem' }}>
            <i className="bi bi-person-circle me-2"></i>
            Información de la Cuenta
          </h3>
          
          <Row>
            <Col md={6}>
              <p><strong style={{ color: 'var(--color-acento)' }}>ID de Usuario:</strong> {usuario?.id}</p>
              <p><strong style={{ color: 'var(--color-acento)' }}>Rol:</strong> {usuario?.rol === 'admin' ? 'Administrador' : 'Cliente'}</p>
            </Col>
            <Col md={6}>
              <p><strong style={{ color: 'var(--color-acento)' }}>Vehículos Registrados:</strong> {usuario?.vehiculos?.length || 0}</p>
              <p><strong style={{ color: 'var(--color-acento)' }}>Fecha de Registro:</strong> {new Date().toLocaleDateString('es-ES')}</p>
            </Col>
          </Row>
        </div>

        {/* Formulario de edición */}
        <div style={{
          backgroundColor: 'var(--color-gris)',
          borderRadius: '10px',
          padding: '2rem',
          border: '1px solid var(--color-acento)'
        }}>
          <h3 style={{ color: 'var(--color-acento)', marginBottom: '1.5rem' }}>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Información Personal
          </h3>

          {mostrarExito && (
            <Alert variant="success" className="mb-4" style={{
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              border: '1px solid #28a745',
              color: '#28a745'
            }}>
              <i className="bi bi-check-circle-fill me-2"></i>
              Perfil actualizado exitosamente
            </Alert>
          )}

          <Form onSubmit={manejarGuardar}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label style={{
                    color: 'var(--color-acento)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Nombre *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={datosPerfil.nombre}
                    onChange={manejarCambio}
                    isInvalid={!!errores.nombre}
                    placeholder="Ingrese su nombre"
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
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label style={{
                    color: 'var(--color-acento)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Apellido *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={datosPerfil.apellido}
                    onChange={manejarCambio}
                    isInvalid={!!errores.apellido}
                    placeholder="Ingrese su apellido"
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
                    {errores.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label style={{
                    color: 'var(--color-acento)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Email *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={datosPerfil.email}
                    onChange={manejarCambio}
                    isInvalid={!!errores.email}
                    placeholder="ejemplo@email.com"
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
                    {errores.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label style={{
                    color: 'var(--color-acento)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Teléfono *
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={datosPerfil.telefono}
                    onChange={manejarCambio}
                    isInvalid={!!errores.telefono}
                    placeholder="11 1234-5678"
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
                    {errores.telefono}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-3">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={estaGuardando}
                style={{
                  backgroundColor: 'var(--color-acento)',
                  color: 'var(--color-fondo)',
                  border: 'none',
                  padding: '1rem 2rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderRadius: '5px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {estaGuardando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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
        <div className="mt-4" style={{
          backgroundColor: 'var(--color-gris)',
          borderRadius: '10px',
          padding: '1.5rem',
          border: '1px solid var(--color-acento)'
        }}>
          <h3 style={{ color: 'var(--color-acento)', marginBottom: '1rem' }}>
            <i className="bi bi-shield-lock me-2"></i>
            Seguridad
          </h3>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-1"><strong>Contraseña</strong></p>
              <p className="text-muted mb-0">Última actualización: Hace 30 días</p>
            </div>
            <Button 
              variant="outline-warning"
              size="sm"
              style={{
                borderColor: 'var(--color-acento)',
                color: 'var(--color-acento)'
              }}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 