import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Funnel, FunnelFill } from 'react-bootstrap-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFilters, resetFilters, setSortBy, selectFilters, selectSortBy, selectAllProducts } from '../store/slices/productsSlice';

const FilterSort = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const sortBy = useAppSelector(selectSortBy);
  const products = useAppSelector(selectAllProducts);
  const [showFilters, setShowFilters] = React.useState(false);

  const maxPrice = Math.max(...products.map(p => p.price || 0), 5000);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{t('filters.title')}</h5>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <FunnelFill className="me-2" /> : <Funnel className="me-2" />}
            {t('common.filter')}
          </Button>
          <Form.Select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{ width: 'auto' }}
            size="sm"
          >
            <option value="title">{t('sort.titleAsc')}</option>
            <option value="price-asc">{t('sort.priceAsc')}</option>
            <option value="price-desc">{t('sort.priceDesc')}</option>
          </Form.Select>
        </div>
      </div>

      {showFilters && (
        <Card className="shadow-sm">
          <Card.Header>
            <h6 className="mb-0">{t('filters.title')}</h6>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>
                  {t('filters.priceRange')}: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Form.Label>
                <Form.Range
                  min={0}
                  max={maxPrice}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])
                  }
                />
                <div className="d-flex justify-content-between">
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])
                    }
                    style={{ width: '48%' }}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || maxPrice])
                    }
                    style={{ width: '48%' }}
                  />
                </div>
              </Col>
              <Col md={4}>
                <Form.Label>{t('filters.status')}</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">{t('filters.allStatus')}</option>
                  <option value="in-stock">{t('products.inStock')}</option>
                  <option value="out-of-stock">{t('products.outOfStock')}</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>{t('filters.category')}</Form.Label>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">{t('filters.allCategories')}</option>
                  <option value="board">{t('nav.boards')}</option>
                  <option value="accessory">{t('nav.accessories')}</option>
                  <option value="scooter">{t('nav.scooters')}</option>
                </Form.Select>
              </Col>
            </Row>
            <Button
              variant="outline-secondary"
              className="mt-3"
              onClick={handleReset}
            >
              {t('filters.resetFilters')}
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default FilterSort;
