/**
 * Utilidades para manejo de fechas
 * Evita problemas de zona horaria usando fechas locales
 */

/**
 * Obtener fecha actual en formato YYYY-MM-DD (zona horaria local)
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const obtenerFechaActual = () => {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
};

/**
 * Obtener fecha específica en formato YYYY-MM-DD (zona horaria local)
 * @param {Date} fecha - Objeto Date
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const formatearFechaLocal = (fecha) => {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
};

/**
 * Crear fecha a partir de año, mes y día (zona horaria local)
 * @param {number} año - Año
 * @param {number} mes - Mes (1-12)
 * @param {number} dia - Día
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const crearFecha = (año, mes, dia) => {
  const mesFormateado = String(mes).padStart(2, '0');
  const diaFormateado = String(dia).padStart(2, '0');
  return `${año}-${mesFormateado}-${diaFormateado}`;
};

/**
 * Obtener las próximas N fechas desde hoy
 * @param {number} cantidad - Cantidad de fechas a generar
 * @returns {string[]} Array de fechas en formato YYYY-MM-DD
 */
export const obtenerProximasFechas = (cantidad = 7) => {
  const fechas = [];
  const hoy = new Date();
  
  for (let i = 0; i < cantidad; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    fechas.push(formatearFechaLocal(fecha));
  }
  
  return fechas;
};

/**
 * Verificar si una fecha es pasada
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean} true si la fecha es pasada
 */
export const esFechaPasada = (fecha) => {
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaCompleta = new Date(año, mes - 1, dia);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return fechaCompleta < hoy;
};

/**
 * Formatear fecha para mostrar al usuario
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada para mostrar
 */
export const formatearFechaParaMostrar = (fecha) => {
  if (!fecha) return 'Fecha no especificada';
  
  // Asegurar que la fecha se interprete en zona horaria local
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaLocal = new Date(año, mes - 1, dia); // mes - 1 porque los meses van de 0-11
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return fechaLocal.toLocaleDateString('es-ES', opciones);
};

/**
 * Formatear fecha y hora para mostrar al usuario
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} hora - Hora en formato HH:MM
 * @returns {string} Fecha y hora formateada para mostrar
 */
export const formatearFechaHoraParaMostrar = (fecha, hora) => {
  if (!fecha || !hora) return 'Fecha no especificada - Hora no especificada';

  const fechaHora = new Date(`${fecha}T${hora}`);
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };
  
  const fechaFormateada = fechaHora.toLocaleDateString('es-ES', opcionesFecha);
  const horaFormateada = fechaHora.toLocaleTimeString('es-ES', opcionesHora);
  
  return `${fechaFormateada} - ${horaFormateada}`;
};

// ===== UTILIDADES PARA MANEJO DE NOMBRES =====

/**
 * Divide un nombre completo en nombre y apellido
 * @param {string} nombreCompleto - El nombre completo a dividir
 * @returns {object} - Objeto con propiedades nombre y apellido
 */
export const dividirNombreCompleto = (nombreCompleto) => {
  if (!nombreCompleto) return { nombre: '', apellido: '' };
  
  const partes = nombreCompleto.trim().split(' ');
  const nombre = partes[0] || '';
  const apellido = partes.slice(1).join(' ') || '';
  
  return { nombre, apellido };
};

/**
 * Combina nombre y apellido en un nombre completo
 * @param {string} nombre - El nombre
 * @param {string} apellido - El apellido
 * @returns {string} - El nombre completo
 */
export const combinarNombreCompleto = (nombre, apellido) => {
  return `${nombre || ''} ${apellido || ''}`.trim();
}; 