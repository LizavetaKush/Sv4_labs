import React from 'react'
import '../../styles/common.css'

const PublicationDetail = ({ item }) => {
  if (!item) return <div>Загрузка...</div>

  const getImageEmoji = () => {
    return item.type === 'газета' ? '📰' : '📚'
  }

  return (
    <div className="detail-view">
      <div>
        {item.photoUrl ? (
          <img 
            src={item.photoUrl} 
            alt={item.title}
            className="detail-image"
            style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '10px' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="detail-image" style={{ display: item.photoUrl ? 'none' : 'flex' }}>
          {getImageEmoji()}
        </div>
      </div>
      <div className="detail-info">
        <div className="detail-item">
          <div className="detail-label">Индекс издания</div>
          <div className="detail-value">{item.index}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Вид издания</div>
          <div className="detail-value">{item.type}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Название издания</div>
          <div className="detail-value">{item.title}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Стоимость подписки на месяц</div>
          <div className="detail-value">{item.monthlyPrice.toFixed(2)} руб.</div>
        </div>
        {item.createdAt && (
          <div className="detail-item">
            <div className="detail-label">Дата создания</div>
            <div className="detail-value">
              {new Date(item.createdAt).toLocaleString('ru-RU')}
            </div>
          </div>
        )}
        {item.updatedAt && (
          <div className="detail-item">
            <div className="detail-label">Дата обновления</div>
            <div className="detail-value">
              {new Date(item.updatedAt).toLocaleString('ru-RU')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicationDetail
