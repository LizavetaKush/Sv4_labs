import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, clearError } from '../../store/slices/authSlice';
import '../../styles/common.css';
import './Auth.css';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Ошибка при регистрации');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email невалиден';
    }
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!formData.fullName) {
      newErrors.fullName = 'ФИО обязательно';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'ФИО должно быть не менее 2 символов';
    }
    if (!formData.role) {
      newErrors.role = 'Роль обязательна';
    } else if (!['user', 'admin'].includes(formData.role)) {
      newErrors.role = 'Роль должна быть "user" или "admin"';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      toast.success('Регистрация успешна');
      navigate('/');
    } catch (error) {
      // Ошибка уже обработана в useEffect
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ФИО *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="Иванов Иван Иванович"
            />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="example@mail.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Пароль *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Минимум 6 символов"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Подтверждение пароля *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Роль *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`form-select ${errors.role ? 'error' : ''}`}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
            {errors.role && <div className="form-error">{errors.role}</div>}
            <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
              Выберите роль для вашего аккаунта
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
