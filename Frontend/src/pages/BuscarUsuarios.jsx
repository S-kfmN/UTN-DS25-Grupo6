import { useState, useEffect } from 'react';
import { Form, Button, Card, Badge, Alert, Row, Col } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';
import { useLocalStorageSync } from '../hooks/useLocalStorageSync';
import UserDetailsModal from '../components/UserDetailsModal';
import EditUserModal from '../components/EditUserModal';

export default function BuscarUsuarios() {
  const { esAdmin, usuarios, reservas, buscarUsuarios, refrescarUsuario, actualizarUsuario, actualizarEstadoVehiculoGlobal } = usarAuth();
  
  // Sincronizar datos del localStorage
  useLocalStorageSync();
  
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Verificar si el usuario es admin
  if (!esAdmin()) {
    return (
      <div className="contenedor-admin-reservas">
        <div className="header-admin-reservas">
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para acceder a esta pagina</p>
        </div>
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Solo los administradores pueden acceder a esta pagina.
        </Alert>
      </div>
    );
  }

  // Funcion para manejar la busqueda
  const manejarBusqueda = (e) => {
    e.preventDefault();
    const resultado = buscarUsuarios(terminoBusqueda);
    setUsuariosFiltrados(resultado);
  };

  // Actualizar usuarios filtrados cuando cambien los usuarios
  useEffect(() => {
    if (terminoBusqueda) {
      const resultado = buscarUsuarios(terminoBusqueda);
      setUsuariosFiltrados(resultado);
    } else {
      setUsuariosFiltrados(usuarios);
    }
  }, [usuarios, terminoBusqueda, buscarUsuarios]);

  // Funcion para limpiar busqueda
  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setUsuariosFiltrados(usuarios);
  };

  // Funcion para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Funciones para manejar modales
  const abrirDetalles = (usuario) => {

    setUsuarioSeleccionado(usuario);
    setMostrarDetalles(true);
  };

  const abrirEditar = (usuario) => {

    setUsuarioSeleccionado(usuario);
    setMostrarEditar(true);
  };

  const cerrarModales = () => {
    setMostrarDetalles(false);
    setMostrarEditar(false);
    setUsuarioSeleccionado(null);
  };

  const manejarGuardarUsuario = async (datosActualizados) => {
    try {
      const resultado = await actualizarUsuario(datosActualizados);
      if (resultado.exito) {
        alert('Usuario actualizado exitosamente');
        refrescarUsuario();
      } else {
        alert('Error al actualizar usuario: ' + resultado.error);
      }
    } catch (error) {
      alert('Error al actualizar usuario: ' + error.message);
    }
  };

  return (
    <div className="contenedor-admin-reservas">
      {/* Header */}
      <div className="header-admin-reservas">
        <div className="d-flex justify-content-between align-items-center">
          <div>
        <h1>Buscar Usuarios</h1>
        <p>Busca y gestiona usuarios registrados en el sistema</p>
          </div>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => {
              // Forzar actualización de usuarios
              refrescarUsuario();
            }}
            style={{
              borderColor: 'var(--color-acento)',
              color: 'var(--color-acento)',
              fontSize: '0.8rem'
            }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refrescar Usuarios
          </Button>
        </div>
      </div>

      {/* Formulario de busqueda */}
      <Card style={{
        backgroundColor: 'var(--color-gris)',
        border: '1px solid var(--color-acento)',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <Card.Body>
          <Form onSubmit={manejarBusqueda}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-acento)', fontWeight: 'bold' }}>
                    <i className="bi bi-search me-2"></i>
                    Buscar por nombre, apellido, DNI o email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder="Ej: Juan Perez, 12345678, juan@email.com"
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <div className="d-grid gap-2 w-100">
                  <Button 
                    type="submit" 
                    variant="warning"
                    className="mb-2"
                  >
                    <i className="bi bi-search me-2"></i>
                    Buscar
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline-secondary"
                    onClick={limpiarBusqueda}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Limpiar
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Resultados de busqueda */}
      <div className="busqueda-usuarios">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 style={{ color: 'var(--color-acento)' }}>
            <i className="bi bi-people me-2"></i>
            Resultados ({usuariosFiltrados.length} usuarios)
          </h3>
          {terminoBusqueda && (
            <Badge bg="info" className="fs-6">
              Buscando: "{terminoBusqueda}"
            </Badge>
          )}
        </div>

        <div className="resultados-usuarios">
          {usuariosFiltrados.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              {terminoBusqueda 
                ? `No se encontraron usuarios que coincidan con "${terminoBusqueda}"`
                : 'No hay usuarios registrados en el sistema'
              }
            </Alert>
          ) : (
            <div className="d-flex flex-column gap-3">
            {usuariosFiltrados.map(usuario => (
              <div key={usuario.id} className="usuario-card">
                <div className="usuario-header">
                  <div className="usuario-nombre">
                    <strong>{usuario.nombre} {usuario.apellido}</strong>
                  </div>
                  <div className="usuario-rol">
                    <Badge bg={usuario.rol === 'admin' ? 'danger' : 'success'}>
                      {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
                    </Badge>
                  </div>
                </div>
                
                <div className="usuario-info">
                  <div className="cliente-info">
                    <Row className="g-2">
                      <Col md={3}>
                        <p><strong>Email:</strong> {usuario.email}</p>
                        <p><strong>Telefono:</strong> {usuario.telefono}</p>
                      </Col>
                      <Col md={3}>
                        <p><strong>DNI:</strong> {usuario.dni}</p>
                        <p><strong>Fecha de registro:</strong> {formatearFecha(usuario.fechaRegistro)}</p>
                      </Col>
                      <Col md={6} className="d-flex align-items-center justify-content-end">
                        <div className="usuario-acciones">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => abrirDetalles(usuario)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Detalles
                          </Button>
                          <Button 
                            variant="outline-warning" 
                            size="sm"
                            onClick={() => abrirEditar(usuario)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Editar
                          </Button>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            onClick={() => abrirDetalles(usuario)}
                          >
                            <i className="bi bi-calendar me-1"></i>
                            Ver Reservas
                          </Button>
                          {usuario.rol === 'cliente' && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`¿Estás seguro de que quieres eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
                                  alert(`Función de eliminar usuario - En desarrollo`);
                                }
                              }}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Modales */}
      <UserDetailsModal
        show={mostrarDetalles}
        onHide={cerrarModales}
        usuario={usuarioSeleccionado}
        reservas={reservas}
      />
      
      <EditUserModal
        show={mostrarEditar}
        onHide={cerrarModales}
        usuario={usuarioSeleccionado}
        onSave={manejarGuardarUsuario}
      />
    </div>
  );
} 