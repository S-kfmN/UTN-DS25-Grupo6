import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('El email es requerido')
    .email('Debe ser un email válido'),
  contraseña: yup
    .string()
    .required('La contraseña es requerida')
});