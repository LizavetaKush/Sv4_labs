import React from 'react';
import featuresData from '../data/features.json';

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {featuresData.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-image">
                <img src={feature.image} alt={feature.title} />
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

