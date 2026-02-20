import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname) ||
    location.pathname.startsWith('/reset-password');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="layout">
      {!isAuthPage && (
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">
              <h1>Подписные издания</h1>
            </Link>
            <nav className="nav">
              {isAuthenticated ? (
                <>
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
                  <div className="user-menu">
                    <span className="user-info">
                      {user?.fullName} {user?.role === 'admin' && '(Админ)'}
                    </span>
                    <Link to="/change-password" className="nav-link">
                      Сменить пароль
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                      Выход
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Вход
                  </Link>
                  <Link to="/register" className="nav-link">
                    Регистрация
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      )}
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      {!isAuthPage && (
        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 Система управления подписными изданиями</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
