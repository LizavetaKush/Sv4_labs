import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  createPublication,
  updatePublication,
} from '../../store/slices/publicationSlice';
import { validatePublication } from '../../utils/validators';
import Modal from '../Modal/Modal';
import '../../styles/common.css';

const PublicationForm = ({ isOpen, onClose, item, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    index: '',
    type: '',
    title: '',
    monthlyPrice: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        index: item.index || '',
        type: item.type || '',
        title: item.title || '',
        monthlyPrice: item.monthlyPrice || '',
        image: item.image || '',
      });
    } else {
      setFormData({
        index: '',
        type: '',
        title: '',
        monthlyPrice: '',
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
    const validationErrors = validatePublication(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        monthlyPrice: parseFloat(formData.monthlyPrice),
      };
      if (item) {
        await dispatch(updatePublication({ id: item.id, data })).unwrap();
        toast.success('Издание успешно обновлено');
      } else {
        await dispatch(createPublication(data)).unwrap();
        toast.success('Издание успешно создано');
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
      title={item ? 'Редактировать издание' : 'Добавить издание'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Индекс издания *</label>
          <input
            type="text"
            name="index"
            value={formData.index}
            onChange={handleChange}
            className={`form-input ${errors.index ? 'error' : ''}`}
            placeholder="Например: 12345"
          />
          {errors.index && <div className="form-error">{errors.index}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Вид издания *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`form-select ${errors.type ? 'error' : ''}`}
          >
            <option value="">Выберите вид</option>
            <option value="газета">Газета</option>
            <option value="журнал">Журнал</option>
          </select>
          {errors.type && <div className="form-error">{errors.type}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Название издания *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Введите название"
          />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Стоимость подписки на 1 месяц (руб.) *</label>
          <input
            type="number"
            name="monthlyPrice"
            value={formData.monthlyPrice}
            onChange={handleChange}
            className={`form-input ${errors.monthlyPrice ? 'error' : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.monthlyPrice && <div className="form-error">{errors.monthlyPrice}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Фото издания</label>
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

export default PublicationForm;
