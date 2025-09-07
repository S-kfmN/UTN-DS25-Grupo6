import { getApiConfig, getDefaultHeaders, API_ENDPOINTS } from '../config/api';

// Servicio de API y ordenado
class ApiService {
  constructor() {
    this.config = getApiConfig();
    this.baseURL = this.config.baseURL;
    this.timeout = this.config.timeout;
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = getDefaultHeaders();
    
    const config = {
      method: 'GET',
      headers: { ...headers, ...options.headers },
      timeout: this.timeout,
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Manejar diferentes códigos de respuesta
      if (response.status === 401) {
        // Token expirado, redirigir al login
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      if (response.status === 403) {
        throw new Error('No tienes permisos para esta acción');
      }

      if (response.status === 404) {
        throw new Error('Recurso no encontrado');
      }

      if (response.status >= 500) {
        throw new Error('Error del servidor');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      // Si la respuesta es exitosa pero no tiene contenido
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado tiempo');
      }
      throw error;
    }
  }

  // Métodos para autenticación
  async login(credentials) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    return this.request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST'
    });
  }

  async recoverPassword(email) {
    return this.request(API_ENDPOINTS.AUTH.RECOVER_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // Métodos para usuarios
  async getUserProfile() {
    return this.request(API_ENDPOINTS.USERS.PROFILE);
  }

  async updateUserProfile(profileData) {
    return this.request(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async searchUsers(query) {
    return this.request(`${API_ENDPOINTS.USERS.SEARCH}?q=${encodeURIComponent(query)}`);
  }

  async getAllUsers() {
    console.log('🔍 ApiService: Llamando a getAllUsers...');
    try {
      const response = await this.request(API_ENDPOINTS.USERS.LIST);
      console.log('👥 ApiService: Respuesta de getAllUsers:', response);
      return response;
    } catch (error) {
      console.error('❌ ApiService: Error en getAllUsers:', error);
      throw error; // Re-lanzar el error para que sea manejado por el AuthContext
    }
  }

  // Métodos para vehículos
  async getVehicles(userId = null, statusFilter = null, forAdminAll = false) {
    let endpoint;

    if (forAdminAll) {
      endpoint = API_ENDPOINTS.VEHICLES.ALL_FOR_ADMIN; // Usar el nuevo endpoint para admin
    } else if (userId) {
      endpoint = API_ENDPOINTS.VEHICLES.BY_USER(userId);
    } else {
      endpoint = API_ENDPOINTS.VEHICLES.LIST;
    }
    
    if (statusFilter) {
      endpoint += `?status=${statusFilter}`;
    }
    
    return this.request(endpoint);
  }

  async createVehicle(vehicleData) {
    return this.request(API_ENDPOINTS.VEHICLES.CREATE, {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    });
  }

  async updateVehicle(id, vehicleData) {
    return this.request(API_ENDPOINTS.VEHICLES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(vehicleData)
    });
  }

  async deleteVehicle(id) {
    return this.request(API_ENDPOINTS.VEHICLES.DELETE(id), {
      method: 'DELETE'
    });
  }

  // Métodos para reservas
  async getReservations(userId = null, forAdminAll = false) {
    let endpoint;
    if (forAdminAll) {
      endpoint = API_ENDPOINTS.RESERVATIONS.LIST; // Esta es ahora la ruta para que el admin obtenga TODAS las reservas
    } else if (userId) {
      endpoint = API_ENDPOINTS.RESERVATIONS.BY_USER(userId); // Esta es para las reservas de un usuario específico
    } else {
      throw new Error('Debe proporcionar un userId o especificar forAdminAll para obtener reservas.');
    }
    return this.request(endpoint);
  }

  async createReservation(reservationData) {
    return this.request(API_ENDPOINTS.RESERVATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  }

  async updateReservation(id, reservationData) {
    return this.request(API_ENDPOINTS.RESERVATIONS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(reservationData)
    });
  }

  async cancelReservation(id) {
    return this.request(API_ENDPOINTS.RESERVATIONS.CANCEL(id), {
      method: 'PATCH'
    });
  }

  async deleteReservation(id) {
    return this.request(API_ENDPOINTS.RESERVATIONS.DELETE(id), {
      method: 'DELETE'
    });
  }

  async getReservationsByDate(date) {
    return this.request(API_ENDPOINTS.RESERVATIONS.BY_DATE(date));
  }

  // Métodos para servicios
  async getServices(category = null) {
    const endpoint = category ? API_ENDPOINTS.SERVICES.BY_CATEGORY(category) : API_ENDPOINTS.SERVICES.LIST;
    return this.request(endpoint);
  }

  async createService(serviceData) {
    return this.request(API_ENDPOINTS.SERVICES.CREATE, {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  // Métodos para historial de servicios
  async getServiceHistory(patente = null) {
    const endpoint = patente ? API_ENDPOINTS.SERVICE_HISTORY.BY_VEHICLE(patente) : API_ENDPOINTS.SERVICE_HISTORY.LIST;
    return this.request(endpoint);
  }

  async createServiceHistory(historyData) {
    return this.request(API_ENDPOINTS.SERVICE_HISTORY.CREATE, {
      method: 'POST',
      body: JSON.stringify(historyData)
    });
  }
}

// Instancia singleton del servicio
const apiService = new ApiService();
export default apiService; 