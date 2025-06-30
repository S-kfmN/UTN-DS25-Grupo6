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
import { AuthProvider } from './context/AuthContext';

import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/reservar" element={<Reservar />} /> 
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
            <Route path="/mis-vehiculos" element={<MisVehiculos />} />
            <Route path="/mi-perfil" element={<MiPerfil />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}