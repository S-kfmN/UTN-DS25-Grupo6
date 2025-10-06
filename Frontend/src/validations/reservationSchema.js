import * as yup from 'yup';

export const reservationSchema = yup.object().shape({
  vehicleId: yup
    .number()
    .required('Debe seleccionar un vehículo')
    .positive('ID de vehículo inválido'),
  serviceId: yup
    .number()
    .required('Debe seleccionar un servicio')
    .positive('ID de servicio inválido'),
  date: yup
    .string()
    .required('Debe seleccionar una fecha')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  time: yup
    .string()
    .required('Debe seleccionar una hora')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  notes: yup
    .string()
    .nullable()
    .max(500, 'Las observaciones no pueden tener más de 500 caracteres')
});

// Esquema adicional para datos de usuario durante el proceso de reserva
export const reservationUserDataSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  apellido: yup
    .string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  telefono: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^\d{10,15}$/, 'Ingrese un teléfono válido (10 a 15 dígitos)'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Debe ser un email válido'),
  patente: yup
    .string()
    .required('La patente es requerida')
    .matches(/^[A-Z]{2,3}-?[0-9]{2,3}$/, 'Formato de patente inválido (ej: ABC-123)'),
  servicio: yup
    .string()
    .required('Debe seleccionar un servicio'),
  fecha: yup
    .string()
    .required('Debe seleccionar una fecha'),
  hora: yup
    .string()
    .required('Debe seleccionar una hora'),
  observaciones: yup
    .string()
    .nullable()
    .max(500, 'Las observaciones no pueden tener más de 500 caracteres')
});