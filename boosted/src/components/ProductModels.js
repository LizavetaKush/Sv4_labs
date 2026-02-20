import React from 'react';
import ProductCard from './ProductCard';

const ProductModels = ({ models, onModelClick }) => {
  return (
    <section className="product-models">
      <div className="models-grid">
        {models.map((model) => (
          <ProductCard
            key={model.id || model.title}
            product={model}
            onClick={onModelClick}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductModels;

