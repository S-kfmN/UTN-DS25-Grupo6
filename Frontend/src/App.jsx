import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Reservar from "./pages/Reservar";
import Contacto from './pages/Contacto';
import Reservas from "./pages/Reservas";

import './App.css';


export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/reservar" element={<Reservar />} /> 
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/reservas" element={<Reservas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}