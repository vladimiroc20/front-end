import React, { useState, useEffect } from 'react';
import '/home/vladimir/Cotizador/front-end/src/Styles/Cotizaciones.css';
import axios from 'axios';

function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [fechaFiltrada, setFechaFiltrada] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (fechaFiltrada) {
          response = await axios.get(`http://localhost:3001/cotizacionesPorFecha?fecha=${fechaFiltrada}`);
        } else {
          response = await axios.get('http://localhost:3001/cotizaciones');
        }
        setCotizaciones(response.data);
      } catch (error) {
        setError('Error al obtener cotizaciones');
        console.error('Error al obtener cotizaciones', error);
      }
    };
    fetchData();
  }, [fechaFiltrada]);

  const handleVerReporteClick = (id) => {
    alert(`Ver reportes de la cotización con ID ${id}`);
  };

  if (error) {
    return (
      <div className="cotizaciones-error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="cotizaciones-container">
      <div className="cotizaciones-filter-container">
        <input
          type="date"
          value={fechaFiltrada}
          onChange={(e) => setFechaFiltrada(e.target.value)}
        />
        <button className="cotizaciones-clear-button" onClick={() => setFechaFiltrada('')}>Limpiar Filtro</button>
      </div>
      <div className="cotizaciones-table-container">
        <table className="cotizaciones-table">
          <thead>
            <tr>
              <th className="cotizaciones-id">ID</th>
              <th className="cotizaciones-cotizador">Cotizador</th>
              <th className="cotizaciones-cliente">Cliente</th>
              <th className="cotizaciones-valor">Valor</th>
              <th className="cotizaciones-fecha">Fecha</th>
              <th className="cotizaciones-action"></th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((cotizacion, index) => (
              <tr key={index}>
                <td className="cotizaciones-id">{cotizacion.idcotizacion}</td>
                <td className="cotizaciones-cotizador">{cotizacion.cotizador}</td>
                <td className="cotizaciones-cliente">{cotizacion.cliente}</td>
                <td className="cotizaciones-valor">{cotizacion.valor}</td>
                <td className="cotizaciones-fecha">{cotizacion.fecha}</td>
                <td className="cotizaciones-action">
                  <span
                    className="cotizaciones-ver-reporte"
                    onClick={() => handleVerReporteClick(cotizacion.idcotizacion)}
                  >
                    👁️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cotizaciones;
