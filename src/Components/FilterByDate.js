import React, { useState } from 'react';
import '/home/vladimir/Cotizador/front-end/src/Styles/FilterByDate.css';

function FilterByDate({ onFilter, onReset }) {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleFilterClick = () => {
        onFilter(selectedDate);
    };

    const handleResetClick = () => {
        onReset();
    };

    return (
    <div className="filter-container">
        <label className='S--fecha'>Seleccionar Fecha:</label>
        <input
            className='F--cot'
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
        />
        <div className="button-group">
            <button onClick={handleFilterClick}>Filtrar</button>
            <button onClick={handleResetClick}>Limpiar</button>
        </div>
    </div>
    );
}

export default FilterByDate;

