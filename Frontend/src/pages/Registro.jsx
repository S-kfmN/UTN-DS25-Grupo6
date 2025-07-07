import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';

export default function Registro() {
  const { registrarUsuario } = usarAuth();
  const navigate = useNavigate();
  
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contraseña: '',
    confirmarContraseña: ''
  });

  const [errores, setErrores] = useState({});
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosFormulario(previo => ({
      ...previo,
      [name]: value
    }));
    

    if (errores[name]) {
      setErrores(previo => ({
        ...previo,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};


    if (!datosFormulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    } else if (datosFormulario.nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }


    if (!datosFormulario.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    } else if (datosFormulario.apellido.length < 2) {
      nuevosErrores.apellido = 'El apellido debe tener al menos 2 caracteres';
    }


    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!datosFormulario.email) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!regexEmail.test(datosFormulario.email)) {
      nuevosErrores.email = 'Ingrese un email válido';
    }


    if (!datosFormulario.telefono) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(datosFormulario.telefono.replace(/\D/g, ''))) {
      nuevosErrores.telefono = 'Ingrese un teléfono válido (10 dígitos)';
    }


    if (!datosFormulario.contraseña) {
      nuevosErrores.contraseña = 'La contraseña es requerida';
    } else if (datosFormulario.contraseña.length < 6) {
      nuevosErrores.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }


    if (!datosFormulario.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = 'Confirme su contraseña';
    } else if (datosFormulario.contraseña !== datosFormulario.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setEstaEnviando(true);
    setMostrarError(false);

    try {
      
      const datosUsuario = {
        nombre: datosFormulario.nombre,
        apellido: datosFormulario.apellido,
        email: datosFormulario.email,
        telefono: datosFormulario.telefono,
        contraseña: datosFormulario.contraseña
      };
      
      const resultado = await registrarUsuario(datosUsuario);
      
      if (resultado.exito) {
        setMostrarExito(true);
        setDatosFormulario({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          contraseña: '',
          confirmarContraseña: ''
        });
        
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMostrarError(true);
        setErrores(prev => ({
          ...prev,
          general: resultado.error || 'Error al registrar usuario'
        }));
      }
      
    } catch (error) {
      console.error('Error al registrar:', error);
      setMostrarError(true);
      setErrores(prev => ({
        ...prev,
        general: 'Error de conexión. Intente nuevamente.'
      }));
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <div className="contenedor-admin-reservas">
      {/* Header del formulario */}
      <div className="header-admin-reservas">
        <h1>Crear Cuenta</h1>
        <p>Únete a Lubricentro Renault</p>
      </div>

      {/* Contenedor del formulario */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        backgroundColor: 'var(--color-gris)',
        borderRadius: '10px',
        padding: '2rem',
        border: '1px solid var(--color-acento)'
      }}>
        {mostrarExito && (
          <Alert variant="success" className="mb-4" style={{
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid #28a745',
            color: '#28a745'
          }}>
            <i className="bi bi-check-circle-fill me-2"></i>
            ¡Registro exitoso! Tu cuenta ha sido creada correctamente.
          </Alert>
        )}

        {mostrarError && (
          <Alert variant="danger" className="mb-4" style={{
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid #dc3545',
            color: '#dc3545'
          }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errores.general || 'Error al registrar usuario. Por favor, intente nuevamente.'}
          </Alert>
        )}

        <Form onSubmit={manejarEnvio}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-2">
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
                  value={datosFormulario.nombre}
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
              <Form.Group className="mb-2">
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
                  value={datosFormulario.apellido}
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
              value={datosFormulario.email}
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
              value={datosFormulario.telefono}
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

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label style={{
                  color: 'var(--color-acento)',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem'
                }}>
                  Contraseña *
                </Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña"
                  value={datosFormulario.contraseña}
                  onChange={manejarCambio}
                  isInvalid={!!errores.contraseña}
                  placeholder="Mínimo 6 caracteres"
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
                  {errores.contraseña}
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
                  Confirmar Contraseña *
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmarContraseña"
                  value={datosFormulario.confirmarContraseña}
                  onChange={manejarCambio}
                  isInvalid={!!errores.confirmarContraseña}
                  placeholder="Repita su contraseña"
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
                  {errores.confirmarContraseña}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid gap-3 mb-4">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={estaEnviando}
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
              {estaEnviando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </div>

          <div className="text-center">
            <p style={{ 
              color: 'var(--color-texto)', 
              opacity: 0.8,
              margin: 0 
            }}>
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--color-acento)',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
} 