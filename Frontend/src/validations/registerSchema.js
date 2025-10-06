import * as yup from 'yup';

export const registerSchema = yup.object().shape({
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
  email: yup
    .string()
    .required('El email es requerido')
    .email('Debe ser un email válido'),
  telefono: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^\d{10,15}$/, 'Ingrese un teléfono válido (10 a 15 dígitos)'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número')
    .matches(/[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?]/, 'Debe contener al menos un caracter especial'),
  confirmarPassword: yup
    .string()
    .required('Confirme su contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
});
