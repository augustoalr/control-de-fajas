import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { format } from 'date-fns';
import { Modal, Button, Form, Row, Col, InputGroup, Nav, Card } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { Toaster, toast } from 'react-hot-toast';

const FajasTable = lazy(() => import('./components/FajasTable'));
const AddFajaForm = lazy(() => import('./components/AddFajaForm'));
const EditFajaModal = lazy(() => import('./components/EditFajaModal'));
const CompanyModal = lazy(() => import('./components/CompanyModal'));
const ExportModal = lazy(() => import('./components/ExportModal'));

function App() {
  // --- ESTADOS ---
  const getInitialState = (key, defaultValue) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      toast.error('Error al leer datos guardados.');
      return defaultValue;
    }
  };

  const [fajas, setFajas] = useState(() => getInitialState('fajas_inventory', []));
  const predefinedCompanies = [
    'Europack', 'Biobela', 'New Colombian', 'Amazon', 'Aura', 'Aurafix',
    'Dres elci', 'Lipolastic', 'Just one', 'U-Desing', 'Generic', 'Macom',
    'My body', 'Salome', 'Old Salome'
  ];

  const [companies, setCompanies] = useState(() => {
    const savedCompanies = getInitialState('fajas_companies', []);
    const allCompanies = [...new Set([...predefinedCompanies, ...savedCompanies])];
    return allCompanies;
  });

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMonth, setExportMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [newCompanyName, setNewCompanyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [newFaja, setNewFaja] = useState({
    numero: '',
    clientName: '',
    fecha: new Date().toISOString().slice(0, 10),
    company: '',
    model: '',
    code: '',
    size: '',
    paid: false,
  });
  const [activeTab, setActiveTab] = useState('stock');

  // --- EFECTOS (CARGA/GUARDADO) ---
  useEffect(() => {
    try {
      localStorage.setItem('fajas_inventory', JSON.stringify(fajas));
    } catch (error) {
      console.error("Error saving fajas to localStorage:", error);
      toast.error('No se pudo guardar el inventario.');
    }
  }, [fajas]);

  useEffect(() => {
    try {
      localStorage.setItem('fajas_companies', JSON.stringify(companies));
    } catch (error) {
      console.error("Error saving companies to localStorage:", error);
      toast.error('No se pudieron guardar las compañías.');
    }
  }, [companies]);


  // --- LÓGICA DE FILTRADO ---
  const filteredFajas = useMemo(() => {
    const stockFajas = fajas.filter(faja => !faja.paid);
    const soldFajas = fajas.filter(faja => faja.paid);

    const filterLogic = (faja) => {
      const fajaDate = new Date(faja.fecha);
      const [year, month] = monthFilter.split('-');
      const matchMonth = !monthFilter || (fajaDate.getFullYear() === parseInt(year) && (fajaDate.getMonth() + 1) === parseInt(month));
      const matchSearch = Object.values(faja).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchMonth && matchSearch;
    };

    if (activeTab === 'stock') {
      return stockFajas.filter(filterLogic);
    } else {
      return soldFajas.filter(filterLogic);
    }
  }, [fajas, searchTerm, monthFilter, activeTab]);

  const [editingFaja, setEditingFaja] = useState(null);

  const handleEdit = (faja) => {
    setEditingFaja(faja);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setFajas(fajas.map(f => f.id === editingFaja.id ? editingFaja : f));
    setEditingFaja(null);
    toast.success('Faja actualizada con éxito.');
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFaja(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // --- Lógica para el número automático ---
    const newNumero = fajas.length > 0 ? Math.max(...fajas.map(f => f.numero)) + 1 : 1;

    setFajas(prev => [...prev, { ...newFaja, id: Date.now(), numero: newNumero }]);
    setNewFaja({ numero: '', clientName: '', fecha: '', company: '', model: '', code: '', size: '', paid: false });
    setActiveTab('stock');
    toast.success('Faja agregada al inventario.');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este registro?')) {
      setFajas(fajas.filter(faja => faja.id !== id));
      toast.success('Registro eliminado correctamente.');
    }
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (newCompanyName && !companies.includes(newCompanyName)) {
      setCompanies(prevCompanies => [...prevCompanies, newCompanyName]);
      setNewCompanyName('');
      toast.success('Compañía agregada.');
    }
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const handleCompanyDelete = (companyName) => {
    setCompanyToDelete(companyName);
    setShowDeleteConfirmation(true);
  };

  const confirmCompanyDelete = () => {
    setCompanies(companies.filter(c => c !== companyToDelete));
    setShowDeleteConfirmation(false);
    setCompanyToDelete(null);
    toast.success('Compañía eliminada.');
  };

  // --- LÓGICA DE EXPORTACIÓN ---
  const getExportData = () => {
    return { fajas };
  };

  const handleExportPDF = () => {
    const { fajas } = getExportData();
    const [year, month] = exportMonth.split('-');

    const soldThisMonth = fajas.filter(f => {
      const fajaDate = new Date(f.fecha);
      return (
        f.paid &&
        fajaDate.getFullYear() === parseInt(year) &&
        (fajaDate.getMonth() + 1) === parseInt(month)
      );
    });

    const doc = new jsPDF({ orientation: 'landscape' });
    const tableProps = { headStyles: { fillColor: [41, 128, 185] } };
    const columns = ["Nº", "name", "date", "company", "model", "code", "size", "paid"];
    const mapData = (f, index) => [index + 1, f.clientName, f.fecha, f.company, f.model, f.code, f.size, f.paid ? 'Yes' : 'No'];
    let finalY = 15;

    doc.text(`Sales - ${month}/${year}`, 14, finalY);

    if (soldThisMonth.length > 0) {
        autoTable(doc, {
            ...tableProps,
            head: [columns],
            body: soldThisMonth.map(mapData),
            startY: finalY + 10,
        });
    } else {
        doc.text("No hay fajas vendidas en el mes seleccionado.", 14, finalY + 10);
    }

    doc.save(`reporte_vendidas_${month}_${year}.pdf`);
    setShowExportModal(false);
  };

  const handleExportStockPDF = () => {
    const { fajas } = getExportData();
    const stock = fajas.filter(f => !f.paid);
    const date = new Date(`${exportMonth}-01`);
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const doc = new jsPDF({ orientation: 'landscape' });
    const tableProps = { headStyles: { fillColor: [41, 128, 185] } };
    const columns = ["Nº", "name", "company", "model", "code", "size", "paid"];
    const mapData = (f, index) => [index + 1, f.clientName, f.company, f.model, f.code, f.size];
    let finalY = 15;

    doc.text(`Stock Inventory ${monthName} ${year}`, 14, finalY);
    
    if (stock.length > 0) {
        autoTable(doc, {
            ...tableProps,
            head: [columns],
            body: stock.map(mapData),
            startY: finalY + 10,
            styles: { fontSize: 12}
        });
    } else {
        doc.text("No hay fajas en stock.", 14, finalY + 10);
    }

    doc.save(`reporte_stock_${new Date().toLocaleDateString()}.pdf`);
  };

  const handleExportExcel = async () => {
    const { fajas } = getExportData();
    const workbook = new ExcelJS.Workbook();

    const stock = fajas.filter(f => !f.paid);
    const sold = fajas.filter(f => f.paid);

    const createSheet = (sheetName, data) => {
      const worksheet = workbook.addWorksheet(sheetName, {
        pageSetup: { orientation: 'landscape' }
      });

      worksheet.columns = [
        { header: 'Nº', key: 'numero' },
        { header: 'Name', key: 'clientName' },
        { header: 'Date', key: 'fecha' },
        { header: 'Company', key: 'company' },
        { header: 'Model', key: 'model' },
        { header: 'Code', key: 'code' },
        { header: 'Size', key: 'size' },
        { header: 'Paid', key: 'paid' }
      ];

      const mappedData = data.map((f, index) => ({
        numero: index + 1,
        clientName: f.clientName,
        fecha: f.fecha,
        company: f.company,
        model: f.model,
        code: f.code,
        size: f.size,
        paid: f.paid ? 'Yes' : 'No'
      }));
      worksheet.addRows(mappedData);

      worksheet.columns.forEach(column => {
        if (column.key === 'numero') {
          column.width = 5;
        } else if (column.key === 'clientName') {
          column.width = 25;
        } else {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, cell => {
            const length = cell.value ? cell.value.toString().length : 10;
            if (length > maxLength) {
              maxLength = length;
            }
          });
          column.width = maxLength + 2;
        }
      });

      const headerRow = worksheet.getRow(1);
      headerRow.height = 20;
      headerRow.font = { bold: true };
      headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell(cell => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        }
      });

      const now = new Date();
      const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
      const year = now.getFullYear();
      const title = `${monthName} ${year} - ${sheetName.toUpperCase()}`;
      
      worksheet.insertRow(1, []);
      worksheet.mergeCells('A1:G1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = title;
      titleCell.font = { name: 'Arial', size: 14, bold: true };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 25;
    };

    if (stock.length > 0) {
      createSheet('Stock', stock);
    }
    if (sold.length > 0) {
      createSheet('Vendidas', sold);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_fajas_${new Date().toLocaleDateString()}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- COPIA DE SEGURIDAD ---
  const handleBackup = () => {
    const data = JSON.stringify({ fajas, companies });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_fajas_${new Date().toLocaleDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Copia de seguridad generada.');
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.fajas && data.companies) {
          setFajas(data.fajas);
          setCompanies(data.companies);
          toast.success('Copia de seguridad restaurada con éxito.');
        } else {
          toast.error('El archivo de copia de seguridad no es válido.');
        }
      } catch {
        toast.error('Error al leer el archivo de copia de seguridad.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mt-4 mb-5">
      <Toaster />
      <header className="text-center mb-4">
        <h1>Control de Inventario</h1>
        <p className="lead mb-3">
          Gestiona tu stock de fajas de forma sencilla.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <Button variant="danger" onClick={() => setShowExportModal(true)}>Exportar ventas</Button>
          <Button variant="success" onClick={handleExportExcel}>Exportar a Excel</Button>
          <Button variant="primary" onClick={handleExportStockPDF}>Exportar Stock</Button>
          <Button variant="info" onClick={handleBackup}>Copia de Seguridad</Button>
          <Form.Label className="btn btn-warning mb-0">
            Restaurar Copia
            <Form.Control type="file" accept=".json" onChange={handleRestore} hidden />
          </Form.Label>
          <Button variant="secondary" onClick={() => setShowCompanyModal(true)}>Gestionar Compañías</Button>
        </div>
      </header>

      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="stock">Stock</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="sold">Vendidas</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="add">Agregar Nueva</Nav.Link>
        </Nav.Item>
      </Nav>

      <Suspense fallback={<div>Cargando...</div>}>
        {activeTab === 'add' && (
          <AddFajaForm 
            newFaja={newFaja} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit} 
            companies={companies} 
          />
        )}

        {(activeTab === 'stock' || activeTab === 'sold') && (
          <>
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <Row className="g-3 align-items-center">
                  <Col md={4}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder={activeTab === 'stock' ? 'Buscar en stock...' : 'Buscar en vendidas...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  {activeTab === 'sold' && (
                    <Col md={3}>
                      <Form.Control
                        type="month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            </div>
            <FajasTable 
              fajas={filteredFajas} 
              handleEdit={handleEdit} 
              handleDelete={handleDelete} 
              activeTab={activeTab} 
            />
          </>
        )}

        {editingFaja && (
          <EditFajaModal 
            editingFaja={editingFaja} 
            setEditingFaja={setEditingFaja} 
            handleUpdate={handleUpdate} 
            companies={companies} 
          />
        )}

        {showCompanyModal && (
          <CompanyModal 
            show={showCompanyModal} 
            handleHide={() => setShowCompanyModal(false)} 
            newCompanyName={newCompanyName} 
            setNewCompanyName={setNewCompanyName} 
            handleCompanySubmit={handleCompanySubmit} 
            companies={companies} 
            handleCompanyDelete={handleCompanyDelete} 
          />
        )}

        {showExportModal && (
          <ExportModal 
            show={showExportModal} 
            handleHide={() => setShowExportModal(false)} 
            exportMonth={exportMonth} 
            setExportMonth={setExportMonth} 
            handleExportPDF={handleExportPDF} 
          />
        )}
      </Suspense>

      {/* Modal de Confirmación para Eliminar Compañía */}
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar la compañía "{companyToDelete}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmCompanyDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;