import ContactoForm from "../components/ContactoForm";

export default function Contacto() {
  return (
    <main className="contenido">
      <h1>Datos de Contacto</h1>
      <p><b>Dirección:</b> Av. Santa Fe 1860, Buenos Aires, Argentina</p>
      <p><b>Teléfono:</b> (011) 4813-6052</p>
      <p><b>Email:</b> contacto@elateneo.com.ar</p>

      <ContactoForm />
    </main>
  );
}