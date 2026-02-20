import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Trash, Plus, Dash } from 'react-bootstrap-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  clearError,
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  selectCartError,
} from '../store/slices/cartSlice';

const CartPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const error = useAppSelector(selectCartError);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <h1 className="display-4 mb-4">{t('cart.empty')}</h1>
            <p className="lead text-muted mb-4">{t('cart.emptyMessage')}</p>
            <Button as={Link} to="/catalog" variant="danger" size="lg">
              {t('cart.continueShopping')}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {error && (
        <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col>
          <h1 className="display-5">{t('cart.title')}</h1>
          <p className="text-muted">{t('cart.itemsCount', { count: cartItemsCount })}</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{t('cart.cartItems')}</h5>
              <Button variant="outline-danger" size="sm" onClick={() => dispatch(clearCart())}>
                {t('cart.clearCart')}
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('cart.product')}</th>
                    <th>{t('cart.price')}</th>
                    <th>{t('cart.quantity')}</th>
                    <th>{t('cart.total')}</th>
                    <th>{t('common.delete')}</th>
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
                              <Badge bg={item.status.includes('Stock') && !item.status.includes('Out') ? 'success' : 'danger'} className="ms-2">
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
                            onClick={() => dispatch(updateQuantity({
                              productId: item.id,
                              category: item.category,
                              quantity: item.quantity - 1,
                            }))}
                          >
                            <Dash />
                          </Button>
                          <span className="fw-bold">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => dispatch(updateQuantity({
                              productId: item.id,
                              category: item.category,
                              quantity: item.quantity + 1,
                            }))}
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
                          onClick={() => dispatch(removeFromCart({
                            productId: item.id,
                            category: item.category,
                          }))}
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
              <h5 className="mb-0">{t('cart.subtotal')}</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>{t('cart.subtotal')}:</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <strong>Free</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5>{t('cart.total')}:</h5>
                <h5 className="text-danger">${cartTotal.toFixed(2)}</h5>
              </div>
              <Button variant="danger" size="lg" className="w-100 mb-3">
                {t('cart.checkout')}
              </Button>
              <Button as={Link} to="/catalog" variant="outline-secondary" className="w-100">
                {t('cart.continueShopping')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
