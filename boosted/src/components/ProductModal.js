import React, { useEffect } from 'react';

const ProductModal = ({ product, onClose, onEdit, onDelete }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} title="Close">
          ×
        </button>
        <div className="modal-header">
          <img src={product.image} alt={product.title} className="modal-image" />
        </div>
        <div className="modal-body">
          <h2>{product.title}</h2>
          <p className="modal-status">{product.status}</p>
          {product.price && (
            <p className="modal-price">${product.price}</p>
          )}
          {product.description && (
            <p className="modal-description">{product.description}</p>
          )}
          {product.features && (
            <ul className="modal-features">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          )}
          {product.salePrice && product.originalPrice && (
            <div className="modal-pricing">
              <span className="sale-price">${product.salePrice}</span>
              <span className="original-price">${product.originalPrice}</span>
            </div>
          )}
          {product.category && (
            <p className="modal-category">Category: {product.category}</p>
          )}
        </div>
        <div className="modal-footer">
          {onEdit && (
            <button className="btn-secondary" onClick={() => onEdit(product)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn-danger" onClick={() => onDelete(product.id)}>
              Delete
            </button>
          )}
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

