import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import '/home/vladimir/Cotizador/front-end/src/Styles/CotizacionForm.css';

function CotizacionForm() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('nit');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombreCotizador, setNombreCotizador] = useState('');
  const [correoEncargado, setCorreoEncargado] = useState(''); // Cambiado el estado a 'correoEncargado'
  const [usuariosEncargados, setUsuariosEncargados] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [reporteGenerado, setReporteGenerado] = useState('');

  useEffect(() => {
    const cargarServiciosActivos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/servicios-activos');
        setServiciosDisponibles(response.data);
      } catch (error) {
        console.error('Error al cargar servicios activos:', error);
      }
    };

    const cargarUsuariosEncargados = async () => {
      try {
        const response = await axios.get('http://localhost:3001/usuarios-encargados');
        setUsuariosEncargados(response.data);
      } catch (error) {
        console.error('Error al cargar usuarios encargados:', error);
      }
    };

    cargarServiciosActivos();
    cargarUsuariosEncargados();
  }, []);

  const handleModificarCantidad = (servicioId, nuevaCantidad) => {
    const carritoActualizado = serviciosSeleccionados.map((servicio) => {
      if (servicio.id === servicioId) {
        servicio.cantidad = nuevaCantidad;
      }
      return servicio;
    });

    setServiciosSeleccionados(carritoActualizado);
  };

  const handleEliminarUnidadServicio = (servicioId) => {
    const carritoActualizado = serviciosSeleccionados.reduce((acumulador, servicio) => {
      if (servicio.id === servicioId) {
        if (servicio.cantidad > 1) {
          servicio.cantidad -= 1;
          acumulador.push(servicio);
        }
      } else {
        acumulador.push(servicio);
      }
      return acumulador;
    }, []);

    setServiciosSeleccionados(carritoActualizado);
  };

  const handleAgregarAlCarrito = (servicio) => {
    const servicioExistente = serviciosSeleccionados.find((s) => s.id === servicio.id);

    if (servicioExistente) {
      const carritoActualizado = serviciosSeleccionados.map((s) => {
        if (s.id === servicio.id) {
          s.cantidad += 1;
        }
        return s;
      });

      setServiciosSeleccionados(carritoActualizado);
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, { ...servicio, cantidad: 1 }]);
    }
  };

  const handleGenerarReporte = async (e) => {
    e.preventDefault();
  
    const datosParaEnviar = {
      nombreCliente,
      tipoDocumento,
      numeroDocumento,
      telefono,
      correoCliente: correo, // Usar el correo del cliente (no el del cotizador)
      nombreCotizador,
      correoCotizador: correoEncargado, // Usar el correo del cotizador
      serviciosSeleccionados,
    };
  
    // Añadir validación para verificar que el correo del cotizador está registrado
    const correosRegistrados = usuariosEncargados.map((usuario) => usuario.correo);
    if (!correosRegistrados.includes(correoEncargado)) {
      console.error('Error al generar cotización: El correo del cotizador proporcionado no está registrado.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/generar-cotizacion', datosParaEnviar);
      setReporteGenerado(response.data);
    } catch (error) {
      console.error('Error al generar cotización:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      }
    }
    try {
      const response = await axios.post('http://localhost:3001/generar-cotizacion', datosParaEnviar);
      setReporteGenerado(response.data);
  
      // Llamar a la función para generar el PDF
      generarPDF();
    } catch (error) {
      // ... (Manejo de errores)
    }
  };
    
    const generarPDF = () => {
      // Crear un nuevo documento PDF
      const pdf = new jsPDF();
      
      // Agregar contenido al PDF
      pdf.setFontSize(10);
      pdf.text('Cotización Generada', 10, 10);
      pdf.text(`Cliente: ${nombreCliente}`, 10, 20);
      pdf.text(`Tipo de Documento: ${tipoDocumento}`, 10, 30);
      pdf.text(`Número de Documento: ${numeroDocumento}`, 10, 40);
      pdf.text(`Teléfono: ${telefono}`, 10, 50);
      pdf.text(`Correo Electrónico: ${correo}`, 10, 60);
      pdf.text(`Cotizador: ${nombreCotizador}`, 10, 70);
      pdf.text(`Correo del Cotizador: ${correoEncargado}`, 10, 80);
  
      // Agregar servicios seleccionados
      pdf.text('Servicios Seleccionados:', 10, 90);
  
      let totalGeneral = 0; // Inicializar el total general
  
      serviciosSeleccionados.forEach((servicio, index) => {
        const yPosition = 100 + index * 40;
  
        pdf.text(`Servicio: ${servicio.nombreservicio}`, 30, yPosition + 10);
        pdf.text(`Cantidad: ${servicio.cantidad}`, 30, yPosition + 20);
        pdf.text(`Subtotal: $${servicio.valor * servicio.cantidad}`, 30, yPosition + 30);
  
        // Sumar al total general
        totalGeneral += servicio.valor * servicio.cantidad;
      });
  
      // Mostrar el total general al final del documento
      pdf.text(`Total: $${totalGeneral}`, 10, 100 + serviciosSeleccionados.length * 40);
  
      // Guardar el PDF
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      // Abrir el PDF en una nueva pestaña
      window.open(pdfUrl, '_blank');
    };
  

  const handleDescargarReporte = () => {
    // Agrega aquí la lógica para descargar el reporte generado.
  };

  const handleEnviarReporte = () => {
    // Agrega aquí la lógica para enviar el reporte por correo.
  };

  const handleLimpiarFormulario = () => {
    setNombreCliente('');
    setTipoDocumento('nit');
    setNumeroDocumento('');
    setTelefono('');
    setCorreo('');
    setNombreCotizador('');
    setCorreoEncargado(''); // Cambiado el campo a 'correoEncargado'
    setServiciosSeleccionados([]);
    setReporteGenerado('');
  };

  return (
    <div className="cotizacion-form">
      <form className="form-column" onSubmit={handleGenerarReporte}>
        <div className="form-group">
          <label htmlFor="nombreCliente" className="unique-label">
            Nombre del Cliente:
          </label>
          <input
            type="text"
            id="nombreCliente"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            className="unique-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipoDocumento" className="unique-label">
            Tipo de Documento:
          </label>
          <select
            id="tipoDocumento"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="unique-input"
            required
          >
            <option value="cedula">Cedula de Ciudadanía</option>
            <option value="nit">Nit</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="registroCivil">Registro Civil</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="numeroDocumento" className="unique-label">
            Número de Documento:
          </label>
          <input
            type="text"
            id="numeroDocumento"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            className="unique-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono" className="unique-label">
            Teléfono:
          </label>
          <input
            type="text"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="unique-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="correo" className="unique-label">
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="unique-input"
            autoComplete="off" // Desactiva el autocompletado
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nombreCotizador" className="unique-label">
            Nombre del Cotizador:
          </label>
          <input
            type="text"
            id="nombreCotizador"
            value={nombreCotizador}
            onChange={(e) => setNombreCotizador(e.target.value)}
            className="unique-input"
            required
          />
        </div>
        <div className="form-group">
          {/* Agregamos la lista desplegable con los correos de los usuarios encargados */}
          <label htmlFor="correoEncargado" className="unique-label">
            Correo del Usuario Encargado:
          </label>
          <select
            id="correoEncargado"
            value={correoEncargado}
            onChange={(e) => setCorreoEncargado(e.target.value)}
            className="unique-input"
            required
          >
            <option value="" disabled>
              Selecciona un correo
            </option>
            {usuariosEncargados.map((usuario, index) => (
              <option key={index} value={usuario.correo}>
                {usuario.correo}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="unique-button">
          Generar Cotización
        </button>
        <button type="button" onClick={handleLimpiarFormulario} className="unique-button">
          Limpiar Campos
        </button>
      </form>
      <div className="servicios-column">
        <h3 className="unique-title">Servicios Disponibles</h3>
        <ul className="unique-list">
          {serviciosDisponibles.map((servicio) => (
            <li key={servicio.id} className="unique-list-item">
              <span>ID: {servicio.id}</span>
              <span>Nombre: {servicio.nombreservicio}</span>
              <span>Precio: ${servicio.valor}</span>
              <button onClick={() => handleAgregarAlCarrito(servicio)} className="unique-button">
                Agregar al Carrito
              </button>
            </li>
          ))}
        </ul>
        <h3 className="unique-title">Carrito de Compras</h3>
        <ul className="unique-list">
          {serviciosSeleccionados.map((servicio) => (
            <li key={servicio.id} className="unique-list-item">
              <span>ID: {servicio.id}</span>
              <span>Nombre: {servicio.nombreservicio}</span>
              <input
                type="number"
                value={servicio.cantidad}
                onChange={(e) => handleModificarCantidad(servicio.id, e.target.value)}
              />
              <span>Subtotal: ${servicio.valor * servicio.cantidad}</span>
              <button onClick={() => handleEliminarUnidadServicio(servicio.id)} className="unique-button">
                Eliminar Unidad
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={handleDescargarReporte} className="unique-button">
          Descargar Cotización
        </button>
        <button type="button" onClick={handleEnviarReporte} className="unique-button">
          Enviar por Correo
        </button>
        {reporteGenerado && (
          <div className="reporte">
            <h3 className="unique-title">Cotización Generada</h3>
            <p>{reporteGenerado.message}</p>
            <p>ID de Cotización: {reporteGenerado.idCotizacion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CotizacionForm;
