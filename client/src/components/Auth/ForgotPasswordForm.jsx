import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, clearError } from '../../store/slices/authSlice';
import '../../styles/common.css';
import './Auth.css';

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Ошибка при запросе восстановления пароля');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const validate = () => {
    if (!email) {
      setEmailError('Email обязателен');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email невалиден');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success('Если пользователь с таким email существует, на него отправлено письмо с инструкциями');
      setSubmitted(true);
    } catch (error) {
      // Ошибка уже обработана в useEffect
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Проверьте почту</h2>
          <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
            Если пользователь с email <strong>{email}</strong> существует, на него отправлено письмо с инструкциями по восстановлению пароля.
          </p>
          <div className="form-actions">
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              Вернуться к входу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Восстановление пароля</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
          Введите ваш email, и мы отправим вам инструкции по восстановлению пароля.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={`form-input ${emailError ? 'error' : ''}`}
              placeholder="example@mail.com"
            />
            {emailError && <div className="form-error">{emailError}</div>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
          </div>

          <div className="auth-footer">
            <p>
              <Link to="/login">Вернуться к входу</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
