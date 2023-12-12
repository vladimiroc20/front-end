import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/home/vladimir/Cotizador/front-end/src/Styles/ServiciosComponent.css';

function ServiciosComponent() {
  const [servicios, setServicios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const response = await axios.get('http://localhost:3001/servicios');
        const serviciosData = response.data.map(servicio => ({
          idServicio: servicio.idservicio,
          nombreServicio: servicio.nombreservicio,
          valor: servicio.valor,
          activo: servicio.activo,
        }));
        setServicios(serviciosData);
        setServiciosFiltrados(serviciosData);
      } catch (error) {
        console.error('Error al obtener servicios', error);
      }
    };

    obtenerServicios();
  }, []);

  const agregarServicio = () => {
    if (!nombre || !precio) {
      alert('Por favor, ingrese un nombre y un precio para el servicio.');
      return;
    }

    axios.post('http://localhost:3001/servicios', { nombreservicio: nombre, valor: precio })
      .then((response) => {
        const nuevoServicio = {
          idServicio: response.data.idservicio,
          nombreServicio: response.data.nombreservicio,
          valor: response.data.valor,
          activo: response.data.activo,
        };
        setServicios([...servicios, nuevoServicio]);
        setServiciosFiltrados([...serviciosFiltrados, nuevoServicio]);
        setNombre('');
        setPrecio('');
      })
      .catch((error) => {
        console.error('Error al agregar servicio', error);
        alert('Se produjo un error al agregar el servicio.');
      });
  };

  const filtrarServicios = () => {
    const filteredServices = servicios.filter(servicio => servicio.nombreServicio.includes(filtroNombre));
    setServiciosFiltrados(filteredServices);
  };

  const limpiarFiltro = () => {
    setServiciosFiltrados(servicios);
    setFiltroNombre('');
  };

  const activarServicio = (id) => {
    if (id) {
      axios.patch(`http://localhost:3001/servicios/activar/${id}`)
        .then(() => {
          const serviciosActualizados = servicios.map((servicio) => {
            if (servicio.idServicio === id) {
              return { ...servicio, activo: true };
            }
            return servicio;
          });
          setServicios(serviciosActualizados);
          setServiciosFiltrados(serviciosActualizados);
        })
        .catch((error) => {
          console.error('Error al activar servicio', error);
        });
    }
  };

  const desactivarServicio = (id) => {
    if (id) {
      axios.patch(`http://localhost:3001/servicios/desactivar/${id}`)
        .then(() => {
          const serviciosActualizados = servicios.map((servicio) => {
            if (servicio.idServicio === id) {
              return { ...servicio, activo: false };
            }
            return servicio;
          });
          setServicios(serviciosActualizados);
          setServiciosFiltrados(serviciosActualizados);
        })
        .catch((error) => {
          console.error('Error al desactivar servicio', error);
        });
    }
  };

  return (
    <div className="servicios-container">
      <div className="servicios-inputs">
        <input
          type="text"
          className="servicios-input"
          placeholder="Nombre del Servicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          name="NombreServicio"
        />
        <input
          type="text"
          className="servicios-input"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          name="Valor"
        />
        <button className="servicios-button servicios-button-agregar" onClick={agregarServicio}>
          Agregar Servicio
        </button>
      </div>
      <div className="servicios-filters">
        <input
          type="text"
          className="servicios-input"
          placeholder="Filtrar por Nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          name="FiltroNombre"
        />
        <button className="servicios-button servicios-button-filtrar" onClick={filtrarServicios}>
          Filtrar
        </button>
        <button className="servicios-button servicios-button-limpiar" onClick={limpiarFiltro}>
          Limpiar Filtro
        </button>
      </div>
      <table className="servicios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Servicio</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {serviciosFiltrados.map((servicio) => (
            <tr key={servicio.idServicio}>
              <td>{servicio.idServicio}</td>
              <td>{servicio.nombreServicio}</td>
              <td>${servicio.valor}</td>
              <td>
                {servicio.activo ? (
                  <button className="servicios-button servicios-button-activar" onClick={() => desactivarServicio(servicio.idServicio)}>
                    Desactivar
                  </button>
                ) : (
                  <button className="servicios-button servicios-button-desactivar" onClick={() => activarServicio(servicio.idServicio)}>
                    Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiciosComponent;

