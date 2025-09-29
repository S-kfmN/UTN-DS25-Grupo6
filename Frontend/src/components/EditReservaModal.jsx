import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { usarAuth } from '../context/AuthContext';

export default function EditReservaModal({ show, reserva, onHide, onSave }) {
  const { servicios } = usarAuth();
  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    observaciones: '',
    servicio: ''
  });

  useEffect(() => {
    if (reserva) {
      setForm({
        fecha: reserva.fecha || '',
        hora: reserva.hora || '',
        observaciones: reserva.observaciones || '',
        servicio: reserva.servicio || (servicios[0]?.name || '')
      });
    }
  }, [reserva, servicios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Reserva</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Servicio</Form.Label>
            <Form.Select
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={2}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}