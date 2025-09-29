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
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  // Si no se proporcionan horarios disponibles, usar los predefinidos
  const timeSlots = availableSlots.length > 0 ? availableSlots : defaultTimeSlots;

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
          const isOccupied = occupiedSlots.includes(time);
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
