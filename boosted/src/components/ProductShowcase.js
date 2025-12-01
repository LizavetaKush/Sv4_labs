import React from 'react';
import ProductCard from './ProductCard';

const ProductShowcase = ({ cards, onCardClick }) => {
  return (
    <section className="product-showcase">
      <div className="container">
        <div className="showcase-grid">
          {cards.map((card) => (
            <ProductCard
              key={card.id || card.title}
              product={card}
              onClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

