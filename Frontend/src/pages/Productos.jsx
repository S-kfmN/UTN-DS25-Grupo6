import TarjetaProducto from "../components/TarjetaProducto";

export default function Productos() {
  return (
    <main className="contenido">
      <h1>Nuestros Productos</h1>
      <p>Disponemos de una amplia gama de aceites, filtros y aditivos para tu vehículo.</p>
      <section className="tarjeta-grid">
        <TarjetaProducto titulo="Aceite Premium" descripcion="Aceite sintético de alto rendimiento ideal para motores Renault." />
        <TarjetaProducto titulo="Filtro de Aceite" descripcion="Filtros originales que garantizan la pureza del aceite del motor." />
        <TarjetaProducto titulo="Aditivo Protector" descripcion="Extiende la vida útil del motor protegiendo sus componentes internos." />
      </section>
    </main>
  );
}