import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(filter.toLowerCase())
  );

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
          <h1 className="display-5 mb-4">{getCategoryTitle()}</h1>
          <Row className="g-3">
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

