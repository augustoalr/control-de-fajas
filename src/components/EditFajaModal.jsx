import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditFajaModal = ({ editingFaja, setEditingFaja, handleUpdate, companies }) => {
  // Si no hay una faja para editar, no mostramos nada.
  if (!editingFaja) return null;

  // Creamos una función local para manejar los cambios en los inputs de este modal.
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    // Si el campo es 'company', convierte el valor a número
    if (name === 'company') {
      finalValue = parseInt(value, 10);
    }
    
    if (name === 'paid') {
      if (value === 'true') finalValue = true;
      else if (value === 'false') finalValue = false;
      else finalValue = value;
    }
    
    // Actualizamos el estado 'editingFaja' en el componente principal (App.jsx)
    setEditingFaja(prev => ({ ...prev, [name]: finalValue }));
  };

  return (
    <Modal show={true} onHide={() => setEditingFaja(null)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Registro de Faja</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="editClientName">
              <Form.Label>Nombre del Cliente</Form.Label>
              <Form.Control
                type="text"
                name="clientName"
                value={editingFaja.clientName || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="editFecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={editingFaja.fecha || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            {/* --- CAMBIO PRINCIPAL AQUÍ --- */}
            <Form.Group as={Col} controlId="editCompany">
              <Form.Label>Compañía</Form.Label>
              <Form.Select 
                name="company" 
                value={editingFaja.company || ''} // Usamos el ID de la compañía
                onChange={handleInputChange} 
                required
              >
                <option value="">Selecciona una compañía...</option>
                {/* Mapeamos el array de objetos de compañías */}
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="editModel">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={editingFaja.model || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="editCode">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={editingFaja.code || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="editSize">
              <Form.Label>Talla</Form.Label>
              <Form.Control
                type="text"
                name="size"
                value={editingFaja.size || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="editPaid">
              <Form.Label>Estado de Pago</Form.Label>
              <Form.Select 
                name="paid" 
                value={String(editingFaja.paid)} 
                onChange={handleInputChange}
              >
                <option value="false">No Pagado</option>
                <option value="true">Pagado</option>
                <option value="I">Gratis (I)</option>
                <option value="P">Pagado (P)</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setEditingFaja(null)} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditFajaModal;