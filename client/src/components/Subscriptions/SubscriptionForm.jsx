import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  createSubscription,
  updateSubscription,
} from '../../store/slices/subscriptionSlice';
import { fetchRecipients } from '../../store/slices/recipientSlice';
import { fetchPublications } from '../../store/slices/publicationSlice';
import { validateSubscription } from '../../utils/validators';
import Modal from '../Modal/Modal';
import '../../styles/common.css';

const SubscriptionForm = ({ isOpen, onClose, item, onSuccess }) => {
  const dispatch = useDispatch();
  const { items: recipients } = useSelector((state) => state.recipients);
  const { items: publications } = useSelector((state) => state.publications);
  const [formData, setFormData] = useState({
    recipientId: '',
    publicationId: '',
    duration: '',
    startMonth: '',
    startYear: new Date().getFullYear(),
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchRecipients({ limit: 1000 }));
      dispatch(fetchPublications({ limit: 1000 }));
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (item) {
      setFormData({
        recipientId: item.recipientId || item.recipient?.id || '',
        publicationId: item.publicationId || item.publication?.id || '',
        duration: item.duration || '',
        startMonth: item.startMonth || '',
        startYear: item.startYear || new Date().getFullYear(),
        image: item.image || '',
      });
    } else {
      setFormData({
        recipientId: '',
        publicationId: '',
        duration: '',
        startMonth: '',
        startYear: new Date().getFullYear(),
        image: '',
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSubscription(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        recipientId: parseInt(formData.recipientId),
        publicationId: parseInt(formData.publicationId),
        duration: parseInt(formData.duration),
        startMonth: parseInt(formData.startMonth),
        startYear: parseInt(formData.startYear),
      };
      if (item) {
        await dispatch(updateSubscription({ id: item.id, data })).unwrap();
        toast.success('Подписка успешно обновлена');
      } else {
        await dispatch(createSubscription(data)).unwrap();
        toast.success('Подписка успешно создана');
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error.message || error.errors?.join(', ') || 'Ошибка при сохранении';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: 1, label: 'Январь' },
    { value: 2, label: 'Февраль' },
    { value: 3, label: 'Март' },
    { value: 4, label: 'Апрель' },
    { value: 5, label: 'Май' },
    { value: 6, label: 'Июнь' },
    { value: 7, label: 'Июль' },
    { value: 8, label: 'Август' },
    { value: 9, label: 'Сентябрь' },
    { value: 10, label: 'Октябрь' },
    { value: 11, label: 'Ноябрь' },
    { value: 12, label: 'Декабрь' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Редактировать подписку' : 'Добавить подписку'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Получатель *</label>
          <select
            name="recipientId"
            value={formData.recipientId}
            onChange={handleChange}
            className={`form-select ${errors.recipientId ? 'error' : ''}`}
          >
            <option value="">Выберите получателя</option>
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fullName} ({r.code})
              </option>
            ))}
          </select>
          {errors.recipientId && <div className="form-error">{errors.recipientId}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Издание *</label>
          <select
            name="publicationId"
            value={formData.publicationId}
            onChange={handleChange}
            className={`form-select ${errors.publicationId ? 'error' : ''}`}
          >
            <option value="">Выберите издание</option>
            {publications.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.type})
              </option>
            ))}
          </select>
          {errors.publicationId && <div className="form-error">{errors.publicationId}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Срок подписки (месяцев) *</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`form-select ${errors.duration ? 'error' : ''}`}
          >
            <option value="">Выберите срок</option>
            <option value="1">1 месяц</option>
            <option value="3">3 месяца</option>
            <option value="6">6 месяцев</option>
          </select>
          {errors.duration && <div className="form-error">{errors.duration}</div>}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Месяц начала *</label>
            <select
              name="startMonth"
              value={formData.startMonth}
              onChange={handleChange}
              className={`form-select ${errors.startMonth ? 'error' : ''}`}
            >
              <option value="">Выберите месяц</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {errors.startMonth && <div className="form-error">{errors.startMonth}</div>}
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Год начала *</label>
            <input
              type="number"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              className={`form-input ${errors.startYear ? 'error' : ''}`}
              min="2000"
              max="2100"
            />
            {errors.startYear && <div className="form-error">{errors.startYear}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Фото подписки</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {formData.image && (
            <div style={{ marginTop: '1rem' }}>
              <img
                src={formData.image}
                alt="Предпросмотр"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '5px' }}
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сохранение...' : item ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubscriptionForm;
