import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../../store/slices/authSlice';
import api from '../../services/api';
import '../../styles/common.css';
import './EnhancedForms.css';

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный формат email'),
  password: z
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(50, 'Пароль должен быть не более 50 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  confirmPassword: z.string(),
  fullName: z
    .string()
    .min(2, 'ФИО должно быть не менее 2 символов')
    .max(200, 'ФИО должно быть не более 200 символов')
    .regex(/^[А-Яа-яЁё\s]+$/, 'ФИО должно содержать только русские буквы'),
  phone: z
    .string()
    .min(1, 'Телефон обязателен')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Некорректный формат телефона'),
  address: z
    .string()
    .min(5, 'Адрес должен быть не менее 5 символов')
    .max(500, 'Адрес должен быть не более 500 символов'),
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: 'Выберите роль' }),
  }),
  avatar: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
      'Размер файла не должен превышать 5 МБ'
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0]?.type),
      'Поддерживаются только изображения (JPEG, PNG, GIF, WebP)'
    ),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'Необходимо согласиться с условиями',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

const EnhancedRegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const password = watch('password');
  const email = watch('email');

  React.useEffect(() => {
    if (password) {
      trigger('confirmPassword');
    }
  }, [password, trigger]);

  React.useEffect(() => {
    const checkEmail = async () => {
      if (email && email.includes('@') && !errors.email) {
        setIsCheckingEmail(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsCheckingEmail(false);
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [email, errors.email]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const registerData = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        role: data.role,
      };

      if (data.avatar && data.avatar[0]) {
        const formData = new FormData();
        Object.keys(registerData).forEach((key) => {
          formData.append(key, registerData[key]);
        });
        formData.append('avatar', data.avatar[0]);
        await dispatch(register(formData)).unwrap();
      } else {
        await dispatch(register(registerData)).unwrap();
      }

      toast.success('Регистрация успешна!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="enhanced-form-container">
      <div className="enhanced-form-card">
        <h2>Расширенная регистрация</h2>
        <p className="form-subtitle">Заполните все поля для создания аккаунта</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">
              ФИО <span className="required">*</span>
            </label>
            <input
              type="text"
              {...registerField('fullName')}
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="Иванов Иван Иванович"
            />
            {errors.fullName && (
              <div className="form-error">{errors.fullName.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Email <span className="required">*</span>
              {isCheckingEmail && <span className="checking-indicator"> (проверка...)</span>}
            </label>
            <input
              type="email"
              {...registerField('email')}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <div className="form-error">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              {...registerField('password')}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Минимум 6 символов, буквы и цифры"
            />
            {errors.password && (
              <div className="form-error">{errors.password.message}</div>
            )}
            <small className="form-hint">
              Пароль должен содержать заглавные и строчные буквы, а также цифры
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">
              Подтверждение пароля <span className="required">*</span>
            </label>
            <input
              type="password"
              {...registerField('confirmPassword')}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && (
              <div className="form-error">{errors.confirmPassword.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Телефон <span className="required">*</span>
            </label>
            <input
              type="tel"
              {...registerField('phone')}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="+375291234567"
            />
            {errors.phone && (
              <div className="form-error">{errors.phone.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Адрес <span className="required">*</span>
            </label>
            <textarea
              {...registerField('address')}
              className={`form-input ${errors.address ? 'error' : ''}`}
              placeholder="Город, улица, дом, квартира"
              rows={3}
            />
            {errors.address && (
              <div className="form-error">{errors.address.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Роль <span className="required">*</span>
            </label>
            <select
              {...registerField('role')}
              className={`form-select ${errors.role ? 'error' : ''}`}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
            {errors.role && (
              <div className="form-error">{errors.role.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Аватар (необязательно)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                {...registerField('avatar', {
                  onChange: handleAvatarChange,
                })}
                className="file-input"
              />
              <label htmlFor="avatar" className="file-label">
                {avatarPreview ? 'Изменить фото' : 'Выбрать фото'}
              </label>
              {avatarPreview && (
                <div className="avatar-preview">
                  <img src={avatarPreview} alt="Preview" />
                </div>
              )}
            </div>
            {errors.avatar && (
              <div className="form-error">{errors.avatar.message}</div>
            )}
            <small className="form-hint">
              Максимальный размер: 5 МБ. Форматы: JPEG, PNG, GIF, WebP
            </small>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...registerField('agreeToTerms')}
                className="checkbox-input"
              />
              <span>
                Я согласен с <Link to="/terms">условиями использования</Link> и{' '}
                <Link to="/privacy">политикой конфиденциальности</Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <div className="form-error">{errors.agreeToTerms.message}</div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isCheckingEmail}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <Link to="/login" className="btn btn-secondary">
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedRegisterForm;
