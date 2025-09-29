import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';
import '../assets/styles/registro.css';

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
    } else if (
      datosFormulario.telefono.replace(/\D/g, '').length < 10 ||
      datosFormulario.telefono.replace(/\D/g, '').length > 15
    ) {
      nuevosErrores.telefono = 'Ingrese un teléfono válido (10 a 15 dígitos)';
    }


    if (!datosFormulario.contraseña) {
      nuevosErrores.contraseña = 'La contraseña es requerida';
    } else if (datosFormulario.contraseña.length < 8) {
      nuevosErrores.contraseña = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(datosFormulario.contraseña)) {
      nuevosErrores.contraseña = 'La contraseña debe contener al menos una letra mayúscula y al menos un número';
    } else if (!/[0-9]/.test(datosFormulario.contraseña)) {
      nuevosErrores.contraseña = 'La contraseña debe contener al menos un número';
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
    <div className="registro-container">
      {/* Header del formulario */}
      <div className="registro-header">
        <h1>Crear Cuenta</h1>
        <p>Únete a Lubricentro Renault</p>
      </div>

      {/* Contenedor del formulario */}
      <div className="registro-form-container">
        {mostrarExito && (
          <Alert variant="success" className="registro-alert success">
            <i className="bi bi-check-circle-fill me-2"></i>
            ¡Registro exitoso! Tu cuenta ha sido creada correctamente.
          </Alert>
        )}

        {mostrarError && (
          <Alert variant="danger" className="registro-alert danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errores.general || 'Error al registrar usuario. Por favor, intente nuevamente.'}
          </Alert>
        )}

        <Form onSubmit={manejarEnvio}>
          <Row className="registro-mb-4">
            <Col md={6}>
              <Form.Group className="registro-form-group mb-2">
                <Form.Label className="registro-form-label">
                  Nombre *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={datosFormulario.nombre}
                  onChange={manejarCambio}
                  isInvalid={!!errores.nombre}
                  placeholder="Ingrese su nombre"
                  className="registro-form-control"
                />
                <Form.Control.Feedback type="invalid" className="registro-form-feedback">
                  {errores.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="registro-form-group mb-2">
                <Form.Label className="registro-form-label">
                  Apellido *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={datosFormulario.apellido}
                  onChange={manejarCambio}
                  isInvalid={!!errores.apellido}
                  placeholder="Ingrese su apellido"
                  className="registro-form-control"
                />
                <Form.Control.Feedback type="invalid" className="registro-form-feedback">
                  {errores.apellido}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="registro-form-group mb-4">
            <Form.Label className="registro-form-label">
              Email *
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={datosFormulario.email}
              onChange={manejarCambio}
              isInvalid={!!errores.email}
              placeholder="ejemplo@email.com"
              className="registro-form-control"
            />
            <Form.Control.Feedback type="invalid" className="registro-form-feedback">
              {errores.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="registro-form-group mb-4">
            <Form.Label className="registro-form-label">
              Teléfono *
            </Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={datosFormulario.telefono}
              onChange={manejarCambio}
              isInvalid={!!errores.telefono}
              placeholder="11 1234-5678"
              className="registro-form-control"
            />
            <Form.Control.Feedback type="invalid" className="registro-form-feedback">
              {errores.telefono}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="registro-mb-4">
            <Col md={6}>
              <Form.Group className="registro-form-group mb-4">
                <Form.Label className="registro-form-label">
                  Contraseña *
                </Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña"
                  value={datosFormulario.contraseña}
                  onChange={manejarCambio}
                  isInvalid={!!errores.contraseña}
                  placeholder="Mínimo 8 caracteres"
                  className="registro-form-control"
                />
                <Form.Control.Feedback type="invalid" className="registro-form-feedback">
                  {errores.contraseña}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="registro-form-group mb-4">
                <Form.Label className="registro-form-label">
                  Confirmar Contraseña *
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmarContraseña"
                  value={datosFormulario.confirmarContraseña}
                  onChange={manejarCambio}
                  isInvalid={!!errores.confirmarContraseña}
                  placeholder="Repita su contraseña"
                  className="registro-form-control"
                />
                <Form.Control.Feedback type="invalid" className="registro-form-feedback">
                  {errores.confirmarContraseña}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Text muted>
            La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
          </Form.Text>

          <div className="d-grid gap-3 registro-mb-4">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={estaEnviando}
              className="registro-submit-button"
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

          <div className="registro-text-center">
            <p className="registro-text">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="registro-link"
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