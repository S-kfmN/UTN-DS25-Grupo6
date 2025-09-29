import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../assets/styles/recuperarcontrasena.css';

export default function RecuperarContraseña() {
  const [email, setEmail] = useState('');
  const [errores, setErrores] = useState({});
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  const manejarCambio = (evento) => {
    const { value } = evento.target;
    setEmail(value);
    
    // Limpiar errores cuando el usuario escriba
    if (errores.email) {
      setErrores({});
    }
    
    // Limpiar mensajes
    if (mostrarExito || mostrarError) {
      setMostrarExito(false);
      setMostrarError(false);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!regexEmail.test(email)) {
      nuevosErrores.email = 'Ingrese un email válido';
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
      // Aquí irá la lógica del backend cuando lo implementemos
      // Por ahora simulamos un delay
      await new Promise(resolver => setTimeout(resolver, 1500));
      
      // Simulamos éxito (esto se cambiará cuando implementemos el backend)
      setMostrarExito(true);
      setEmail('');
      
    } catch (error) {
      console.error('Error al enviar email:', error);
      setMostrarError(true);
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <div className="recuperarcontrasena-container">
      {/* Header del formulario */}
      <div className="recuperarcontrasena-header">
        <h1>Recuperar Contraseña</h1>
        <p>Te enviaremos un enlace para restablecer tu contraseña</p>
      </div>

      {/* Contenedor del formulario */}
      <div className="recuperarcontrasena-formulario-container">
        {mostrarExito && (
          <Alert variant="success" className="mb-4" style={{
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid #28a745',
            color: '#28a745'
          }}>
            <i className="bi bi-check-circle-fill me-2"></i>
            <strong>¡Email enviado!</strong><br />
            Hemos enviado un enlace de restablecimiento a tu correo electrónico. 
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </Alert>
        )}

        {mostrarError && (
          <Alert variant="danger" className="mb-4" style={{
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid #dc3545',
            color: '#dc3545'
          }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Error al enviar el email. Por favor, intenta nuevamente o contacta con soporte.
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
              Email de Registro *
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
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
                  Enviando email...
                </>
              ) : (
                'Enviar Email de Recuperación'
              )}
            </Button>
          </div>

          <div className="text-center">
            <p style={{ 
              color: 'var(--color-texto)', 
              opacity: 0.8,
              margin: 0 
            }}>
              ¿Recordaste tu contraseña?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--color-acento)',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Volver al Login
              </Link>
            </p>
          </div>
        </Form>

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
            <li>El enlace de recuperación expira en 24 horas</li>
            <li>Revisa también tu carpeta de spam</li>
            <li>Si no recibes el email, verifica que el correo esté registrado</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 