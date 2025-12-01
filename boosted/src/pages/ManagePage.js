import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  };

  const handleDeleteSelected = () => {
    setProducts(products.filter(p => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
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
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="manage-page">
      <div className="container">
        <div className="manage-header">
          <h1>Manage Products</h1>
          <div className="manage-controls">
            <input
              type="text"
              placeholder="Search products..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="search-input"
            />
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedProduct(null);
                setIsEditing(false);
                setEditingProduct(null);
                setShowAddForm(true);
              }}
            >
              Add Product
            </button>
            <button
              className="btn-danger"
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
            >
              Delete Selected ({selectedIds.size})
            </button>
            <button
              className="btn-secondary"
              onClick={() => setSelectedIds(new Set())}
              disabled={selectedIds.size === 0}
            >
              Clear Selection
            </button>
          </div>
        </div>
        <div className="catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.uniqueId || `${product.category}-${product.id}`}
              product={product}
              onClick={handleProductClick}
              isSelected={selectedIds.has(product.id)}
              showCheckbox={true}
              onSelect={handleSelect}
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="no-products">No products found.</p>
        )}
      </div>
      
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

      {showAddForm && createPortal(
        <AddProductModal
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
        />,
        document.body
      )}
    </div>
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddProductModal = ({ onAdd, onClose }) => {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePage;

