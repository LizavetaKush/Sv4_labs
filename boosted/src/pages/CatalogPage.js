import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, InputGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import FilterSort from '../components/FilterSort';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadProducts,
  setFilters,
  selectFilteredAndSortedProducts,
  selectProductsLoading,
  selectAllProducts,
} from '../store/slices/productsSlice';

const CatalogPage = () => {
  const { t } = useTranslation();
  const { category } = useParams();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(selectAllProducts);
  const loading = useAppSelector(selectProductsLoading);
  const filteredProducts = useAppSelector(selectFilteredAndSortedProducts);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    // Apply category filter based on URL param
    if (category === 'boards') {
      dispatch(setFilters({ category: 'board' }));
    } else if (category === 'accessories') {
      dispatch(setFilters({ category: 'accessory' }));
    } else if (category === 'scooters') {
      dispatch(setFilters({ category: 'scooter' }));
    } else {
      dispatch(setFilters({ category: 'all' }));
    }
  }, [category, dispatch]);

  // Filter products by category from URL
  const categoryFilteredProducts = React.useMemo(() => {
    if (!category || category === 'all') {
      return filteredProducts;
    }
    
    if (category === 'boards') {
      return filteredProducts.filter(p => p.category === 'board');
    } else if (category === 'accessories') {
      return filteredProducts.filter(p => p.category === 'accessory');
    } else if (category === 'scooters') {
      return filteredProducts.filter(p => p.category === 'scooter');
    }
    
    return filteredProducts;
  }, [filteredProducts, category]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
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

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const searchValue = useAppSelector(state => state.products.filters.search);

  const getCategoryTitle = () => {
    if (category === 'boards') return t('nav.boards');
    if (category === 'accessories') return t('nav.accessories');
    if (category === 'scooters') return t('nav.scooters');
    return t('products.title');
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 mb-4">{getCategoryTitle()}</h1>

          <FilterSort />

          <Row className="g-3 mb-4">
            <Col md={8}>
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
            <Col md={4}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{t('common.clear')}</Tooltip>}
              >
                <Button
                  variant="secondary"
                  onClick={() => setSelectedIds(new Set())}
                  disabled={selectedIds.size === 0}
                  className="w-100"
                >
                  {t('common.clear')} <Badge bg="light" text="dark">{selectedIds.size}</Badge>
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>

          {categoryFilteredProducts.length !== allProducts.length && (
            <Alert variant="info" className="mb-4">
              {t('filters.showing', { count: categoryFilteredProducts.length, total: allProducts.length })}
            </Alert>
          )}
        </Col>
      </Row>

      {loading ? (
        <Row>
          <Col className="text-center py-5">
            <Spinner animation="border" variant="secondary" className="mb-3" />
            <p className="text-muted">{t('common.loading')}</p>
          </Col>
        </Row>
      ) : categoryFilteredProducts.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <p className="text-muted">{t('products.noProducts')}</p>
          </Col>
        </Row>
      ) : (
        <Row className="g-4">
          {categoryFilteredProducts.map((product) => (
            <Col key={product.uniqueId || `${product.category || 'product'}-${product.id}`} xs={12} sm={6} md={4} lg={3}>
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

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </Container>
  );
};

export default CatalogPage;
