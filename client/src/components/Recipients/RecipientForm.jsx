import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  createRecipient,
  updateRecipient,
} from '../../store/slices/recipientSlice';
import { validateRecipient } from '../../utils/validators';
import Modal from '../Modal/Modal';
import '../../styles/common.css';

const RecipientForm = ({ isOpen, onClose, item, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    street: '',
    house: '',
    apartment: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        code: item.code || '',
        fullName: item.fullName || '',
        street: item.street || '',
        house: item.house || '',
        apartment: item.apartment || '',
        image: item.image || '',
      });
    } else {
      setFormData({
        code: '',
        fullName: '',
        street: '',
        house: '',
        apartment: '',
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
    const validationErrors = validateRecipient(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (item) {
        await dispatch(updateRecipient({ id: item.id, data: formData })).unwrap();
        toast.success('Получатель успешно обновлен');
      } else {
        await dispatch(createRecipient(formData)).unwrap();
        toast.success('Получатель успешно создан');
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error.message || error.errors?.join(', ') || 'Ошибка при сохранении';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Редактировать получателя' : 'Добавить получателя'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Код получателя *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={`form-input ${errors.code ? 'error' : ''}`}
            placeholder="Например: R001"
          />
          {errors.code && <div className="form-error">{errors.code}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">ФИО получателя *</label>
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
          <label className="form-label">Улица *</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className={`form-input ${errors.street ? 'error' : ''}`}
            placeholder="ул. Ленина"
          />
          {errors.street && <div className="form-error">{errors.street}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Дом *</label>
          <input
            type="text"
            name="house"
            value={formData.house}
            onChange={handleChange}
            className={`form-input ${errors.house ? 'error' : ''}`}
            placeholder="10"
          />
          {errors.house && <div className="form-error">{errors.house}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Квартира</label>
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            className={`form-input ${errors.apartment ? 'error' : ''}`}
            placeholder="25"
          />
          {errors.apartment && <div className="form-error">{errors.apartment}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Фото получателя</label>
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

export default RecipientForm;
