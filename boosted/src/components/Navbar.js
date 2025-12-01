import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import navigationData from '../data/navigation.json';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <BootstrapNavbar 
      bg="white" 
      expand="lg" 
      sticky="top" 
      className="shadow-sm"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <Image 
            src="/images/Rectangle.png" 
            alt={`${navigationData.orgName} Logo`}
            height="36"
            className="d-inline-block align-top"
          />
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navigationData.navLinks.map((link) => (
              <OverlayTrigger
                key={link.label}
                placement="bottom"
                overlay={<Tooltip id={`tooltip-${link.label}`}>{link.label}</Tooltip>}
              >
                <Nav.Link 
                  as={Link} 
                  to={link.href}
                  className="text-uppercase"
                  style={{ fontSize: '0.875rem', letterSpacing: '0.07em' }}
                >
                  {link.label}
                </Nav.Link>
              </OverlayTrigger>
            ))}
          </Nav>
          
          <Nav className="ms-auto">
            {navigationData.socialLinks.map((link, index) => {
              const isFirstLink = index === 0;
              return (
                <React.Fragment key={link.alt}>
                  {isFirstLink ? (
                    <NavDropdown
                      title={
                        <Image 
                          src={link.src} 
                          alt={link.alt}
                          width="18"
                          height="18"
                          className="social-icon"
                        />
                      }
                      id="profile-dropdown"
                      align="end"
                    >
                      <NavDropdown.Item as={Link} to="/manage">
                        Manage Products
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/catalog">
                        Catalog
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/">
                        Home
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id={`tooltip-${link.alt}`}>{link.alt}</Tooltip>}
                    >
                      <Nav.Link 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image 
                          src={link.src} 
                          alt={link.alt}
                          width="18"
                          height="18"
                          className="social-icon"
                        />
                      </Nav.Link>
                    </OverlayTrigger>
                  )}
                </React.Fragment>
              );
            })}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;