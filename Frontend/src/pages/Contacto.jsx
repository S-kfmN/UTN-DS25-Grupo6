import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../assets/styles/contacto.css';

export default function Contacto() {
  return (
    <main className="contacto-contenido">
      <h3>Formulario de Contacto</h3>
      <div className="contacto-separador"></div>
      <form className="contacto-formulario">
        <label>Nombre:</label>
        <input type="text" required />

        <label>Email:</label>
        <input type="email" required />

        <label>Asunto:</label>
        <input type="text" required />

        <label>Mensaje:</label>
        <textarea rows="5" required></textarea>

        <button type="submit" className="contacto-boton-enviar">Enviar mensaje</button>
      </form>
      
      <div className="contacto-datos">
        <h1>Datos de Contacto</h1>
        <p><b>Dirección:</b> Av. Santa Fe 1860, Buenos Aires, Argentina</p>
        <p><b>Teléfono:</b> (011) 4813-6052</p>
        <p><b>Email:</b> contacto@elateneo.com.ar</p>
      </div>
    </main>
  );
}