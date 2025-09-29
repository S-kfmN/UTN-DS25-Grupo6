import { Link } from "react-router-dom";
import { usarAuth } from "../context/AuthContext";
import '../assets/styles/home.css';

export default function HomePage() {
  const { estaAutenticado } = usarAuth();
  const destinoReserva = estaAutenticado() ? "/reservar" : "/registro";
  // Función para hacer scroll suave a testimonios
  const scrollToTestimonios = () => {
    const seccion = document.getElementById("testimonios");
    seccion?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Sección Principal con imagen de fondo */}
      <section className="seccion-principal">
        <h1>Bienvenido a Lubricentro Renault</h1>
        <p>Gestiona tus turnos de manera fácil y rápida.</p>
        
        <Link to={destinoReserva} className="boton-principal">
          Reservar Ahora
        </Link>

        <div className="contenedor-botones-secundarios">
          <Link to="/productos" className="boton-secundario">
            Ofertas
          </Link>
          <Link to="/servicios" className="boton-secundario">
            Servicios
          </Link>
          <button className="boton-secundario" onClick={scrollToTestimonios}>
            Testimonios
          </button>
        </div>
      </section>

      {/* Sección Productos */}
      <section className="seccion-contenido">
        <h2>Nuestros Productos</h2>
        <div className="contenedor-grid">
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-titulo">Aceite Sintético</div>
            </div>
          </div>
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-titulo">Filtro de Aceite</div>
            </div>
          </div>
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-titulo">Bujías de Encendido</div>
            </div>
          </div>
        </div>
        <Link to="/productos" className="boton-principal">Ver Más</Link>
      </section>

      {/* Sección Servicios */}
      <section className="seccion-contenido">
        <h2>Servicios Ofrecidos</h2>
        <div className="contenedor-grid">
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-titulo">Cambio de Aceite</div>
            </div>
          </div>
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-titulo">Limpieza de Filtro</div>
            </div>
          </div>
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-titulo">Revisión de Niveles</div>
            </div>
          </div>
        </div>
        <Link to="/servicios" className="boton-principal">Consultar</Link>
      </section>

      {/* Sección Testimonios */}
      <section className="seccion-contenido" id="testimonios">
        <h2>Testimonios de Clientes</h2>
        <div className="contenedor-grid">
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-texto">"Excelente atención y rapidez"</div>
            </div>
          </div>
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-texto">"Muy profesional, lo recomiendo"</div>
            </div>
          </div>
          <div className="tarjeta">
            <div className="tarjeta-contenido">
              <div className="tarjeta-texto">"Volveré sin dudas"</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}