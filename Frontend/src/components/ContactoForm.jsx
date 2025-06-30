export default function ContactoForm() {
  return (
    <div className="formulario-contenedor">
      <h2>Formulario de Contacto</h2>
      <form className="formulario">
        <div className="grupo-campos">
          <label>Nombre</label>
          <input type="text" required />
        </div>

        <div className="grupo-campos">
          <label>Email</label>
          <input type="email" required />
        </div>

        <div className="grupo-campos">
          <label>Asunto</label>
          <input type="text" required />
        </div>

        <div className="grupo-campos">
          <label>Mensaje</label>
          <textarea rows="4" required></textarea>
        </div>

        <button type="submit" className="boton-principal">
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}