import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

const FajasTable = ({ fajas, handleEdit, handleDelete, activeTab, handleDeleteSelected }) => {
  const [selectedFajas, setSelectedFajas] = useState([]);

  const handleSelect = (id) => {
    setSelectedFajas((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((fajaId) => fajaId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFajas.length === fajas.length) {
      setSelectedFajas([]);
    } else {
      setSelectedFajas(fajas.map((faja) => faja.id));
    }
  };

  const renderPaidStatus = (paid) => {
    if (paid === 'I') return 'Gratis';
     if (String(paid) === 'true' || paid === 'P') return 'Si';
    return 'No';
  };

  return (
    <>
      <div className="d-none d-md-block">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              {activeTab === 'stock' ? 'Inventario en Stock' : 'Fajas Vendidas'} ({fajas.length})
            </h5>
            {selectedFajas.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteSelected(selectedFajas)}
              >
                Eliminar seleccionados ({selectedFajas.length})
              </Button>
            )}
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedFajas.length === fajas.length && fajas.length > 0}
                      />
                    </th>
                    <th>Number</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Compañía</th>
                    <th>Modelo</th>
                    <th>Código</th>
                    <th>Talla</th>
                    <th>Pagado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fajas.length > 0 ? (
                    fajas.map((faja) => (
                      <tr key={faja.id}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedFajas.includes(faja.id)}
                            onChange={() => handleSelect(faja.id)}
                          />
                        </td>
                        <td>{faja.id}</td>
                        <td>{faja.clientName}</td>
                        <td>{faja.fecha}</td>
                        <td>{faja.companies?.name}</td>
                        <td>{faja.model}</td>
                        <td>{faja.code}</td>
                        <td>{faja.size}</td>
                        <td>{renderPaidStatus(faja.paid)}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEdit(faja)}
                            className="me-2"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(faja.id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No se encontraron registros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="d-block d-md-none">
        {selectedFajas.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            className="mb-3"
            onClick={() => handleDeleteSelected(selectedFajas)}
          >
            Eliminar seleccionados ({selectedFajas.length})
          </Button>
        )}
        {fajas.length > 0 ? (
          fajas.map((faja) => (
            <Card key={faja.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <Card.Title>{faja.code} - {faja.company}</Card.Title>
                  <Form.Check
                    type="checkbox"
                    checked={selectedFajas.includes(faja.id)}
                    onChange={() => handleSelect(faja.id)}
                  />
                </div>
                <Card.Subtitle className="mb-2 text-muted">
                  {faja.clientName || 'Sin cliente'}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Código:</strong> {faja.code} <br />
                  <strong>Talla:</strong> {faja.size} <br />
                  <strong>Fecha:</strong> {faja.fecha} <br />
                  <strong>Pagado:</strong> {renderPaidStatus(faja.paid)}
                </Card.Text>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(faja)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(faja.id)}
                >
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="text-center">
            No se encontraron registros.
          </div>
        )}
      </div>
    </>
  );
};

export default FajasTable;