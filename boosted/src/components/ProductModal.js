import React from 'react';
import { Modal, Button, Badge, ListGroup, Image } from 'react-bootstrap';
import { CartPlus, Heart, HeartFill, ArrowBarLeft } from 'react-bootstrap-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';

const ProductModal = ({ product, onClose, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare, compareItems } = useCompare();

  if (!product) return null;

  const getStatusVariant = (status) => {
    if (status?.toLowerCase().includes('stock')) return 'success';
    if (status?.toLowerCase().includes('out')) return 'danger';
    return 'secondary';
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id, product.category)) {
      removeFromWishlist(product.id, product.category);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompareToggle = () => {
    if (isInCompare(product.id, product.category)) {
      removeFromCompare(product.id, product.category);
    } else {
      if (compareItems.length >= 3) {
        alert('You can compare up to 3 products at a time. Please remove one product from comparison first.');
        return;
      }
      addToCompare(product);
    }
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
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={handleAddToCart}>
            <CartPlus className="me-2" />
            Add to Cart
          </Button>
          <Button
            variant={isInWishlist(product.id, product.category) ? 'danger' : 'outline-danger'}
            onClick={handleWishlistToggle}
          >
            {isInWishlist(product.id, product.category) ? <HeartFill /> : <Heart />}
          </Button>
          <Button
            variant={isInCompare(product.id, product.category) ? 'info' : 'outline-info'}
            onClick={handleCompareToggle}
            disabled={!isInCompare(product.id, product.category) && compareItems.length >= 3}
          >
            <ArrowBarLeft className="me-2" />
            {isInCompare(product.id, product.category) ? 'Remove from Compare' : 'Compare'}
          </Button>
        </div>
        <div className="d-flex gap-2 ms-auto">
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
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;

