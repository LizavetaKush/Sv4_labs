import React from 'react';

const Accessories = ({ items = [] }) => {
  const renderPrice = (item) => {
    if (item.soldOut) {
      return <span className="price sold-out">Sold Out</span>;
    }

    if (item.originalPrice) {
      return (
        <div className="price-container">
          <span className="sale-price">${item.salePrice}</span>
          <span className="original-price">${item.originalPrice}</span>
        </div>
      );
    }

    return <span className="price">${item.price}</span>;
  };

  return (
    <section className="accessories">
      <div className="container">
        <h2 className="accessories-title">Looking for Accessories?</h2>
        <div className="divider-line"></div>
      </div>
      <div className="accessories-grid">
        {items.map((item) => (
          <div key={item.id || item.title} className="accessory-item" title={item.description || item.title}>
            <img src={item.image} alt={item.title} />
            <h4>{item.title}</h4>
            {renderPrice(item)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accessories;

