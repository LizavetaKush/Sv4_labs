import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import FilterSort from '../components/FilterSort';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  setFilters,
  clearError,
  selectFilteredAndSortedProducts,
  selectProductsLoading,
  selectProductsError,
} from '../store/slices/productsSlice';

const ManagePage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredAndSortedProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertVariant('danger');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

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

  const handleDelete = (product) => {
    dispatch(deleteProduct({ id: product.id, category: product.category }));
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(product.id);
      return newSet;
    });
    handleCloseModal();
    setAlertMessage(t('products.productDeleted'));
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDeleteSelected = () => {
    const productsToDelete = Array.from(selectedIds).map(id => {
      const product = products.find(p => p.id === id);
      return product ? { id: product.id, category: product.category } : null;
    }).filter(Boolean);
    
    if (productsToDelete.length > 0) {
      dispatch(deleteProducts(productsToDelete));
      setSelectedIds(new Set());
      setAlertMessage(t('products.productsDeleted', { count: productsToDelete.length }));
      setAlertVariant('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setSelectedProduct(product);
  };

  const handleSave = (updatedProduct) => {
    dispatch(updateProduct(updatedProduct));
    handleCloseModal();
    setAlertMessage(t('products.productUpdated'));
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAdd = (newProduct) => {
    dispatch(addProduct(newProduct));
    setShowAddForm(false);
    setSelectedProduct(null);
    setIsEditing(false);
    setEditingProduct(null);
    setAlertMessage(t('products.productAdded'));
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const searchValue = useAppSelector(state => state.products.filters.search);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 mb-4">{t('products.title')}</h1>
          
          {showAlert && (
            <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
              {alertMessage}
            </Alert>
          )}

          <FilterSort />

          <Row className="mb-3 g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t('products.searchPlaceholder')}
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="d-flex gap-2 flex-wrap">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t('products.addProduct')}</Tooltip>}
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
                  {t('products.addProduct')}
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t('common.delete')}</Tooltip>}
              >
                <Button
                  variant="danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                >
                  {t('common.delete')} ({selectedIds.size})
                </Button>
              </OverlayTrigger>
              <Button
                variant="secondary"
                onClick={() => setSelectedIds(new Set())}
                disabled={selectedIds.size === 0}
              >
                {t('common.clear')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {loading ? (
        <Row>
          <Col className="text-center py-5">
            <Spinner animation="border" variant="secondary" className="mb-3" />
            <p className="text-muted">{t('common.loading')}</p>
          </Col>
        </Row>
      ) : products.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <p className="text-muted">{t('products.noProducts')}</p>
          </Col>
        </Row>
      ) : (
        <Row className="g-4">
          {products.map((product) => (
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
        onAdd={handleAdd}
        onClose={() => {
          setShowAddForm(false);
        }}
      />
    </Container>
  );
};

const EditProductModal = ({ product, onSave, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(product);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = t('validation.titleRequired');
    }
    if (formData.price !== undefined && formData.price !== null && formData.price < 0) {
      newErrors.price = t('validation.priceInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <Modal show={!!product} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('products.editProduct')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.titleLabel')}</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.priceLabel')}</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              isInvalid={!!errors.price}
              min="0"
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">
              {errors.price}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.statusLabel')}</Form.Label>
            <Form.Select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
            >
              <option value="In Stock">{t('products.inStock')}</option>
              <option value="Out of Stock">{t('products.outOfStock')}</option>
              <option value="Pre-order">{t('products.preOrder')}</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.descriptionLabel')}</Form.Label>
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
            {t('common.cancel')}
          </Button>
          <Button variant="danger" type="submit">
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const AddProductModal = ({ show, onAdd, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    status: 'In Stock',
    description: '',
    image: '/images/Rectangle(12).png',
    category: 'other',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = t('validation.titleRequired');
    }
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = t('validation.priceInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
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
        category: 'other',
      });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('products.addProduct')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.titleLabel')}</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.priceLabel')}</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              isInvalid={!!errors.price}
              min="0"
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">
              {errors.price}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.statusLabel')}</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="In Stock">{t('products.inStock')}</option>
              <option value="Out of Stock">{t('products.outOfStock')}</option>
              <option value="Pre-order">{t('products.preOrder')}</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.categoryLabel')}</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="board">Board</option>
              <option value="accessory">Accessory</option>
              <option value="scooter">Scooter</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.descriptionLabel')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('products.imageLabel')}</Form.Label>
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
            {t('common.cancel')}
          </Button>
          <Button variant="danger" type="submit">
            {t('products.addProduct')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ManagePage;
