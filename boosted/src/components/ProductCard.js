import React from 'react';

const ProductCard = ({ product, onClick, isSelected = false, showCheckbox = false, onSelect }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(product.id);
    }
  };

  return (
    <div
      className={`product-card ${product.className || ""} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      title={product.description || product.title}
    >
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="product-checkbox"
          onClick={handleSelect}
        />
      )}
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-overlay">
        <div className="product-icon">
          <img src="/images/Vector(1).svg" alt="Lightning Icon" />
        </div>
        <h3>{product.title}</h3>
        <span className="stock-status">{product.status}</span>
        {product.price && (
          <span className="product-price">${product.price}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

