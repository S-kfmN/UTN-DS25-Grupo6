import { useState, useEffect } from 'react';
import { Form, Button, Card, Badge, Alert, Row, Col, Modal } from 'react-bootstrap';
import GestionTable from '../components/GestionTable';
import { dividirNombreCompleto } from '../utils/dateUtils';
import { usarAuth } from '../context/AuthContext';
import UserDetailsModal from '../components/UserDetailsModal';
import EditUserModal from '../components/EditUserModal';
import apiService from '../services/apiService';
import '../assets/styles/buscarusuarios.css';

export default function GestionarUsuarios() {
  const { esAdmin, allUsers, allReservations, refrescarUsuario, actualizarUsuario, actualizarEstadoVehiculoGlobal, cargarTodosLosUsuarios, limpiarError } = usarAuth();
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  // Inicializar con allUsers en lugar de usuarios
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(allUsers);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);

  // Cargar todos los usuarios al montar el componente
  useEffect(() => {
    cargarTodosLosUsuarios();
  }, [cargarTodosLosUsuarios]); // Dependencia del contexto para evitar re-renders innecesarios

  // Verificar si el usuario es admin
  if (!esAdmin()) {
    return (
      <div className="buscarusuarios-container">
        <div className="buscarusuarios-header">
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para acceder a esta pagina</p>
        </div>
        <Alert variant="danger" className="buscarusuarios-alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Solo los administradores pueden acceder a esta pagina.
        </Alert>
      </div>
    );
  }

  // Funcion para manejar la busqueda
  const manejarBusqueda = (e) => {
    e.preventDefault();
    const terminoLower = terminoBusqueda.toLowerCase();
    const resultado = allUsers.filter(usuario =>
      (usuario.name?.toLowerCase().includes(terminoLower)) ||
      (usuario.email?.toLowerCase().includes(terminoLower)) ||
      (usuario.phone?.toLowerCase().includes(terminoLower))
    );
    setUsuariosFiltrados(resultado);
  };

  // Actualizar usuarios filtrados cuando cambien los usuarios
  useEffect(() => {
    if (terminoBusqueda) {
      const terminoLower = terminoBusqueda.toLowerCase();
      const resultado = allUsers.filter(usuario =>
        (usuario.name?.toLowerCase().includes(terminoLower)) ||
        (usuario.email?.toLowerCase().includes(terminoLower)) ||
        (usuario.phone?.toLowerCase().includes(terminoLower))
      );
      setUsuariosFiltrados(resultado);
    } else {
      setUsuariosFiltrados(allUsers);
    }
  }, [allUsers, terminoBusqueda]); // buscarUsuarios ya no es una dependencia

  // Funcion para limpiar busqueda
  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setUsuariosFiltrados(allUsers);
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
      // usuarioSeleccionado es el usuario que se está editando
      const resultado = await apiService.updateUserById(usuarioSeleccionado.id, datosActualizados);
      if (resultado && !resultado.error) {
        
        refrescarUsuario();
      } else {
        alert('Error al actualizar usuario: ' + (resultado.error || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error al actualizar usuario: ' + error.message);
    }
  };

  const handleEliminarUsuario = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarConfirmEliminar(true);
  };

  const confirmarEliminarUsuario = async () => {
    if (!usuarioAEliminar) return;
    try {
      await apiService.deleteUserById(usuarioAEliminar.id);
      await cargarTodosLosUsuarios();
      setAlerta({ tipo: 'success', mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      setAlerta({ tipo: 'error', mensaje: 'Error al eliminar usuario' });
    } finally {
      setMostrarConfirmEliminar(false);
      setUsuarioAEliminar(null);
    }
  };

  return (
    <div className="buscarusuarios-container">
      {/* Header */}
      <div className="buscarusuarios-header">
        <h1>Gestionar Usuarios</h1>
        <h3>Busca y gestiona usuarios registrados en el sistema</h3>
      </div>

      {/* Formulario de busqueda */}
      <Card className="buscarusuarios-card-busqueda">
        <Card.Body>
          <Form onSubmit={manejarBusqueda}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="buscarusuarios-form-label">
                    <i className="bi bi-search me-2"></i>
                    Buscar por nombre, apellido, DNI o email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder="Ej: Juan Perez, 12345678, juan@email.com"
                    className="buscarusuarios-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Resultados de busqueda */}
      <div className="buscarusuarios-busqueda-usuarios">
        <div className="buscarusuarios-resultados-header">
          <h3 className="buscarusuarios-resultados-titulo">
            <i className="bi bi-people me-2"></i>
            Resultados ({usuariosFiltrados.length} usuarios)
          </h3>
          {terminoBusqueda && (
            <Badge bg="info" className="buscarusuarios-badge-busqueda">
              Buscando: "{terminoBusqueda}"
            </Badge>
          )}
        </div>

        <GestionTable
          columns={[
            {
              key: 'name',
              label: 'Nombre',
              sortable: true,
              getSortValue: (u) => {
                const { apellido, nombre } = dividirNombreCompleto(u.name || '');
                return `${apellido.toLowerCase()} ${nombre.toLowerCase()}`.trim();
              },
              render: (u) => u.name || '-'
            },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'phone', label: 'Teléfono', sortable: true, width: '160px' },
            {
              key: 'role',
              label: 'Rol',
              sortable: true,
              render: (u) => (
                <Badge bg={u.role === 'ADMIN' ? 'danger' : 'success'} className="fs-6">
                  {u.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </Badge>
              )
            },
            {
              key: 'createdAt',
              label: 'Fecha de registro',
              sortable: true,
              getSortValue: (u) => new Date(u.createdAt).getTime(),
              render: (u) => formatearFecha(u.createdAt)
            }
          ]}
          data={usuariosFiltrados}
          emptyMessage={terminoBusqueda ? `No se encontraron usuarios que coincidan con "${terminoBusqueda}"` : 'No hay usuarios registrados en el sistema'}
          renderActions={(u) => (
            <div className="buscarusuarios-usuario-acciones">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => abrirDetalles(u)}
                title="Ver Detalles"
                className="buscarusuarios-boton-accion buscarusuarios-boton-ver"
              >
                <i className="bi bi-eye"></i>
              </Button>
              <Button 
                variant="outline-warning" 
                size="sm"
                onClick={() => abrirEditar(u)}
                title="Editar Usuario"
                className="buscarusuarios-boton-accion buscarusuarios-boton-editar"
              >
                <i className="bi bi-pencil"></i>
              </Button>
              {u.role === 'USER' && (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleEliminarUsuario(u)}
                  title="Eliminar Usuario"
                  className="buscarusuarios-boton-accion buscarusuarios-boton-eliminar"
                >
                  <i className="bi bi-trash"></i>
                </Button>
              )}
            </div>
          )}
        />
      </div>

      {/* Modales */}
      <UserDetailsModal
        show={mostrarDetalles}
        onHide={cerrarModales}
        usuario={usuarioSeleccionado}
        reservas={allReservations}
      />
      
      <EditUserModal
        show={mostrarEditar}
        onHide={cerrarModales}
        usuario={usuarioSeleccionado}
        onSave={manejarGuardarUsuario}
      />

      <Modal show={mostrarConfirmEliminar} onHide={() => setMostrarConfirmEliminar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar el usuario <b>{usuarioAEliminar?.name}</b>? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminarUsuario}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


