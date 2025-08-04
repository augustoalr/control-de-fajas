import React from 'react';
import { Button, Card } from 'react-bootstrap';

const FajasTable = ({ fajas, handleEdit, handleDelete, activeTab }) => {
  return (
    <>
      <div className="d-none d-md-block">
        <div className="card shadow-sm">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {activeTab === 'stock' ? 'Inventario en Stock' : 'Fajas Vendidas'} ({fajas.length})
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
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
                        <td>{faja.id}</td>
                        <td>{faja.clientName}</td>
                        <td>{faja.fecha}</td>
                        <td>{faja.company}</td>
                        <td>{faja.model}</td>
                        <td>{faja.code}</td>
                        <td>{faja.size}</td>
                        <td>{faja.paid ? "Yes" : "No"}</td>
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
                      <td colSpan="9" className="text-center">
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
        {fajas.length > 0 ? (
          fajas.map((faja) => (
            <Card key={faja.id} className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{faja.code} - {faja.company}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {faja.clientName || 'Sin cliente'}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Código:</strong> {faja.code} <br />
                  <strong>Talla:</strong> {faja.size} <br />
                  <strong>Fecha:</strong> {faja.fecha} <br />
                  <strong>Pagado:</strong> {faja.paid ? 'Sí' : 'No'}
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
