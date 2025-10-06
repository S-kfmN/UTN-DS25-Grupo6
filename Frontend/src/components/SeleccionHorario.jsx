import React from 'react';
import '../assets/styles/seleccionHorario.css';

const SeleccionHorario = ({ 
  selectedTime, 
  onTimeSelect, 
  availableSlots = [],
  occupiedSlots = [],
  disabled = false,
  className = ''
}) => {
  // Horarios predefinidos (puedes modificar según tus necesidades)
  const defaultTimeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00',
  ];

  // Si no se proporcionan horarios disponibles, usar los predefinidos
  const timeSlots = availableSlots.length > 0 ? availableSlots : defaultTimeSlots;

  // Set para búsqueda eficiente (asume que occupiedSlots ya está en el mismo formato HH:MM)
  const occupiedSet = new Set(occupiedSlots || []);

  const handleTimeClick = (time) => {
    if (!disabled) {
      onTimeSelect(time);
    }
  };

  return (
    <div className={`seleccion-horario ${className}`}>
      <h4 className="seleccion-horario-title">Horarios Disponibles</h4>
      <div className="seleccion-horario-grid">
        {timeSlots.map((time) => {
          const isSelected = selectedTime === time;
          const isOccupied = occupiedSet.has(time);
          const isDisabled = disabled || isOccupied;
          
          return (
            <button
              key={time}
              type="button"
              className={`seleccion-horario-btn ${isSelected ? 'seleccion-horario-btn--selected' : ''} ${isOccupied ? 'seleccion-horario-btn--unavailable' : ''} ${isDisabled ? 'seleccion-horario-btn--disabled' : ''}`}
              onClick={() => handleTimeClick(time)}
              disabled={isDisabled}
              title={isOccupied ? 'Horario ocupado' : ''}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeleccionHorario;
