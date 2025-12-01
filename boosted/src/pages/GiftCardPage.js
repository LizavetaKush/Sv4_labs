import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Badge, Alert, ListGroup } from 'react-bootstrap';
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';

const GiftCardPage = () => {
  const [amount, setAmount] = useState(50);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      alert(`Gift card for $${amount} will be sent to ${recipientEmail}`);
    }, 2000);
  };

  const presetAmounts = [25, 50, 100, 200, 500];

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col className="text-center">
          <h1 className="display-4 mb-3">Gift Card</h1>
          <p className="lead text-muted">Give the gift of electric mobility</p>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
          <Alert.Heading>Processing your gift card purchase...</Alert.Heading>
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Header as="h3" className="bg-white">Choose Amount</Card.Header>
            <Card.Body>
              <Row className="g-2 mb-3">
                {presetAmounts.map((value) => (
                  <Col xs={6} sm={4} key={value}>
                    <Button
                      variant={amount === value ? 'danger' : 'outline-secondary'}
                      className="w-100"
                      onClick={() => setAmount(value)}
                      size="lg"
                    >
                      ${value}
                    </Button>
                  </Col>
                ))}
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>
                  Custom Amount{' '}
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">Custom Amount</Popover.Header>
                        <Popover.Body>
                          Enter any amount between $1 and $1000. Gift cards can be used for any product in our store.
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Badge bg="info" className="ms-2" style={{ cursor: 'pointer' }}>?</Badge>
                  </OverlayTrigger>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="1"
                    max="1000"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    placeholder="Enter amount"
                  />
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h3" className="bg-white">Delivery Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Recipient Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Your Message (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a personal message..."
                  />
                </Form.Group>
                
                <Card className="bg-light mb-3">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col>
                        <strong>Total:</strong>
                      </Col>
                      <Col xs="auto">
                        <Badge bg="danger" className="fs-4 px-3 py-2">
                          ${amount}.00
                        </Badge>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <Button variant="danger" type="submit" size="lg" className="w-100">
                  Purchase Gift Card
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h3" className="bg-light">Gift Card Terms</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Badge bg="success" className="me-2">✓</Badge>
                  Gift cards never expire
                </ListGroup.Item>
                <ListGroup.Item>
                  <Badge bg="success" className="me-2">✓</Badge>
                  Can be used for any product on Boosted USA
                </ListGroup.Item>
                <ListGroup.Item>
                  <Badge bg="success" className="me-2">✓</Badge>
                  Gift cards are delivered via email instantly
                </ListGroup.Item>
                <ListGroup.Item>
                  <Badge bg="success" className="me-2">✓</Badge>
                  Can be combined with other gift cards
                </ListGroup.Item>
                <ListGroup.Item>
                  <Badge bg="success" className="me-2">✓</Badge>
                  Non-refundable but transferable
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GiftCardPage;


