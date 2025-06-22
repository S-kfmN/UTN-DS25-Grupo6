import ReservaItem from "../components/ReservaItem";
export default function Reservas() {
  return (
    <main className="contenido">
      <h1>Mis Reservas</h1>
      <p>Estas son tus reservas registradas:</p>
      <ReservaItem fecha="20/06/2025" servicio="Cambio de Aceite" vehiculo="AB123CD" />
      <ReservaItem fecha="30/06/2025" servicio="Revisión de Niveles" vehiculo="XY987ZT" />
    </main>
  );
}