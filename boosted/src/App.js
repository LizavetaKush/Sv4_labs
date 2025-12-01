import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ManagePage from './pages/ManagePage';
import GiftCardPage from './pages/GiftCardPage';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog/:category?" element={<CatalogPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/gift-card" element={<GiftCardPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-end" className="p-3" />
      </div>
    </Router>
  );
}

export default App;
