import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Hero = ({ title, subtitle, buttons, background }) => {
  return (
    <section 
      className="position-relative d-flex align-items-center justify-content-center text-center"
      style={{
        minHeight: '810px',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      />
      <Container className="position-relative z-1">
        <h1 className="display-3 mb-3 fw-normal">{title}</h1>
        <p className="lead mb-4" style={{ letterSpacing: '0.067em' }}>{subtitle}</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          {buttons.map((btn) => (
            <OverlayTrigger
              key={btn.label}
              placement="bottom"
              overlay={<Tooltip id={`tooltip-${btn.label}`}>{btn.tooltip || btn.label}</Tooltip>}
            >
              <Button
                as={Link}
                to={btn.path || "#"}
                variant="danger"
                size="lg"
                className="px-5"
              >
                {btn.label}
              </Button>
            </OverlayTrigger>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Hero;

