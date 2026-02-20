import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword, clearError } from '../../store/slices/authSlice';
import '../../styles/common.css';
import './Auth.css';

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Ошибка при сбросе пароля');
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
    if (!formData.newPassword) {
      newErrors.newPassword = 'Новый пароль обязателен';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Пароль должен быть не менее 6 символов';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
      await dispatch(resetPassword({
        token,
        newPassword: formData.newPassword,
      })).unwrap();
      toast.success('Пароль успешно сброшен');
      navigate('/login');
    } catch (error) {
      // Ошибка уже обработана в useEffect
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Сброс пароля</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Новый пароль *</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Минимум 6 символов"
            />
            {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Подтверждение пароля *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Повторите новый пароль"
            />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Сброс...' : 'Сбросить пароль'}
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

export default ResetPasswordForm;
