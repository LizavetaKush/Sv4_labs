import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>{getCategoryTitle()}</h1>
          <div className="catalog-controls">
            <input
              type="text"
              placeholder="Search products..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="search-input"
            />
            <button
              className="btn-secondary"
              onClick={() => setSelectedIds(new Set())}
              disabled={selectedIds.size === 0}
            >
              Clear Selection ({selectedIds.size})
            </button>
          </div>
        </div>
        <div className="catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.uniqueId || `${product.category || 'product'}-${product.id}`}
              product={product}
              onClick={handleProductClick}
              isSelected={selectedIds.has(product.id)}
              showCheckbox={true}
              onSelect={handleSelect}
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="no-products">No products found matching your search.</p>
        )}
      </div>
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CatalogPage;

