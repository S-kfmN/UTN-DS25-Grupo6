export default function FormularioReserva() {
  return (
    <div className="formulario-contenedor">
      <h2>Formulario de Reserva</h2>
      <form className="formulario-reserva">
        <div className="grupo-campos">
          <label>Nombre Completo</label>
          <input type="text" required />
        </div>

        <div className="grupo-campos">
          <label>Teléfono</label>
          <input type="tel" required />
        </div>

        <div className="grupo-campos">
          <label>DNI</label>
          <input type="text" required />
        </div>

        <div className="grupo-campos">
          <label>Servicio</label>
          <select required>
            <option value="" disabled>—Tipo Servicio—</option>
            <option value="aceite">Cambio de Aceite</option>
            <option value="filtro">Limpieza de Filtro</option>
            <option value="niveles">Revisión de Niveles</option>
          </select>
        </div>

        <div className="grupo-campos">
          <label>Fecha</label>
          <input type="date" required />
        </div>

        <div className="grupo-campos">
          <label>Patente del vehículo</label>
          <input type="text" required />
        </div>

        <div className="contenedor-botones-formulario">
          <button type="reset">Limpiar</button>
          <button type="submit" className="boton-principal">Confirmar Reserva</button>
        </div>
      </form>
    </div>
  );
}