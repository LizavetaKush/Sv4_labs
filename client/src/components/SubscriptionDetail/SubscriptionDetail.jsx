import React from 'react'
import '../../styles/common.css'

const SubscriptionDetail = ({ item }) => {
  if (!item) return <div>Загрузка...</div>

  const recipient = item.recipientCode
  const publication = item.publicationIndex

  let endMonth = item.startMonth + item.duration - 1
  let endYear = item.startYear
  if (endMonth > 12) {
    endMonth -= 12
    endYear += 1
  }

  return (
    <div className="detail-view">
      <div>
        {item.photoUrl ? (
          <img 
            src={item.photoUrl} 
            alt="Подписка"
            className="detail-image"
            style={{ objectFit: 'cover', width: '100%', height: '300px', borderRadius: '10px' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="detail-image" style={{ display: item.photoUrl ? 'none' : 'flex' }}>📋</div>
      </div>
      <div className="detail-info">
        <div className="detail-item">
          <div className="detail-label">Получатель</div>
          <div className="detail-value">
            {recipient?.code || item.recipientCode} - {recipient?.fullName || ''}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Издание</div>
          <div className="detail-value">
            {publication?.index || item.publicationIndex} - {publication?.title || ''} ({publication?.type || ''})
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Срок подписки</div>
          <div className="detail-value">{item.duration} {item.duration === 1 ? 'месяц' : 'месяца'}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Начало доставки</div>
          <div className="detail-value">
            {item.startMonth}.{item.startYear}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Окончание доставки</div>
          <div className="detail-value">
            {endMonth}.{endYear}
          </div>
        </div>
        {publication && (
          <div className="detail-item">
            <div className="detail-label">Стоимость подписки</div>
            <div className="detail-value">
              {(publication.monthlyPrice * item.duration).toFixed(2)} руб.
            </div>
          </div>
        )}
        {item.createdAt && (
          <div className="detail-item">
            <div className="detail-label">Дата создания</div>
            <div className="detail-value">
              {new Date(item.createdAt).toLocaleString('ru-RU')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionDetail
