import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ExportModal = ({ show, handleHide, exportMonth, setExportMonth, handleExportPDF }) => {
  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Exportar Ventas por Mes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Selecciona el Mes y Año</Form.Label>
          <Form.Control
            type="month"
            value={exportMonth}
            onChange={(e) => setExportMonth(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleExportPDF}>
          Exportar PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;
