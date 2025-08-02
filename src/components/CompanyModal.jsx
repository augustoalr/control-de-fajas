import React from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';

const CompanyModal = ({ show, handleHide, newCompanyName, setNewCompanyName, handleCompanySubmit, companies, handleCompanyDelete }) => {
  return (
    <Modal
      show={show}
      onHide={handleHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Gestionar Compañías</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCompanySubmit}>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Nombre de la nueva compañía"
            />
            <Button variant="primary" type="submit">
              Agregar
            </Button>
          </InputGroup>
        </Form>
        <ul className="list-group">
          {companies.map((c) => (
            <li
              key={c}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {c}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleCompanyDelete(c)}
              >
                Eliminar
              </Button>
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyModal;
