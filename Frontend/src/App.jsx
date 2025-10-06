import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Reservar from "./pages/Reservar";
import Reservas from "./pages/Reservas";
import Contacto from './pages/Contacto';
import Registro from './pages/Registro';
import Login from './pages/Login';
import RecuperarContraseña from './pages/RecuperarContraseña';
import MisVehiculos from './pages/MisVehiculos';
import MiPerfil from './pages/MiPerfil';
import MisReservas from './pages/MisReservas';
import AdminPanel from './pages/AdminPanel';
import GestionarUsuarios from './pages/GestionarUsuarios';
import HistorialVehiculo from "./pages/HistorialVehiculo";
import RegistrarServicio from './pages/RegistrarServicio';
import CrearServicio from './pages/CrearServicio';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute'; // Importar PrivateRoute
import GestionReservas from './pages/GestionReservas';
import GestionVehiculos from './pages/GestionVehiculos';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />

            {/* Rutas privadas para usuarios autenticados */}
            <Route
              path="/reservar"
              element={
                <PrivateRoute>
                  <Reservar />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservas"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <Reservas />
                </PrivateRoute>
              }
            />
            <Route
              path="/mis-vehiculos"
              element={
                <PrivateRoute>
                  <MisVehiculos />
                </PrivateRoute>
              }
            />
            <Route
              path="/mi-perfil"
              element={
                <PrivateRoute>
                  <MiPerfil />
                </PrivateRoute>
              }
            />
            <Route
              path="/mis-reservas"
              element={
                <PrivateRoute>
                  <MisReservas />
                </PrivateRoute>
              }
            />

            {/* Rutas privadas para administradores */}
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/gestion-usuarios"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <GestionarUsuarios />
                </PrivateRoute>
              }
            />
            <Route
              path="/gestion-reservas"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <GestionReservas />
                </PrivateRoute>
              }
            />
            <Route
              path="/gestion-vehiculos"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <GestionVehiculos />
                </PrivateRoute>
              }
            />
            <Route
              path="/crear-servicio"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <CrearServicio />
                </PrivateRoute>
              }
            />
            <Route
              path="/registrar-servicio"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <RegistrarServicio />
                </PrivateRoute>
              }
            />
            <Route
              path="/historial-vehiculo"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <HistorialVehiculo />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}