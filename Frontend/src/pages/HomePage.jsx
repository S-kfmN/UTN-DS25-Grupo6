import { Link } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto";
import Testimonios from "../components/Testimonios";
import ServicioItem from "../components/ServicioItem";
export default function HomePage() {
  return (
    <section className="hero">
      <h1>Bienvenido a Lubricentro Renault</h1>
      <p>Gestiona tus turnos de manera fácil y rápida.</p>

      <Link to="/reservar" className="btn-principal">Reservar Ahora</Link>

      <div className="botones-secundarios">
        <Link to="/productos" className="btn-secundario">Ofertas</Link>
        <Link to="/servicios" className="btn-secundario">Servicios</Link>
        <button
          className="btn-secundario"
          onClick={() => {
            const seccion = document.getElementById("testimonios");
            seccion?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Testimonios
        </button>
      </div>

      {/* Sección Productos */}
      <section className="productos">
        <h2>Nuestros Productos</h2>
        <div className="grid-productos">
          <TarjetaProducto titulo="Aceite Sintético" descripcion="Alta calidad para motores Renault." />
          <TarjetaProducto titulo="Filtro de Aceite" descripcion="Filtrado eficiente y duradero." />
          <TarjetaProducto titulo="Bujías de Encendido" descripcion="Mejora la combustión del motor." />
        </div>
        <Link to="/productos" className="btn-principal">Ver Más</Link>
      </section>



      {/* Sección Servicios */}
      <section className="servicios">
        <h2>Servicios Ofrecidos</h2>
          <div className="grid-servicios">
            <ServicioItem titulo="Cambio de Aceite" descripcion="Servicio rápido y seguro con aceites de calidad." />
            <ServicioItem titulo="Limpieza de Filtro" descripcion="Elimina impurezas del sistema de lubricación." />
            <ServicioItem titulo="Revisión de Niveles" descripcion="Chequeo completo de fluidos esenciales." />
          </div>        
        <Link to="/servicios" className="btn-principal">Consultar</Link>
      </section>

      <section className="testimonios" id="testimonios">
        <Testimonios />
      </section>
    </section>
  );
}