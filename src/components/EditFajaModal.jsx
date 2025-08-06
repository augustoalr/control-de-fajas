import React from 'react';
import { Modal, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

const EditFajaModal = ({ editingFaja, setEditingFaja, handleUpdate, companies }) => {
  return (
    <Modal
      show={!!editingFaja}
      onHide={() => setEditingFaja(null)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Faja</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Row className="g-3">
            <Col md={6}>
                  <Form.Group>
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingFaja.id}
                      readOnly
                      disabled
                    />
                  </Form.Group>
                </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre del Cliente</Form.Label>
                <Form.Control
                  type="text"
                  name="clientName"
                  value={editingFaja.clientName}
                  onChange={(e) =>
                    setEditingFaja({
                      ...editingFaja,
                      clientName: e.target.value,
                    })
                  }
                  placeholder="Nombre del Cliente"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={editingFaja.fecha}
                    placeholder="Seleccionar fecha" // Placeholder para la guía visual
                    onChange={(e) =>
                      setEditingFaja({ ...editingFaja, fecha: e.target.value })
                    }
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setEditingFaja({ ...editingFaja, fecha: "" })
                    }
                  >
                    &#x2715;
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Compañía</Form.Label>
                <Form.Select
                  name="company"
                  value={editingFaja.company}
                  onChange={(e) =>
                    setEditingFaja({
                      ...editingFaja,
                      company: e.target.value,
                    })
                  }
                >
                  <option value="">Selecciona una compañía</option>
                  {companies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Modelo</Form.Label>
                <Form.Control
                  type="text"
                  name="model"
                  value={editingFaja.model}
                  onChange={(e) =>
                    setEditingFaja({ ...editingFaja, model: e.target.value })
                  }
                  placeholder="Modelo (*)"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Código</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={editingFaja.code}
                  onChange={(e) =>
                    setEditingFaja({ ...editingFaja, code: e.target.value })
                  }
                  placeholder="Código (*)"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Talla</Form.Label>
                <Form.Control
                  type="text"
                  name="size"
                  value={editingFaja.size}
                  onChange={(e) =>
                    setEditingFaja({ ...editingFaja, size: e.target.value })
                  }
                  placeholder="Talla (*)"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Select
                name="paid"
                value={editingFaja.paid}
                onChange={(e) =>
                  setEditingFaja({ ...editingFaja, paid: e.target.value })
                }
                id="editPaidSelect"
              >
                <option value="false">No Pagado</option>
                <option value="true">Pagado</option>
                <option value="I">Gratis</option>
              </Form.Select>
            </Col>
            <Col md={12} className="text-end">
              <Button type="submit" variant="primary">
                Guardar Cambios
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditFajaModal;
