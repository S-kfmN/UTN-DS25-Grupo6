// Configuración de APIs para el proyecto
const API_CONFIG = {
  // URLs base para diferentes entornos
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
  },
  production: {
    baseURL: 'https://tu-api-produccion.com/api',
    timeout: 10000
  },
  staging: {
    baseURL: 'https://tu-api-staging.com/api',
    timeout: 8000
  }
};

// Obtener configuración según el entorno
const getApiConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  return API_CONFIG[environment];
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RECOVER_PASSWORD: '/auth/recover-password'
  },
  
  // Usuarios
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    SEARCH: '/users/search'
  },
  
  // Vehículos
  VEHICLES: {
    LIST: '/vehicles',
    CREATE: '/vehicles',
    UPDATE: (id) => `/vehicles/${id}`,
    DELETE: (id) => `/vehicles/${id}`,
    BY_USER: (userId) => '/vehicles' // El backend obtiene vehículos del usuario autenticado
  },
  
  // Reservas
  RESERVATIONS: {
    LIST: '/reservations',
    CREATE: '/reservations',
    UPDATE: (id) => `/reservations/${id}`,
    DELETE: (id) => `/reservations/${id}`,
    BY_USER: (userId) => `/users/${userId}/reservations`,
    BY_DATE: (date) => `/reservations/date/${date}`,
    CANCEL: (id) => `/reservations/${id}/cancel`
  },
  
  // Servicios
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    UPDATE: (id) => `/services/${id}`,
    DELETE: (id) => `/services/${id}`,
    BY_CATEGORY: (category) => `/services/category/${category}`
  },
  
  // Historial de servicios
  SERVICE_HISTORY: {
    LIST: '/service-history',
    CREATE: '/service-history',
    BY_VEHICLE: (patente) => `/service-history/vehicle/${patente}`,
    BY_DATE: (date) => `/service-history/date/${date}`
  }
};

// Headers por defecto
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json'
  };
};

export { getApiConfig }; 