import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function NavbarComponent() {
  const { usuario, cerrarSesion, estaAutenticado, esAdmin } = usarAuth();
  const navigate = useNavigate();

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
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/servicios">Servicios</Nav.Link>
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            
            {/* Mostrar opciones según si está autenticado o no */}
            {estaAutenticado() ? (
              <>
                {/* Usuario autenticado */}
                <Nav.Link as={Link} to="/reservar">Reservar Turno</Nav.Link>
                
                {/* Enlace al panel de administración para admins */}
                {esAdmin() && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin"
                    style={{ 
                      color: 'var(--color-acento)',
                      fontWeight: 'bold'
                    }}
                  >
                    <i className="bi bi-gear me-1"></i>
                    Panel
                  </Nav.Link>
                )}
                
                {/* Dropdown del usuario */}
                <Dropdown className="ms-3">
                  <Dropdown.Toggle 
                    variant="outline-light" 
                    id="dropdown-usuario"
                    style={{ border: '1px solid var(--color-acento)' }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {usuario?.nombre || 'Mi Cuenta'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu 
                    style={{
                      backgroundColor: 'var(--color-gris)',
                      border: '1px solid var(--color-acento)'
                    }}
                  >
                    <Dropdown.Header style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                      Mi Cuenta
                    </Dropdown.Header>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/mis-vehiculos"
                      style={{ color: 'var(--color-texto)' }}
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-car-front me-2"></i>
                      Mis Vehículos
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/mi-perfil"
                      style={{ color: 'var(--color-texto)' }}
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/mis-reservas"
                      style={{ color: 'var(--color-texto)' }}
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      Mis Reservas
                    </Dropdown.Item>
                    
                    {/* Opción de administración en el dropdown */}
                    {esAdmin() && (
                      <>
                        <Dropdown.Divider style={{ borderColor: 'var(--color-acento)' }} />
                        <Dropdown.Item 
                          as={Link} 
                          to="/admin"
                          style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}
                          className="dropdown-item-custom"
                        >
                          <i className="bi bi-gear me-2"></i>
                          Panel de Control
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          to="/reservas"
                          style={{ color: 'var(--color-acento)' }}
                          className="dropdown-item-custom"
                        >
                          <i className="bi bi-calendar-event me-2"></i>
                          Turnos de Hoy
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          to="/gestion-reservas"
                          style={{ color: 'var(--color-acento)' }}
                          className="dropdown-item-custom"
                        >
                          <i className="bi bi-funnel me-2"></i>
                          Gestión de Reservas
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          to="/gestion-vehiculos"
                          style={{ color: 'var(--color-acento)' }}
                          className="dropdown-item-custom"
                        >
                          <i className="bi bi-car-front me-2"></i>
                          Gestión de Vehículos
                        </Dropdown.Item>
                        <Dropdown.Item 
                          as={Link} 
                          to="/buscar-usuarios"
                          style={{ color: 'var(--color-acento)' }}
                          className="dropdown-item-custom"
                        >
                          <i className="bi bi-people me-2"></i>
                          Buscar Usuarios
                        </Dropdown.Item>
                      </>
                    )}
                    
                    <Dropdown.Divider style={{ borderColor: 'var(--color-acento)' }} />
                    
                    <Dropdown.Item 
                      onClick={() => {
                        cerrarSesion();
                        navigate('/login');
                      }}
                      style={{ color: '#dc3545' }}
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                {/* Usuario no autenticado */}
                <div className="d-flex align-items-center ms-3">
                  <Button 
                    as={Link} 
                    to="/registro" 
                    variant="outline-light" 
                    size="sm"
                    className="me-2"
                    style={{
                      width: '120px',
                      height: '40px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    Registrarse
                  </Button>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="light" 
                    size="sm"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}