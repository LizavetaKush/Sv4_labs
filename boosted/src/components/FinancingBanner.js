import React from 'react';
import { Alert } from 'react-bootstrap';

const FinancingBanner = ({ text }) => {
  return (
    <Alert variant="dark" className="mb-0 text-center rounded-0" style={{ padding: '7px 0' }}>
      <small style={{ letterSpacing: '0.16em' }}>{text}</small>
    </Alert>
  );
};

export default FinancingBanner;

