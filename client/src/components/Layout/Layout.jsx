import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>Подписные издания</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Главная
            </Link>
            <Link to="/publications" className={`nav-link ${isActive('/publications')}`}>
              Издания
            </Link>
            <Link to="/recipients" className={`nav-link ${isActive('/recipients')}`}>
              Получатели
            </Link>
            <Link to="/subscriptions" className={`nav-link ${isActive('/subscriptions')}`}>
              Подписки
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Система управления подписными изданиями</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
