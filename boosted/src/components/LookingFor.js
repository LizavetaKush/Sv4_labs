import React from 'react';

const LookingFor = ({ content }) => {
  const { title, description } = content;
  return (
    <section className="looking-for-section">
      <div className="looking-for-content">
        <h2 className="looking-for-title">{title}</h2>
        <p className="looking-for-description">{description}</p>
        <div className="divider-line"></div>
      </div>
    </section>
  );
};

export default LookingFor;

