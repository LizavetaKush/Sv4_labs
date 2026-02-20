import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import boardsData from '../data/boards.json';
import accessoriesData from '../data/accessories.json';

const ManagePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    // Ensure unique IDs by adding prefix or offset if needed
    const boards = boardsData.map(board => ({ 
      ...board, 
      category: 'board',
      uniqueId: `board-${board.id}` // Create unique identifier for React keys
    }));
    const accessories = accessoriesData.map(accessory => ({ 
      ...accessory, 
      category: 'accessory',
      uniqueId: `accessory-${accessory.id}` // Create unique identifier for React keys
    }));
    const allProducts = [...boards, ...accessories];
    // Remove any duplicates by uniqueId to ensure no duplicate keys
    const seenIds = new Set();
    const uniqueProducts = allProducts.filter(product => {
      const id = product.uniqueId || `${product.category}-${product.id}`;
      if (seenIds.has(id)) {
        console.warn(`Duplicate product found with uniqueId: ${id}`, product);
        return false;
      }
      seenIds.add(id);
      return true;
    });
    setProducts(uniqueProducts);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSelect = (productId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    handleCloseModal();
    setAlertMessage('Product deleted successfully');
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    setProducts(products.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setAlertMessage(`${count} product(s) deleted successfully`);
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setSelectedProduct(product);
  };

  const handleSave = (updatedProduct) => {
    setProducts(products.map(p => {
      if (p.id === updatedProduct.id && p.category === updatedProduct.category) {
        // Preserve uniqueId when updating
        return {
          ...updatedProduct,
          uniqueId: p.uniqueId || `${updatedProduct.category || 'product'}-${updatedProduct.id}`
        };
      }
      return p;
    }));
    handleCloseModal();
    setAlertMessage('Product updated successfully');
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAdd = (newProduct) => {
    const maxId = Math.max(...products.map(p => p.id || 0), 0);
    const productCategory = newProduct.category || 'other';
    const productWithId = { 
      ...newProduct, 
      id: maxId + 1,
      category: productCategory,
      uniqueId: `${productCategory}-${maxId + 1}`, // Create unique identifier
      status: newProduct.status || 'In Stock'
    };
    setProducts([...products, productWithId]);
    setAlertMessage('Product added successfully');
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 mb-4">Manage Products</h1>
          
          {showAlert && (
            <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
              {alertMessage}
            </Alert>
          )}

          <Row className="mb-3 g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="d-flex gap-2 flex-wrap">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Add a new product to the catalog</Tooltip>}
              >
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsEditing(false);
                    setEditingProduct(null);
                    setShowAddForm(true);
                  }}
                >
                  Add Product
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete selected products</Tooltip>}
              >
                <Button
                  variant="danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                >
                  Delete Selected ({selectedIds.size})
                </Button>
              </OverlayTrigger>
              <Button
                variant="secondary"
                onClick={() => setSelectedIds(new Set())}
                disabled={selectedIds.size === 0}
              >
                Clear Selection
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {filteredProducts.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <Spinner animation="border" variant="secondary" className="mb-3" />
            <p className="text-muted">No products found.</p>
          </Col>
        </Row>
      ) : (
        <Row className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.uniqueId || `${product.category}-${product.id}`} xs={12} sm={6} md={4} lg={3}>
              <ProductCard
                product={product}
                onClick={handleProductClick}
                isSelected={selectedIds.has(product.id)}
                showCheckbox={true}
                onSelect={handleSelect}
              />
            </Col>
          ))}
        </Row>
      )}
      
      {selectedProduct && !isEditing && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isEditing && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      <AddProductModal
        show={showAddForm}
        onAdd={(newProduct) => {
          handleAdd(newProduct);
          setShowAddForm(false);
          setSelectedProduct(null);
          setIsEditing(false);
          setEditingProduct(null);
        }}
        onClose={() => {
          setShowAddForm(false);
        }}
      />
    </Container>
  );
};

const EditProductModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState(product);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={!!product} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-order">Pre-order</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const AddProductModal = ({ show, onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    status: 'In Stock',
    description: '',
    image: '/images/Rectangle(12).png',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
    });
    // Reset form
    setFormData({
      title: '',
      price: '',
      status: 'In Stock',
      description: '',
      image: '/images/Rectangle(12).png',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-order">Pre-order</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            Add Product
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ManagePage;

