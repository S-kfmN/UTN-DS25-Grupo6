import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../assets/styles/modalEdicion.css';

export default function EditVehicleModal({ show, vehiculo, onHide, onSave }) {
  const [form, setForm] = useState({
    license: '',
    brand: '',
    model: '',
    year: '',
    color: ''
  });

  useEffect(() => {
    if (vehiculo) {
      setForm({
        license: vehiculo.patente || '',
        brand: vehiculo.marca || '',
        model: vehiculo.modelo || '',
        year: vehiculo.año || '',
        color: vehiculo.color || ''
      });
    }
  }, [vehiculo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-edicion .modal-content">
      <Modal.Header closeButton className="modal-edicion-header">
        <Modal.Title className="modal-edicion-title">
          <i className="bi bi-car-front me-2"></i>
          Modificar Vehículo
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-edicion-body">
          <Form.Group className="mb-3">
            <Form.Label>Patente</Form.Label>
            <Form.Control
              name="license"
              value={form.license}
              onChange={handleChange}
              required
              maxLength={8}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              name="model"
              value={form.model}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Año</Form.Label>
            <Form.Control
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              required
              min={1900}
              max={new Date().getFullYear() + 1}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              name="color"
              value={form.color}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-edicion-footer">
          <Button variant="secondary" onClick={onHide} className="modal-edicion-boton-cerrar">
            Cancelar
          </Button>
          <Button variant="warning" type="submit" className="modal-edicion-boton-guardar">
            <i className="bi bi-check-circle me-2"></i>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}