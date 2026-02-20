import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PublicationsPage from './pages/PublicationsPage';
import RecipientsPage from './pages/RecipientsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import HomePage from './pages/HomePage';
import './App.css';
import './styles/common.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/recipients" element={<RecipientsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
