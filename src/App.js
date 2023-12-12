import './App.css';
import Navbar from './Components/Barra_nav';
import Cotizaciones from './Components/Cotizaciones';
import CarouselComponent from '/home/vladimir/Cotizador/front-end/src/Components/Carousel.js';
import ServiciosComponent from '/home/vladimir/Cotizador/front-end/src/Components/ServiciosComponent.js';
import CotizacionForm from './Components/CotizacionForm';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar /> {/* Barra de navegación */}
      <Routes>
        <Route path="/" element={<CarouselComponent />} />
        <Route path="Inicio" element={<CarouselComponent />} />
        <Route path="Cotizaciones" element={<Cotizaciones />} />
        <Route path="Servicios" element={<ServiciosComponent />} />
        <Route path="/crear-cotizacion" element={<CotizacionForm />} />
      </Routes>
    </>
  );
}

export default App;
