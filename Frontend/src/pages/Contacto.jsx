import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

export default function Contacto() {
  return (
    <main className="seccion-contenido">
      <h1>Datos de Contacto</h1>
      <p><b>Dirección:</b> Av. Santa Fe 1860, Buenos Aires, Argentina</p>
      <p><b>Teléfono:</b> (011) 4813-6052</p>
      <p><b>Email:</b> contacto@elateneo.com.ar</p>

      <h3>Formulario de Contacto</h3>
      <form className="formulario">
        <label>Nombre:</label>
        <input type="text" required />

        <label>Email:</label>
        <input type="email" required />

        <label>Asunto:</label>
        <input type="text" required />

        <label>Mensaje:</label>
        <textarea rows="5" required></textarea>

        <button type="submit" className="boton-principal">Enviar mensaje</button>
      </form>
    </main>
  );
}