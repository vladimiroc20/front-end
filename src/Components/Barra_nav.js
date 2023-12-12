import React from 'react';
import '/home/vladimir/Cotizador/front-end/src/Styles/Barra_nav.css';
import image from '/home/vladimir/Cotizador/front-end/src/image/HC logo .png';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

function Navbar() {
  return (
    <header className="header">
      <div className="logo">
        <img src={image} alt="logo" className="logo" />
      </div>

      <nav>
        <ul className="nav-links">
          <li>
            <Link to="Inicio">Inicio</Link>
          </li>
          <li>
            <Link to="/Cotizaciones">Cotizaciones</Link>
          </li>
          <li>
            <Link to="/Servicios">Servicios</Link>
          </li>
        </ul>
      </nav>

      {/* Usa Link para redirigir al formulario de creación de cotizaciones */}
      <Link to="/crear-cotizacion" className="btn">
        <button>Nueva cotizacion</button>
      </Link>
    </header>
  );
}

export default Navbar;

