import React from 'react'
import '../../styles/common.css'

const RecipientDetail = ({ item }) => {
  if (!item) return <div>Загрузка...</div>

  return (
    <div className="detail-view">
      <div>
        {item.photoUrl ? (
          <img 
            src={item.photoUrl} 
            alt={item.fullName}
            className="detail-image"
            style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '10px' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="detail-image" style={{ display: item.photoUrl ? 'none' : 'flex' }}>👤</div>
      </div>
      <div className="detail-info">
        <div className="detail-item">
          <div className="detail-label">Код получателя</div>
          <div className="detail-value">{item.code}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Ф.И.О. получателя</div>
          <div className="detail-value">{item.fullName}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Адрес</div>
          <div className="detail-value">
            {item.address?.street}, д. {item.address?.house}, кв. {item.address?.apartment}
          </div>
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

export default RecipientDetail
