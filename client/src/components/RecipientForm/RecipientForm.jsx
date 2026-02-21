import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { createRecipient, updateRecipient } from '../../store/slices/recipientSlice'
import { validateRecipient } from '../../utils/validation'
import '../../styles/common.css'

const RecipientForm = ({ item, onClose }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    address: {
      street: '',
      house: '',
      apartment: '',
    },
    photoUrl: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        code: item.code || '',
        fullName: item.fullName || '',
        address: {
          street: item.address?.street || '',
          house: item.address?.house || '',
          apartment: item.address?.apartment || '',
        },
        photoUrl: item.photoUrl || '',
      })
    }
  }, [item])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      })
      if (errors.address && errors.address[field]) {
        setErrors({
          ...errors,
          address: { ...errors.address, [field]: '' },
        })
      }
    } else {
      setFormData({ ...formData, [name]: value })
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateRecipient(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      if (item) {
        await dispatch(updateRecipient({ id: item._id, data: formData })).unwrap()
        toast.success('Получатель успешно обновлен')
      } else {
        await dispatch(createRecipient(formData)).unwrap()
        toast.success('Получатель успешно создан')
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
        <label className="form-label">Код получателя *</label>
        <input
          type="text"
          name="code"
          className={`form-input ${errors.code ? 'error' : ''}`}
          value={formData.code}
          onChange={handleChange}
          disabled={!!item}
        />
        {errors.code && <div className="form-error">{errors.code}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Ф.И.О. получателя *</label>
        <input
          type="text"
          name="fullName"
          className={`form-input ${errors.fullName ? 'error' : ''}`}
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Иванов Иван Иванович"
        />
        {errors.fullName && <div className="form-error">{errors.fullName}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Улица *</label>
        <input
          type="text"
          name="address.street"
          className={`form-input ${errors.address?.street ? 'error' : ''}`}
          value={formData.address.street}
          onChange={handleChange}
        />
        {errors.address?.street && <div className="form-error">{errors.address.street}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Дом *</label>
        <input
          type="text"
          name="address.house"
          className={`form-input ${errors.address?.house ? 'error' : ''}`}
          value={formData.address.house}
          onChange={handleChange}
        />
        {errors.address?.house && <div className="form-error">{errors.address.house}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Квартира *</label>
        <input
          type="text"
          name="address.apartment"
          className={`form-input ${errors.address?.apartment ? 'error' : ''}`}
          value={formData.address.apartment}
          onChange={handleChange}
        />
        {errors.address?.apartment && <div className="form-error">{errors.address.apartment}</div>}
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

export default RecipientForm
