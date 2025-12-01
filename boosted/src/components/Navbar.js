import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container, Image, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { Cart3, Heart, ArrowBarLeft } from 'react-bootstrap-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import navigationData from '../data/navigation.json';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const { getCartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { compareItems } = useCompare();

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
          
          <Nav className="ms-auto align-items-center">
            {/* Cart Icon */}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-cart">Shopping Cart</Tooltip>}
            >
              <Nav.Link as={Link} to="/cart" className="position-relative me-2">
                <Cart3 size={20} />
                {getCartItemsCount() > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Nav.Link>
            </OverlayTrigger>

            {/* Wishlist Icon */}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-wishlist">Wishlist</Tooltip>}
            >
              <Nav.Link as={Link} to="/wishlist" className="position-relative me-2">
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {wishlistItems.length}
                  </Badge>
                )}
              </Nav.Link>
            </OverlayTrigger>

            {/* Compare Icon */}
            {compareItems.length > 0 && (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-compare">Compare Products ({compareItems.length})</Tooltip>}
              >
                <Nav.Link as={Link} to="/compare" className="position-relative me-2">
                  <ArrowBarLeft size={20} />
                  <Badge
                    bg="info"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {compareItems.length}
                  </Badge>
                </Nav.Link>
              </OverlayTrigger>
            )}

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