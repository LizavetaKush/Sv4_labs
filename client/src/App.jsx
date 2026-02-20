import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import EnhancedRegisterForm from './components/Forms/EnhancedRegisterForm';
import MultiStepSubscriptionForm from './components/Forms/MultiStepSubscriptionForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import ChangePasswordForm from './components/Auth/ChangePasswordForm';
import PublicationsPage from './pages/PublicationsPage';
import RecipientsPage from './pages/RecipientsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import { getMe } from './store/slices/authSlice';
import './App.css';
import './styles/common.css';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/register-enhanced" element={<EnhancedRegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publications"
          element={
            <ProtectedRoute>
              <PublicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipients"
          element={
            <ProtectedRoute>
              <RecipientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <SubscriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions/create-multistep"
          element={
            <ProtectedRoute>
              <MultiStepSubscriptionForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
