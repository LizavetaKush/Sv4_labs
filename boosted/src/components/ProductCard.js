import React from 'react';
import { Card, Badge, Form, OverlayTrigger, Tooltip, ButtonGroup, Button } from 'react-bootstrap';
import { Heart, HeartFill, CartPlus, ArrowBarLeft } from 'react-bootstrap-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';

const ProductCard = ({ product, onClick, isSelected = false, showCheckbox = false, onSelect }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare, compareItems } = useCompare();

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(product.id);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist(product.id, product.category)) {
      removeFromWishlist(product.id, product.category);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation();
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

  const getStatusVariant = (status) => {
    if (status?.toLowerCase().includes('stock')) return 'success';
    if (status?.toLowerCase().includes('out')) return 'danger';
    return 'secondary';
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-${product.id}`}>
          {product.description || product.title}
        </Tooltip>
      }
    >
      <Card
        className={`h-100 shadow-sm ${isSelected ? 'border-danger border-3' : ''}`}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        {showCheckbox && (
          <div className="position-absolute top-0 start-0 m-2" onClick={handleSelect}>
            <Form.Check
              type="checkbox"
              checked={isSelected}
              onChange={handleSelect}
              onClick={handleSelect}
              style={{ zIndex: 10 }}
            />
          </div>
        )}
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.title}
          style={{ height: '250px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <div className="text-center mb-2">
            <img 
              src="/images/Vector(1).svg" 
              alt="Lightning Icon"
              style={{ width: '30px', height: '30px' }}
            />
          </div>
          <Card.Title className="text-center">{product.title}</Card.Title>
          <div className="text-center mb-2">
            <Badge bg={getStatusVariant(product.status)}>
              {product.status}
            </Badge>
          </div>
          {product.price && (
            <Card.Text className="text-center">
              <strong className="text-danger fs-5">${product.price}</strong>
            </Card.Text>
          )}
          <div className="d-flex gap-2 justify-content-center mt-auto">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Add to Cart</Tooltip>}
            >
              <Button
                variant="danger"
                size="sm"
                onClick={handleAddToCart}
              >
                <CartPlus />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{isInWishlist(product.id, product.category) ? 'Remove from Wishlist' : 'Add to Wishlist'}</Tooltip>}
            >
              <Button
                variant={isInWishlist(product.id, product.category) ? 'danger' : 'outline-danger'}
                size="sm"
                onClick={handleWishlistToggle}
              >
                {isInWishlist(product.id, product.category) ? <HeartFill /> : <Heart />}
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{isInCompare(product.id, product.category) ? 'Remove from Compare' : 'Add to Compare'}</Tooltip>}
            >
              <Button
                variant={isInCompare(product.id, product.category) ? 'info' : 'outline-info'}
                size="sm"
                onClick={handleCompareToggle}
                disabled={!isInCompare(product.id, product.category) && compareItems.length >= 3}
              >
                <ArrowBarLeft />
              </Button>
            </OverlayTrigger>
          </div>
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
};

export default ProductCard;

