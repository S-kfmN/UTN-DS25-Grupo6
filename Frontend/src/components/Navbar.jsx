import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function NavbarComponent() {
  const { usuario, cerrarSesion, estaAutenticado, esAdmin } = usarAuth();
  const navigate = useNavigate();
  
  // Determinar si el navbar debe estar centrado
  const shouldCenter = !estaAutenticado() || (estaAutenticado() && !esAdmin());

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container>
        {/* Logo y marca */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src="/renault-logo.png" 
            alt="Logo Renault" 
            className="me-2" 
            style={{ height: '40px' }}
          />
          <span className="fw-bold">Lubricentro Renault</span>
        </Navbar.Brand>

        {/* Botón hamburguesa para móviles */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navegación */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className={`navbar-nav-container ${shouldCenter ? 'navbar-centered' : ''}`}>
            {/* Enlaces principales - siempre visibles */}
            <div className="navbar-main-links">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/servicios">Servicios</Nav.Link>
              <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            </div>
            
            {/* Enlaces específicos del usuario autenticado */}
            {estaAutenticado() && (
              <div className="navbar-user-links">
                <Nav.Link as={Link} to="/reservar">Reservar Turno</Nav.Link>
                
                {/* Enlace al panel de administración para admins */}
                {esAdmin() && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin"
                    className="navbar-admin-link"
                  >
                    <i className="bi bi-gear me-1"></i>
                    Panel de control
                  </Nav.Link>
                )}
              </div>
            )}
            
            {/* Sección de autenticación - siempre al final */}
            <div className="navbar-auth-section">
              {estaAutenticado() ? (
                /* Usuario autenticado - Dropdown */
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-light" 
                    id="dropdown-usuario"
                    className="navbar-user-dropdown"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {usuario?.nombre || 'Mi Cuenta'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="navbar-dropdown-menu">
                    <Dropdown.Header className="navbar-dropdown-header">
                      Mi Cuenta
                    </Dropdown.Header>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/mis-vehiculos"
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-car-front me-2"></i>
                      Mis Vehículos
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/mi-perfil"
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/mis-reservas"
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      Mis Reservas
                    </Dropdown.Item>
                    
                    {/* Opciones de administración en el dropdown */}
                    {esAdmin() && (
                      <>
                        <Dropdown.Divider className="navbar-dropdown-divider" />
                        <Dropdown.Item 
                          as={Link} 
                          to="/reservas"
                          className="dropdown-item-custom navbar-admin-dropdown-item"
                        >
                          <i className="bi bi-calendar-event me-2"></i>
                          Turnos de Hoy
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          to="/gestion-reservas"
                          className="dropdown-item-custom navbar-admin-dropdown-item"
                        >
                          <i className="bi bi-funnel me-2"></i>
                          Gestión de Reservas
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          to="/gestion-vehiculos"
                          className="dropdown-item-custom navbar-admin-dropdown-item"
                        >
                          <i className="bi bi-car-front me-2"></i>
                          Gestión de Vehículos
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          to="/buscar-usuarios"
                          className="dropdown-item-custom navbar-admin-dropdown-item"
                        >
                          <i className="bi bi-people me-2"></i>
                          Buscar Usuarios
                        </Dropdown.Item>
                      </>
                    )}
                    
                    <Dropdown.Divider className="navbar-dropdown-divider" />
                    
                    <Dropdown.Item 
                      onClick={() => {
                        cerrarSesion();
                        navigate('/login');
                      }}
                      className="dropdown-item-custom navbar-logout-item"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                /* Usuario no autenticado - Botones */
                <div className="navbar-auth-buttons">
                  <Button 
                    as={Link} 
                    to="/registro" 
                    variant="outline-light" 
                    size="md"
                    className="navbar-register-btn"
                  >
                    Registrarse
                  </Button>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="light" 
                    size="sm"
                    className="navbar-login-btn"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}