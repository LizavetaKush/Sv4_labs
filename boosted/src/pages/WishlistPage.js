import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { HeartFill, Trash, CartPlus } from 'react-bootstrap-icons';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (wishlistItems.length === 0) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <HeartFill size={64} className="text-muted mb-4" />
            <h1 className="display-4 mb-4">Your Wishlist is Empty</h1>
            <p className="lead text-muted mb-4">Start adding products you love to your wishlist!</p>
            <Button as={Link} to="/catalog" variant="danger" size="lg">
              Browse Products
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-5">My Wishlist</h1>
            <p className="text-muted">{wishlistItems.length} item(s) in your wishlist</p>
          </div>
          <Button variant="outline-danger" onClick={clearWishlist}>
            Clear Wishlist
          </Button>
        </Col>
      </Row>

      <Row className="g-4">
        {wishlistItems.map((item) => (
          <Col key={`${item.category}-${item.id}`} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm position-relative">
              <Button
                variant="link"
                className="position-absolute top-0 end-0 m-2 p-2"
                style={{ zIndex: 10 }}
                onClick={() => removeFromWishlist(item.id, item.category)}
              >
                <HeartFill className="text-danger" size={20} />
              </Button>
              <Card.Img
                variant="top"
                src={item.image}
                alt={item.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.title}</Card.Title>
                <div className="mb-2">
                  <Badge bg="secondary">{item.category}</Badge>
                  {item.status && (
                    <Badge bg={item.status.includes('Stock') ? 'success' : 'danger'} className="ms-2">
                      {item.status}
                    </Badge>
                  )}
                </div>
                {item.price && (
                  <Card.Text className="fs-4 text-danger fw-bold mb-3">
                    ${item.price}
                  </Card.Text>
                )}
                <div className="mt-auto d-flex gap-2">
                  <Button
                    variant="danger"
                    className="flex-fill"
                    onClick={() => handleAddToCart(item)}
                  >
                    <CartPlus className="me-2" />
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WishlistPage;

