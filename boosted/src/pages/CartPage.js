import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Trash, Plus, Dash } from 'react-bootstrap-icons';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <h1 className="display-4 mb-4">Your Cart is Empty</h1>
            <p className="lead text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Button as={Link} to="/catalog" variant="danger" size="lg">
              Continue Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5">Shopping Cart</h1>
          <p className="text-muted">{cartItems.length} item(s) in your cart</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cart Items</h5>
              <Button variant="outline-danger" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={`${item.category}-${item.id}`}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem' }}
                            className="rounded"
                          />
                          <div>
                            <h6 className="mb-1">{item.title}</h6>
                            <Badge bg="secondary">{item.category}</Badge>
                            {item.status && (
                              <Badge bg={item.status.includes('Stock') ? 'success' : 'danger'} className="ms-2">
                                {item.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>${item.price || 0}</strong>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.category, item.quantity - 1)}
                          >
                            <Dash />
                          </Button>
                          <span className="fw-bold">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.category, item.quantity + 1)}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </td>
                      <td>
                        <strong className="text-danger">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id, item.category)}
                        >
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <strong>Free</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5>Total:</h5>
                <h5 className="text-danger">${getCartTotal().toFixed(2)}</h5>
              </div>
              <Button variant="danger" size="lg" className="w-100 mb-3">
                Proceed to Checkout
              </Button>
              <Button as={Link} to="/catalog" variant="outline-secondary" className="w-100">
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;

