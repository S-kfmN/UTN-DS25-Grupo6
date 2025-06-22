import ServicioItem from "../components/ServicioItem";
export default function Servicios() {
  return (
    <main className="contenido">
      <h1>Servicios</h1>
      <p>Ofrecemos cambios de aceite, limpieza y diagnóstico de motor.</p>
      <section className="tarjeta-grid">
        <ServicioItem titulo="Cambio de Aceite" descripcion="Servicio rápido y seguro con aceites de la más alta calidad." />
        <ServicioItem titulo="Limpieza de Motor" descripcion="Eliminamos residuos y mejoramos el rendimiento general." />
        <ServicioItem titulo="Diagnóstico Electrónico" descripcion="Detectamos fallas con equipamiento de última generación." />
      </section>
    </main>
  );
}