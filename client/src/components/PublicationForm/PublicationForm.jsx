import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { createPublication, updatePublication } from '../../store/slices/publicationSlice'
import { validatePublication } from '../../utils/validation'
import '../../styles/common.css'

const PublicationForm = ({ item, onClose }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    index: '',
    type: '',
    title: '',
    monthlyPrice: '',
    photoUrl: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        index: item.index || '',
        type: item.type || '',
        title: item.title || '',
        monthlyPrice: item.monthlyPrice || '',
        photoUrl: item.photoUrl || '',
      })
    }
  }, [item])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validatePublication(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const data = {
        ...formData,
        monthlyPrice: parseFloat(formData.monthlyPrice),
      }

      if (item) {
        await dispatch(updatePublication({ id: item._id, data })).unwrap()
        toast.success('Издание успешно обновлено')
      } else {
        await dispatch(createPublication(data)).unwrap()
        toast.success('Издание успешно создано')
      }
      onClose()
    } catch (error) {
      toast.error(error || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Индекс издания *</label>
        <input
          type="text"
          name="index"
          className={`form-input ${errors.index ? 'error' : ''}`}
          value={formData.index}
          onChange={handleChange}
          disabled={!!item}
        />
        {errors.index && <div className="form-error">{errors.index}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Вид издания *</label>
        <select
          name="type"
          className={`form-select ${errors.type ? 'error' : ''}`}
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">Выберите тип</option>
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
          className={`form-input ${errors.title ? 'error' : ''}`}
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Стоимость подписки на месяц (руб.) *</label>
        <input
          type="number"
          name="monthlyPrice"
          step="0.01"
          min="0"
          className={`form-input ${errors.monthlyPrice ? 'error' : ''}`}
          value={formData.monthlyPrice}
          onChange={handleChange}
        />
        {errors.monthlyPrice && <div className="form-error">{errors.monthlyPrice}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">URL фотографии</label>
        <input
          type="url"
          name="photoUrl"
          className={`form-input ${errors.photoUrl ? 'error' : ''}`}
          value={formData.photoUrl}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />
        {errors.photoUrl && <div className="form-error">{errors.photoUrl}</div>}
        {formData.photoUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            <img 
              src={formData.photoUrl} 
              alt="Предпросмотр" 
              style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
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
  )
}

export default PublicationForm
