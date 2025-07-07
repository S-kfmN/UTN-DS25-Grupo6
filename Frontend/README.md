# 🚗 Lubricentro Renault - Sistema de Gestión de Reservas

Sistema web completo para gestión de reservas de un lubricentro especializado en vehículos Renault. Desarrollado con React + Vite, incluye sistema de autenticación, gestión de roles (cliente/administrador), gestión de vehículos y reservas.

## 🎯 Características Principales

- **Sistema de Autenticación** con roles de usuario y administrador
- **Gestión de Vehículos** por usuario
- **Sistema de Reservas** con calendario interactivo
- **Panel de Administración** completo
- **Interfaz Responsive** para todos los dispositivos
- **Diseño Profesional** con tema Renault

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd desarrollo-privado-pedro
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 👥 Usuarios de Prueba

### 🔑 Administrador
- **Email:** `admin@lubricentro.com`
- **Contraseña:** `admin123`
- **Rol:** Administrador
- **Acceso:** Panel completo de administración

### 👤 Usuarios Cliente (Pre-registrados)

#### Juan Pérez
- **Email:** `juan.perez@email.com`
- **Contraseña:** `cliente123`
- **Vehículos:** Renault Clio 2020, Renault Megane 2019

#### María González
- **Email:** `maria.gonzalez@email.com`
- **Contraseña:** `cliente123`
- **Vehículos:** Renault Captur 2021

#### Carlos López
- **Email:** `carlos.lopez@email.com`
- **Contraseña:** `cliente123`
- **Vehículos:** Renault Sandero 2018

#### Ana Martínez
- **Email:** `ana.martinez@email.com`
- **Contraseña:** `cliente123`
- **Vehículos:** Renault Logan 2019

#### Roberto Silva
- **Email:** `roberto.silva@email.com`
- **Contraseña:** `cliente123`
- **Vehículos:** Renault Duster 2020

## 🔐 Sistema de Autenticación

### Roles de Usuario

#### **Cliente**
- Registro de vehículos personales
- Creación y gestión de reservas
- Visualización de historial de servicios
- Edición de perfil personal

#### **Administrador**
- Acceso completo al sistema
- Gestión de todos los usuarios
- Administración de vehículos del sistema
- Gestión de reservas global
- Panel de estadísticas

### Funcionalidades por Rol

| Funcionalidad | Cliente | Admin |
|---------------|---------|-------|
| Registro de vehículos | ✅ Propios | ✅ Todos |
| Crear reservas | ✅ | ✅ |
| Ver reservas | ✅ Propias | ✅ Todas |
| Gestionar usuarios | ❌ | ✅ |
| Panel de administración | ❌ | ✅ |
| Estadísticas del sistema | ❌ | ✅ |

## 🚗 Gestión de Vehículos

### Estados de Vehículo
- **Registrado:** Vehículo recién agregado
- **Activo:** Vehículo disponible para reservas
- **Inactivo:** Vehículo temporalmente no disponible

### Funcionalidades
- Registro de vehículos con datos completos
- Cambio de estado de vehículos
- Eliminación de vehículos
- Filtrado y búsqueda

## 📅 Sistema de Reservas

### Estados de Reserva
- **Pendiente:** Reserva creada, pendiente de confirmación
- **Confirmado:** Reserva confirmada por el administrador
- **Completado:** Servicio realizado
- **Cancelado:** Reserva cancelada

### Características del Calendario
- Navegación entre meses
- Días pasados no seleccionables
- Marcado de días con reservas existentes
- Selección de horarios disponibles
- Validaciones en tiempo real

### Horarios Disponibles
- **Mañana:** 08:00, 09:00, 10:00, 11:00, 12:00
- **Tarde:** 14:00, 15:00, 16:00, 17:00, 18:00

### Servicios Ofrecidos
- Cambio de Aceite
- Limpieza de Filtro
- Cambio de Bujías
- Revisión General
- Frenos y Suspensión
- Sistema Eléctrico
- Aire Acondicionado
- Diagnóstico Computarizado

## 🛠️ Panel de Administración

### Funcionalidades Principales
- **Dashboard** con estadísticas del sistema
- **Gestión de Usuarios** - Búsqueda, edición, eliminación
- **Gestión de Vehículos** - Vista completa del sistema
- **Gestión de Reservas** - Administración global
- **Estadísticas** en tiempo real

### Acceso al Panel
1. Iniciar sesión como administrador
2. Navegar a "Panel de Administración" desde el menú
3. Acceder a las diferentes secciones según necesidad

## 📱 Interfaz de Usuario

### Diseño Responsive
- **Desktop:** Layout completo con sidebar
- **Tablet:** Adaptación de columnas
- **Mobile:** Navegación optimizada

### Paleta de Colores
- **Fondo:** Negro (#000000)
- **Texto:** Blanco (#FFFFFF)
- **Acentos:** Amarillo Renault (#FFD700)
- **Estados:** Verde (éxito), Rojo (error), Amarillo (advertencia)

## 🔧 Herramientas de Desarrollo

### DevTools (Solo Administradores)
- **Ubicación:** Botón de engranaje en esquina inferior derecha
- **Funcionalidades:**
  - Cambio dinámico de roles
  - Visualización de datos del sistema
  - Limpieza de localStorage
  - Información de debug

## 📁 Estructura del Proyecto

```
desarrollo-privado-pedro/
├── public/
│   ├── fondo-lubricentro.jpg    # Imagen de fondo principal
│   ├── renault-logo.png         # Logo de Renault
│   └── vite.svg                 # Icono de Vite
├── src/
│   ├── assets/                  # Recursos estáticos
│   │   └── react.svg            # Icono de React
│   ├── components/              # Componentes reutilizables
│   │   ├── ContactoForm.jsx     # Formulario de contacto
│   │   ├── DevTools.jsx         # Herramientas de desarrollo (solo admin)
│   │   ├── EditUserModal.jsx    # Modal para editar usuarios
│   │   ├── ErrorBoundary.jsx    # Manejo de errores
│   │   ├── Footer.jsx           # Pie de página
│   │   ├── FormularioReserva.jsx # Formulario de reserva
│   │   ├── Layout.jsx           # Layout principal
│   │   ├── Navbar.jsx           # Barra de navegación con roles
│   │   ├── ReservaItem.jsx      # Item individual de reserva
│   │   └── UserDetailsModal.jsx # Modal de detalles de usuario
│   ├── config/                  # Configuraciones
│   │   └── api.js               # Configuración de API
│   ├── context/                 # Contexto de React
│   │   └── AuthContext.jsx      # Contexto de autenticación y gestión
│   ├── hooks/                   # Hooks personalizados
│   │   ├── useFetch.js          # Hook para peticiones HTTP
│   │   ├── useHistorial.js      # Hook para historial de vehículos
│   │   ├── useLocalStorageSync.js # Hook para sincronización
│   │   ├── useReservas.js       # Hook para gestión de reservas
│   │   ├── useReservasSync.js   # Hook para sincronización de reservas
│   │   ├── useServicios.js      # Hook para servicios
│   │   ├── useUsuarios.js       # Hook para gestión de usuarios
│   │   └── useVehiculos.js      # Hook para gestión de vehículos
│   ├── pages/                   # Páginas principales
│   │   ├── AdminPanel.jsx       # Panel de administración completo
│   │   ├── BuscarUsuarios.jsx   # Búsqueda y gestión de usuarios
│   │   ├── Contacto.jsx         # Página de contacto
│   │   ├── GestionReservas.jsx  # Gestión de reservas (ADMIN)
│   │   ├── GestionVehiculos.jsx # Gestión de vehículos (ADMIN)
│   │   ├── HistorialVehiculo.jsx # Historial de servicios del vehículo
│   │   ├── HomePage.jsx         # Página de inicio
│   │   ├── Login.jsx            # Formulario de inicio de sesión
│   │   ├── MiPerfil.jsx         # Perfil del usuario
│   │   ├── MisReservas.jsx      # Reservas del usuario (CLIENTES)
│   │   ├── MisVehiculos.jsx     # Gestión de vehículos del usuario
│   │   ├── Productos.jsx        # Catálogo de productos
│   │   ├── RecuperarContraseña.jsx # Recuperación de contraseña
│   │   ├── Registro.jsx         # Formulario de registro de usuarios
│   │   ├── RegistrarServicio.jsx # Registro de servicios realizados
│   │   ├── Reservar.jsx         # Reserva de turnos (CLIENTES)
│   │   ├── Reservas.jsx         # Vista de reservas (ADMIN)
│   │   └── Servicios.jsx        # Catálogo de servicios
│   ├── services/                # Servicios de API
│   │   └── apiService.js        # Servicios de comunicación con API
│   ├── utils/                   # Utilidades
│   │   └── dateUtils.js         # Utilidades para manejo de fechas
│   ├── App.jsx                  # Componente principal con rutas
│   ├── index.css                # Estilos globales
│   └── main.jsx                 # Punto de entrada
├── .gitignore                   # Archivos ignorados por Git
├── eslint.config.js             # Configuración de ESLint
├── index.html                   # Archivo HTML principal
├── package.json                 # Dependencias del proyecto
├── package-lock.json            # Lock de dependencias
└── vite.config.js              # Configuración de Vite
```

## 🚀 Tecnologías Utilizadas

- **Frontend:** React 18 + Vite
- **Estilos:** Bootstrap 5 + CSS personalizado
- **Estado:** React Context API
- **Navegación:** React Router DOM
- **Iconos:** Bootstrap Icons
- **Almacenamiento:** localStorage

## 📋 Funcionalidades Destacadas

### Para Clientes
- ✅ Registro y autenticación
- ✅ Gestión de vehículos personales
- ✅ Creación de reservas con calendario
- ✅ Visualización de historial
- ✅ Edición de perfil

### Para Administradores
- ✅ Panel de control completo
- ✅ Gestión de usuarios del sistema
- ✅ Administración de vehículos
- ✅ Gestión de reservas global
- ✅ Estadísticas del sistema
- ✅ Herramientas de desarrollo

## 🎯 Casos de Uso

### Cliente Nuevo
1. Registrarse en el sistema
2. Agregar vehículos personales
3. Crear primera reserva
4. Gestionar reservas futuras

### Cliente Existente
1. Iniciar sesión
2. Ver reservas activas
3. Crear nuevas reservas
4. Gestionar vehículos

### Administrador
1. Iniciar sesión como admin
2. Acceder al panel de administración
3. Gestionar usuarios y vehículos
4. Administrar reservas del sistema
5. Revisar estadísticas

## 🔒 Seguridad

- Autenticación basada en roles
- Validaciones en frontend
- Persistencia segura en localStorage
- Acceso restringido a funcionalidades administrativas

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

---

**Desarrollado para Lubricentro Renault** 🚗
