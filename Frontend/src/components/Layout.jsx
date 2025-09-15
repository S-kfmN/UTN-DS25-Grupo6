import NavbarComponent from './Navbar';
import Footer from './Footer';
import DevTools from './DevTools';

export default function Layout({ children }) {
  return (
    <div className="layout-fondo">
      <div className="layout-overlay">
        <NavbarComponent />
        <main className="contenido-principal">
          {children}
        </main>
        <Footer />
        <DevTools />
      </div>
    </div>
  );
}