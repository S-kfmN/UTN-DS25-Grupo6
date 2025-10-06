import * as yup from 'yup';

export const vehicleSchema = yup.object().shape({
  license: yup
    .string()
    .required('La patente es requerida')
    .matches(/^[A-Z]{2,3}-?[0-9]{2,3}$/, 'Formato de patente inválido (ej: ABC-123)')
    .max(8, 'La patente no puede tener más de 8 caracteres'),
  brand: yup
    .string()
    .required('La marca es requerida')
    .max(50, 'La marca no puede tener más de 50 caracteres'),
  model: yup
    .string()
    .required('El modelo es requerido')
    .max(50, 'El modelo no puede tener más de 50 caracteres'),
  year: yup
    .number()
    .typeError('El año debe ser un número')
    .required('El año es requerido')
    .integer('Ingrese un año válido')
    .min(1900, 'El año debe ser mayor o igual a 1900')
    .max(2099, 'El año debe ser menor o igual a 2099'),
  color: yup
    .string()
    .nullable()
    .max(30, 'El color no puede tener más de 30 caracteres')
});
