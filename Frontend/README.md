#  Lubricentro Renault - Sistema de Reservas

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

##  Instalación y Uso

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

### Tecnologías Utilizadas
- **Frontend**: React 18
- **Build Tool**: Vite
- **CSS Framework**: Bootstrap 5
- **Estilos**: CSS personalizado con variables CSS
- **Routing**: React Router DOM
- **Iconos**: Bootstrap Icons
- **Estado**: React Context API
- **Persistencia**: localStorage (simulación de backend) 