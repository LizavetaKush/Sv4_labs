import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, InputGroup, Badge, Spinner, Card, Accordion, Alert } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Funnel, FunnelFill } from 'react-bootstrap-icons';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import boardsData from '../data/boards.json';
import accessoriesData from '../data/accessories.json';

const CatalogPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = () => {
    let loadedProducts = [];
    
    if (category === 'boards') {
      loadedProducts = boardsData.map(board => ({
        ...board,
        category: 'board',
        uniqueId: `board-${board.id}`
      }));
    } else if (category === 'accessories') {
      loadedProducts = accessoriesData.map(accessory => ({
        ...accessory,
        category: 'accessory',
        uniqueId: `accessory-${accessory.id}`
      }));
    } else if (category === 'scooters') {
      loadedProducts = [
        {
          id: 10,
          title: "Boosted Rev",
          status: "In Stock",
          image: "/images/boosted-revs.jpg",
          price: 1599,
          description: "Revolutionary electric scooter for urban commuting.",
          features: ["Top speed: 24 mph", "Range: 22 miles", "Portable design"],
          category: 'scooter',
          uniqueId: 'scooter-10'
        }
      ];
    } else {
      // All products - ensure unique IDs
      const boards = boardsData.map(board => ({
        ...board,
        category: 'board',
        uniqueId: `board-${board.id}`
      }));
      const accessories = accessoriesData.map(accessory => ({
        ...accessory,
        category: 'accessory',
        uniqueId: `accessory-${accessory.id}`
      }));
      loadedProducts = [...boards, ...accessories];
    }

    setProducts(loadedProducts);
  };

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

  const filteredProducts = products.filter(product => {
    // Text search filter
    const matchesSearch = product.title.toLowerCase().includes(filter.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(filter.toLowerCase()));
    
    // Price filter
    const matchesPrice = (!product.price || (product.price >= priceRange[0] && product.price <= priceRange[1]));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'in-stock' && product.status?.toLowerCase().includes('stock')) ||
                         (statusFilter === 'out-of-stock' && product.status?.toLowerCase().includes('out'));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesPrice && matchesStatus && matchesCategory;
  });

  // Get max price for range slider
  const maxPrice = Math.max(...products.map(p => p.price || 0), 5000);

  const getCategoryTitle = () => {
    if (category === 'boards') return 'Electric Skateboards';
    if (category === 'accessories') return 'Accessories';
    if (category === 'scooters') return 'Electric Scooters';
    return 'All Products';
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 mb-0">{getCategoryTitle()}</h1>
            <Button
              variant="outline-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <FunnelFill className="me-2" /> : <Funnel className="me-2" />}
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Filter Products</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Form.Label>
                    <Form.Range
                      min={0}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="d-flex justify-content-between">
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        style={{ width: '48%' }}
                      />
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                        style={{ width: '48%' }}
                      />
                    </div>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="board">Boards</option>
                      <option value="accessory">Accessories</option>
                      <option value="scooter">Scooters</option>
                    </Form.Select>
                  </Col>
                </Row>
                <Button
                  variant="outline-secondary"
                  className="mt-3"
                  onClick={() => {
                    setPriceRange([0, maxPrice]);
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
              </Card.Body>
            </Card>
          )}

          <Row className="g-3 mb-4">
            <Col md={8}>
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
            <Col md={4}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Clear all selected products</Tooltip>}
              >
                <Button
                  variant="secondary"
                  onClick={() => setSelectedIds(new Set())}
                  disabled={selectedIds.size === 0}
                  className="w-100"
                >
                  Clear Selection <Badge bg="light" text="dark">{selectedIds.size}</Badge>
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>

          {filteredProducts.length !== products.length && (
            <Alert variant="info" className="mb-4">
              Showing {filteredProducts.length} of {products.length} products
            </Alert>
          )}
        </Col>
      </Row>

      {filteredProducts.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <Spinner animation="border" variant="secondary" className="mb-3" />
            <p className="text-muted">No products found matching your search.</p>
          </Col>
        </Row>
      ) : (
        <Row className="g-4">
          {filteredProducts.map((product) => (
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

