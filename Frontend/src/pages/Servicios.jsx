import { Container, Row, Col, Card } from 'react-bootstrap';

export default function Servicios() {
  return (
    <main className="seccion-contenido">
      <h1>Servicios</h1>
      <p>Ofrecemos cambios de aceite, limpieza y diagnóstico de motor.</p>
      
      <div className="contenedor-tarjetas">
        <div className="tarjeta-servicio">
          <h2>Cambio de Aceite</h2>
          <p>Servicio rápido y seguro con aceites de la más alta calidad.</p>
        </div>
        
        <div className="tarjeta-servicio">
          <h2>Limpieza de Motor</h2>
          <p>Eliminamos residuos y mejoramos el rendimiento general.</p>
        </div>
        
        <div className="tarjeta-servicio">
          <h2>Diagnóstico Electrónico</h2>
          <p>Detectamos fallas con equipamiento de última generación.</p>
        </div>
      </div>
    </main>
  );
}