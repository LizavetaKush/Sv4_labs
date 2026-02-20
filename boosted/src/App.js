import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-bootstrap';
import { store } from './store/store';
import { WishlistProvider } from './contexts/WishlistContext';
import { CompareProvider } from './contexts/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ManagePage from './pages/ManagePage';
import GiftCardPage from './pages/GiftCardPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ComparePage from './pages/ComparePage';
import './styles.css';
import './i18n/config';

function App() {
  return (
    <Provider store={store}>
      <WishlistProvider>
        <CompareProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog/:category?" element={<CatalogPage />} />
                  <Route path="/manage" element={<ManagePage />} />
                  <Route path="/gift-card" element={<GiftCardPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer position="top-end" className="p-3" />
            </div>
          </Router>
        </CompareProvider>
      </WishlistProvider>
    </Provider>
  );
}

export default App;
