import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import '../assets/styles/login.css';

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
    setMostrarError(false);

    try {
      const resultado = await iniciarSesion(datosFormulario);
      
      if (resultado.exito) {
        // Redirigir al usuario después del login exitoso
        navigate('/mis-vehiculos');
      } else {
        // Mostrar error específico
        setErrores(prev => ({
          ...prev,
          general: resultado.error || 'Error al iniciar sesión'
        }));
        setMostrarError(true);
      }
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrores(prev => ({
        ...prev,
        general: 'Error de conexión. Intente nuevamente.'
      }));
      setMostrarError(true);
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <div className="login-container">
      {/* Header del formulario */}
      <div className="login-header">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta de Lubricentro Renault</p>
      </div>

      {/* Contenedor del formulario */}
      <div className="login-form-container">
        {mostrarError && (
          <Alert variant="danger" className="login-alert danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errores.general || errores.email || errores.contraseña || 'Email o contraseña incorrectos. Por favor, verifica tus credenciales.'}
          </Alert>
        )}

        <Form onSubmit={manejarEnvio}>
          <Form.Group className="login-form-group">
            <Form.Label className="login-form-label">
              Email *
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={datosFormulario.email}
              onChange={manejarCambio}
              isInvalid={!!errores.email}
              placeholder="ejemplo@email.com"
              className="login-form-control"
            />
            <Form.Control.Feedback type="invalid" className="login-form-feedback">
              {errores.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="login-form-group">
            <Form.Label className="login-form-label">
              Contraseña *
            </Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={datosFormulario.contraseña}
              onChange={manejarCambio}
              isInvalid={!!errores.contraseña}
              placeholder="Ingrese su contraseña"
              className="login-form-control"
            />
            <Form.Control.Feedback type="invalid" className="login-form-feedback">
              {errores.contraseña}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid gap-3 login-mb-4">
            <CustomButton 
              type="submit" 
              disabled={estaEnviando}
              variant="primary"
              size="medium"
              className="custom-btn--full"
            >
              {estaEnviando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </CustomButton>
          </div>

          <div className="login-text-center login-mb-3">
            <Link 
              to="/recuperar-contraseña" 
              className="login-link"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="login-text-center">
            <p className="login-text">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/registro" 
                className="login-link"
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