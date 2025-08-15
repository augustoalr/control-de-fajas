import React from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

const CompanyModal = ({ 
  show, 
  handleHide, 
  newCompanyName, 
  setNewCompanyName, 
  handleCompanySubmit, 
  companies, 
  handleCompanyDelete 
}) => {
  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gestionar Compañías</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCompanySubmit} className="mb-3">
          <Form.Group>
            <Form.Label>Agregar Nueva Compañía</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de la compañía"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">
            Agregar
          </Button>
        </Form>
        <hr />
        <h5>Compañías Existentes</h5>
        <ListGroup>
          {/* --- CAMBIO PRINCIPAL AQUÍ --- */}
          {/* Ahora mapeamos el array de objetos y mostramos company.name */}
          {companies.map((company) => (
            <ListGroup.Item 
              key={company.id} 
              className="d-flex justify-content-between align-items-center"
            >
              {company.name}
              <Button 
                variant="outline-danger" 
                size="sm"
                // El botón de borrar ahora pasa el nombre de la compañía
                onClick={() => handleCompanyDelete(company.name)}
              >
                Eliminar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyModal;