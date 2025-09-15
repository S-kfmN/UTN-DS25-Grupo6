export default function ReservaItem({ fecha, servicio, vehiculo }) {
  return (
    <div className="item-reserva">
      <div className="info-reserva">
        <p><strong>Fecha:</strong> {fecha}</p>
        <p><strong>Servicio:</strong> {servicio}</p>
        <p><strong>Vehículo:</strong> {vehiculo}</p>
      </div>
    </div>
  );
}