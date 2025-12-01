import React from 'react';
import partnersData from '../data/partners.json';

const Partners = () => {
  return (
    <section className="partners">
      <div className="container">
        <div className="partners-grid">
          {partnersData.map((logo) => (
            <div key={logo.alt} className="partner-logo" title={logo.alt}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;

