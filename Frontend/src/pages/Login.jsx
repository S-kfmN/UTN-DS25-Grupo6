import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';

export default function Login() {
  const { iniciarSesion } = usarAuth();
  const navigate = useNavigate();
  
  const [datosFormulario, setDatosFormulario] = useState({
    email: '',
    contraseña: ''
  });

  const [errores, setErrores] = useState({});
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosFormulario(previo => ({
      ...previo,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(previo => ({
        ...previo,
        [name]: ''
      }));
    }
    
    // Limpiar mensaje de error general
    if (mostrarError) {
      setMostrarError(false);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!datosFormulario.email) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!regexEmail.test(datosFormulario.email)) {
      nuevosErrores.email = 'Ingrese un email válido';
    }

    // Validar contraseña
    if (!datosFormulario.contraseña) {
      nuevosErrores.contraseña = 'La contraseña es requerida';
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

    try {
      const resultado = await iniciarSesion(datosFormulario);
      
      if (resultado.exito) {
        // Redirigir al usuario después del login exitoso
        navigate('/mis-vehiculos');
      } else {
        setMostrarError(true);
      }
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMostrarError(true);
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <div className="contenedor-admin-reservas">
      {/* Header del formulario */}
      <div className="header-admin-reservas">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta de Lubricentro Renault</p>
      </div>

      {/* Contenedor del formulario */}
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto',
        backgroundColor: 'var(--color-gris)',
        borderRadius: '10px',
        padding: '2rem',
        border: '1px solid var(--color-acento)'
      }}>
        {mostrarError && (
          <Alert variant="danger" className="mb-4" style={{
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid #dc3545',
            color: '#dc3545'
          }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Email o contraseña incorrectos. Por favor, verifica tus credenciales.
          </Alert>
        )}

        <Form onSubmit={manejarEnvio}>
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
              Contraseña *
            </Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={datosFormulario.contraseña}
              onChange={manejarCambio}
              isInvalid={!!errores.contraseña}
              placeholder="Ingrese su contraseña"
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
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </div>

          <div className="text-center mb-3">
            <Link 
              to="/recuperar-contraseña" 
              style={{ 
                color: 'var(--color-acento)',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="text-center">
            <p style={{ 
              color: 'var(--color-texto)', 
              opacity: 0.8,
              margin: 0 
            }}>
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/registro" 
                style={{ 
                  color: 'var(--color-acento)',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Registrarse
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
} 