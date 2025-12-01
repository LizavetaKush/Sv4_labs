import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import navigationData from '../data/navigation.json';

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <img src="/images/Rectangle.png" alt={`${navigationData.orgName} Logo`} />
          </Link>
        </div>
        <div className="nav-menu">
          {navigationData.navLinks.map((link) => (
            <Link key={link.label} to={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-social" ref={profileRef}>
          {navigationData.socialLinks.map((link, index) => {
            // First social link (Facebook) opens the menu
            const isFirstLink = index === 0;
            return (
              <React.Fragment key={link.alt}>
                {isFirstLink ? (
                  <button
                    className="social-link-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfileMenu(!showProfileMenu);
                    }}
                    title={link.alt}
                  >
                    <img src={link.src} alt={link.alt} />
                  </button>
                ) : (
                  <a href={link.href} className="social-link" title={link.alt}>
                    <img src={link.src} alt={link.alt} />
                  </a>
                )}
              </React.Fragment>
            );
          })}
          {showProfileMenu && (
            <div className="profile-menu">
              <Link to="/manage" onClick={() => setShowProfileMenu(false)}>Manage Products</Link>
              <Link to="/catalog" onClick={() => setShowProfileMenu(false)}>Catalog</Link>
              <Link to="/" onClick={() => setShowProfileMenu(false)}>Home</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

