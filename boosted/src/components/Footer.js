import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import navigationData from '../data/navigation.json';

const Footer = () => {
  const exploreLinks = [
    "Electric Skateboards",
    "Electric Scooters",
    "Accessories",
    "FAQs",
    "Warranty",
    "Quick Start Guide",
    "Contact",
    "Gift Card",
    "Accessibility Statement",
  ];

  const aboutText =
    "Boosted empowers people everywhere to commute across their cities, campuses, and communities in ways that were never before possible. Boosted is solving one of the biggest problems people face each day: transportation.";

  const address = [
    "CaliRides LLC - DBA Boosted USA",
    "1281 Andersen Drive Ste. K",
    "San Rafael, CA 94901",
  ];

  const payment = [
    { src: "/images/Group.png", alt: "American Express" },
    { src: "/images/Frame(1).png", alt: "Shop Pay" },
    { src: "/images/Frame(2).png", alt: "Google Pay" },
    { src: "/images/Frame(3).png", alt: "Klarna" },
    { src: "/images/Frame.png", alt: "Mastercard" },
    { src: "/images/Frame-1.png", alt: "Apple Pay" },
    { src: "/images/Frame-2.png", alt: "Venmo" },
    { src: "/images/Frame-3.png", alt: "Visa" },
  ];

  return (
    <footer className="bg-light mt-5">
      <Container className="py-5">
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <div className="mb-3">
              <img 
                src="/images/Rectangle(29).png" 
                alt={`${navigationData.orgName} Logo`}
                style={{ maxWidth: '160px', height: 'auto' }}
              />
            </div>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Explore</h5>
            <div className="d-flex flex-column">
              {exploreLinks.map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className="text-decoration-none text-dark mb-2"
                  style={{ fontSize: '0.875rem' }}
                >
                  {link}
                </a>
              ))}
            </div>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">About {navigationData.orgName}</h5>
            <p style={{ fontSize: '0.875rem' }}>{aboutText}</p>
            <div>
              {address.map((line, index) => (
                <p key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{line}</p>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
      <div className="bg-white border-top py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-2 mb-md-0">
              <small className="text-muted">
                © 2021 {navigationData.orgName}. All Rights Reserved.{' '}
                <a href="#" className="text-danger text-decoration-none">Terms of Service</a>
                . Built by <a href="#" className="text-danger text-decoration-none">BH</a>
              </small>
            </Col>
            <Col md={6} className="d-flex gap-2 flex-wrap">
              {payment.map((logo) => (
                <img 
                  key={logo.alt} 
                  src={logo.src} 
                  alt={logo.alt}
                  style={{ height: '20px', width: 'auto' }}
                />
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

