# 🚗 Lubricentro Renault - Sistema de Reservas

Sistema web completo para gestión de reservas de un lubricentro especializado en vehículos Renault, desarrollado con React + Vite y Bootstrap. Incluye sistema de autenticación, gestión de roles (cliente/administrador), y herramientas de desarrollo para testing.

##  Diseño y Estilo

- **Paleta de colores**: Fondo negro, texto blanco, acentos amarillos (Renault)
- **Framework CSS**: Bootstrap 5 con personalizaciones
- **Responsive**: Diseño adaptativo para móviles, tablets y desktop
- **Tema**: Profesional y moderno, enfocado en la marca Renault

## 📁 Estructura del Proyecto

```
desarrollo/
├── public/
│   ├── fondo-lubricentro.jpg    # Imagen de fondo principal
│   ├── renault-logo.png         # Logo de Renault
│   └── vite.svg                 # Icono de Vite
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── ContactoForm.jsx     # Formulario de contacto
│   │   ├── Footer.jsx           # Pie de página
│   │   ├── FormularioReserva.jsx # Formulario de reserva
│   │   ├── Layout.jsx           # Layout principal con DevTools
│   │   ├── Navbar.jsx           # Barra de navegación con roles
│   │   ├── ReservaItem.jsx      # Item individual de reserva
│   │   └── DevTools.jsx         # Herramientas de desarrollo
│   ├── context/                 # Contexto de React
│   │   └── AuthContext.jsx      # Contexto de autenticación y gestión de usuarios
│   ├── pages/                   # Páginas principales
│   │   ├── HomePage.jsx         # Página de inicio
│   │   ├── Servicios.jsx        # Catálogo de servicios
│   │   ├── Productos.jsx        # Catálogo de productos
│   │   ├── Reservar.jsx         # Reserva de turnos (CLIENTES)
│   │   ├── Reservas.jsx         # Panel de administración (ADMIN)
│   │   ├── Contacto.jsx         # Página de contacto
│   │   ├── Registro.jsx         # Formulario de registro de usuarios
│   │   ├── Login.jsx            # Formulario de inicio de sesión
│   │   ├── RecuperarContraseña.jsx # Recuperación de contraseña
│   │   ├── MisVehiculos.jsx     # Gestión de vehículos del usuario
│   │   ├── MiPerfil.jsx         # Perfil del usuario
│   │   ├── MisReservas.jsx      # Reservas del usuario
│   │   └── AdminPanel.jsx       # Panel de administración completo
│   ├── App.jsx                  # Componente principal con rutas
│   ├── main.jsx                 # Punto de entrada
│   ├── App.css                  # Estilos de la aplicación
│   └── index.css                # Estilos globales
├── package.json                 # Dependencias del proyecto
└── vite.config.js              # Configuración de Vite
```

##  Sistema de Autenticación y Roles

### **Contexto de Autenticación (AuthContext)**
- **Gestión de usuarios**: Login, registro, logout
- **Roles**: Cliente y Administrador
- **Persistencia**: localStorage para simular backend
- **Funciones principales**:
  - `iniciarSesion()` - Login de usuarios
  - `registrarUsuario()` - Registro de nuevos usuarios
  - `cerrarSesion()` - Logout
  - `esAdmin()` - Verificar si es administrador
  - `estaAutenticado()` - Verificar autenticación

### **Gestión de Vehículos**
- **Registro de vehículos** por usuario
- **Estados**: registrado, activo, inactivo
- **Autocompletado** en formularios de reserva
- **Funciones**:
  - `agregarVehiculo()` - Agregar nuevo vehículo
  - `actualizarEstadoVehiculo()` - Cambiar estado
  - `eliminarVehiculo()` - Eliminar vehículo
  - `obtenerVehiculosActivos()` - Obtener vehículos activos

### **Gestión de Reservas**
- **Creación de reservas** con datos del usuario
- **Estados**: pendiente, confirmado, cancelado, completado
- **Funciones**:
  - `crearReserva()` - Crear nueva reserva
  - `obtenerReservasUsuario()` - Obtener reservas del usuario
  - `cancelarReserva()` - Cancelar reserva

## Herramientas de Desarrollo

### **DevTools Component**
- **Ubicación**: Botón ⚙️ en esquina inferior derecha
- **Funcionalidades**:
  - Cambiar rol dinámicamente (Cliente ↔ Admin)
  - Ver información del usuario actual
  - Estado de funciones administrativas
  - Solo visible cuando hay usuario autenticado

### **Cómo usar las DevTools**
1. **Inicia sesión** con cualquier credencial
2. **Busca el botón ⚙️** en la esquina inferior derecha
3. **Haz clic** para abrir las herramientas
4. **Cambia el rol** con los botones "Cliente" / "Admin"
5. **Ve los cambios** en tiempo real en la interfaz

## Funcionalidades Principales

### **Página de Inicio (HomePage)**
- Hero section con imagen de fondo del lubricentro
- Botones de acción principales
- Información de la empresa
- Diseño impactante con overlay oscuro

### **Servicios**
- Catálogo de servicios automotrices
- Tarjetas con hover effects
- Información detallada de cada servicio
- Diseño en grid responsivo

### **Productos**
- Catálogo de productos automotrices
- Tarjetas de productos con imágenes
- Información de precios y descripciones
- Filtros por categorías

### **Sistema de Autenticación**

#### **Registro de Usuarios**
- Formulario completo con validaciones
- Campos: nombre, apellido, email, teléfono
- Integración con AuthContext
- Mensajes de éxito/error

#### **Login de Usuarios**
- Formulario de inicio de sesión
- Validaciones de campos
- Estados de carga
- Integración con AuthContext

#### **Recuperación de Contraseña**
- Formulario para ingresar email
- Simulación de envío de enlace
- Mensajes informativos

### **Gestión de Vehículos (MisVehiculos)**
- **Listado de vehículos** del usuario
- **Estados**: registrado, activo, inactivo
- **Acciones**:
  - Agregar nuevo vehículo
  - Cambiar estado
  - Eliminar vehículo
- **Modal de confirmación** para eliminación
- **Validaciones** completas

### **Perfil de Usuario (MiPerfil)**
- **Información de la cuenta**:
  - ID de usuario
  - Rol actual
  - Vehículos registrados
  - Fecha de registro
- **Edición de datos personales**:
  - Nombre, apellido, email, teléfono
  - Validaciones en tiempo real
  - Mensajes de éxito
- **Sección de seguridad**:
  - Cambio de contraseña (simulado)

### **Mis Reservas**
- **Listado de reservas** del usuario
- **Filtros por estado**:
  - Todos, confirmado, pendiente, cancelado
- **Estadísticas rápidas**:
  - Total, confirmadas, pendientes, canceladas
- **Acciones**:
  - Cancelar reservas pendientes
  - Ver detalles de reservas confirmadas
- **Información importante** sobre políticas

### **Reservar Turno (Para Clientes)**
- **Calendario interactivo mejorado**:
  - Navegación entre meses (botones atrás/adelante)
  - Días pasados no seleccionables
  - Días con reservas marcados
  - Día seleccionado resaltado
  - Leyenda completa
- **Formulario inteligente**:
  - **Autocompletado** de datos del usuario logueado
  - **Selección de vehículos** activos del usuario
  - **Autocompletado** de datos del vehículo seleccionado
  - **Validaciones** completas
  - **Campo de fecha** visible con formato legible
  - **Estados de carga** y mensajes de éxito
- **Servicios disponibles**:
  - Cambio de Aceite, Limpieza de Filtro, etc.
- **Horarios disponibles**: 08:00 a 18:00
- **Integración completa** con AuthContext

### **Panel de Administración (AdminPanel)**
- **Acceso restringido** solo para administradores
- **Información del administrador** conectado
- **Estadísticas del sistema**:
  - Total de reservas
  - Reservas por estado
  - Total de usuarios
- **Acciones rápidas**:
  - Gestionar Reservas
  - Gestionar Usuarios
  - Gestionar Vehículos
  - Configuración
- **Últimas reservas** del sistema
- **Información del sistema**

### **Panel de Administración (Reservas)**
- **Filtros avanzados**:
  - Por fecha específica
  - Por estado (confirmado/pendiente/cancelado)
- **Estadísticas rápidas**:
  - Total de reservas
  - Reservas confirmadas
  - Reservas pendientes
  - Reservas canceladas
- **Gestión completa**:
  - Cambiar estado de reservas
  - Eliminar reservas
  - Ver información detallada
- **Organización por fecha**:
  - Reservas agrupadas por día
  - Ordenadas por hora
  - Información completa de cada cliente

### **Contacto**
- Formulario de contacto
- Información de la empresa
- Ubicación y horarios
- Múltiples canales de comunicación

## Gestión de Roles

### **Rol Cliente**
- **Acceso a**:
  - Reservar turnos
  - Gestionar vehículos propios
  - Ver perfil personal
  - Ver reservas propias
- **Funcionalidades**:
  - Calendario de reservas
  - Formularios autocompletados
  - Gestión de vehículos

### **Rol Administrador**
- **Acceso a**:
  - Panel de administración completo
  - Gestión de todas las reservas
  - Estadísticas del sistema
  - Todas las funcionalidades de cliente
- **Funcionalidades**:
  - Panel de admin en `/admin`
  - Enlace "Admin" en navbar
  - Gestión completa del sistema

## Testing de Roles

### **Métodos para probar roles:**

#### **1. Herramientas de Desarrollo (Recomendado)**
- Inicia sesión con cualquier credencial
- Busca el botón ⚙️ en la esquina inferior derecha
- Haz clic para abrir las herramientas
- Usa los botones "Cliente" / "Admin" para cambiar roles
- Ve los cambios en tiempo real

#### **2. Modificación del Contexto**
- El usuario simulado ya viene como admin por defecto
- Puedes modificar `AuthContext.jsx` para cambiar el rol inicial

#### **3. Acceso Directo**
- Ve a `/admin` directamente en la URL
- Si eres admin: verás el panel completo
- Si eres cliente: verás mensaje de acceso denegado

## Tecnologías Utilizadas

- **Frontend**: React 18
- **Build Tool**: Vite
- **CSS Framework**: Bootstrap 5
- **Estilos**: CSS personalizado con variables CSS
- **Routing**: React Router DOM
- **Iconos**: Bootstrap Icons
- **Estado**: React Context API
- **Persistencia**: localStorage (simulación de backend)

## Características Técnicas

### **Responsive Design**
- Mobile-first approach
- Breakpoints optimizados
- Navegación adaptativa
- Componentes flexibles

### **Performance**
- Lazy loading de componentes
- Optimización de imágenes
- CSS optimizado
- Build optimizado con Vite

### **UX/UI**
- Interfaz intuitiva
- Feedback visual inmediato
- Estados de carga y error
- Accesibilidad mejorada

### **Seguridad (Frontend)**
- Validación de roles
- Protección de rutas
- Validaciones de formularios
- Manejo de estados de autenticación

## Instalación y Uso

### Pre-requisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Entrar al directorio
cd desarrollo

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Navegación

### **Para Clientes**
1. **Inicio** → Información general del lubricentro
2. **Servicios** → Ver servicios disponibles
3. **Productos** → Ver productos en venta
4. **Reservar Turno** → Calendario interactivo para reservas
5. **Mi Cuenta** (Dropdown):
   - Mis Vehículos → Gestión de vehículos
   - Mi Perfil → Editar información personal
   - Mis Reservas → Ver reservas propias
6. **Contacto** → Información de contacto

### **Para Administradores**
1. **Admin** → Panel de administración completo
2. **Reservas** → Panel de gestión de reservas
3. **Mi Cuenta** (Dropdown):
   - Panel de Administración → Acceso directo al admin
   - Todas las opciones de cliente
4. **Todas las funcionalidades de cliente**

## Personalización

### Variables CSS Principales
```css
:root {
  --color-fondo: #000;         /* Fondo negro */
  --color-texto: #fff;         /* Texto blanco */
  --color-acento: #ffcc00;     /* Amarillo Renault */
  --color-gris: #333;          /* Gris oscuro */
  --espaciado: 1rem;           /* Espaciado base */
}
```

### Componentes Reutilizables
- **Navbar**: Navegación principal con roles
- **Footer**: Pie de página
- **Layout**: Estructura base con DevTools
- **AuthContext**: Gestión de autenticación y usuarios
- **Formularios**: Componentes de formulario estandarizados

## Estado del Proyecto

### ✅ **Completado**
- ✅ Sistema de autenticación completo
- ✅ Gestión de roles (cliente/admin)
- ✅ Sistema de reservas con calendario interactivo
- ✅ Panel de administración completo
- ✅ Gestión de vehículos por usuario
- ✅ Perfil de usuario editable
- ✅ Mis reservas con filtros
- ✅ Herramientas de desarrollo para testing
- ✅ Diseño responsivo
- ✅ Estilos personalizados
- ✅ Componentes reutilizables
- ✅ Validaciones completas
- ✅ Estados de carga y error
- ✅ Protección de rutas por roles

### **En Desarrollo**
- Backend API (actualmente simulado con localStorage)
- Base de datos
- Autenticación real con JWT
- Notificaciones por email
- Reportes avanzados

### **Próximas Funcionalidades**
- Dashboard con gráficos
- Gestión de empleados
- Sistema de notificaciones
- Reportes de ventas
- Integración con sistemas externos
