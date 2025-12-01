import React from 'react';
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
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-logo">
            <div className="logo-icon">
              <img src="/images/Rectangle(29).png" alt={`${navigationData.orgName} Logo`} />
            </div>
          </div>
          <div className="footer-section">
            <h4>Explore</h4>
            <div className="footer-links">
              {exploreLinks.map((link) => (
                <a key={link} href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-section">
            <h4>About {navigationData.orgName}</h4>
            <p>{aboutText}</p>
            <div className="footer-address">
              {address.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-copyright">
            <span>© 2021 {navigationData.orgName}. All Rights Reserved.</span>
            <a href="#" className="brand">
              Terms of Service
            </a>
            <span>. Built by</span>
            <a href="#" className="brand">
              BH
            </a>
          </div>
          <div className="footer-payment">
            {payment.map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

