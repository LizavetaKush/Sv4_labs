import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createSubscription, updateSubscription } from '../../store/slices/subscriptionSlice'
import { fetchRecipients } from '../../store/slices/recipientSlice'
import { fetchPublications } from '../../store/slices/publicationSlice'
import { validateSubscription } from '../../utils/validation'
import '../../styles/common.css'

const SubscriptionForm = ({ item, onClose }) => {
  const dispatch = useDispatch()
  const { items: recipients } = useSelector((state) => state.recipients)
  const { items: publications } = useSelector((state) => state.publications)

  const [formData, setFormData] = useState({
    recipientCode: '',
    publicationIndex: '',
    duration: '',
    startMonth: '',
    startYear: '',
    photoUrl: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchRecipients({ limit: 1000 }))
    dispatch(fetchPublications({ limit: 1000 }))
  }, [dispatch])

  useEffect(() => {
    if (item) {
      setFormData({
        recipientCode: item.recipientCode?.code || item.recipientCode || '',
        publicationIndex: item.publicationIndex?.index || item.publicationIndex || '',
        duration: item.duration || '',
        startMonth: item.startMonth || '',
        startYear: item.startYear || '',
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
    
    const validationErrors = validateSubscription(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const data = {
        ...formData,
        duration: parseInt(formData.duration),
        startMonth: parseInt(formData.startMonth),
        startYear: parseInt(formData.startYear),
      }

      if (item) {
        await dispatch(updateSubscription({ id: item._id, data })).unwrap()
        toast.success('Подписка успешно обновлена')
      } else {
        await dispatch(createSubscription(data)).unwrap()
        toast.success('Подписка успешно создана')
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
        <label className="form-label">Получатель *</label>
        <select
          name="recipientCode"
          className={`form-select ${errors.recipientCode ? 'error' : ''}`}
          value={formData.recipientCode}
          onChange={handleChange}
        >
          <option value="">Выберите получателя</option>
          {recipients.map((recipient) => (
            <option key={recipient._id} value={recipient.code}>
              {recipient.code} - {recipient.fullName}
            </option>
          ))}
        </select>
        {errors.recipientCode && <div className="form-error">{errors.recipientCode}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Издание *</label>
        <select
          name="publicationIndex"
          className={`form-select ${errors.publicationIndex ? 'error' : ''}`}
          value={formData.publicationIndex}
          onChange={handleChange}
        >
          <option value="">Выберите издание</option>
          {publications.map((publication) => (
            <option key={publication._id} value={publication.index}>
              {publication.index} - {publication.title} ({publication.type})
            </option>
          ))}
        </select>
        {errors.publicationIndex && <div className="form-error">{errors.publicationIndex}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Срок подписки (месяцев) *</label>
        <select
          name="duration"
          className={`form-select ${errors.duration ? 'error' : ''}`}
          value={formData.duration}
          onChange={handleChange}
        >
          <option value="">Выберите срок</option>
          <option value="1">1 месяц</option>
          <option value="3">3 месяца</option>
          <option value="6">6 месяцев</option>
        </select>
        {errors.duration && <div className="form-error">{errors.duration}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Месяц начала доставки *</label>
        <select
          name="startMonth"
          className={`form-select ${errors.startMonth ? 'error' : ''}`}
          value={formData.startMonth}
          onChange={handleChange}
        >
          <option value="">Выберите месяц</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        {errors.startMonth && <div className="form-error">{errors.startMonth}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Год начала доставки *</label>
        <input
          type="number"
          name="startYear"
          min="2000"
          max="2100"
          className={`form-input ${errors.startYear ? 'error' : ''}`}
          value={formData.startYear}
          onChange={handleChange}
        />
        {errors.startYear && <div className="form-error">{errors.startYear}</div>}
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

export default SubscriptionForm
