import React from 'react';
import { Link } from 'react-router-dom';

const ElectricSkateboards = ({ data }) => {
  const { background, subtitle, title, description, buttonText } = data;
  return (
    <section className="electric-skateboards">
      <div className="skateboards-background">
        <img src={background} alt={title} />
      </div>
      <div className="skateboards-content">
        <p className="skateboards-subtitle">{subtitle}</p>
        <h2>{title}</h2>
        <p className="skateboards-description">{description}</p>
        <Link to="/catalog/boards" className="btn-primary small" title="View Electric Skateboards">
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default ElectricSkateboards;

