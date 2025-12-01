import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ title, subtitle, buttons, background }) => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src={background} alt={title} />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="hero-buttons">
          {buttons.map((btn) => (
            <Link 
              key={btn.label} 
              to={btn.path || "#"} 
              className="btn-primary"
              title={btn.tooltip || btn.label}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

