import React from 'react';
import { Link } from 'react-router-dom';

const BoostedRev = ({ data }) => {
  const { title, description, buttonText, images } = data;
  return (
    <section className="boosted-rev">
      <div className="container">
        <div className="rev-grid">
          <div className="rev-images">
            <div className="rev-image-top">
              <img src={images.top} alt={`${title} Rider`} />
            </div>
            <div className="rev-image-bottom">
              <img src={images.bottom} alt={`${title} Detail`} />
            </div>
          </div>
          <div className="rev-content">
            <h2>{title}</h2>
            <p>{description}</p>
            <Link to="/catalog/scooters" className="btn-primary small" title="View Boosted Rev">
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoostedRev;

