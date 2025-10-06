// Configuración de APIs para el proyecto
const API_CONFIG = {
  // URLs base para diferentes entornos
  development: {
    baseURL: 'http://localhost:3000/api', // <-- incluye /api
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
    LIST: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    SEARCH: '/users/search',
    LIST: '/users' // Nuevo endpoint para obtener todos los usuarios
  },
  
  // Vehículos
  VEHICLES: {
    LIST: '/vehicles',
    CREATE: '/vehicles',
    UPDATE: (id) => `/vehicles/${id}`,
    DELETE: (id) => `/vehicles/${id}`,
    BY_USER: (userId) => '/vehicles', // El backend obtiene vehículos del usuario autenticado
    ALL_FOR_ADMIN: '/vehicles/all' // Nuevo endpoint para que el admin obtenga TODOS los vehículos
  },
  
  // Reservas
  RESERVATIONS: {
    LIST: '/reservations', // Obtiene reservas del usuario autenticado o todas si es admin
    CREATE: '/reservations',
    UPDATE: (id) => `/reservations/${id}`,
    DELETE: (id) => `/reservations/${id}`,
    BY_USER: (userId) => `/reservations/user/${userId}`, // Endpoint para admin obtener reservas de un usuario específico
    BY_DATE: (date) => `/reservations/date/${date}`,
    BY_MONTH: (year, month) => `/reservations/month/${year}/${month}`,
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
    LIST: '/services/history/all',
    CREATE: '/services/history',
    BY_VEHICLE: (patente) => `/services/history/vehicle?patente=${patente}`,
    BY_USER: (userId) => `/services/history/user/${userId}`,
    STATS: '/services/history/stats',
    UPDATE: (id) => `/services/history/${id}`,
    DELETE: (id) => `/services/history/${id}`
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

export const getApiConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return API_CONFIG[env] || API_CONFIG.development;
};

