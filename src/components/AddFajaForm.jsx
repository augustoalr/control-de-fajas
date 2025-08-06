import React from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

const AddFajaForm = ({ newFaja, handleInputChange, handleSubmit, companies }) => {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header">
        <h5 className="card-title mb-0">Agregar Nueva Faja</h5>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={3}>
              <Form.Control
                type="text"
                inputMode="verbatim"
                name="clientName"
                value={newFaja.clientName}
                onChange={handleInputChange}
                placeholder="Nombre del Cliente"
              />
            </Col>
            <Col md={3}>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={newFaja.fecha}
                  onChange={handleInputChange}
                  placeholder="Seleccionar fecha" // Placeholder para la guía visual
                />
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    handleInputChange({ target: { name: "fecha", value: "" } })
                  }
                >
                  &#x2715;
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                name="company"
                value={newFaja.company}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una compañía</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                name="model"
                value={newFaja.model}
                onChange={handleInputChange}
                placeholder="Modelo (*)"
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                name="code"
                value={newFaja.code}
                onChange={handleInputChange}
                placeholder="Código (*)"
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                name="size"
                value={newFaja.size}
                onChange={handleInputChange}
                placeholder="Talla (*)"
              />
            </Col>
            <Col md={2} className="d-flex align-items-center">
              <Form.Select
                name="paid"
                value={newFaja.paid}
                onChange={handleInputChange}
                id="paidSelect"
              >
                <option value="false">No Pagado</option>
                <option value="true">Pagado</option>
                <option value="I">Gratis</option>
              </Form.Select>
            </Col>
            <Col md={12} className="text-end">
              <Button type="submit" variant="primary">
                Agregar al Inventario
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default AddFajaForm;
