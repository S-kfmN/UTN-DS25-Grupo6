import { Container, Row, Col, Card } from 'react-bootstrap';
import '../assets/styles/productos.css';

export default function Productos() {
  return (
    <main className="productos-seccion-contenido">
      <h1>Nuestros Productos</h1>
      <p>Disponemos de una amplia gama de aceites, filtros y aditivos para tu vehículo.</p>
      
      <div className="productos-contenedor-tarjetas">
        <div className="productos-tarjeta-producto">
          <h2>Aceite Premium</h2>
          <p>Aceite sintético de alto rendimiento ideal para motores Renault.</p>
        </div>
        
        <div className="productos-tarjeta-producto">
          <h2>Filtro de Aceite</h2>
          <p>Filtros originales que garantizan la pureza del aceite del motor.</p>
        </div>
        
        <div className="productos-tarjeta-producto">
          <h2>Aditivo Protector</h2>
          <p>Extiende la vida útil del motor protegiendo sus componentes internos.</p>
        </div>
      </div>
    </main>
  );
}