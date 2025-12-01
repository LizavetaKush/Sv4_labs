import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { useCompare } from '../contexts/CompareContext';
import { Link } from 'react-router-dom';
import { X } from 'react-bootstrap-icons';

const ComparePage = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <h1 className="display-4 mb-4">No Products to Compare</h1>
            <p className="lead text-muted mb-4">Add products to compare their features side by side.</p>
            <Alert variant="info">
              <strong>Tip:</strong> You can compare up to 3 products at a time. Click the "Compare" button on any product card to add it.
            </Alert>
            <Button as={Link} to="/catalog" variant="danger" size="lg">
              Browse Products
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  // Получаем все уникальные характеристики из всех товаров
  const getAllFeatures = () => {
    const featuresSet = new Set();
    compareItems.forEach(item => {
      if (item.features) {
        item.features.forEach(feature => featuresSet.add(feature));
      }
    });
    return Array.from(featuresSet);
  };

  const allFeatures = getAllFeatures();

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-5">Compare Products</h1>
            <p className="text-muted">Compare {compareItems.length} product(s)</p>
          </div>
          <Button variant="outline-danger" onClick={clearCompare}>
            Clear All
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '200px' }}>Feature</th>
                      {compareItems.map((item) => (
                        <th key={`${item.category}-${item.id}`} className="text-center" style={{ minWidth: '250px' }}>
                          <Button
                            variant="link"
                            className="position-absolute top-0 end-0 m-2 p-1"
                            onClick={() => removeFromCompare(item.id, item.category)}
                          >
                            <X size={20} />
                          </Button>
                          <div className="p-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                              className="rounded mb-3"
                            />
                            <h6>{item.title}</h6>
                            <Badge bg="secondary" className="mb-2">{item.category}</Badge>
                            {item.status && (
                              <Badge bg={item.status.includes('Stock') ? 'success' : 'danger'} className="ms-2 mb-2">
                                {item.status}
                              </Badge>
                            )}
                            <div className="fs-4 text-danger fw-bold mt-2">
                              ${item.price || 0}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Price</td>
                      {compareItems.map((item) => (
                        <td key={`price-${item.category}-${item.id}`} className="text-center">
                          <strong className="text-danger">${item.price || 0}</strong>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold">Status</td>
                      {compareItems.map((item) => (
                        <td key={`status-${item.category}-${item.id}`} className="text-center">
                          <Badge bg={item.status?.includes('Stock') ? 'success' : 'danger'}>
                            {item.status || 'N/A'}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold">Description</td>
                      {compareItems.map((item) => (
                        <td key={`desc-${item.category}-${item.id}`} className="text-center">
                          {item.description || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    {allFeatures.length > 0 && (
                      <>
                        {allFeatures.map((feature, idx) => (
                          <tr key={`feature-${idx}`}>
                            <td className="fw-bold">{feature}</td>
                            {compareItems.map((item) => (
                              <td key={`feature-${item.category}-${item.id}`} className="text-center">
                                {item.features?.includes(feature) ? (
                                  <Badge bg="success">✓</Badge>
                                ) : (
                                  <span className="text-muted">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ComparePage;

