
import { Alert, Form } from 'react-bootstrap';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactSchema } from '../validations/contactSchema';
import '../assets/styles/contacto.css';
import CustomButton from '../components/CustomButton';
import { usarAuth } from '../context/AuthContext';

export default function Contacto() {
  const { usuario, estaAutenticado } = usarAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    getValues
  } = useForm({
    resolver: yupResolver(contactSchema)
  });

  useEffect(() => {
    if (estaAutenticado && usuario) {
      const valoresActuales = getValues();
      reset({
        ...valoresActuales,
        name: usuario.name || usuario.nombre || '',
        email: usuario.email || ''
      });
    }
  }, [estaAutenticado, usuario, getValues, reset]);

  const onSubmit = async (data) => {
    try {
      const resultado = await enviarMensaje(data);
      if (resultado.exito) {
        alert(`Mensaje enviado por ${data.name}`);
        reset();
      } else {
        setError("root", { 
          type: "manual", 
          message: resultado.error || "Error al enviar el mensaje" 
        });
      }
    } catch (error) {
      console.error(error);
      setError("root", { 
        type: "manual", 
        message: "Error al enviar el mensaje" 
      });
    }
  };

  return (
    <div className="contacto-container">
      <div className="contacto-header">
        <h1>Formulario de Contacto</h1>
      </div>
      {/* Contenedor del formulario */}
      <div className="contacto-form-container">
        {errors.root && (
          <Alert variant="danger" className="contacto-alert danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errors.root.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="contacto-form-group">
            <Form.Label className="contacto-form-label">
              Nombre:
            </Form.Label>
            <Form.Control
              {...register("name")}
              type="text"
              placeholder="Tu nombre"
              readOnly={true}
              className={`contacto-form-control ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && (
              <span className="field-error">{errors.name.message}</span>
            )}
          </Form.Group>

          <Form.Group className="contacto-form-group">
            <Form.Label className="contacto-form-label">
              Email:
            </Form.Label>
            <Form.Control
              {...register("email")}
              type="email"
              readOnly={true}
              placeholder="Tu email"
              className={`contacto-form-control ${errors.email ? "input-error" : ""}`}
            /> 
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </Form.Group>

          <Form.Group className="contacto-form-group">
            <Form.Label className="contacto-form-label">Mensaje:</Form.Label>
            <Form.Control
              {...register("message")}
              as="textarea"
              placeholder="Tu mensaje"
              rows="5"
              className={`contacto-form-control ${errors.message ? "input-error" : ""}`}
            />
            {errors.message && (
              <span className="field-error">{errors.message.message}</span>
            )}
          </Form.Group>

          <div className="d-grid gap-3 contacto-mb-4">
            <CustomButton 
              type="submit" 
              disabled={isSubmitting} 
              variant="primary"
              size="medium"
              className="custom-btn--full"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Enviando...
                </>
              ) : (
                "Enviar Mensaje"
              )}
            </CustomButton>
          </div>
        </Form>
      </div>

      <div className="contacto-datos">
        <h1>Datos de Contacto</h1>
        <p><b>Dirección:</b> Av. Santa Fe 1860, Buenos Aires, Argentina</p>
        <p><b>Teléfono:</b> (011) 4813-6052</p>
        <p><b>Email:</b> contacto@elateneo.com.ar</p>
      </div>
    </div>
  );
}