import React from 'react';
import { Modal, Button, Badge, ListGroup, Image } from 'react-bootstrap';

const ProductModal = ({ product, onClose, onEdit, onDelete }) => {
  if (!product) return null;

  const getStatusVariant = (status) => {
    if (status?.toLowerCase().includes('stock')) return 'success';
    if (status?.toLowerCase().includes('out')) return 'danger';
    return 'secondary';
  };

  return (
    <Modal show={!!product} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <Image 
            src={product.image} 
            alt={product.title}
            fluid
            rounded
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Badge bg={getStatusVariant(product.status)} className="fs-6">
            {product.status}
          </Badge>
          {product.price && (
            <h4 className="text-danger mb-0">${product.price}</h4>
          )}
        </div>

        {product.salePrice && product.originalPrice && (
          <div className="mb-3">
            <span className="text-decoration-line-through text-muted me-2">
              ${product.originalPrice}
            </span>
            <span className="text-danger fw-bold">${product.salePrice}</span>
          </div>
        )}

        {product.description && (
          <p className="text-muted mb-3">{product.description}</p>
        )}

        {product.features && product.features.length > 0 && (
          <div className="mb-3">
            <h5>Features:</h5>
            <ListGroup variant="flush">
              {product.features.map((feature, index) => (
                <ListGroup.Item key={index}>
                  <Badge bg="success" className="me-2">✓</Badge>
                  {feature}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {product.category && (
          <p className="text-muted small">
            <strong>Category:</strong> {product.category}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {onEdit && (
          <Button variant="secondary" onClick={() => onEdit(product)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" onClick={() => onDelete(product.id)}>
            Delete
          </Button>
        )}
        <Button variant="danger" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;

